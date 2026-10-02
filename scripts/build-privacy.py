"""Build the local P011 Core Page payload from its single planning copy source."""
from html import escape
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
spec = (ROOT / "planning/pages/P011.md").read_text(encoding="utf-8")
copy = spec.split("### H1: Privacy information\n", 1)[1].split(
    "### Content self-check and unresolved decisions", 1
)[0].strip()


def inline(value):
    value = escape(value)
    value = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda match: f'<a href="{match.group(2)}">{match.group(1)}</a>',
        value,
    )
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    value = re.sub(r"`([^`]+)`", r"<code>\1</code>", value)
    return value


blocks = []  # The Theme renders the Core Page title as the single H1.
for paragraph in re.split(r"\n\s*\n", copy):
    paragraph = paragraph.strip()
    if not paragraph:
        continue
    if paragraph.startswith("### "):
        heading = inline(paragraph[4:])
        blocks.append(f'<!-- wp:heading --><h2 class="wp-block-heading">{heading}</h2><!-- /wp:heading -->')
    else:
        blocks.append(f'<!-- wp:paragraph --><p>{inline(paragraph)}</p><!-- /wp:paragraph -->')

payload = {
    "stable_id": "P011",
    "slug": "privacy",
    "title": "Privacy information",
    "status": "publish",
    "content": "\n".join(blocks),
    "seo": {
        "title": "Privacy information | GE Masterbatch",
        "description": "Learn how GE handles website inquiries and analytics choices, and how to contact us about information you submitted.",
    },
}
target = ROOT / ".local/p011-page.json"
target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"P011 local payload: {len(blocks)} Core blocks")
