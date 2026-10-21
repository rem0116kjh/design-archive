'use strict';

// TEMPLATE: 처음에는 이 네 가지 값과 아래 두 회전 속도만 바꾸세요.
// 예시 주소는 실제 개인 연락처가 아닙니다.
const TEMPLATE = Object.freeze({
  brand: 'ORBIT',
  email: 'hello@example.com',
  github: 'https://github.com/',
  orbitSpeed: 0.19, // radians / second
  globeSpeed: 0.09  // radians / second
});

(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const root = document.documentElement;
  $$('[data-brand]').forEach(element => { element.textContent = TEMPLATE.brand; });
  $$('[data-brand-home]').forEach(element => { element.setAttribute('aria-label', `${TEMPLATE.brand} 홈`); });
  $('[data-email]').href = `mailto:${TEMPLATE.email}`;
  $('[data-email-text]').textContent = TEMPLATE.email;
  $('[data-github]').href = TEMPLATE.github;
  document.title = `${TEMPLATE.brand} — Ideas in Orbit`;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = matchMedia('(max-width: 767px), (pointer: coarse)');
  const mobileMenu = matchMedia('(max-width: 767px)');
  const hero = $('.hero');
  const motionButton = $('.motion-toggle');
  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');
  const toast = $('.toast');
  let toastTimer;
  let savedMotion = null;
  // Private browsing and file:// can disallow storage. The page still works.
  try { savedMotion = localStorage.getItem('orbit-template-motion'); } catch { /* Optional preference. */ }
  let motionEnabled = !reducedMotion.matches && savedMotion !== 'off';
  let motionInitialized = false;

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  // Mobile navigation: keyboard loop, Escape, outside click, and resize cleanup.
  function setMenu(open, restoreFocus = false) {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.classList.toggle('menu-open', open);
    $('main').inert = open;
    $('.site-footer').inert = open;
    $('.asset-credit').inert = open;
    syncAnimation();
    if (open) nav.querySelector('a').focus();
    else if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !mobileMenu.matches) return;
    setMenu(false);
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setMenu(false, true); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...nav.querySelectorAll('a'), ...(!motionButton.disabled ? [motionButton] : []), menuButton];
    const index = focusable.indexOf(document.activeElement);
    if ((event.shiftKey && index <= 0) || (!event.shiftKey && (index === -1 || index === focusable.length - 1))) {
      event.preventDefault();
      focusable[event.shiftKey ? focusable.length - 1 : 0].focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false, true);
  });
  mobileMenu.addEventListener('change', () => setMenu(false));

  // Observe once for entrance effects; native links handle all page navigation.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });
    reveals.forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const id = visible[visible.length - 1].target.id;
      $$('.main-nav a, .section-dots a').forEach((link) => {
        const current = link.hash === `#${id}`;
        if (current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        link.classList.toggle('is-active', current);
      });
    }, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });
    $$('main > section').forEach((section) => sectionObserver.observe(section));
    new IntersectionObserver(([entry]) => {
      $('.orbit-map').classList.toggle('is-in-view', entry.isIntersecting);
    }).observe($('.orbit-map'));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      $('.site-header').classList.toggle('is-scrolled', scrollY > 35);
      story.update(scrollY);
      scrollProgress = story.progress;
      scrollQueued = false;
    });
  }, { passive: true });
  $('.site-header').classList.toggle('is-scrolled', scrollY > 35);

  // Filtering uses existing semantic cards, so the full portfolio is available without JS.
  const cards = $$('.project-card');
  $$('.project-filters button').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      $$('.project-filters button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) {
          count += 1;
          card.classList.add('is-visible');
        }
      });
      $('.project-counter').textContent = `${count} ${count === 1 ? 'PROJECT' : 'PROJECTS'} IN ORBIT`;
    });
  });

  $('.copy-email').addEventListener('click', async () => {
    const email = TEMPLATE.email;
    try {
      await navigator.clipboard.writeText(email);
      notify('이메일 주소를 복사했습니다.');
    } catch {
      // Selection is a graceful fallback for browser contexts without clipboard access.
      const range = document.createRange();
      range.selectNodeContents($('[data-email-text]'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      notify('이메일을 선택했습니다. 복사 단축키를 눌러 주세요.');
    }
  });
  $('#current-year').textContent = new Date().getFullYear();

  // Example project details: real UI interaction with explicitly sample content.
  const dialog = $('.project-dialog');
  let dialogOpener = null;
  $$('[data-project]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const card = $(`#project-${link.dataset.project}`);
    if (!card) return;
    dialogOpener = link;
    $('#dialog-title').textContent = card.querySelector('h3').textContent;
    $('.dialog-description').textContent = card.querySelector('.project-info > p').textContent;
    $('.dialog-image').src = card.querySelector('.project-visual img')?.getAttribute('src') || 'assets/project-orbit.svg';
    $('.dialog-image').alt = `${card.querySelector('h3').textContent} 예시 디자인`;
    $('.dialog-tags').replaceChildren(...[...card.querySelectorAll('.tags > li')].map(tag => {
      const item = document.createElement('li');
      item.textContent = tag.textContent;
      return item;
    }));
    dialog.showModal();
    document.body.classList.add('dialog-open');
    syncAnimation();
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogOpener?.focus({ preventScroll: true });
    syncAnimation();
  });
  // An orbital card always reveals its target, even after using the gallery filter.
  $$('.orbit-card').forEach(link => link.addEventListener('click', () => {
    $('.project-filters [data-filter="all"]').click();
    const target = $(link.hash);
    target?.classList.add('is-visible');
  }));

  // One shared frame loop for the starfield, actual sphere rotation and orbital cards.
  // Pause fully when the hero is offscreen, the tab is hidden, or motion is disabled.
  const canvas = $('#starfield');
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;
  let lastTime = 0;
  let heroVisible = true;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let resizeTimer;
  let scrollProgress = 0;
  let starTime = 0;
  const scene = new window.OrbitScene($('.universe-stage'), {
    mobile: compactScreen.matches,
    motion: motionEnabled,
    orbitSpeed: TEMPLATE.orbitSpeed,
    globeSpeed: TEMPLATE.globeSpeed
  });
  const story = new window.OrbitScrollStory($('#home'), hero, scene);

  function resizeCanvas(preserveStory = false) {
    width = hero.clientWidth;
    height = hero.clientHeight;
    story.refresh(preserveStory);
    scrollProgress = story.progress;
    scene.resize();
    if (!context) return;
    const density = Math.min(window.devicePixelRatio || 1, compactScreen.matches ? 1.25 : 1.75);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
    const count = compactScreen.matches ? 28 : Math.min(105, Math.round(width / 13));
    // Seeded layout avoids stars jumping arbitrarily when viewport dimensions change.
    let seed = 81;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    stars = Array.from({ length: count }, () => ({ x: random() * width, y: random() * height, radius: random() * .85 + .25, alpha: random() * .45 + .18, speed: random() * .65 + .15, phase: random() * Math.PI * 2 }));
    drawStars(starTime);
  }

  function drawStars(time) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      const drift = motionEnabled ? time * .0025 * star.speed : 0;
      const twinkle = motionEnabled ? Math.sin(time * .0004 + star.phase) * .12 : 0;
      context.globalAlpha = Math.max(.05, star.alpha + twinkle);
      context.fillStyle = '#dae8ff';
      context.beginPath();
      context.arc((star.x + drift) % width, (star.y - drift * .25 + height) % height, star.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }

  function tick(time) {
    frame = 0;
    if (!motionEnabled || !heroVisible || document.hidden || document.body.classList.contains('menu-open') || dialog.open) return;
    const interval = compactScreen.matches ? 1000 / 24 : 1000 / 30;
    if (time - lastTime >= interval) {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .075) : 0;
      starTime += delta * 1000;
      drawStars(starTime);
      if (!compactScreen.matches) {
        currentX += (pointerX - currentX) * .08;
        currentY += (pointerY - currentY) * .08;
        hero.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`);
        hero.style.setProperty('--pointer-y', `${currentY.toFixed(2)}px`);
      }
      story.update(scrollY);
      scrollProgress = story.progress;
      scene.setOptions({ pointerX: currentX, pointerY: currentY, scroll: scrollProgress });
      scene.render(delta);
      lastTime = time;
    }
    frame = requestAnimationFrame(tick);
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (motionEnabled && heroVisible && !document.hidden && !document.body.classList.contains('menu-open') && !dialog.open) frame = requestAnimationFrame(tick);
    else drawStars(starTime);
  }

  function applyMotion() {
    const previous = {
      enabled: story.enabled, start: story.start, total: story.total, position: scrollY,
      pastPinnedViewport: scrollY >= story.start + story.range
    };
    root.classList.toggle('motion-enabled', motionEnabled);
    root.classList.toggle('motion-paused', !motionEnabled);
    motionButton.setAttribute('aria-pressed', String(!motionEnabled));
    motionButton.disabled = reducedMotion.matches;
    const label = reducedMotion.matches ? '시스템의 모션 줄이기 설정 사용 중' : (motionEnabled ? '애니메이션 끄기' : '애니메이션 켜기');
    motionButton.setAttribute('aria-label', label);
    motionButton.title = label;
    if (!motionEnabled || compactScreen.matches) {
      pointerX = pointerY = currentX = currentY = 0;
      hero.style.setProperty('--pointer-x', '0px');
      hero.style.setProperty('--pointer-y', '0px');
    }
    scene.setOptions({ motion: motionEnabled, mobile: compactScreen.matches, resolutionScale: motionEnabled ? 1.6 : 1 });
    story.setEnabled(motionEnabled);
    if (motionInitialized && previous.enabled !== motionEnabled && previous.position > previous.start) {
      // Collapsing the pinned sequence preserves the reader's position after it.
      // Switching while inside the sequence returns to its accessible static introduction.
      const pastStory = previous.position - previous.start - previous.total;
      const target = previous.pastPinnedViewport ? story.start + story.total + pastStory : story.start;
      window.scrollTo({ top: target, behavior: 'instant' });
      story.update(scrollY);
    }
    scrollProgress = story.progress;
    scene.resize();
    scene.render(0);
    syncAnimation();
    motionInitialized = true;
  }

  motionButton.addEventListener('click', () => {
    if (reducedMotion.matches) return;
    motionEnabled = !motionEnabled;
    savedMotion = motionEnabled ? 'on' : 'off';
    try { localStorage.setItem('orbit-template-motion', savedMotion); } catch { /* Optional preference. */ }
    applyMotion();
    notify(motionEnabled ? '애니메이션을 켰습니다.' : '애니메이션을 멈췄습니다.');
  });
  reducedMotion.addEventListener('change', () => {
    motionEnabled = !reducedMotion.matches && savedMotion !== 'off';
    applyMotion();
  });
  compactScreen.addEventListener('change', () => { applyMotion(); resizeCanvas(); });
  hero.addEventListener('pointermove', (event) => {
    if (!motionEnabled || compactScreen.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / width - .5) * 15;
    pointerY = ((event.clientY - bounds.top) / height - .5) * 11;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; }, { passive: true });
  window.addEventListener('resize', () => {
    // Preserve the chapter immediately. A delayed resize must not overwrite
    // a new scroll gesture made while canvas allocation is debounced.
    story.refresh(true);
    scrollProgress = story.progress;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => resizeCanvas(false), 120);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('page-hidden', document.hidden);
    syncAnimation();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0, rootMargin: '-100px 0px 0px 0px' }).observe(hero);
  }
  resizeCanvas();
  applyMotion();
  // A deep link should still land on its project after the sticky section expands.
  if (location.hash && location.hash !== '#home') {
    requestAnimationFrame(() => $(location.hash)?.scrollIntoView({ behavior: 'instant' }));
  }
})();
