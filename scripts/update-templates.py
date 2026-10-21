#!/usr/bin/env python3
"""Refresh the static gallery and optional ZIP; viewing needs no Python or server."""
from __future__ import annotations
import argparse
import hashlib
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
e = html.escape


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'img', 'source'):
            self.refs.append(attrs.get('src', ''))
        elif tag == 'link' and attrs.get('rel') in ('stylesheet', 'preload', 'icon'):
            self.refs.append(attrs.get('href', ''))


def complete(entry):
    source = entry.read_text(encoding='utf-8')
    if '</html>' not in source.lower():
        return False
    parser = References()
    parser.feed(source)
    for ref in parser.refs:
        parsed = urlsplit(ref)
        if not ref or ref.startswith(('#', 'data:', 'blob:', '//')) or parsed.scheme:
            continue
        path = entry.parent / unquote(parsed.path)
        if not path.is_file():
            return False
    return True


def discover(config):
    excluded = set(config.get('excludeFolders', []))
    candidates = []
    for folder in sorted(ROOT.iterdir()):
        if not folder.is_dir() or folder.name.startswith('.') or folder.name in excluded:
            continue
        entry = folder / 'index.html'
        if not entry.is_file():
            entry = folder / 'dist' / 'index.html'
        if entry.is_file():
            candidates.append((folder, entry))
    templates, used = [], set()
    for item in config['templates']:
        item = dict(item)
        match = next(((folder, entry) for folder, entry in candidates
                      if folder.name == item.get('folder') or any(alias.casefold() in folder.name.casefold() for alias in item.get('aliases', []))), None)
        if not match and not item.get('expected'):
            continue
        item['ready'] = False
        if match:
            folder, entry = match
            used.add(folder.name)
            item.update(folder=folder.name, href=entry.relative_to(ROOT).as_posix(), ready=complete(entry))
        templates.append(item)
    for folder, entry in candidates:
        if folder.name in used:
            continue
        templates.append(dict(id='template-' + hashlib.sha256(folder.name.encode()).hexdigest()[:10], name=folder.name,
                              category='A NEW PERSPECTIVE', description='새로운 스타일로 나의 이야기를 시작해 보세요.',
                              tags=['HTML', 'CSS', 'JAVASCRIPT'], fallback='assets/template-placeholder.svg',
                              folder=folder.name, href=entry.relative_to(ROOT).as_posix(), ready=complete(entry), new=True))
    for item in templates:
        item.setdefault('fallback', 'assets/template-placeholder.svg')
        preview = None
        if item.get('folder'):
            folder = ROOT / item['folder']
            for stem in ['preview/desktop', 'preview/home', 'screenshots/desktop', 'preview/responsive']:
                for suffix in ['.webp', '.png', '.jpg', '.jpeg']:
                    file = folder / (stem + suffix)
                    if file.is_file():
                        preview = file.relative_to(ROOT).as_posix()
                        break
                if preview:
                    break
        custom = item.get('cover')
        item['preview'] = preview or (custom if custom and (ROOT / custom).is_file() else item['fallback'])
    return templates


def icon(name):
    return f'<svg class="icon" aria-hidden="true"><use href="#i-{name}"/></svg>'


def highlight(item):
    cls = 'highlight' + (' highlight-new' if item.get('new') else '') + ('' if item['ready'] else ' highlight-pending')
    inner = f'<span class="highlight-circle"><img src="{e(item["preview"])}" data-fallback="{e(item["fallback"])}" alt="" width="69" height="69"></span><span>{e(item["name"])}</span>'
    if item['ready']:
        return f'<a class="{cls}" href="{e(item["href"])}" aria-label="{e(item["name"])} 템플릿 열기">{inner}</a>'
    return f'<button class="{cls}" data-pending aria-label="{e(item["name"])} 제작 중">{inner}</button>'


def card(item):
    pending = not item['ready']
    search = ' '.join([item['name'], item['category'], item['description'], *item['tags']]).casefold()
    image = f'<img class="post-image" src="{e(item["preview"])}" data-fallback="{e(item["fallback"])}" alt="{e(item["name"])} 디자인 미리보기" width="600" height="660" loading="lazy">'
    if not pending:
        image = f'<a class="post-link" href="{e(item["href"])}" aria-label="{e(item["name"])} 템플릿 실행">{image}</a>'
    overlays = f'<span class="post-overlay">{icon("layers")}<span>HTML TEMPLATE</span></span>'
    overlays += (f'<span class="pending-chip">제작 중</span>' if pending else f'<button class="bookmark-button" aria-label="{e(item["name"])} 저장" aria-pressed="false">{icon("bookmark")}</button>')
    label = f'<div class="post-label"><span class="post-category">{e(item["category"])}</span><h2>{e(item["name"])}</h2><span class="post-description">{e(item["description"])}</span></div>'
    bottom = '<span class="post-state"><i></i>곧 만나요</span>' if pending else f'<a href="{e(item["href"])}"><span class="post-state"><i></i>바로 열기</span>{icon("arrow")}</a>'
    return (f'<article class="post{" post-pending" if pending else ""}" data-id="{e(item["id"])}" data-name="{e(item["name"])}" data-ready="{str(not pending).lower()}" data-search="{e(search)}">'
            f'<div class="post-media">{image}{overlays}{label}</div><div class="post-bottom">{bottom}<span class="post-tag">{e(item["tags"][0])}</span></div></article>')


def replace_block(source, name, value):
    pattern = rf'<!-- {re.escape(name)}:start -->.*?<!-- {re.escape(name)}:end -->'
    result, count = re.subn(pattern, lambda match: f'<!-- {name}:start -->{value}<!-- {name}:end -->', source, flags=re.S)
    if count != 1:
        raise ValueError(f'Expected one {name} block; found {count}.')
    return result


def sync():
    config = json.loads((ROOT / 'templates.config.json').read_text())
    templates = discover(config)
    page = ROOT / 'index.html'
    source = page.read_text()
    source = replace_block(source, 'highlights', '\n' + '\n'.join(highlight(t) for t in templates) + '\n')
    source = replace_block(source, 'templates', '\n' + '\n'.join(card(t) for t in templates) + '\n')
    source = replace_block(source, 'ready-count', str(sum(t['ready'] for t in templates)))
    source = replace_block(source, 'upcoming-count', str(sum(not t['ready'] for t in templates)))
    temp = ROOT / '.index.next.html'
    temp.write_text(source)
    temp.replace(page)
    return templates


def package(templates):
    entries = ['index.html', 'home.css', 'home.js', 'README.md', '.gitignore', '.nojekyll', 'templates.config.json', '목록-업데이트.command', 'assets', 'scripts', 'preview']
    entries.extend(t['folder'] for t in templates if t.get('folder') and t['ready'])
    files = set()
    excluded = {'.git', '.openai', 'node_modules', '__pycache__', 'performance'}
    for name in entries:
        path = ROOT / name
        for file in ([path] if path.is_file() else path.rglob('*') if path.is_dir() else []):
            relative = file.relative_to(ROOT)
            if not file.is_file() or excluded.intersection(relative.parts) or file.name.startswith('.env') or file.name == '.DS_Store' or file.suffix in ('.zip', '.pyc'):
                continue
            files.add(file)
    archive = ROOT / 'HTML-디자인-템플릿.zip'
    with ZipFile(archive, 'w', ZIP_DEFLATED) as zipfile:
        for file in sorted(files):
            zipfile.write(file, Path('HTML-디자인-템플릿') / file.relative_to(ROOT))
    with ZipFile(archive) as zipfile:
        if zipfile.testzip() is not None:
            raise ValueError('ZIP integrity check failed')
    print(f'ZIP: {archive.name} ({len(files)} files)')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', action='store_true', help='Also refresh the shareable ZIP.')
    args = parser.parse_args()
    templates = sync()
    for item in templates:
        print(f'{"READY" if item["ready"] else "PREPARING"}: {item["name"]} {item.get("href", "")}')
    if args.package:
        package(templates)
