(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.post')];
  const search = document.querySelector('#template-search');
  const clear = document.querySelector('.clear-search');
  const dialog = document.querySelector('#help-dialog');
  const readyCards = cards.filter(card => card.dataset.ready === 'true');
  const validIds = new Set(readyCards.map(card => card.dataset.id));
  const storageKey = 'design-archive.saved.v1';
  let view = 'all', saved = new Set(), canPersist = true, toastTimer;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) saved = new Set(stored.map(id => id === 'm' && validIds.has('l') ? 'l' : id).filter(id => typeof id === 'string' && validIds.has(id)));
  } catch { canPersist = false; }
  function notify(message) {
    const toast = document.querySelector('.toast');
    clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2300);
  }
  function update() {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let count = 0;
    cards.forEach(card => {
      const isSaved = saved.has(card.dataset.id);
      const match = (view !== 'saved' || isSaved) && (!query || card.dataset.search.includes(query));
      card.hidden = !match; if (match) count++;
      const button = card.querySelector('.bookmark-button');
      if (button) { button.classList.toggle('is-saved', isSaved); button.setAttribute('aria-pressed', String(isSaved)); button.setAttribute('aria-label', `${card.dataset.name} ${isSaved ? '저장 취소' : '저장'}`); }
    });
    document.querySelectorAll('[data-view]').forEach(button => { const active = button.dataset.view === view; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('.count-saved').forEach(e => { e.textContent = saved.size; });
    document.querySelectorAll('.saved-badge').forEach(e => { e.textContent = saved.size; e.hidden = saved.size === 0; });
    document.querySelector('.count-ready').textContent = readyCards.length;
    const pending = cards.length - readyCards.length;
    document.querySelector('.count-upcoming').textContent = pending;
    document.querySelector('.upcoming-stat').hidden = pending === 0;
    clear.hidden = !query;
    document.querySelector('#result-count').textContent = query ? `“${search.value.trim()}” 검색 결과 ${count}개` : view === 'saved' ? `저장한 디자인 ${count}개` : `${readyCards.length}개의 디자인${pending ? ` · ${pending}개 준비 중` : ''}`;
    const empty = document.querySelector('.empty-state'); empty.hidden = count !== 0;
    empty.querySelector('h2').textContent = query ? '찾는 디자인이 없어요.' : '아직 저장한 디자인이 없어요.';
    empty.querySelector('p').textContent = query ? '다른 이름이나 스타일로 검색해 보세요.' : '마음에 드는 템플릿의 책갈피를 눌러 모아보세요.';
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; update(); if (!button.classList.contains('view-tab')) document.querySelector('#templates').scrollIntoView({ block: 'start' }); }));
  document.querySelectorAll('.bookmark-button').forEach(button => button.addEventListener('click', () => {
    const id = button.closest('.post').dataset.id, removing = saved.has(id);
    if (removing) saved.delete(id); else saved.add(id);
    try { localStorage.setItem(storageKey, JSON.stringify([...saved])); canPersist = true; } catch { canPersist = false; }
    update(); notify(removing ? '저장한 디자인에서 뺐어요.' : canPersist ? '마음에 드는 디자인을 저장했어요.' : '현재 탭에 디자인을 저장했어요.');
  }));
  search.addEventListener('input', update);
  search.addEventListener('keydown', e => { if (e.key === 'Escape') { search.value = ''; update(); } });
  clear.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
  document.querySelectorAll('[data-search-button]').forEach(button => button.addEventListener('click', () => { document.querySelector('#templates').scrollIntoView({ block: 'start' }); search.focus({ preventScroll: true }); }));
  document.querySelector('[data-reset]').addEventListener('click', () => { view = 'all'; search.value = ''; update(); });
  document.querySelectorAll('[data-help-button]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelectorAll('[data-close-help]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); });
  document.querySelectorAll('[data-pending]').forEach(button => button.addEventListener('click', () => notify('새 디자인을 준비 중이에요. 완성되면 연결됩니다.')));
  document.querySelectorAll('img[data-fallback]').forEach(img => img.addEventListener('error', () => { if (img.dataset.fallback) { const fallback = img.dataset.fallback; delete img.dataset.fallback; img.src = fallback; } }, { once: true }));
  window.addEventListener('storage', e => { if (e.key !== storageKey) return; try { const data = JSON.parse(e.newValue || '[]'); if (Array.isArray(data)) saved = new Set(data.filter(id => validIds.has(id))); } catch { return; } update(); });
  update();
})();
