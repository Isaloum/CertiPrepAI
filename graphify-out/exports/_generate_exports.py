#!/usr/bin/env python3
"""Regenerate all shareable exports from graphify-out/graph.json.

Outputs (into this same exports/ folder):
  graph-slim.json   - trimmed graph for path tracing
  GRAPH_DIGEST.md   - human/LLM-readable map
  GRAPH_PROMPT.md   - self-contained reusable prompt (paste into ANY chat, no Project needed)
"""
import json
from collections import defaultdict
from pathlib import Path

EXPORTS = Path(__file__).resolve().parent          # graphify-out/exports
OUT = EXPORTS.parent                                # graphify-out
g = json.load(open(OUT / "graph.json"))
labels = json.load(open(OUT / ".graphify_labels.json")) if (OUT / ".graphify_labels.json").exists() else {}
nodes = {n["id"]: n for n in g["nodes"]}
links = g["links"]

# ---------- degree + communities ----------
deg = defaultdict(int)
for e in links:
    deg[e["source"]] += 1
    deg[e["target"]] += 1
comm = defaultdict(list)
for n in g["nodes"]:
    comm[str(n.get("community"))].append(n)

# ---------- 1) slim json ----------
slim = {
    "meta": {"project": "CertiPrepAI", "nodes": len(nodes), "edges": len(links),
             "communities": {str(k): v for k, v in labels.items()}},
    "nodes": [{"id": n["id"], "label": n.get("label"), "type": n.get("file_type"), "c": n.get("community")} for n in g["nodes"]],
    "edges": [{"s": e["source"], "t": e["target"], "r": e.get("relation")} for e in links],
}
(EXPORTS / "graph-slim.json").write_text(json.dumps(slim, ensure_ascii=False), encoding="utf-8")

# ---------- shared digest body ----------
gods = sorted(nodes.values(), key=lambda n: -deg[n["id"]])[:12]
cross = []
for e in links:
    s, t = nodes.get(e["source"]), nodes.get(e["target"])
    if s and t and s.get("community") != t.get("community") and e.get("relation") in ("semantically_similar_to", "conceptually_related_to"):
        cross.append((s, t, e))
cross = cross[:12]

body = []
body.append(f"**{len(nodes)} nodes, {len(links)} edges, {len(comm)} communities.** Nodes = files, functions/classes (code, via AST) and named concepts (docs/PDFs/images, via LLM).")
body.append("")
body.append("## Most-connected nodes (core abstractions)")
for n in gods:
    body.append(f"- **{n.get('label')}** ({deg[n['id']]} edges) - `{n.get('source_file')}` [{n.get('file_type')}]")
body.append("")
body.append("## Cross-domain / surprising links")
for s, t, e in cross:
    body.append(f"- **{s.get('label')}** <-> **{t.get('label')}** ({e.get('relation')}) - `{s.get('source_file')}` <-> `{t.get('source_file')}`")
body.append("")
body.append("## Communities (clusters), largest first")
for cid, members in sorted(comm.items(), key=lambda kv: -len(kv[1])):
    if len(members) < 2:
        continue
    name = labels.get(cid, f"Community {cid}")
    mem = " / ".join(m.get("label", "") for m in members[:10])
    body.append(f"- **{name}** ({len(members)} nodes): {mem}")
body.append("")
body.append("## Notable structural findings")
body.append("- **Heavy duplication**: near-identical doc trees under `_from-documents/`, `docs-project/`, `project-docs/`, `_marketing/`, plus duplicate `deploy.sh`, `fix-users-lambda.sh`, `generate-questions.py`, `fix-explanations.py`, and 4+ near-identical Lambda `package.json` clusters.")
body.append("- **`useAuth()` is the dominant bridge** connecting ~18 page/feature communities; auth changes ripple widely.")
body.append("- **Study material links to real infra**: AWS SAA-C03 study-PDF concepts (CloudFront, WAF, DynamoDB) connect to the app's own architecture diagram.")
body.append("- **~189 doc-to-code edges were dropped** at build time (LLM ids that did not match AST ids), so prose and code halves are slightly under-linked; treat a missing cross-half link as possibly-missing, not confirmed-absent.")
digest_body = "\n".join(body)

# ---------- 2) digest ----------
(EXPORTS / "GRAPH_DIGEST.md").write_text(
    "# CertiPrepAI - Knowledge Graph Digest\n\nAuto-generated from a graphify build of the repo. This digest is self-contained - reason over it directly.\n\n" + digest_body + "\n",
    encoding="utf-8")

# ---------- 3) reusable prompt ----------
preamble = """# CertiPrepAI Codebase - Reusable Prompt

> HOW TO USE: paste this whole file as your FIRST message in any Claude chat (no Project needed),
> or save the "Instruction to Claude" block into Settings -> Custom instructions. Then ask your question.
> Optionally also attach `graph-slim.json` for exact path tracing.

## Instruction to Claude
You are assisting with **CertiPrepAI**, an AWS certification-prep SaaS: a React + Vite + TypeScript SPA on
AWS Amplify, with a serverless backend (AWS Lambda + DynamoDB + Cognito) and Stripe billing. Below is a
knowledge-graph MAP of the repository, produced by graphify (code parsed via AST; docs/PDFs/images via LLM).
Treat it as ground truth for how files, functions, and concepts connect. When I ask how a change ripples,
trace through the "Most-connected nodes" and "Communities" below. Cite node labels and file paths in answers.
If a link between the code and docs halves seems absent, treat it as possibly-missing (about 189 cross edges
were dropped at build), not confirmed-absent. If I attach `graph-slim.json`, use it to walk exact node paths.

---

# Knowledge Graph Map

"""
(EXPORTS / "GRAPH_PROMPT.md").write_text(preamble + digest_body + "\n", encoding="utf-8")

# ---------- 4) Claude desktop Skill bundle (SKILL.md + graph-slim.json) ----------
import shutil, zipfile

skill_dir = EXPORTS / "skill"
if skill_dir.exists():
    shutil.rmtree(skill_dir)
skill_dir.mkdir(parents=True)

skill_md = """---
name: certiprepai-codebase-graph
description: Knowledge-graph map of the CertiPrepAI codebase (React SPA on AWS Amplify; serverless AWS Lambda + DynamoDB + Cognito backend; Stripe billing). Use whenever answering questions about how CertiPrepAI's files, functions, Lambdas, pages, or docs connect, what a code change ripples into, or where a feature lives. A bundled graph-slim.json holds every node and edge for exact path tracing.
---

# CertiPrepAI Codebase Knowledge Graph

Use this skill whenever the user asks about the structure of the **CertiPrepAI** project: how files/functions/Lambdas/pages/docs relate, what a change to X would affect, or where a feature lives.

## How to use
- The map below is the primary reference: most-connected nodes (core abstractions), clusters (communities), and cross-domain links.
- For exact "what connects to what" path tracing, read the bundled **`graph-slim.json`** in this skill's folder. Its shape: `nodes: [{id,label,type,community}]`, `edges: [{s,t,r}]` (s=source id, t=target id, r=relation). `meta.communities` maps community id -> name.
- Always cite node **labels** and **file paths** in answers.
- Caveat: about 189 doc<->code edges were dropped at build (LLM ids that did not match AST ids), so the prose and code halves are slightly under-linked. Treat a missing cross-half link as possibly-missing, not confirmed-absent.

---

# Knowledge Graph Map

"""
(skill_dir / "SKILL.md").write_text(skill_md + digest_body + "\n", encoding="utf-8")
shutil.copy(EXPORTS / "graph-slim.json", skill_dir / "graph-slim.json")

# zip with SKILL.md at the archive ROOT (required by the uploader)
zip_path = EXPORTS / "certiprepai-codebase-graph.skill.zip"
if zip_path.exists():
    zip_path.unlink()
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(skill_dir / "SKILL.md", "SKILL.md")
    z.write(skill_dir / "graph-slim.json", "graph-slim.json")

for f in ("graph-slim.json", "GRAPH_DIGEST.md", "GRAPH_PROMPT.md", "skill/SKILL.md", "certiprepai-codebase-graph.skill.zip"):
    print(f"  {f}: {(EXPORTS / f).stat().st_size} bytes")
print("Exports regenerated.")
