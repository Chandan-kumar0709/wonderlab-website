"""Dependency-free source checks. Run from any directory with python scripts/check-site.py."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parents[1]
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.elements, self.stack, self.text = path, [], [], []
        self.hidden_stack, self.visible_text = [], []
        self.feed(path.read_text(encoding='utf-8'))
        if self.stack:
            errors.append(f'{path.name}: unclosed tags {self.stack}')

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if tag not in VOID:
            self.stack.append(tag)
            self.hidden_stack.append('hidden' in attrs)

    def handle_startendtag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
            self.hidden_stack.pop()
        else:
            errors.append(f'{self.path.name}: mismatched closing tag {tag}')

    def handle_data(self, data):
        self.text.append(data)
        if not any(self.hidden_stack):
            self.visible_text.append(data)


pages = {p.name: Page(p) for p in ROOT.glob('*.html')}
titles, descriptions = [], []
references = 0
for name, page in pages.items():
    ids = [a['id'] for _, a in page.elements if 'id' in a]
    assert_unique = [i for i, count in Counter(ids).items() if count > 1]
    if assert_unique:
        errors.append(f'{name}: duplicate IDs {assert_unique}')
    if name != 'privacy-policy.html':
        if sum(t == 'h1' for t, _ in page.elements) != 1:
            errors.append(f'{name}: expected one H1')
        source = page.path.read_text(encoding='utf-8')
        title = re.search(r'<title>(.*?)</title>', source, re.S)
        titles.append(title.group(1) if title else '')
        descriptions += [a.get('content', '') for t, a in page.elements if t == 'meta' and a.get('name') == 'description']
        if re.search(r'\bmaths?\b|[↗→]', ''.join(page.text), re.I):
            errors.append(f'{name}: unwanted subject or arrow glyph')
        if any(t == 'form' for t, _ in page.elements):
            errors.append(f'{name}: enquiry form must remain absent')
        route = '/' if name == 'index.html' else '/' + name
        canonical = [a.get('href') for _, a in page.elements if a.get('rel') == 'canonical']
        og_url = [a.get('content') for _, a in page.elements if a.get('property') == 'og:url']
        if canonical != ['https://wonderlab.sg' + route] or og_url != canonical:
            errors.append(f'{name}: canonical/social URL does not match confirmed release origin')
        if re.search(r'35 years|25 years|Efficiency Award|Head of Department|MOE-approved|MOE-certified|guaranteed|aligned with the Singapore MOE', ' '.join(page.visible_text), re.I):
            errors.append(f'{name}: approval-dependent claim in visible content')
        if '{{' in source or 'PRODUCTION_ORIGIN' in source:
            errors.append(f'{name}: unresolved release metadata')
        for payload in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S):
            json.loads(payload)
    for tag, attrs in page.elements:
        if tag == 'img' and (not attrs.get('alt') or not attrs.get('width') or not attrs.get('height')):
            errors.append(f'{name}: image needs alt and dimensions')
        if tag == 'svg' and attrs.get('class', '').find('icon-arrow') >= 0 and attrs.get('aria-hidden') != 'true':
            errors.append(f'{name}: decorative SVG must be hidden')
        if attrs.get('target') == '_blank' and not {'noopener', 'noreferrer'} <= set(attrs.get('rel', '').split()):
            errors.append(f'{name}: unsafe external link')
        urls = [attrs[k] for k in ('href', 'src') if k in attrs]
        urls += [item.strip().split()[0] for item in attrs.get('srcset', '').split(',') if item.strip()]
        for url in urls:
            target = urlsplit(url)
            if target.scheme or target.netloc:
                continue
            references += 1
            dest = ROOT / unquote(target.path) if target.path else page.path
            if not dest.is_file():
                errors.append(f'{name}: missing local resource {url}')
            if target.fragment and dest.name in pages:
                found = any(a.get('id') == unquote(target.fragment) for _, a in pages[dest.name].elements)
                if not found:
                    errors.append(f'{name}: missing anchor {url}')
for label, values in [('titles', titles), ('descriptions', descriptions)]:
    if len(values) != 7 or len(set(values)) != 7 or not all(values):
        errors.append(f'Expected seven unique, nonempty {label}')
for css in (ROOT / 'assets').glob('*.css'):
    source = re.sub(r'/\*.*?\*/', '', css.read_text(encoding='utf-8'), flags=re.S)
    for url in re.findall(r'url\([\'"]?([^\)\'\"]+)', source):
        if not urlsplit(url).scheme and not url.startswith('#') and not (css.parent / url).is_file():
            errors.append(f'{css.name}: missing CSS resource {url}')
    # Structural check; browser CSSOM checks supplement this, not a full CSS validator.
    source = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"|\'[^\'\\]*(?:\\.[^\'\\]*)*\'', '', source)
    stack = []
    for char in source:
        if char in '{(': stack.append(char)
        elif char in '})':
            if not stack or stack.pop() != {'}': '{', ')': '('}[char]:
                errors.append(f'{css.name}: unbalanced CSS delimiters')
                break
    if stack: errors.append(f'{css.name}: unclosed CSS delimiters')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML files; {references} local references; unique metadata; anchors; image attributes; SVG semantics; CSS structure/resources; approval guards.')
