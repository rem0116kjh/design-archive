'use strict';

(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const settings = { email: 'kjh08116@naver.com', github: 'https://github.com/rem0116kjh' };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'ko';
  let manualPause = false;
  let modalPaused = false;
  let activeProject = null;
  let toastTimer;
  let lastDialogTrigger = null;

  const translations = $$('[data-en]').map(element => ({ element, ko: element.innerHTML, en: element.dataset.en }));
  const projects = {
    ghas: {
      eyebrow: '01 / EVERYDAY, SIMPLIFIED',
      title: ['GHAS 알리미', 'GHAS Alimi'],
      description: [
        '경기자동차과학고 학생들을 위한 학교생활 지원 앱입니다. 매일 확인하는 급식과 시간표를 한곳에 모아 더 편리하게 확인할 수 있도록 만들었습니다.\n\nAndroid와 iOS에서 사용할 수 있습니다. 이 포트폴리오에 표시된 앱 화면은 프로젝트를 소개하기 위해 제작한 일러스트이며, 실제 앱 화면은 스토어에서 확인할 수 있습니다.',
        'A daily-life support app for students at Gyeonggi Automotive Science High School, bringing school meals and schedules together.\n\nAvailable on Android and iOS. The phone interface in this portfolio is an illustration; visit the store listings to see the actual application.'
      ],
      tags: ['Android', 'iOS', 'NEIS API'],
      links: [
        ['Play Store', 'https://play.google.com/store/apps/details?id=kr.hs.ghas.ghason'],
        ['App Store', 'https://apps.apple.com/kr/app/ghas%EC%95%8C%EB%A6%AC%EB%AF%B8/id6779186783']
      ]
    },
    suffice: {
      eyebrow: '02 / CONTEXT BEFORE CODE',
      title: ['SufficePatch', 'SufficePatch'],
      description: [
        'Codex와 Claude Code가 코드를 수정하기 전에 필요한 소스, 프로젝트 지침, 의존성, 테스트 후보, Git 변경 내역을 모으는 스킬입니다.\n\n다양한 언어와 모노레포 탐색을 지원하고, 수집 결과를 요약 또는 JSON으로 출력합니다. 더 적은 추측으로 작업할 수 있도록 수정에 앞서 프로젝트의 맥락을 전달합니다.\n\n화면의 터미널 출력은 기능 소개를 위한 일러스트입니다.',
        'A skill that gathers source files, project instructions, dependencies, test candidates, and Git changes before Codex or Claude Code edits your code.\n\nIt supports multiple languages, monorepo exploration, and summary or JSON output—providing project context before changes begin.\n\nThe terminal output in this portfolio is an illustration.'
      ],
      tags: ['Python', 'Codex', 'Claude Code', 'Open source'],
      links: [['GitHub', 'https://github.com/rem0116kjh/suffice-patch'], ['Guide', 'https://rem0116kjh.github.io/suffice-patch/']]
    },
    ktspace: {
      eyebrow: '03 / A UNIVERSE OF WHAT-IFS',
      title: ['KTspace', 'KTspace'],
      description: [
        '태양의 질량, 거리, 밝기 등의 조건을 바꾸며 행성 궤도와 지구 환경을 비교하는 교육용 태양계 시뮬레이터입니다.\n\n10가지 실험, 탐구 노트, CSV 내보내기를 통해 관찰한 내용을 기록하고 비교할 수 있습니다.\n\n이 페이지의 공전 슬라이더는 속도를 조절하는 인터랙티브 일러스트입니다. 실제 물리 조건을 바꾸는 시뮬레이션은 프로젝트에서 확인할 수 있습니다.',
        'An educational solar system simulator for comparing planetary orbits and Earth conditions by changing solar mass, distance, brightness, and more.\n\nIt includes 10 experiments, inquiry notes, and CSV export to help record and compare observations.\n\nThe orbital slider on this page is an interactive animation. Open the project for the actual physics simulator.'
      ],
      tags: ['Python', 'Streamlit', 'Physics', 'Education'],
      links: [['GitHub', 'https://github.com/rem0116kjh/KTspace']]
    },
    story: {
      eyebrow: 'CURIOSITY → EXPERIMENT → EXPERIENCE',
      title: ['작은 질문을, 작동하는 무언가로.', 'From a small question to something real.'],
      description: [
        '01 — 먼저, 궁금해합니다.\n매일 겪는 작은 불편이나 이해하고 싶은 원리에서 프로젝트를 시작합니다.\n\n02 — 직접 만들고 실험합니다.\n필요한 기술을 찾고, 작은 형태로 구현하며, 실제로 어떻게 작동하는지 확인합니다.\n\n03 — 배우고, 기록하고, 다시 만듭니다.\n코드는 GitHub에, 배운 것은 블로그에 남기며 다음 질문으로 이어갑니다.',
        '01 — Start with curiosity.\nA small everyday frustration or an unfamiliar principle becomes the starting point.\n\n02 — Build and experiment.\nFind the right tools, make a small version, and observe how it works.\n\n03 — Learn, document, repeat.\nShare the code on GitHub, write down the lessons, and move on to the next question.'
      ],
      tags: ['Curiosity', 'Code', 'Learning'],
      links: [['GitHub', settings.github], ['Velog', 'https://velog.io/@luka0116kjh/posts']]
    }
  };

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    translations.forEach(({ element, ko, en }) => {
      if (language === 'ko') element.innerHTML = ko;
      else element.textContent = en;
    });
    $('#language-label').textContent = language === 'ko' ? 'EN' : 'KO';
    $('.language-button').setAttribute('aria-label', language === 'ko' ? 'Switch to English' : '한국어로 전환');
    $('.menu-button').setAttribute('aria-label', language === 'ko' ? '메뉴 열기' : 'Open menu');
    $('.announcement-close').setAttribute('aria-label', language === 'ko' ? '안내 닫기' : 'Dismiss announcement');
    $('.dialog-close').setAttribute('aria-label', language === 'ko' ? '닫기' : 'Close');
    $('#orbit-speed').setAttribute('aria-label', language === 'ko' ? '공전 애니메이션 속도' : 'Orbital animation speed');
    document.title = language === 'ko' ? 'Rem — 호기심을 가능성으로.' : 'Rem — Ideas into reality.';
    updateMotionUI();
    if (activeProject) populateDialog(activeProject);
    try { localStorage.setItem('rem-antigravity-language', language); } catch (_) { /* File previews may restrict storage. */ }
  }
  $('.language-button').addEventListener('click', () => setLanguage(language === 'ko' ? 'en' : 'ko'));

  const menu = $('#mobile-nav');
  const menuButton = $('.menu-button');
  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.inert = true;
    menuButton.setAttribute('aria-label', language === 'ko' ? '메뉴 열기' : 'Open menu');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', language === 'ko' ? '메뉴 닫기' : 'Close menu');
      menu.classList.add('is-open');
      menu.inert = false;
    }
  });
  $$('a', menu).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !$('#header').contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  $('.announcement-close').addEventListener('click', () => {
    $('#announcement').hidden = true;
    $('.brand').focus({ preventScroll: true });
  });

  const dialog = $('#project-dialog');
  function populateDialog(key) {
    const project = projects[key];
    const index = language === 'ko' ? 0 : 1;
    $('#dialog-eyebrow').textContent = project.eyebrow;
    $('#dialog-title').textContent = project.title[index];
    $('#dialog-description').textContent = project.description[index];
    $('#dialog-tags').replaceChildren(...project.tags.map(tag => {
      const item = document.createElement('span'); item.textContent = tag; return item;
    }));
    $('#dialog-links').replaceChildren(...project.links.map(([label, url], i) => {
      const link = document.createElement('a');
      link.className = `button ${i === 0 ? 'button-dark' : 'button-light'}`;
      link.textContent = `${label} ↗`;
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${label} (${language === 'ko' ? '새 탭' : 'new tab'})`);
      return link;
    }));
  }
  function openProject(key, trigger) {
    if (!projects[key]) return;
    activeProject = key;
    lastDialogTrigger = trigger;
    populateDialog(key);
    dialog.showModal();
    document.body.classList.add('modal-open');
    modalPaused = true;
    syncAnimation();
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
  $('#open-story').addEventListener('click', event => openProject('story', event.currentTarget));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    activeProject = null; modalPaused = false;
    syncAnimation();
    lastDialogTrigger?.focus({ preventScroll: true });
  });

  const tabs = $$('[role="tab"]');
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });

  $('#orbit-speed').addEventListener('input', event => {
    const speed = Number(event.target.value);
    document.documentElement.style.setProperty('--orbit-speed', speed);
    $('#speed-value').textContent = `${speed.toFixed(1)}×`;
  });
  $('#copy-email').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(settings.email);
      else {
        const field = document.createElement('textarea');
        field.value = settings.email; field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.append(field); field.select();
        const copied = document.execCommand('copy'); field.remove();
        if (!copied) throw new Error('Copy not available');
      }
      notify(language === 'ko' ? '이메일 주소를 복사했어요.' : 'Email address copied.');
    } catch (_) { notify(`${language === 'ko' ? '이 주소를 복사해주세요: ' : 'Copy this address: '}${settings.email}`); }
    $('#copy-email').focus({ preventScroll: true });
  });
  $('#year').textContent = new Date().getFullYear();

  // A single frame loop serves both canvases and stops when they are off screen.
  const field = $('#particles');
  const ribbon = $('#ribbon');
  const fieldCtx = field.getContext('2d');
  const ribbonCtx = ribbon.getContext('2d');
  const sizes = { field: { w: 0, h: 0 }, ribbon: { w: 0, h: 0 } };
  const inView = { field: true, ribbon: false };
  let stars = [];
  let frame = 0;
  let clock = 0;
  let previous = 0;
  let lastPaint = 0;
  let pointer = { x: -10000, y: -10000 };
  let resizeTimer;

  function fitCanvas(canvas, ctx, key) {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizes[key] = { w: rect.width, h: rect.height };
  }
  function resize() {
    fitCanvas(field, fieldCtx, 'field'); fitCanvas(ribbon, ribbonCtx, 'ribbon');
    const { w, h } = sizes.field;
    stars = Array.from({ length: w < 768 ? 210 : 530 }, () => {
      let x = Math.random() * w, y = Math.random() * h;
      const center = Math.abs(x - w / 2) < w * .28 && Math.abs(y - h * .45) < h * .3;
      return { x, y, size: .6 + Math.random() * 1.7, alpha: center ? .06 + Math.random() * .12 : .15 + Math.random() * .45, speed: .2 + Math.random() * .7, angle: Math.random() * Math.PI, color: Math.random() > .19 ? '84,115,206' : '174,153,141' };
    });
    drawField(clock); drawRibbon(clock);
  }
  function drawField(t) {
    if (!fieldCtx) return;
    const ctx = fieldCtx, { w, h } = sizes.field;
    ctx.clearRect(0, 0, w, h);
    stars.forEach(star => {
      let x = (star.x + Math.sin(t * .13 + star.y * .004) * 8 + (star.x - w / 2) * Math.sin(t * .05) * .018 + w) % w;
      let y = (star.y - t * star.speed * 2 + h * 100) % h;
      const dx = x - pointer.x, dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 135 && distance > 0) { const force = (1 - distance / 135) * 30; x += dx / distance * force; y += dy / distance * force; }
      ctx.save(); ctx.translate(x, y); ctx.rotate(star.angle + t * .04);
      ctx.fillStyle = `rgba(${star.color},${star.alpha})`;
      ctx.fillRect(-star.size * .5, -star.size * .25, star.size, star.size * .6);
      ctx.restore();
    });
  }
  function drawRibbon(t) {
    if (!ribbonCtx) return;
    const ctx = ribbonCtx, { w, h } = sizes.ribbon;
    ctx.clearRect(0, 0, w, h);
    const mobile = w < 768;
    const cx = w * (mobile ? .77 : .73), cy = h * .49;
    const radius = Math.min(w * .26, h * .4);
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
    halo.addColorStop(0, '#344aa31a'); halo.addColorStop(.5, '#344aa30d'); halo.addColorStop(1, '#00000000');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h);
    const points = [], segments = mobile ? 88 : 132, bands = mobile ? 14 : 20;
    for (let i = 0; i < segments; i++) {
      const u = i / segments * Math.PI * 2;
      for (let j = 0; j < bands; j++) {
        const v = (j / (bands - 1) - .5) * 1.05;
        const wave = Math.sin(u * 2 + t * .34) * .2;
        const r = radius * (1 + v * .28);
        const x = Math.cos(u) * r;
        const y = Math.sin(u) * r * .9;
        const z = Math.sin(u * 2 + t * .26) * radius * .44 + v * radius * .7;
        const angle = -.48 + Math.sin(t * .15) * .14;
        const xr = x * Math.cos(angle) - y * Math.sin(angle);
        const yr = x * Math.sin(angle) + y * Math.cos(angle);
        const depth = 1 + z / (radius * 4);
        points.push({ x: cx + xr * depth, y: cy + (yr + wave * radius) * depth, z, size: (1 + z / (radius * 2)) * (mobile ? .9 : 1.05), alpha: .2 + (z / radius + 1) * .27, band: j / bands });
      }
    }
    points.sort((a,b) => a.z - b.z);
    points.forEach(p => {
      ctx.fillStyle = `rgba(${Math.round(123+p.band*64)},${Math.round(158+p.band*45)},255,${p.alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.4, p.size), 0, Math.PI * 2); ctx.fill();
    });
  }
  function isPaused() { return manualPause || reducedMotion.matches || modalPaused || document.hidden; }
  function animate(now) {
    frame = 0;
    if (isPaused() || (!inView.field && !inView.ribbon)) { previous = 0; return; }
    if (!previous) previous = now;
    clock += Math.min((now - previous) / 1000, .08); previous = now;
    if (now - lastPaint > 1000 / 30) {
      if (inView.field) drawField(clock);
      if (inView.ribbon) drawRibbon(clock);
      lastPaint = now;
    }
    frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (isPaused() || (!inView.field && !inView.ribbon)) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; previous = 0;
    } else if (!frame) frame = requestAnimationFrame(animate);
    document.body.classList.toggle('motion-paused', manualPause || reducedMotion.matches || modalPaused || document.hidden);
  }
  function updateMotionUI() {
    const paused = manualPause || reducedMotion.matches;
    $('.motion-button').setAttribute('aria-pressed', String(paused));
    $('.motion-button').setAttribute('aria-label', language === 'ko' ? (paused ? '애니메이션 재생' : '애니메이션 일시 정지') : (paused ? 'Resume animation' : 'Pause animation'));
    $('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    $('.motion-text').textContent = language === 'ko' ? (paused ? '모션 재생' : '모션 정지') : (paused ? 'Play motion' : 'Pause motion');
  }
  $('.motion-button').addEventListener('click', () => {
    if (reducedMotion.matches) { notify(language === 'ko' ? '시스템의 동작 줄이기 설정이 적용되어 있어요.' : 'Your system’s reduced motion preference is enabled.'); return; }
    manualPause = !manualPause; updateMotionUI(); syncAnimation();
  });
  reducedMotion.addEventListener('change', () => { updateMotionUI(); syncAnimation(); });
  document.addEventListener('visibilitychange', syncAnimation);
  $('.hero').addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const rect = field.getBoundingClientRect(); pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, { passive: true });
  $('.hero').addEventListener('pointerleave', () => { pointer = { x: -10000, y: -10000 }; });
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); }, { passive: true });

  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => { inView[entry.target === field ? 'field' : 'ribbon'] = entry.isIntersecting; });
      syncAnimation();
    }, { rootMargin: '50px' });
    visibility.observe(field); visibility.observe(ribbon);
    if (!reducedMotion.matches) {
      const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      }), { threshold: .08, rootMargin: '0px 0px -20px 0px' });
      document.body.classList.add('js-motion');
      $$('.reveal').forEach(element => revealObserver.observe(element));
    }
  }

  try { const saved = localStorage.getItem('rem-antigravity-language'); if (saved === 'en') setLanguage('en'); } catch (_) {}
  updateMotionUI();
  resize();
  syncAnimation();
})();
