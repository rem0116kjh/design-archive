/* Standalone interactions for the local junho.io reference edition. */
(() => {
  'use strict';
  const phone = document.querySelector('[data-phone]');
  const displayName = document.body.dataset.name || 'Jin-hyung Kim';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => reducedMotion.matches ? 'auto' : 'smooth';

  document.querySelectorAll('[data-date]').forEach(element => {
    const date = new Date(element.dataset.date);
    if (!Number.isNaN(date.getTime())) element.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });
  document.querySelectorAll('[data-relative-date]').forEach(element => {
    const date = new Date(element.dataset.relativeDate);
    if (Number.isNaN(date.getTime())) return;
    const years = Math.max(0, (Date.now() - date.getTime()) / 31557600000);
    if (years < 1) {
      const months = Math.max(1, Math.round(years * 12));
      element.textContent = `${months} month${months === 1 ? '' : 's'} ago`;
      return;
    }
    const whole = Math.floor(years), fraction = years - whole;
    const count = fraction >= .75 ? whole + 1 : whole;
    const prefix = fraction < .25 ? 'About' : fraction < .75 ? 'Over' : 'Almost';
    element.textContent = `${prefix} ${count} year${count === 1 ? '' : 's'} ago`;
  });

  document.querySelectorAll('time[datetime]').forEach(time => {
    const date = new Date(time.dateTime);
    if (Number.isNaN(date.getTime())) return;
    const hour = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    time.textContent = `${hour} - ${day}`;
  });

  if (phone) {
    const container = document.querySelector('[data-phone-container]');
    const holder = phone.parentElement;
    const call = phone.querySelector('[data-call]');
    const callButton = call.querySelector('button');
    const clock = phone.querySelector('[class*="_clock_"]');

    function resizePhone() {
      const scale = Math.min(0.85, window.innerWidth > 500 ? 0.85 : window.innerWidth * 0.9 / 428);
      const height = 868 * scale;
      phone.style.transform = `scale(${scale})`;
      holder.style.width = `${428 * scale + 6}px`;
      holder.style.height = `${height}px`;
      container.style.width = window.innerWidth > 1000 ? `${428 * 0.85}px` : '100%';
      document.documentElement.style.setProperty('--device-height', `${height}px`);
      document.documentElement.style.setProperty('--bottom', `${height * -0.45}px`);
    }

    function updateClock() {
      const now = new Date();
      clock.textContent = `${now.getHours() || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function toggleCall(force) {
      const open = typeof force === 'boolean' ? force : !call.classList.contains('is-open');
      call.classList.toggle('is-open', open);
      callButton.setAttribute('aria-expanded', String(open));
      callButton.setAttribute('aria-label', `${displayName} 통화 패널 ${open ? '닫기' : '열기'}`);
    }

    callButton.addEventListener('click', () => toggleCall());
    phone.querySelectorAll('[data-dock]').forEach(app => {
      app.addEventListener('click', () => {
        const url = app.dataset.url;
        if (!url) { toggleCall(); return; }
        if (url.startsWith('https://')) window.open(url, '_blank', 'noopener,noreferrer');
        else window.location.href = url;
      });
    });
    phone.querySelectorAll('[data-project]').forEach(app => {
      app.addEventListener('click', () => {
        const target = document.getElementById(app.dataset.project);
        if (!target) return;
        window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - 64, behavior: behavior() });
      });
    });

    phone.querySelectorAll('[role="button"]').forEach(app => {
      app.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          app.click();
        }
      });
    });

    // The original phone rests at the bottom on smaller screens and folds on click.
    window.addEventListener('click', event => {
      const inDevice = event.target.closest('.device');
      if (!container.classList.contains('collapsed') && event.target.closest('[data-call] button')) return;
      container.classList.toggle('collapsed', inDevice ? !container.classList.contains('collapsed') : true);
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        toggleCall(false);
        container.classList.add('collapsed');
      }
    });
    window.addEventListener('resize', resizePhone, { passive: true });
    resizePhone();
    updateClock();
    setInterval(updateClock, 15000);
  }

  const repositorySearch = document.getElementById('repo-search');
  if (repositorySearch) {
    const repositories = [...document.querySelectorAll('[data-repository]')];
    repositorySearch.addEventListener('input', () => {
      const query = repositorySearch.value.trim().toLocaleLowerCase();
      let visible = 0;
      repositories.forEach(repository => {
        const matches = repository.dataset.repository.includes(query);
        repository.hidden = !matches;
        if (matches) visible++;
      });
      document.querySelector('[data-repo-count]').textContent = query ? `${visible}개 저장소 표시` : `공개 저장소 ${visible}개`;
      document.querySelector('.repo-empty').hidden = visible > 0;
    });
  }

  // Article headings and their table of contents work without the original React runtime.
  if (document.body.hasAttribute('data-article')) {
    const used = new Set([...document.querySelectorAll('[id]')].map(el => el.id));
    document.querySelectorAll('main h2:not([id]), main h3:not([id])').forEach(heading => {
      if (heading.querySelector('[id]')) return;
      const base = heading.textContent.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
      if (!base) return;
      let id = base, suffix = 1;
      while (used.has(id)) id = `${base}-${suffix++}`;
      heading.id = id;
      used.add(id);
    });
    const links = [...document.querySelectorAll('#toc a[href*="#"]')];
    links.forEach(link => {
      link.addEventListener('click', event => {
        const id = decodeURIComponent(link.hash.slice(1));
        const heading = document.getElementById(id);
        if (!heading) return;
        event.preventDefault();
        heading.scrollIntoView({ behavior: behavior(), block: 'start' });
        try { history.replaceState(null, '', `#${encodeURIComponent(id)}`); } catch (_) { /* file: fallback */ }
      });
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries.find(item => item.isIntersecting);
        if (!entry) return;
        const id = entry.target.id || entry.target.querySelector('[id]')?.id;
        links.forEach(link => {
          const current = decodeURIComponent(link.hash.slice(1)) === id;
          link.toggleAttribute('data-current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
      document.querySelectorAll('main h2, main h3').forEach(heading => observer.observe(heading));
    }
  }
})();
