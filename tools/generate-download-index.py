#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    ROOT / "downloads" / "Stable",
    ROOT / "downloads" / "All Releases",
]


def encode_path_for_href(path: Path) -> str:
    # Keep paths workspace-relative and encode spaces for safe href usage.
    rel = path.relative_to(ROOT).as_posix()
    return rel.replace(" ", "%20")


def build_index(folder: Path):
    items = []
    for entry in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
        if not entry.is_file():
            continue
        if entry.name == "index.json":
            continue
        stat = entry.stat()
        items.append(
            {
                "name": entry.name,
                "path": encode_path_for_href(entry),
                "bytes": stat.st_size,
                "mtime": int(stat.st_mtime),
            }
        )
    return items


def main() -> int:
    for folder in TARGETS:
        if not folder.exists():
            print(f"skip missing: {folder}")
            continue
        index_path = folder / "index.json"
        data = build_index(folder)
        index_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {index_path.relative_to(ROOT)} ({len(data)} items)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

