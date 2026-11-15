from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import hashlib,json,re
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.path=path;self.ids=[];self.links=[];self.assets=[];self.blank=[];self.tags=[];self.feed(path.read_text(encoding='utf-8'))
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag in ['script','img'] and 'src' in a:self.assets.append(a['src'])
  if tag=='object' and 'data' in a:self.assets.append(a['data'])
  if tag=='link' and 'href' in a:self.assets.append(a['href'])
  if tag=='a' and a.get('target')=='_blank':self.blank.append(a)
pages={p.name:Page(p) for p in root.glob('*.html')}
checks=0
for name,page in pages.items():
 assert len(page.ids)==len(set(page.ids)),f'Duplicate IDs: {name}'
 for a in page.blank:assert 'noopener' in a.get('rel',''),f'Unsafe link: {a}'
 for ref in page.links+page.assets:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  path=unquote(u.path);target=root/(path or name)
  assert target.exists(),f'Missing target: {name}: {ref}'
  if u.fragment and target.suffix=='.html':assert u.fragment in pages[target.name].ids,f'Missing fragment {ref}'
  checks+=1
index=pages['index.html'];s=(root/'index.html').read_text(encoding='utf-8')
assert len(re.findall('class="project-visual"',s))==6
assert len(re.findall('class="writing-entry"',s))==4
assert 'href="https://reidmaxim.github.io/creaturecreator/' in s
protected=json.loads((root/'tests/protected-baseline.json').read_text())
for path,digest in protected.items():assert hashlib.sha256((root/path).read_bytes().replace(b"\r\n",b"\n")).hexdigest()==digest,f'Protected intro changed: {path}'
print(f'PASS: {len(pages)} pages, {checks} local references, six projects, four writings, safe external links, protected intro hashes.')
