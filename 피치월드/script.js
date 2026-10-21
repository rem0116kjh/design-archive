(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const nav = $('#site-nav');
  const toggle = $('.menu-toggle');
  let toastTimer;

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    nav.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (open) nav.querySelector('a').focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('menu-open')) return;
    if (event.key === 'Escape') { setMenu(false); toggle.focus(); }
    if (event.key === 'Tab') {
      const items = [toggle, ...nav.querySelectorAll('a')];
      const current = items.indexOf(document.activeElement);
      if (event.shiftKey && current === 0) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && current === items.length - 1) { event.preventDefault(); toggle.focus(); }
    }
  });

  const clock = $('#seoul-clock');
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  function updateClock() { const now = new Date(); clock.textContent = formatter.format(now); clock.dateTime = now.toISOString(); }
  updateClock();
  setInterval(() => { if (!document.hidden) updateClock(); }, 1000);
  $('#year').textContent = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(new Date());

  const filters = document.querySelectorAll('.filter');
  const works = document.querySelectorAll('.work');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    works.forEach(work => { work.hidden = button.dataset.filter !== 'all' && work.dataset.category !== button.dataset.filter; if (!work.hidden) work.classList.add('is-visible'); });
  }));

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  function notify(message) { clearTimeout(toastTimer); const toast = $('.toast'); toast.textContent = message; toast.classList.add('visible'); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500); }
  $('.copy-email').addEventListener('click', async () => {
    const email = $('.email').textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
      else {
        const field = document.createElement('textarea'); field.value = email; field.style.cssText = 'position:fixed;opacity:0;pointer-events:none'; document.body.append(field); field.select(); const copied = document.execCommand('copy'); field.remove(); if (!copied) throw new Error('Copy unavailable');
      }
      notify('이메일 주소를 복사했어요!');
    } catch { notify('이메일 주소를 선택해 복사해 주세요.'); const range = document.createRange(); range.selectNodeContents($('.email')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
  });
})();
