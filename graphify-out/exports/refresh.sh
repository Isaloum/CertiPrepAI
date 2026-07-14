#!/usr/bin/env bash
# Rebuild the code side of the knowledge graph and regenerate all shareable exports.
# Usage:  ./graphify-out/exports/refresh.sh          (from anywhere)
set -euo pipefail

# resolve project root = two levels up from this script (exports/ -> graphify-out/ -> repo)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT"
export PATH="$HOME/.local/bin:$PATH"

PY="$(cat graphify-out/.graphify_python 2>/dev/null || command -v python3)"

echo "1/2  Clean rebuild (fresh AST over code + cached doc concepts, no LLM)..."
"$PY" graphify-out/exports/rebuild.py

echo "2/2  Regenerating exports (slim JSON, digest, prompt, skill zip)..."
"$PY" graphify-out/exports/_generate_exports.py

echo
echo "Done. Updated files in graphify-out/exports/:"
echo "  certiprepai-codebase-graph.skill.zip  <- re-upload in Settings > Skills"
echo "  GRAPH_PROMPT.md   <- paste into any chat (self-contained prompt)"
echo "  GRAPH_DIGEST.md   <- readable map"
echo "  graph-slim.json   <- for exact path tracing"
echo
echo "Note: this reflects CODE changes (fresh AST). NEW doc/PDF/image files need a full"
echo "LLM rebuild (run /graphify . in Claude Code) to be semantically extracted."
