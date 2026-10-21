(() => {
  'use strict';

  const en = document.documentElement.lang === 'en';
  const themeKey = 'design-archive.rem.theme.v1';
  const themeButton = document.querySelector('.theme-toggle');
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
  const moon = '<path d="M20.985 12.486A9 9 0 1 1 11.51 3.01a7 7 0 0 0 9.475 9.475Z"/>';

  function updateTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0a0a0a' : '#fafafa';
    themeButton.setAttribute('aria-label', en
      ? (dark ? 'Switch to light mode' : 'Switch to dark mode')
      : (dark ? '라이트 모드로 전환' : '다크 모드로 전환'));
    themeButton.title = themeButton.getAttribute('aria-label');
    themeButton.querySelector('svg').innerHTML = dark ? sun : moon;
  }

  updateTheme(document.documentElement.classList.contains('dark'));
  themeButton.addEventListener('click', () => {
    const dark = !document.documentElement.classList.contains('dark');
    updateTheme(dark);
    try { localStorage.setItem(themeKey, dark ? 'dark' : 'light'); } catch { /* Optional persistence. */ }
  });

  // Keep the current section when switching between the two editable HTML pages.
  const languageLink = document.querySelector('.language-toggle');
  function updateLanguageLink() {
    languageLink.href = (en ? 'index.html' : 'en.html') + window.location.hash;
  }
  updateLanguageLink();
  window.addEventListener('hashchange', updateLanguageLink);

  document.querySelectorAll('.more-button').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    const collapsedLabel = button.getAttribute('aria-label');
    const collapsedText = button.lastChild.textContent;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      panel.hidden = !expanded;
      button.setAttribute('aria-label', expanded ? (en ? 'Collapse additional records' : '추가 기록 접기') : collapsedLabel);
      button.lastChild.textContent = expanded ? (en ? 'Collapse' : '접기') : collapsedText;
      button.querySelector('svg').innerHTML = expanded ? '<path d="m18 15-6-6-6 6"/>' : '<path d="M5 12h14M12 5v14"/>';
    });
  });

  // This terminal only displays local text; it never executes system commands.
  const { profile, skills } = JSON.parse(document.querySelector('#terminal-data').textContent);
  const form = document.querySelector('.terminal-form');
  const input = form.querySelector('input');
  const log = document.querySelector('.terminal-log');
  const hint = document.querySelector('#terminal-hint');
  const commands = [];
  let historyIndex = 0;
  const initialEntries = [...log.querySelectorAll('.terminal-entry')];
  const identity = initialEntries[0]?.querySelector('.terminal-prompt').textContent || 'Rem@macbook';

  if (en) {
    hint.textContent = 'Type help to explore.';
    input.setAttribute('aria-label', 'Terminal command');
    form.querySelector('button').setAttribute('aria-label', 'Run command');
    form.querySelector('button').title = 'Run command';
    log.setAttribute('aria-label', 'Terminal output');
    document.querySelector('.mac-desktop').setAttribute('aria-label', 'Meet Rem in the terminal');
  }

  function appendEntry(command, output) {
    const entry = document.createElement('div');
    entry.className = 'terminal-entry';
    const prompt = document.createElement('p');
    const user = document.createElement('span');
    user.className = 'terminal-prompt';
    user.textContent = identity;
    const location = document.createElement('span');
    location.className = 'terminal-path';
    location.textContent = '~ %';
    prompt.append(user, ' ', location, ' ', command);
    const response = document.createElement('p');
    response.className = 'terminal-output';
    response.textContent = output;
    entry.append(prompt, response);
    log.append(entry);
    while (log.children.length > 50) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    commands.push(value);
    if (commands.length > 50) commands.shift();
    historyIndex = commands.length;
    const normalized = value.toLowerCase();
    if (normalized === 'clear') {
      log.replaceChildren();
      return;
    }
    const output = {
      help: en ? 'whoami — introduction\nabout — biography\nstack — skills\nclear — clear screen' : 'whoami — 자기소개\nabout — 소개 글\nstack — 기술 스택\nclear — 화면 지우기',
      whoami: `${profile.name} · ${profile.role}`,
      about: profile.bio,
      'cat about.txt': profile.bio,
      stack: skills.map(({ name, items }) => `${name}: ${items.join(', ')}`).join('\n'),
    };
    appendEntry(value, Object.hasOwn(output, normalized) ? output[normalized] : en
      ? `Command not found: ${value}\nType help for available commands.`
      : `명령어를 찾을 수 없어요: ${value}\nhelp로 사용 가능한 명령어를 확인해 보세요.`);
  });

  input.addEventListener('keydown', event => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    historyIndex = Math.max(0, Math.min(commands.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = commands[historyIndex] || '';
  });
})();
