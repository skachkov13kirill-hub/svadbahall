#!/usr/bin/env python3
"""
Вставляет/обновляет блок TRACKERS в <head> всех HTML файлов сайта.
Идемпотентно: если блок уже есть — заменяет; если нет — вставляет перед </head>.

Использование:
  python3 _inject_trackers.py                              # вставить с placeholder'ами
  GSC=abc YV=def YM=12345678 python3 _inject_trackers.py   # вставить с реальными значениями
"""
import os
import re
import sys
from pathlib import Path

SITE_DIR = Path(__file__).parent

GSC = os.environ.get("GSC", "REPLACE_WITH_GSC_TOKEN")
YV = os.environ.get("YV", "REPLACE_WITH_YV_TOKEN")
YM = os.environ.get("YM", "REPLACE_WITH_METRIKA_ID")

BLOCK = f'''<!-- TRACKERS:START -->
<meta name="google-site-verification" content="{GSC}">
<meta name="yandex-verification" content="{YV}">
<script>(function(m,e,t,r,i,k,a){{m[i]=m[i]||function(){{(m[i].a=m[i].a||[]).push(arguments)}};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {{if (document.scripts[j].src === r) {{ return; }}}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym({YM}, "init", {{clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true}});</script>
<noscript><div><img src="https://mc.yandex.ru/watch/{YM}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- TRACKERS:END -->
'''

PATTERN_EXISTING = re.compile(r"<!-- TRACKERS:START -->.*?<!-- TRACKERS:END -->\s*", re.DOTALL)


def process(path: Path) -> str:
    content = path.read_text(encoding="utf-8")
    if PATTERN_EXISTING.search(content):
        new_content = PATTERN_EXISTING.sub(BLOCK, content)
        action = "updated"
    elif "</head>" in content:
        new_content = content.replace("</head>", BLOCK + "</head>", 1)
        action = "inserted"
    else:
        return "skipped (no </head>)"
    if new_content != content:
        path.write_text(new_content, encoding="utf-8")
    return action


def main():
    html_files = list(SITE_DIR.glob("*.html")) + list((SITE_DIR / "articles").glob("*.html"))
    print(f"Processing {len(html_files)} HTML files")
    print(f"  GSC: {GSC}")
    print(f"  YV:  {YV}")
    print(f"  YM:  {YM}")
    print()
    for f in sorted(html_files):
        rel = f.relative_to(SITE_DIR)
        result = process(f)
        print(f"  {result:10} {rel}")


if __name__ == "__main__":
    main()
