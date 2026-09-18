#!/usr/bin/env python3
"""Assemble index.html.

The Before/After section and the conversation scroll section live as standalone
prototypes in ../before-after-prototype and ../conversation-scroll. This script
pulls their <style>, markup and <script> in, scopes their CSS under .ba-wrap / .cs
(and prefixes their @keyframes) so nothing collides with the page styles, and
writes index.html next to this file. Run it after editing template.html or either
prototype:  python3 build.py
"""
import re, pathlib

HERE = pathlib.Path(__file__).parent
BA = HERE.parent / "before-after-prototype" / "index.html"
CS = HERE.parent / "conversation-scroll" / "index.html"


def part(html, tag):
    m = re.search(r"<%s[^>]*>(.*?)</%s>" % (tag, tag), html, re.S)
    return m.group(1)


def _blocks(css):
    """Yield (selector, inner) for each top-level block, matching braces."""
    i = 0
    while True:
        j = css.find("{", i)
        if j < 0:
            return
        sel = css[i:j].strip()
        depth, k = 1, j + 1
        while depth:
            if css[k] == "{": depth += 1
            elif css[k] == "}": depth -= 1
            k += 1
        yield sel, css[j + 1:k - 1]
        i = k


def _scope(css, scope):
    out = []
    for sel, inner in _blocks(css):
        if sel.startswith("@keyframes") or sel.startswith("@font-face"):
            out.append("%s {%s}" % (sel, inner))
        elif sel.startswith("@"):
            out.append("%s {%s}" % (sel, _scope(inner, scope)))
        elif sel in (":root", "*", "html, body", "body", "html"):
            continue
        else:
            parts = [p.strip() for p in sel.split(",")]
            out.append("%s {%s}" % (", ".join(scope + " " + p for p in parts), inner))
    return "\n".join(out)


def scope_css(css, scope, prefix):
    """Prefix every selector with `scope`; rename keyframes with `prefix`; drop tokens/fonts/resets."""
    names = set(re.findall(r"@keyframes\s+([\w-]+)", css))
    css = re.sub(r"@keyframes\s+([\w-]+)", lambda m: "@keyframes %s%s" % (prefix, m.group(1)), css)
    for n in names:
        css = re.sub(r"(animation(?:-name)?\s*:[^;]*?)\b%s\b" % re.escape(n), lambda m: m.group(1) + prefix + n, css)
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return _scope(css, scope)


def body_markup(html, start, end):
    s = html.index(start)
    e = html.index(end, s) + len(end)
    return html[s:e]


ba = BA.read_text()
cs = CS.read_text()

ba_css = scope_css(part(ba, "style"), ".ba-wrap", "ba-")
cs_css = scope_css(part(cs, "style"), ".cs", "cs-")
ba_html = body_markup(ba, '<section class="ba"', "</section>")
cs_html = body_markup(cs, '<div class="track" id="track">', "\n</div>\n\n<div class=\"tail\">").replace("\n\n<div class=\"tail\">", "")
ba_js = part(ba, "script")
cs_js = part(cs, "script")

tpl = (HERE / "template.html").read_text()
out = (tpl.replace("<!-- BA_CSS -->", ba_css)
          .replace("<!-- CS_CSS -->", cs_css)
          .replace("<!-- BA_HTML -->", ba_html)
          .replace("<!-- CS_HTML -->", cs_html)
          .replace("<!-- BA_JS -->", ba_js)
          .replace("<!-- CS_JS -->", cs_js))
(HERE / "index.html").write_text(out)
print("index.html written:", len(out), "bytes")
