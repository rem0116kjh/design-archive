(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const themeToggle = $('.theme-toggle');
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? '라이트 모드로 전환' : '다크 모드로 전환');
    $('use', themeToggle).setAttribute('href', dark ? '#sun' : '#moon');
    $('meta[name="theme-color"]').content = dark ? '#111511' : '#f2f4ed';
  }
  themeToggle.hidden = false;
  syncTheme();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('rem-log.neon.theme.v1', root.dataset.theme); } catch {}
    syncTheme();
  });

  const menuToggle = $('.menu-toggle');
  const menu = $('.mobile-menu');
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? '메뉴 닫기' : '메뉴 열기');
  });
  $$('a', menu).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => { if (!menu.hidden && !$('.site-header').contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  $('.filter-bar').hidden = false;
  const filters = $$('.filter');
  const cards = $$('.project-card');
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = selected !== 'all' && !card.dataset.category.split(' ').includes(selected); });
    const count = cards.filter(card => !card.hidden).length;
    $('.filter-count').textContent = `${count}개의 프로젝트`;
  }));

  // Project copy and links are kept here for easy template customization.
  const projects = {
    ghas: {name:'GHAS 알리미', category:'MOBILE APP', title:'학교생활의 작은 도우미.', description:'매일 확인하는 급식과 시간표를 한곳에 모았습니다. 경기자동차과학고 학생들을 위한 생활 지원 앱으로, Android와 iOS에서 사용할 수 있는 프로젝트입니다.', facts:[['무엇을','급식과 시간표를 한곳에서 확인하는 학교생활 지원 앱'],['분야','Android · iOS · NEIS API']], links:[['Play Store','https://play.google.com/store/apps/details?id=kr.hs.ghas.ghason'],['App Store','https://apps.apple.com/kr/app/ghas%EC%95%8C%EB%A6%AC%EB%AF%B8/id6779186783']]},
    linux: {name:'lhLinux', category:'OPEN SOURCE / LINUX', title:'나만의 환경, 나만의 가능성.', description:'Ubuntu 24.04 LTS를 기반으로 만든 오픈소스 WSL2 CLI 배포판입니다. 누구나 설치하고 개선할 수 있는 개발 환경을 탐구하는 프로젝트입니다.', facts:[['무엇을','오픈소스 WSL2 CLI 개발 환경'],['기반','Ubuntu 24.04 LTS · WSL2 · CLI']], links:[['GitHub에서 보기','https://github.com/rem0116kjh/lhlinux']]},
    gcpt: {name:'GCPT', category:'AI / COLLABORATION', title:'다른 생각이 만나는 곳.', description:'GPT, Claude, Gemini가 나누는 토론을 시각화하고, 서로 다른 추론 흐름을 살펴보는 협업 프로젝트입니다. 디자인과 일부 기능 구현에 참여했습니다.', facts:[['무엇을','여러 AI 모델의 토론 및 추론 흐름 시각화'],['참여','디자인 · 일부 기능 구현'],['분야','AI Debate · Visualization']], links:[['GitHub에서 보기','https://github.com/cksdud32/gcpt']]},
    suffice: {name:'SufficePatch', category:'DEVELOPER TOOL / AI', title:'좋은 수정은, 맥락에서.', description:'Codex와 Claude Code가 코드 수정 전에 필요한 소스, 프로젝트 지침, 의존성, 테스트 후보, Git 변경 내역을 모으는 스킬입니다. 다언어·모노레포 탐색과 요약·JSON 출력을 지원합니다.', facts:[['무엇을','AI 코딩 에이전트를 위한 소스 맥락 수집'],['지원','Codex · Claude Code'],['기능','소스 탐색 · 요약 · JSON 출력']], links:[['GitHub에서 보기','https://github.com/rem0116kjh/suffice-patch'],['스킬 소개','https://rem0116kjh.github.io/suffice-patch/']]}
  };
  const dialog = $('.project-dialog');
  let dialogTrigger;
  if (typeof dialog.showModal === 'function') {
    $$('[data-detail]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        const project = projects[button.dataset.detail];
        if (!project) return;
        dialogTrigger = button;
        $('#dialog-category').textContent = project.category;
        $('#dialog-name').textContent = project.name;
        $('#dialog-title').textContent = project.title;
        $('#dialog-description').textContent = project.description;
        $('#dialog-facts').replaceChildren(...project.facts.map(([label,value]) => {
          const row = document.createElement('div');
          const dt = document.createElement('dt'); dt.textContent = label;
          const dd = document.createElement('dd'); dd.textContent = value;
          row.append(dt, dd); return row;
        }));
        $('#dialog-links').replaceChildren(...project.links.map(([label,href],index) => {
          const link = document.createElement('a');
          link.className = `button ${index === 0 ? 'button-accent' : 'button-outline'}`;
          link.href = href; link.target = '_blank'; link.rel = 'noreferrer';
          link.setAttribute('aria-label', `${label} (새 탭)`);
          link.textContent = `${label} ↗`; return link;
        }));
        document.body.classList.add('dialog-open');
        dialog.showModal();
      });
    });
    $('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      dialogTrigger?.focus({preventScroll:true});
    });
  }

  const email = 'kjh08116@naver.com';
  const copyButton = $('.copy-email');
  let toastTimeout;
  function notify(message) {
    const toast = $('.toast');
    clearTimeout(toastTimeout);
    toast.textContent = message; toast.classList.add('visible');
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
  }
  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(email);
      notify('이메일 주소를 복사했어요.');
    } catch {
      const text = document.createElement('textarea');
      text.value = email; text.setAttribute('readonly','');
      text.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(text); text.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch {}
      text.remove(); copyButton.focus({preventScroll:true});
      if (copied) notify('이메일 주소를 복사했어요.');
      else {
        const range = document.createRange(); range.selectNodeContents($('.email-row a'));
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        notify('이메일 주소를 선택했어요. 길게 누르거나 복사해 주세요.');
      }
    }
  }
  copyButton.hidden = false;
  copyButton.addEventListener('click', copyEmail);
})();
