(() => {
  'use strict';
  const root = document.documentElement;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  const finePointer = matchMedia('(pointer: fine)');
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ } };
  let language = read('m-portfolio.language.v1') === 'en' ? 'en' : 'ko';
  const english = {
    skip: 'Skip to main content', navAbout: 'About', navWork: 'Work', navApproach: 'Approach', navNotes: 'Notes', navContact: 'Contact',
    menu: 'Menu', close: 'Close', navigation: 'Explore',
    aboutLine1: 'Finding possibility in the familiar.', aboutLine2: 'Connecting design and technology', aboutLine3: 'to make experiences that matter.',
    aboutBody1: 'Hello, I’m M. I’m a creative developer making websites and apps with the person behind the screen in mind. I start with everyday friction and turn small ideas into thoughtful products.',
    aboutBody2: 'I believe good design and good code begin with the same question: who is this for, and what could it change for them?', aboutLink: 'How I work',
    practiceDesign: 'Find the question. Shape the experience.', practiceBuild: 'Turn an idea into something that works.', practiceExplore: 'Experiment, learn, and look ahead.',
    workIntro: 'From a question to a screen, and into an experience. A selection of the little worlds I’ve been exploring.', filterAll: 'All (3)', filterExperiment: 'Experiments (1)',
    atlasCaption: 'A new perspective on exploration.', formCaption: 'Small steps. A better everyday.', signalCaption: 'Where code meets feeling.',
    approachLine1: 'Different perspectives, connected.', approachLine2: 'That’s where good experiences begin.',
    understand: 'Start with the person and the problem. Observe everyday friction, untangle complexity, and find the question that matters most.',
    connect: 'Bring design and development into one conversation. Make a small prototype, use it, and turn an abstract idea into a tangible experience.',
    refine: 'Treat making as an ongoing conversation. Listen, test, and refine the details, including accessibility and performance.',
    notesIntro: 'Thoughts gathered along the way.',
    noteTitle1: 'Making starts with asking better questions.',
    noteBody1: 'Building one useful feature can be harder than building many impressive ones. Before drawing the first screen, I write down who it is for and the problem it should solve.',
    noteTitle2: 'A small prototype beats a long explanation.',
    noteBody2: 'When ideas drift apart, I make something small that works. We can try it, find the friction, and change the next version. Short feedback loops bring clarity.',
    noteTitle3: 'The unseen details are part of the experience.',
    noteBody3: 'Keyboard focus, line breaks on a small screen, and a quieter experience for someone who prefers reduced motion. Thoughtful foundations make a product comfortable to use.',
    contactIntro: 'A new idea, a good question, or the next thing we could build together.', copyEmail: 'Copy email', backTop: 'Back to top',
    detailRole: 'Role', detailType: 'Type', conceptProject: 'Personal concept project', conceptExperiment: 'Personal interaction study',
    detailChallenge: 'The question', detailApproach: 'Design & implementation', detailLearned: 'What comes next',
    atlasLead: 'Make the next step feel natural, even in a world of information.',
    atlasChallenge: 'As information grows, it gets harder to know where to start. Could we shorten the path to useful information while keeping the joy of exploration?',
    atlasApproach: 'I mapped content relationships first, then brought search and categories into one view. On small screens, essential information comes first, with details available when needed.',
    atlasLearned: 'Showing more information and making information easier to understand are different things. This concept focuses on a clear next step instead of a crowded screen.',
    formLead: 'An app for one small action today, rather than a perfect plan.',
    formChallenge: 'Falling behind on a tracker can make restarting feel heavy. Could an interface focus on one achievable action rather than pressure to maintain a perfect record?',
    formApproach: 'I simplified the flow around today’s routine and a single check. Calm colors, generous touch targets, and a welcoming restart replace warnings about missed days.',
    formLearned: 'A small line of interface copy can shape how someone feels. I explored language that guides the next action rather than emphasizing a missed goal.',
    signalLead: 'Motion that carries meaning, beyond decoration.',
    signalChallenge: 'What happens when a quiet screen responds to small gestures? I explored the balance between visual play and comfortable use.',
    signalApproach: 'I combined vector forms and typography with short pointer and scroll responses. Touch devices and reduced-motion preferences receive a composed, static experience.',
    signalLearned: 'Why something moves matters more than how much it moves. A small response feels natural when it explains position, relationship, or cause.',
  };
  const menu = document.querySelector('#menu-dialog');
  const menuToggle = document.querySelector('.menu-toggle');
  const projectDialog = document.querySelector('#project-dialog');
  const detailBody = projectDialog.querySelector('.project-dialog-body');
  const copyStatus = document.querySelector('.copy-status');
  let lastProjectTrigger;

  function applyLanguage() {
    root.lang = language;
    document.querySelectorAll('[data-copy]').forEach(element => {
      if (!element.hasAttribute('data-ko')) element.dataset.ko = element.textContent;
      element.textContent = language === 'en' ? (english[element.dataset.copy] || element.dataset.ko) : element.dataset.ko;
    });
    const en = language === 'en';
    document.title = en ? 'M — Creative developer portfolio' : 'M — 개발자 포트폴리오';
    document.querySelector('meta[name="description"]').content = en
      ? 'A creative developer connecting design and technology. Selected projects, thoughtful process, and ideas along the way.'
      : '아이디어를 쓸 수 있는 경험으로 만드는 개발자. M의 프로젝트, 작업 방식과 기록을 만나보세요.';
    const toggle = document.querySelector('.language-toggle');
    toggle.innerHTML = (en ? 'KO' : 'EN') + ' <span aria-hidden="true">↗</span>';
    toggle.setAttribute('aria-label', en ? '한국어로 보기' : 'View in English');
    document.querySelector('[data-nav-label]').setAttribute('aria-label', en ? 'Primary navigation' : '주요 메뉴');
    document.querySelector('[data-scroll-label]').setAttribute('aria-label', en ? 'Scroll to About' : '소개로 스크롤');
    document.querySelector('.work-filters').setAttribute('aria-label', en ? 'Project categories' : '프로젝트 분류');
    menu.querySelector('nav').setAttribute('aria-label', en ? 'Mobile navigation' : '모바일 메뉴');
    document.querySelector('.practice-grid').setAttribute('aria-label', en ? 'Three perspectives on making' : '작업의 세 가지 관점');
    document.querySelectorAll('.wordmark,.footer-brand').forEach(link => link.setAttribute('aria-label', en ? 'M home' : 'M 홈'));
    const imageDescriptions = {
      'atlas.svg': 'A blue wireframe globe and ATLAS typography for a web experience',
      'form.svg': 'Two routine app screens against a warm coral background',
      'signal.svg': 'Reflective metal rings and SIGNAL typography in a lime green space',
    };
    document.querySelectorAll('img[alt]').forEach(image => {
      if (!image.alt) return;
      if (!image.hasAttribute('data-ko-alt')) image.dataset.koAlt = image.alt;
      image.alt = en ? (imageDescriptions[image.getAttribute('src').split('/').pop()] || image.dataset.koAlt) : image.dataset.koAlt;
    });
    document.querySelectorAll('.project-trigger').forEach(button => {
      const title = button.querySelector('strong').textContent;
      button.setAttribute('aria-label', en ? `View ${title} project details` : `${title} 프로젝트 자세히 보기`);
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.setAttribute('aria-label', en ? 'Dark theme' : '어두운 테마'));
    copyStatus.textContent = '';
  }
  applyLanguage();
  document.querySelector('.language-toggle').addEventListener('click', () => {
    language = language === 'ko' ? 'en' : 'ko';
    write('m-portfolio.language.v1', language);
    applyLanguage();
    updateFilterStatus();
  });

  function applyTheme() {
    const dark = root.dataset.theme !== 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.setAttribute('aria-checked', String(dark)));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#111111' : '#f4f4ef';
  }
  applyTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    write('m-portfolio.theme.v1', root.dataset.theme);
    applyTheme();
  }));

  function updateModalLock() { document.body.classList.toggle('modal-open', menu.open || projectDialog.open); }
  menuToggle.addEventListener('click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    updateModalLock();
    menu.querySelector('nav a').focus();
  });
  menu.querySelector('[data-close-menu]').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    updateModalLock();
    if (mobile.matches) menuToggle.focus({ preventScroll: true });
  });
  mobile.addEventListener('change', () => { if (!mobile.matches && menu.open) menu.close(); });

  document.querySelectorAll('.project-trigger').forEach(button => button.addEventListener('click', () => {
    const template = document.querySelector(`#project-${button.dataset.project}`);
    if (!template) return;
    lastProjectTrigger = button;
    detailBody.replaceChildren(template.content.cloneNode(true));
    applyLanguage();
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
    updateModalLock();
  }));
  projectDialog.querySelector('[data-close-project]').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => {
    if (event.target !== projectDialog) return;
    const bounds = projectDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) projectDialog.close();
  });
  projectDialog.addEventListener('close', () => {
    updateModalLock();
    lastProjectTrigger?.focus({ preventScroll: true });
    detailBody.replaceChildren();
  });

  function updateFilterStatus() {
    const count = [...document.querySelectorAll('.work-card')].filter(card => !card.hidden).length;
    document.querySelector('.filter-status').textContent = language === 'en' ? `${count} projects shown.` : `${count}개 프로젝트를 표시합니다.`;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('.work-grid').classList.toggle('filtered', category !== 'all');
    updateFilterStatus();
  }));

  document.querySelector('.copy-email').addEventListener('click', async () => {
    const email = document.querySelector('.email-link').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = language === 'en' ? 'Email copied.' : '이메일을 복사했어요.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-link'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = language === 'en' ? 'Select the address and copy it.' : '주소를 선택해 직접 복사해 주세요.';
    }
  });
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.removeAttribute('data-pending');
      reveals.unobserve(entry.target);
    }), { threshold: .06 });
    if (!media.matches) document.querySelectorAll('[data-reveal]').forEach(element => {
      if (element.getBoundingClientRect().top > innerHeight * .95) {
        element.setAttribute('data-pending', '');
        reveals.observe(element);
      }
    });
    const sections = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.desktop-nav a').forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-12% 0px -55% 0px' });
    document.querySelectorAll('main>section[id]').forEach(section => sections.observe(section));
  }
  media.addEventListener('change', () => {
    if (media.matches) document.querySelectorAll('[data-pending]').forEach(element => element.removeAttribute('data-pending'));
  });

  const header = document.querySelector('.site-header');
  const guide = document.querySelector('.page-guide span');
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    header.classList.toggle('scrolled', scrollY > 30);
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    guide.style.top = Math.min(1, scrollY / range) * (innerHeight - 5) + 'px';
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
  addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const hero = document.querySelector('.hero');
  const sculpture = document.querySelector('.hero-object');
  hero.addEventListener('pointermove', event => {
    if (media.matches || !finePointer.matches || mobile.matches) return;
    sculpture.style.setProperty('--tilt-x', `${(event.clientY / innerHeight - .5) * -7}deg`);
    sculpture.style.setProperty('--tilt-y', `${(event.clientX / innerWidth - .5) * 9}deg`);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { sculpture.style.setProperty('--tilt-x', '0deg'); sculpture.style.setProperty('--tilt-y', '0deg'); });
})();
