#!/usr/bin/env python3
"""Clean, deterministic rebuild of the CertiPrepAI knowledge graph.

Why not `graphify update`? That command re-scans broader and APPENDS duplicate
nodes (observed: 772 -> 1443 AST nodes, doubled package.json entries). This does a
full clean rebuild instead:
  - fresh AST over code (deterministic, no LLM) -> reflects code changes
  - semantic nodes/edges pulled from the on-disk cache (no subagents, no tokens)
  - rebuild + re-cluster + auto-label communities from their top node
Never duplicates, because it rebuilds from scratch each run rather than merging.

NOTE: the `if __name__ == "__main__"` guard is REQUIRED — graphify.extract uses
multiprocessing (spawn on macOS); without the guard, worker processes re-import
this module and corrupt the extraction (partial nodes + leaked semaphores).

New doc/PDF/image files are NOT semantically extracted here (that needs the LLM
subagent pipeline / `/graphify .`); they are reported as skipped.
"""
import json
from collections import defaultdict
from pathlib import Path

from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.cache import check_semantic_cache
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

ROOT = Path(__file__).resolve().parents[2]   # repo root
OUT = ROOT / "graphify-out"
GENERIC = {"package.json", "dependencies", "devDependencies", "index.js", "index.mjs",
           "handler()", "compilerOptions", "main.tsx", "App()", "stripe", "cognito"}


def main():
    det = detect(ROOT)
    (OUT / ".graphify_detect.json").write_text(json.dumps(det, ensure_ascii=False), encoding="utf-8")

    # AST (code) — deterministic, no LLM
    code_files = []
    for f in det["files"].get("code", []):
        p = Path(f)
        code_files.extend(collect_files(p) if p.is_dir() else [p])
    ast = extract(code_files, cache_root=ROOT) if code_files else {"nodes": [], "edges": []}

    # semantic (from on-disk cache only — no subagents)
    doc_files = [f for cat in ("document", "paper", "image") for f in det["files"].get(cat, [])]
    c_nodes, c_edges, c_hyper, uncached = check_semantic_cache(doc_files, root=str(ROOT))

    # merge (dedupe by id, AST wins)
    seen = {n["id"] for n in ast["nodes"]}
    nodes = list(ast["nodes"])
    for n in c_nodes:
        if n["id"] not in seen:
            nodes.append(n); seen.add(n["id"])
    extraction = {"nodes": nodes, "edges": ast["edges"] + c_edges, "hyperedges": c_hyper,
                  "input_tokens": 0, "output_tokens": 0}

    # build + cluster
    G = build_from_json(extraction, root=str(ROOT), directed=False)
    if G.number_of_nodes() == 0:
        raise SystemExit("ERROR: empty graph")
    communities = cluster(G)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)

    # auto-label communities from their highest-degree, non-generic node
    id2node = {n["id"]: n for n in nodes}
    deg = defaultdict(int)
    for e in extraction["edges"]:
        deg[e["source"]] += 1; deg[e["target"]] += 1
    labels = {}
    for cid, members in communities.items():
        ranked = sorted(members, key=lambda m: -deg.get(m, 0))
        name = None
        for m in ranked:
            lbl = (id2node.get(m) or {}).get("label", "")
            if lbl and lbl not in GENERIC:
                name = lbl; break
        if not name and ranked:
            name = (id2node.get(ranked[0]) or {}).get("label", f"Community {cid}")
        labels[cid] = (name or f"Community {cid}")[:60]

    questions = suggest_questions(G, communities, labels)

    # write graph.json (remove first to bypass shrink-guard #479)
    gj = OUT / "graph.json"
    if gj.exists():
        gj.unlink()
    to_json(G, communities, str(gj))

    report = generate(G, communities, cohesion, labels, gods, surprises, det,
                      {"input": 0, "output": 0}, str(ROOT), suggested_questions=questions)
    (OUT / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")
    (OUT / ".graphify_labels.json").write_text(
        json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding="utf-8")
    (OUT / ".graphify_detect.json").unlink(missing_ok=True)

    print(f"Rebuilt: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, "
          f"{len(communities)} communities "
          f"({len(ast['nodes'])} AST + {len(c_nodes)} cached-semantic).")
    if uncached:
        print(f"Note: {len(uncached)} doc/image file(s) not in the semantic cache were skipped "
              f"(run /graphify . for a full LLM rebuild that includes them).")


if __name__ == "__main__":
    main()
