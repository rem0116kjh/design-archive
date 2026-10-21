(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(pointer: coarse)');
  const site = $('#site');
  const intro = $('#intro');
  const hero = $('.hero');
  const seenKey = 'ignition:intro-seen:v1';
  let introFrame = 0, finishTimer = 0, leavingTimer = 0, introActive = false;
  let returnFocus = null, introStart = 0, boomStart = 0, currentCount = 0;
  let particles = [], burstWidth = 0, burstHeight = 0;
  let burstContext;

  function hasSeenIntro() { try { return localStorage.getItem(seenKey) === '1'; } catch { return false; } }
  function markSeen() { try { localStorage.setItem(seenKey, '1'); } catch { /* Browsing still works without storage. */ } }
  function setCanvasSize(canvas, width, height) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    const context = canvas.getContext('2d');
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return context;
  }

  function finishIntro(immediate = false) {
    if (!introActive) return;
    introActive = false;
    cancelAnimationFrame(introFrame); clearTimeout(finishTimer); clearTimeout(leavingTimer);
    markSeen(); site.inert = false; document.body.classList.remove('locked');
    intro.classList.add('leaving');
    hero.classList.add('arriving');
    const focusTarget = returnFocus || $('#main');
    focusTarget.focus({ preventScroll: true });
    const clean = () => {
      intro.hidden = true; intro.classList.remove('exploding', 'leaving');
      if (burstContext) burstContext.clearRect(0, 0, burstWidth, burstHeight);
      particles = [];
    };
    if (immediate || motion.matches) clean(); else leavingTimer = setTimeout(clean, 650);
  }

  function makeBurst() {
    burstWidth = innerWidth; burstHeight = innerHeight;
    burstContext = setCanvasSize($('#explosion'), burstWidth, burstHeight);
    if (!burstContext) { finishIntro(true); return; }
    const count = touch.matches || innerWidth < 768 ? 85 : 230;
    particles = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 130 + Math.random() * Math.max(burstWidth, burstHeight) * .8;
      return { angle, speed, size: .8 + Math.random() * 3.2, length: 2 + Math.random() * 16,
        color: i % 7 === 0 ? '#f8e6c3' : i % 3 === 0 ? '#ff9f37' : '#ff6b00',
        lat: Math.acos(2 * ((i + .5) / count) - 1), lon: i * 2.399963 };
    });
  }

  function drawBurst(elapsed) {
    if (!burstContext) return;
    const ctx = burstContext;
    ctx.clearRect(0, 0, burstWidth, burstHeight);
    const t = elapsed / 1000;
    const morph = Math.max(0, Math.min(1, (t - .48) / .85));
    const ease = morph * morph * (3 - 2 * morph);
    const bounds = $('#sculpture').getBoundingClientRect();
    const targetX = bounds.x + bounds.width * .5, targetY = bounds.y + bounds.height * .48;
    const radius = Math.min(bounds.width, bounds.height) * .28;
    const fade = Math.max(0, 1 - Math.max(0, t - 1.1) * 1.4);
    for (const p of particles) {
      const distance = p.speed * (1 - Math.exp(-t * 2.4)) / 1.9;
      const ex = burstWidth / 2 + Math.cos(p.angle) * distance;
      const ey = burstHeight * .48 + Math.sin(p.angle) * distance + t * t * 32;
      const tx = targetX + Math.sin(p.lat) * Math.cos(p.lon) * radius;
      const ty = targetY + Math.cos(p.lat) * radius;
      const x = ex * (1 - ease) + tx * ease, y = ey * (1 - ease) + ty * ease;
      ctx.globalAlpha = fade * (.6 + .4 * (1 - morph)); ctx.strokeStyle = p.color; ctx.fillStyle = p.color;
      ctx.lineWidth = p.size * (1 - .6 * ease);
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x - Math.cos(p.angle) * p.length * (1 - ease), y - Math.sin(p.angle) * p.length * (1 - ease)); ctx.stroke();
      ctx.fillRect(x, y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function introLoop(now) {
    if (!introActive) return;
    const elapsed = now - introStart;
    if (!boomStart) {
      const count = 3 - Math.floor(elapsed / 1000);
      if (elapsed >= 3000) {
        boomStart = now;
        intro.dataset.boomAt = String(now);
        performance.mark('ignition-explosion');
        $('#count').textContent = 'BOOM'; intro.classList.add('exploding');
        $('#intro-status').textContent = '인트로가 끝났습니다. 포트폴리오가 열립니다.';
        makeBurst();
        clearTimeout(finishTimer); finishTimer = setTimeout(() => finishIntro(), 1400);
      } else if (count !== currentCount) {
        currentCount = count; $('#count').textContent = String(count);
        $('.countdown').classList.remove('tick');
        void $('.countdown').offsetWidth;
        $('.countdown').classList.add('tick');
        intro.style.setProperty('--intensity', String((4 - count) / 3));
      }
    }
    if (boomStart) drawBurst(now - boomStart);
    introFrame = requestAnimationFrame(introLoop);
  }

  function startIntro(replay = false) {
    if (introActive) return;
    if (motion.matches) {
      markSeen();
      if (replay) showToast('동작 줄이기 설정에 따라 인트로를 생략했습니다.');
      return;
    }
    clearTimeout(leavingTimer); hero.classList.remove('arriving');
    returnFocus = replay ? $('#replay-intro') : null;
    introActive = true; introStart = performance.now(); boomStart = 0; currentCount = 0;
    intro.dataset.startedAt = String(introStart); delete intro.dataset.boomAt;
    intro.hidden = false; intro.classList.remove('leaving', 'exploding');
    if (burstContext) burstContext.clearRect(0, 0, burstWidth, burstHeight);
    $('#count').textContent = '3'; $('#intro-status').textContent = '포트폴리오가 3초 후 열립니다.';
    site.inert = true; document.body.classList.add('locked');
    $('#skip-intro').focus({ preventScroll: true });
    // A final recovery timer ensures content remains reachable even if rendering stalls.
    clearTimeout(finishTimer); finishTimer = setTimeout(() => finishIntro(true), 6500);
    introFrame = requestAnimationFrame(introLoop);
  }
  $('#skip-intro').addEventListener('click', () => finishIntro(true));
  $('#replay-intro').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'instant' }); startIntro(true); });
  document.addEventListener('keydown', e => {
    if (!introActive) return;
    if (e.key === 'Escape') finishIntro(true);
    if (e.key === 'Tab') { e.preventDefault(); $('#skip-intro').focus(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && introActive) finishIntro(true); });

  // Procedural low-poly sculpture. Every face is drawn locally; no WebGL or remote assets.
  const sculpture = $('#sculpture');
  let sculptureContext, artWidth = 0, artHeight = 0, artFrame = 0, artVisible = true, lastArtTime = 0;
  let pointerX = 0, pointerY = 0, isPointerInside = false;
  const seeded = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const latCount = touch.matches ? 30 : 42, lonCount = touch.matches ? 62 : 88;
  const vertices = [];
  for (let lat = 0; lat <= latCount; lat++) {
    const row = [], a = lat / latCount * Math.PI;
    for (let lon = 0; lon <= lonCount; lon++) {
      const b = lon / lonCount * Math.PI * 2;
      const wave = Math.sin(a * 8 + Math.cos(b * 5)) * Math.cos(b * 7 + a * 3);
      const random = seeded(lat * lonCount + (lon % lonCount));
      const spike = Math.pow(random, 14) * .52;
      const r = .92 + wave * .16 + random * .08 + spike;
      row.push({ x: Math.sin(a) * Math.cos(b) * r, y: Math.cos(a) * r, z: Math.sin(a) * Math.sin(b) * r, random });
    }
    vertices.push(row);
  }
  const triangles = [];
  for (let i = 0; i < latCount; i++) for (let j = 0; j < lonCount; j++) {
    triangles.push([vertices[i][j], vertices[i+1][j], vertices[i][j+1]]);
    triangles.push([vertices[i+1][j], vertices[i+1][j+1], vertices[i][j+1]]);
  }
  function resizeArt() {
    const rect = sculpture.getBoundingClientRect();
    artWidth = rect.width; artHeight = rect.height;
    sculptureContext = setCanvasSize(sculpture, artWidth, artHeight);
    renderArt(performance.now());
  }
  function renderArt(now) {
    if (!sculptureContext || !artWidth) return;
    const ctx = sculptureContext, width = artWidth, height = artHeight;
    ctx.clearRect(0, 0, width, height);
    const cx = width * .5, cy = height * .48, radius = Math.min(width, height) * .286;
    const ambient = ctx.createRadialGradient(cx, cy, radius * .18, cx, cy, radius * 1.9);
    ambient.addColorStop(0, '#ff6b0018'); ambient.addColorStop(.45, '#ff6b0010'); ambient.addColorStop(1, '#ff6b0000');
    ctx.fillStyle = ambient; ctx.fillRect(0, 0, width, height);
    // Fine radial trajectories retain the energy of the opening explosion.
    for (let i = 0; i < 190; i++) {
      const angle = seeded(i + 40) * Math.PI * 2;
      const start = radius * (1.05 + seeded(i + 53) * .45);
      const length = radius * (.03 + Math.pow(seeded(i + 84), 3) * .65);
      const x = cx + Math.cos(angle) * start, y = cy + Math.sin(angle) * start;
      ctx.strokeStyle = i % 5 === 0 ? '#ff9b5345' : '#ff6b0027'; ctx.lineWidth = i % 9 === 0 ? 1.1 : .5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length); ctx.stroke();
    }
    const rot = .65 + pointerX * .08, tilt = -.25 + pointerY * .07;
    const project = v => {
      const x = v.x * Math.cos(rot) + v.z * Math.sin(rot), z = -v.x * Math.sin(rot) + v.z * Math.cos(rot);
      const y = v.y * Math.cos(tilt) - z * Math.sin(tilt), zz = v.y * Math.sin(tilt) + z * Math.cos(tilt);
      const perspective = 3.8 / (3.8 - zz);
      return { x: cx + x * radius * perspective, y: cy + y * radius * perspective, z: zz, nx: x, ny: y, random: v.random };
    };
    const projected = triangles.map((tri, i) => { const p = tri.map(project); return {p, i, depth:(p[0].z+p[1].z+p[2].z)/3}; }).filter(f => f.depth > -.3).sort((a,b) => a.depth-b.depth);
    for (const face of projected) {
      const [a,b,c] = face.p;
      const light = Math.max(.05, Math.min(1, .43 + face.depth * .41 + (a.nx + b.nx + c.nx) / 3 * .26 - (a.ny+b.ny+c.ny)/3 * .28));
      const variation = seeded(face.i + 200);
      const lit = Math.max(3, light * (22 + variation * 32));
      ctx.fillStyle = `hsl(${13 + light * 13 + variation * 8} 100% ${lit}%)`;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.fill();
      if (variation > .66) { ctx.strokeStyle = `rgba(255,131,27,${light*.26})`; ctx.lineWidth = .5; ctx.stroke(); }
      if (variation > .95 && face.depth > .25) { ctx.fillStyle = '#ffca7d'; ctx.globalAlpha = light * .7; ctx.fillRect(a.x,a.y,1.5,1.5); ctx.globalAlpha=1; }
    }
    for (let i = 0; i < 70; i++) {
      const angle = seeded(i + 100) * Math.PI * 2, distance = radius * (1.17 + seeded(i + 29) * .65);
      const size = .5 + seeded(i + 12) * 2;
      ctx.globalAlpha = .25 + seeded(i) * .65; ctx.fillStyle = i%7===0?'#e5c796':'#ff6b00';
      ctx.fillRect(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance, size, size);
    }
    ctx.globalAlpha = 1;
    lastArtTime = now;
  }
  function animateArt(now) {
    if (artVisible && !document.hidden && !motion.matches && now-lastArtTime>45) renderArt(now);
    if (isPointerInside && !motion.matches) artFrame = requestAnimationFrame(animateArt);
    else artFrame = 0;
  }
  hero.addEventListener('pointermove', e => {
    if (touch.matches || motion.matches) return;
    const rect=hero.getBoundingClientRect();
    pointerX=(e.clientX-rect.left)/rect.width-.5; pointerY=(e.clientY-rect.top)/rect.height-.5;
    hero.style.setProperty('--parallax-x', `${pointerX * 14}px`); hero.style.setProperty('--parallax-y', `${pointerY * 12}px`);
    isPointerInside = true; if (!artFrame) artFrame=requestAnimationFrame(animateArt);
  }, {passive:true});
  hero.addEventListener('pointerleave', () => { isPointerInside=false; pointerX=0; pointerY=0; hero.style.setProperty('--parallax-x','0px'); hero.style.setProperty('--parallax-y','0px'); renderArt(performance.now()); });
  if ('ResizeObserver' in window) new ResizeObserver(resizeArt).observe(sculpture); else window.addEventListener('resize',resizeArt);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {artVisible=entries[0].isIntersecting;},{threshold:0}).observe(sculpture);
  resizeArt();

  // Native scrolling, section reveals, and the progressive experience line.
  if ('IntersectionObserver' in window && !motion.matches) {
    document.documentElement.classList.add('motion-enabled');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:.08, rootMargin:'0px 0px -20px 0px'});
    $$('.reveal').forEach(el => observer.observe(el));
  }
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    $('.scroll-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;
    const rect=$('.timeline').getBoundingClientRect();
    $('.timeline').style.setProperty('--timeline-progress', Math.min(1, Math.max(0, (innerHeight*.8-rect.top)/rect.height)));
  }
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
  window.addEventListener('resize',updateScroll); $$('.records-panel').forEach(panel=>panel.addEventListener('toggle',updateScroll)); updateScroll();
  motion.addEventListener('change',()=>{
    if(motion.matches){document.documentElement.classList.remove('motion-enabled');finishIntro(true);cancelAnimationFrame(artFrame);artFrame=0;}
    renderArt(performance.now());
  });

  // A compact menu with keyboard and focus behavior for touch layouts.
  const menu=$('.menu-toggle'), mobileNav=$('#mobile-nav');
  function closeMenu(restore=false){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');if(restore)menu.focus();}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'메뉴 열기':'메뉴 닫기');});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden)closeMenu(true);});
  window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});
  document.addEventListener('click',e=>{if(!mobileNav.hidden&&!mobileNav.contains(e.target)&&!menu.contains(e.target))closeMenu();});

  const projects={
  "ghas": {
    "title": "GHAS 알리미",
    "category": "01 / 학교생활 · 모바일 앱",
    "image": "assets/project-ghas.svg",
    "alt": "실제 GHAS 알리미 앱 화면과 이름을 배치한 프로젝트 소개",
    "summary": "경기자동차과학고 학생들을 위한 생활 지원 앱입니다. 급식과 시간표를 한곳에서 확인할 수 있습니다.",
    "idea": "급식과 시간표를 함께 제공하는 학교생활 지원 앱입니다.",
    "approach": "Android·iOS 앱과 NEIS API를 다룹니다. 아래 스토어 링크에서 공개된 앱 페이지로 이동할 수 있습니다.",
    "stack": [
      "Android",
      "iOS",
      "NEIS API"
    ],
    "links": [
      {
        "label": "Play Store",
        "url": "https://play.google.com/store/apps/details?id=kr.hs.ghas.ghason"
      },
      {
        "label": "App Store",
        "url": "https://apps.apple.com/kr/app/ghas%EC%95%8C%EB%A6%AC%EB%AF%B8/id6779186783"
      }
    ]
  },
  "suffice-patch": {
    "title": "SufficePatch",
    "category": "02 / 개발 도구 · AI 에이전트 스킬",
    "image": "assets/project-suffice-patch.svg",
    "alt": "소스와 지침을 수집하는 터미널을 표현한 SufficePatch 프로젝트 일러스트",
    "summary": "Codex와 Claude Code가 코드 수정 전에 필요한 소스·프로젝트 지침·의존성·테스트 후보·Git 변경 내역을 모으는 스킬입니다. 다언어·모노레포 탐색과 요약·JSON 출력을 지원합니다.",
    "idea": "AI 코딩 에이전트가 수정 전에 필요한 맥락을 수집하는 개발 도구입니다.",
    "approach": "소스·프로젝트 지침·의존성·테스트 후보·Git 변경 내역을 수집합니다. 다언어·모노레포 탐색과 요약·JSON 출력을 지원합니다.",
    "stack": [
      "Python",
      "Codex",
      "Claude Code"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/rem0116kjh/suffice-patch"
      },
      {
        "label": "스킬 설명",
        "url": "https://rem0116kjh.github.io/suffice-patch/"
      }
    ]
  },
  "ktspace": {
    "title": "KTspace",
    "category": "03 / 과학 교육 · 시뮬레이션",
    "image": "assets/project-ktspace.svg",
    "alt": "태양과 행성 궤도를 표현한 KTspace 프로젝트 일러스트",
    "summary": "태양의 질량·거리·밝기 등 조건을 바꾸며 행성 궤도와 지구 환경을 비교하는 교육용 태양계 시뮬레이터입니다. 10가지 실험, 탐구 노트와 CSV 내보내기를 제공합니다.",
    "idea": "태양의 조건 변화가 행성 궤도와 지구 환경에 미치는 영향을 탐구하는 교육용 시뮬레이터입니다.",
    "approach": "Python·Streamlit 기반으로 10가지 실험, 탐구 노트와 CSV 내보내기를 제공합니다.",
    "stack": [
      "Python",
      "Streamlit",
      "Physics"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/rem0116kjh/KTspace"
      }
    ]
  },
  "gcpt": {
    "title": "GCPT",
    "category": "04 / AI · 협업 프로젝트",
    "image": "assets/project-gcpt.svg",
    "alt": "GPT·Claude·Gemini의 대화를 표현한 GCPT 프로젝트 일러스트",
    "summary": "GPT, Claude, Gemini의 토론을 시각화하고 추론 흐름을 분석합니다. 디자인과 일부 기능 구현에 참여했습니다.",
    "idea": "GPT, Claude, Gemini의 토론과 추론 흐름을 시각화하는 협업 프로젝트입니다.",
    "approach": "디자인과 일부 기능 구현에 참여했습니다. 프로젝트 코드와 구성은 공개 저장소에서 확인할 수 있습니다.",
    "stack": [
      "AI Debate",
      "시각화"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/cksdud32/gcpt"
      }
    ]
  },
  "lhlinux": {
    "title": "lhLinux",
    "category": "05 / Linux · CLI · Ubuntu",
    "image": "assets/project-lhlinux.svg",
    "alt": "Ubuntu·WSL2·CLI를 표현한 lhLinux 프로젝트 일러스트",
    "summary": "Ubuntu 24.04 LTS 기반의 오픈소스 WSL2 CLI 배포판으로, 누구나 설치하고 개선할 수 있는 개발 환경 프로젝트입니다.",
    "idea": "Ubuntu 24.04 LTS 기반의 오픈소스 WSL2 CLI 배포판입니다.",
    "approach": "누구나 설치하고 개선할 수 있는 개발 환경 프로젝트입니다. 자세한 구성과 설치 방법은 공개 저장소를 확인하세요.",
    "stack": [
      "WSL2",
      "CLI",
      "Ubuntu"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/rem0116kjh/lhlinux"
      }
    ]
  }
};
  const dialog=$('#project-dialog');
  let projectTrigger=null;
  $$('.project-open').forEach(button=>button.addEventListener('click',()=>{
    const p=projects[button.dataset.project];if(!p)return;projectTrigger=button;
    $('#dialog-title').textContent=p.title;$('#dialog-category').textContent=p.category;
    $('#dialog-image').src=p.image;$('#dialog-image').alt=p.alt;
    $('#dialog-summary').textContent=p.summary;$('#dialog-idea').textContent=p.idea;$('#dialog-approach').textContent=p.approach;
    $('#dialog-stack').replaceChildren(...p.stack.map(item=>{const span=document.createElement('span');span.textContent=item;return span;}));
    $('#dialog-links').replaceChildren(...p.links.map(link=>{const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=link.label+' ↗';a.setAttribute('aria-label',p.title+' '+link.label+' (새 탭)');return a;}));
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('locked');
  }));
  function closeDialog(){dialog.close();}
  $('.dialog-close').addEventListener('click',closeDialog);$('.dialog-done').addEventListener('click',closeDialog);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('locked');projectTrigger?.focus({preventScroll:true});});

  let toastTimer;
  function showToast(message){const toast=$('.toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500);}
  $('#copy-email').addEventListener('click',async()=>{
    const email=$('.contact-links a[href^="mailto:"]').getAttribute('href').slice(7);
    try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(email);showToast('이메일 주소를 복사했습니다.');}
    catch{showToast(`이메일 주소: ${email}`);}
  });
  function updateClock(){$('#seoul-time').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}
  updateClock();setInterval(updateClock,60000);
  if(!hasSeenIntro()&&!location.hash)startIntro();
})();
