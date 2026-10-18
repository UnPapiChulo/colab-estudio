"""Build a portable static site, including GitHub Pages project paths.

Example: python3 scripts/build_pages.py --base-path /colab-estudio/
The generated site is written to _site/; source files in dist/ stay root-relative.
"""

import argparse
from html import escape
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "_site"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-path", default="/", help="Deployment path, e.g. /colab-estudio/")
    parser.add_argument("--site-url", help="Full deployed homepage URL for social metadata")
    args = parser.parse_args()

    base = "/" + args.base_path.strip("/") + "/" if args.base_path.strip("/") else "/"
    if not re.fullmatch(r"/(?:[A-Za-z0-9_.-]+/)*", base) or any(part in (".", "..") for part in base.split("/")):
        parser.error("--base-path must be a simple URL path, such as /colab-estudio/")
    if args.site_url:
        url = urlsplit(args.site_url)
        if url.scheme not in ("http", "https") or not url.netloc or url.username or url.password:
            parser.error("--site-url must be an absolute HTTP(S) URL without credentials")

    subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], check=True)
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    shutil.copytree(ROOT / "dist", OUTPUT)

    for path in OUTPUT.rglob("*.html"):
        html = path.read_text(encoding="utf-8")
        # Preserve fragments, relative files, external URLs and protocol-relative URLs.
        html = re.sub(r'\b(href|src)=("|\')/(?!/)', lambda match: match.group(1) + "=" + match.group(2) + base, html)
        if args.site_url:
            html = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda match: match.group(1) + escape(args.site_url, quote=True), html)
        path.write_text(html, encoding="utf-8")

    (OUTPUT / ".nojekyll").touch()
    print(f"Portable site generated in {OUTPUT.relative_to(ROOT)}/ with base path {base}")


if __name__ == "__main__":
    main()
