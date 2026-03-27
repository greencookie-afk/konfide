#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_ROOT="${TMPDIR:-/tmp}/konfide-next-cache-resets"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE_PATH="$ARCHIVE_ROOT/$TIMESTAMP"

cd "$PROJECT_ROOT"

archive_path() {
  local relative_path="$1"

  if [ ! -e "$relative_path" ]; then
    return
  fi

  mkdir -p "$ARCHIVE_PATH"
  mv "$relative_path" "$ARCHIVE_PATH/"
  printf 'Archived %s -> %s/%s\n' "$relative_path" "$ARCHIVE_PATH" "$relative_path"
}

archive_path ".next"
archive_path ".turbo"
archive_path ".cache"
archive_path "out"
archive_path "coverage"
archive_path ".eslintcache"

for tsbuildinfo in *.tsbuildinfo; do
  if [ -e "$tsbuildinfo" ]; then
    archive_path "$tsbuildinfo"
  fi
done

if [ ! -d "$ARCHIVE_PATH" ]; then
  printf 'No runtime cache directories found to archive.\n'
fi
