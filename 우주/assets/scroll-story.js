'use strict';

/* Native sticky positioning + a reversible, scroll-driven camera.
   No wheel interception, no scroll locks, and no independent animation loop. */
window.OrbitScrollStory = class OrbitScrollStory {
  constructor(section, hero, scene) {
    this.section = section;
    this.hero = hero;
    this.scene = scene;
    this.intro = hero.querySelector('.hero-content');
    this.panels = [...hero.querySelectorAll('[data-story-panel]')];
    this.buttons = [...hero.querySelectorAll('[data-story-jump]')];
    this.percent = hero.querySelector('.story-percent');
    this.announcement = hero.querySelector('.story-announcement');
    this.progressBar = hero.querySelector('.story-progress > span');
    this.controls = hero.querySelector('.orbit-controls');
    this.scrollCue = hero.querySelector('.hero-bottom');
    this.coordinates = hero.querySelector('.hero-coordinates');
    this.jumpPoints = [0, .32, .66, .98];
    this.names = ['궤도 탐색', '지구 확대', '프로젝트 펼침', '다음 이야기'];
    this.enabled = false;
    this.progress = 0;
    this.chapter = -1;
    this.lastProgress = -1;
    this.state = null;
    this.refresh();
    this.buttons.forEach((button, index) => button.addEventListener('click', () => this.goTo(index)));
    hero.querySelector('[data-story-next]').addEventListener('click', event => {
      if (!this.enabled) return;
      event.preventDefault();
      this.goTo(Math.min(3, this.chapter + 1));
    });
  }

  static clamp(value) { return Math.max(0, Math.min(1, value)); }
  static mix(a, b, t) { return a + (b - a) * t; }
  static smooth(a, b, value) {
    const t = OrbitScrollStory.clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  }

  refresh(preserve = false) {
    const previous = this.progress;
    const samePosition = Math.abs(scrollY - this.lastPosition) < 2;
    const previousWidth = this.width;
    const previousHeight = this.height;
    const previousRange = this.range;
    const inside = this.enabled && this.range > 0 && scrollY >= this.start && scrollY <= this.start + this.range;
    this.start = this.section.getBoundingClientRect().top + scrollY;
    this.width = this.hero.clientWidth;
    this.height = this.hero.clientHeight;
    this.total = this.section.offsetHeight;
    this.range = Math.max(1, this.total - this.height);
    this.mobile = matchMedia('(max-width: 767px)').matches;
    const resized = previousWidth !== this.width || previousHeight !== this.height || previousRange !== this.range;
    // A scroll made after the viewport changed takes priority over resize preservation.
    if (preserve && inside && resized && samePosition) {
      window.scrollTo({ top: this.start + previous * this.range, behavior: 'instant' });
    }
    this.lastProgress = -1;
    this.update(scrollY);
  }

  setEnabled(enabled) {
    const unchanged = this.enabled === enabled;
    this.enabled = enabled;
    this.refresh(unchanged);
  }

  goTo(index) {
    if (!this.enabled) return;
    window.scrollTo({ top: this.start + this.range * this.jumpPoints[index], behavior: 'smooth' });
  }

  setLayer(element, opacity, offset = 0) {
    const shown = opacity > .02;
    const accessible = opacity > .48;
    element.style.opacity = opacity.toFixed(4);
    element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    element.style.visibility = shown ? 'visible' : 'hidden';
    element.inert = !accessible;
    element.setAttribute('aria-hidden', String(!accessible));
  }

  update(position) {
    // Resize events can arrive after a fresh scroll or animation frame.
    if (this.width !== this.hero.clientWidth || this.height !== this.hero.clientHeight) {
      this.refresh(true);
      return;
    }
    const { clamp, smooth, mix } = OrbitScrollStory;
    const p = this.enabled ? clamp((position - this.start) / this.range) : 0;
    this.progress = p;
    this.lastPosition = position;
    if (Math.abs(p - this.lastProgress) < .00005) return;
    this.lastProgress = p;
    const close = smooth(.12, .36, p);
    const release = smooth(.43, .67, p);
    const depart = smooth(.79, .98, p);
    const mobile = this.mobile;
    let centerX = mix(mobile ? .5 : .65, .5, close);
    let centerY = mix(mobile ? .32 : .49, mobile ? .69 : .74, close);
    centerX = mix(centerX, mobile ? .13 : .2, release);
    centerY = mix(centerY, mobile ? .77 : .87, release);
    centerX = mix(centerX, mobile ? -.08 : .08, depart);
    centerY = mix(centerY, 1.04, depart);
    let globeScale = mix(1, mobile ? 2.02 : 2.1, close);
    globeScale = mix(globeScale, mobile ? 1.08 : .98, release);
    globeScale = mix(globeScale, .48, depart);
    this.state = {
      enabled: this.enabled,
      progress: p,
      width: this.width,
      height: this.height,
      centerX: centerX * this.width,
      centerY: centerY * this.height,
      globeScale,
      globeOpacity: mix(1, .08, depart),
      radiusScale: mix(1, 1.68, close),
      fan: release,
      departure: depart,
      rotation: close * 1.35 + release * 1.75 + depart * .8,
      roll: mix(0, -10, close) * (1 - release),
      lift: -close * 22,
      ringOpacity: (1 - release) * (1 - depart),
      mobile
    };
    this.scene.setOptions({ story: this.state, scroll: p });
    this.section.dataset.storyProgress = p.toFixed(4);
    const chapter = p < .19 ? 0 : p < .49 ? 1 : p < .83 ? 2 : 3;
    this.section.dataset.storyChapter = String(chapter + 1);
    this.hero.style.setProperty('--story-glow', (close * (1 - depart) * .45).toFixed(3));

    const intro = 1 - smooth(.075, .205, p);
    this.setLayer(this.intro, intro, -smooth(.075, .205, p) * 70);
    const focus = smooth(.17, .28, p) * (1 - smooth(.43, .51, p));
    const projects = smooth(.49, .59, p) * (1 - smooth(.76, .85, p));
    const outro = smooth(.83, .94, p);
    const amounts = this.enabled ? [focus, projects, outro] : [0, 0, 0];
    this.panels.forEach((panel, index) => this.setLayer(panel, amounts[index], (1 - amounts[index]) * 40));
    const controlsOpacity = 1 - smooth(.055, .145, p);
    this.controls.style.opacity = controlsOpacity.toFixed(3);
    this.controls.style.visibility = controlsOpacity > .02 ? 'visible' : 'hidden';
    this.controls.inert = controlsOpacity < .5;
    this.scrollCue.style.opacity = controlsOpacity.toFixed(3);
    this.scrollCue.inert = controlsOpacity < .5;
    this.coordinates.style.opacity = controlsOpacity.toFixed(3);
    this.progressBar.style.transform = `scaleX(${p.toFixed(5)})`;
    this.percent.textContent = `${Math.round(p * 100).toString().padStart(3, '0')}%`;
    if (chapter !== this.chapter) {
      this.chapter = chapter;
      this.buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === chapter)));
      this.announcement.textContent = this.enabled ? `${chapter + 1} / 4 · ${this.names[chapter]}` : '';
    }
  }
};
