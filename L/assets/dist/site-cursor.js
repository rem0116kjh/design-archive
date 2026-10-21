const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./chunks/RoundedBoxGeometry-DbW1yx3M.js","./chunks/three.module-DbTyATjt.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./chunks/preload-helper-DHlaQ_oz.js";
import { n as createMakervilGlassObject, t as getMakervilMobileIdleRotation } from "./chunks/makervil-glass-idle-RcJS0RnU.js";
//#region resources/ts/smooth-scroll.ts
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
var scrollKeys = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
]);
if (!window.__makervilSmoothScrollBooted) {
  window.__makervilSmoothScrollBooted = true;
  let instance = null;
  let frameId = null;
  let backToTopActive = false;
  let backToTopFallbackTimerId = null;
  let viewportFrameId = null;
  let viewportHeight = 0;
  const visualViewport = window.visualViewport;
  const touchViewport = window.matchMedia("(any-pointer: coarse)");
  const syncViewportHeight = () => {
    if (visualViewport && Math.abs(visualViewport.scale - 1) > .01) return;
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && (focused.matches("input, textarea, select") || focused.isContentEditable)) return;
    const height = visualViewport?.height ?? window.innerHeight;
    if (height < 1 || Math.abs(height - viewportHeight) < .5) return;
    viewportHeight = height;
    document.documentElement.style.setProperty("--mv-viewport-height", `${height}px`);
    if (touchViewport.matches) (instance ?? window.lenis)?.resize?.();
  };
  const requestViewportSync = () => {
    if (viewportFrameId !== null) return;
    viewportFrameId = window.requestAnimationFrame(() => {
      viewportFrameId = null;
      syncViewportHeight();
    });
  };
  const finishBackToTop = () => {
    backToTopActive = false;
    if (backToTopFallbackTimerId !== null) {
      window.clearTimeout(backToTopFallbackTimerId);
      backToTopFallbackTimerId = null;
    }
  };
  const cancelBackToTop = () => {
    if (!backToTopActive) return;
    const activeInstance = instance ?? window.lenis;
    finishBackToTop();
    if (activeInstance?.scrollTo) {
      activeInstance.scrollTo(window.scrollY, {
        immediate: true,
        force: true
      });
      return;
    }
    window.scrollTo({
      top: window.scrollY,
      left: window.scrollX,
      behavior: "auto"
    });
  };
  const onScrollKeyDown = (event) => {
    if (!scrollKeys.has(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target instanceof HTMLElement && target.isContentEditable) return;
    cancelBackToTop();
  };
  const onBackToTopClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    cancelBackToTop();
    if (reducedMotion.matches) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });
      return;
    }
    const activeInstance = instance ?? window.lenis;
    backToTopActive = true;
    if (activeInstance?.scrollTo) {
      activeInstance.scrollTo(0, {
        duration: 1.4,
        lock: false,
        onComplete: finishBackToTop
      });
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    backToTopFallbackTimerId = window.setTimeout(finishBackToTop, 2500);
  };
  const onSmoothScrollClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.currentTarget;
    const targetId = link.hash ? decodeURIComponent(link.hash.slice(1)) : "";
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;
    event.preventDefault();
    cancelBackToTop();
    if (reducedMotion.matches) {
      target.scrollIntoView({
        block: "start",
        behavior: "auto"
      });
      return;
    }
    const activeInstance = instance ?? window.lenis;
    backToTopActive = true;
    if (activeInstance?.scrollTo) {
      activeInstance.scrollTo(target, {
        duration: 1.2,
        force: true,
        lock: false,
        onComplete: finishBackToTop
      });
      return;
    }
    target.scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
    backToTopFallbackTimerId = window.setTimeout(finishBackToTop, 2200);
  };
  const cancelFrame = () => {
    if (frameId === null) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  };
  const destroy = () => {
    cancelFrame();
    finishBackToTop();
    if (!instance) return;
    instance.destroy();
    if (window.lenis === instance) delete window.lenis;
    instance = null;
  };
  const animate = (time) => {
    if (!instance) {
      frameId = null;
      return;
    }
    syncViewportHeight();
    instance.raf(time);
    frameId = window.requestAnimationFrame(animate);
  };
  const initialize = () => {
    if (instance || window.lenis || !window.Lenis || reducedMotion.matches) return;
    instance = new window.Lenis({
      lerp: .1,
      smoothWheel: true,
      syncTouch: false
    });
    window.lenis = instance;
    if (document.documentElement.classList.contains("is-home-intro-loading")) instance.stop();
    frameId = window.requestAnimationFrame(animate);
  };
  const syncMotionPreference = () => {
    if (reducedMotion.matches) {
      destroy();
      return;
    }
    initialize();
  };
  document.querySelectorAll("[data-site-back-to-top]").forEach((link) => {
    link.addEventListener("click", onBackToTopClick);
  });
  document.querySelectorAll("[data-site-smooth-scroll]").forEach((link) => {
    link.addEventListener("click", onSmoothScrollClick);
  });
  window.addEventListener("wheel", cancelBackToTop, {
    capture: true,
    passive: true
  });
  window.addEventListener("pointerdown", cancelBackToTop, {
    capture: true,
    passive: true
  });
  window.addEventListener("touchstart", cancelBackToTop, {
    capture: true,
    passive: true
  });
  window.addEventListener("keydown", onScrollKeyDown, { capture: true });
  window.addEventListener("resize", requestViewportSync, { passive: true });
  window.addEventListener("scroll", requestViewportSync, { passive: true });
  window.addEventListener("pageshow", requestViewportSync);
  visualViewport?.addEventListener("resize", requestViewportSync, { passive: true });
  visualViewport?.addEventListener("scroll", requestViewportSync, { passive: true });
  document.addEventListener("focusout", requestViewportSync);
  syncViewportHeight();
  reducedMotion.addEventListener("change", syncMotionPreference);
  syncMotionPreference();
}
//#endregion
//#region resources/ts/site-theme.ts
var STORAGE_KEY = "l-portfolio:site-theme";
var PAGE_SWAP_EVENT$2 = "l-portfolio:page-swapped";
var THEME_CHANGE_EVENT = "l-portfolio:site-theme-change";
var TRANSITION_CLASS = "is-site-theme-transitioning";
var HIDDEN_TOGGLE_CLASS = "is-site-theme-toggle-hidden";
var HOVER_LOCK_CLASS = "is-site-theme-toggle-hover-locked";
var TRANSITION_DURATION = 680;
var SCROLL_THRESHOLD = 6;
var root = document.documentElement;
var readTheme = () => root.dataset.siteTheme === "light" ? "light" : "dark";
var syncThemeControls = () => {
  const isDark = readTheme() === "dark";
  document.querySelectorAll("[data-site-theme-toggle]").forEach((control) => {
    control.setAttribute("aria-checked", String(isDark));
  });
  const themeColor = document.querySelector("[data-site-theme-color]");
  if (themeColor) themeColor.content = isDark ? "#111111" : "#ffffff";
};
if (!root.dataset.siteThemeInitialized) {
  root.dataset.siteThemeInitialized = "true";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let transitionTimerId = null;
  let scrollFrameId = null;
  let lastScrollY = Math.max(0, window.scrollY);
  const persistTheme = (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_error) {}
  };
  const finishThemeTransition = () => {
    root.classList.remove(TRANSITION_CLASS);
    if (transitionTimerId !== null) {
      window.clearTimeout(transitionTimerId);
      transitionTimerId = null;
    }
  };
  const applyTheme = (theme) => {
    const previousTheme = readTheme();
    if (previousTheme === theme) {
      syncThemeControls();
      return;
    }
    if (transitionTimerId !== null) {
      window.clearTimeout(transitionTimerId);
      transitionTimerId = null;
    }
    if (reducedMotion.matches) root.classList.remove(TRANSITION_CLASS);
    else {
      const transitionWasActive = root.classList.contains(TRANSITION_CLASS);
      root.classList.add(TRANSITION_CLASS);
      if (!transitionWasActive) root.offsetWidth;
    }
    root.dataset.siteTheme = theme;
    persistTheme(theme);
    syncThemeControls();
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: {
      theme,
      previousTheme,
      duration: reducedMotion.matches ? 0 : TRANSITION_DURATION
    } }));
    if (!reducedMotion.matches) transitionTimerId = window.setTimeout(finishThemeTransition, 760);
  };
  const updateDesktopToggleVisibility = () => {
    scrollFrameId = null;
    const header = document.querySelector("[data-persistent-header]");
    if (!header) return;
    const currentScrollY = Math.max(0, window.scrollY);
    const themeSlot = document.querySelector("[data-site-theme-toggle-slot]");
    if (!themeSlot || getComputedStyle(themeSlot).display === "none" || currentScrollY <= 1) {
      header.classList.remove(HIDDEN_TOGGLE_CLASS);
      lastScrollY = currentScrollY;
      return;
    }
    const delta = currentScrollY - lastScrollY;
    if (Math.abs(delta) < SCROLL_THRESHOLD) return;
    const slotHasKeyboardFocus = Boolean(themeSlot?.querySelector(":focus-visible"));
    if (delta > 0 && !slotHasKeyboardFocus) header.classList.add(HIDDEN_TOGGLE_CLASS);
    else if (delta < 0) header.classList.remove(HIDDEN_TOGGLE_CLASS);
    lastScrollY = currentScrollY;
  };
  const requestDesktopToggleVisibilityUpdate = () => {
    if (scrollFrameId !== null) return;
    scrollFrameId = window.requestAnimationFrame(updateDesktopToggleVisibility);
  };
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-site-theme-toggle]") : null;
    if (!target) return;
    if (event instanceof MouseEvent && event.detail > 0 && target.matches(":hover")) {
      target.classList.add(HOVER_LOCK_CLASS);
      target.addEventListener("pointerleave", () => {
        target.classList.remove(HOVER_LOCK_CLASS);
      }, { once: true });
    }
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  });
  window.addEventListener("scroll", requestDesktopToggleVisibilityUpdate, { passive: true });
  window.addEventListener("resize", requestDesktopToggleVisibilityUpdate, { passive: true });
  window.addEventListener("pageshow", () => {
    syncThemeControls();
    requestDesktopToggleVisibilityUpdate();
  });
  window.addEventListener("pagehide", () => {
    finishThemeTransition();
    if (scrollFrameId !== null) {
      window.cancelAnimationFrame(scrollFrameId);
      scrollFrameId = null;
    }
  });
  window.addEventListener(PAGE_SWAP_EVENT$2, () => {
    syncThemeControls();
    lastScrollY = Math.max(0, window.scrollY);
    document.querySelector("[data-persistent-header]")?.classList.remove(HIDDEN_TOGGLE_CLASS);
  });
  syncThemeControls();
}
//#endregion
//#region resources/ts/site-header.ts
var HEADER_FOOTER_STATE_CLASS = "is-site-footer-reached";
var FOOTER_VIEWPORT_COVERAGE_TO_HIDE = .85;
var FOOTER_VERSION_CHANGE_EVENT = "l-portfolio:site-footer-version-change";
var MOBILE_MENU_OPEN_CLASS = "is-site-mobile-menu-open";
var MOBILE_MENU_VISIBLE_CLASS = "is-site-mobile-menu-visible";
var MOBILE_MENU_CLOSING_CLASS = "is-site-mobile-menu-closing";
var PAGE_WILL_SWAP_EVENT$1 = "l-portfolio:page-will-swap";
var MOBILE_MENU_QUERY = "(width < 960px)";
var COMPACT_HEADER_CLASS = "is-site-header-compact";
var HEADER_MENU_MIN_GAP = 12;
var usesMobileHeader = () => window.matchMedia(MOBILE_MENU_QUERY).matches || document.documentElement.classList.contains(COMPACT_HEADER_CLASS);
var MOBILE_MENU_CLOSE_DURATION = 700;
var MOBILE_MENU_CONTENT_EXIT_LEAD = 650;
var MOBILE_MENU_FOCUS_DELAY = 90;
var LANGUAGE_OPEN_CLASS = "is-site-language-open";
var activeMobileHeader = null;
var activeMobilePanel = null;
var activeMobileToggle = null;
var mobileMenuRestoreTarget = null;
var mobileMenuInertStates = [];
var mobileMenuOpenFrameId = null;
var mobileMenuCloseTimerId = null;
var mobileMenuFocusTimerId = null;
var activeLanguageSwitcher = null;
var activeLanguageToggle = null;
var activeLanguagePanel = null;
var languageFocusFrameId = null;
var initializeSiteHeaderFooterVisibility = () => {
  const header = document.querySelector(".site-header");
  const footer = document.querySelector(".site-footer");
  const page = footer?.closest(".site-page");
  const revealSpacer = page?.querySelector("[data-site-footer-reveal-spacer]");
  if (!header || !footer || header.dataset.footerVisibilityInitialized === "true") return;
  header.dataset.footerVisibilityInitialized = "true";
  let frameId = null;
  const setFooterReached = (reached) => {
    header.classList.toggle(HEADER_FOOTER_STATE_CLASS, reached);
  };
  const syncFromLayout = () => {
    frameId = null;
    if (page?.dataset.siteFooterLayout === "v1" && revealSpacer) {
      const spacerBounds = revealSpacer.getBoundingClientRect();
      if (spacerBounds.height > 0) {
        const visibleTop = Math.max(0, spacerBounds.top);
        const visibleBottom = Math.min(window.innerHeight, spacerBounds.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const coverageBase = Math.max(1, Math.min(spacerBounds.height, window.innerHeight));
        setFooterReached(visibleHeight / coverageBase >= FOOTER_VIEWPORT_COVERAGE_TO_HIDE);
        return;
      }
    }
    const footerBounds = footer.getBoundingClientRect();
    const hideTriggerY = window.innerHeight * (1 - FOOTER_VIEWPORT_COVERAGE_TO_HIDE);
    setFooterReached(footerBounds.top <= hideTriggerY && footerBounds.bottom > 0);
  };
  const scheduleSync = () => {
    if (frameId === null) frameId = window.requestAnimationFrame(syncFromLayout);
  };
  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("pageshow", scheduleSync, { passive: true });
  window.addEventListener(FOOTER_VERSION_CHANGE_EVENT, scheduleSync);
  syncFromLayout();
};
var clearLanguageFocusFrame = () => {
  if (languageFocusFrameId !== null) {
    window.cancelAnimationFrame(languageFocusFrameId);
    languageFocusFrameId = null;
  }
};
var getLanguageOptions = (panel = activeLanguagePanel) => {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll("[data-site-language-option]"));
};
var closeLanguageSwitcher = (restoreFocus = false) => {
  const restoreTarget = activeLanguageToggle;
  clearLanguageFocusFrame();
  activeLanguageSwitcher?.classList.remove(LANGUAGE_OPEN_CLASS);
  activeLanguageToggle?.setAttribute("aria-expanded", "false");
  activeLanguagePanel?.setAttribute("aria-hidden", "true");
  if (activeLanguagePanel) activeLanguagePanel.inert = true;
  activeLanguageSwitcher = null;
  activeLanguageToggle = null;
  activeLanguagePanel = null;
  if (restoreFocus && restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
};
var openLanguageSwitcher = (toggle, focusIndex = null) => {
  const switcher = toggle.closest("[data-site-language-switcher]");
  const panelId = toggle.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!switcher || !(panel instanceof HTMLElement)) return;
  if (activeLanguageSwitcher && activeLanguageSwitcher !== switcher) closeLanguageSwitcher();
  clearLanguageFocusFrame();
  activeLanguageSwitcher = switcher;
  activeLanguageToggle = toggle;
  activeLanguagePanel = panel;
  panel.inert = false;
  panel.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  switcher.classList.add(LANGUAGE_OPEN_CLASS);
  if (focusIndex !== null) languageFocusFrameId = window.requestAnimationFrame(() => {
    languageFocusFrameId = null;
    const options = getLanguageOptions(panel);
    options[focusIndex < 0 ? options.length - 1 : focusIndex]?.focus({ preventScroll: true });
  });
};
var initializeSiteLanguageSwitcher = () => {
  const root = document.documentElement;
  if (root.dataset.siteLanguageSwitcherInitialized === "true") return;
  root.dataset.siteLanguageSwitcherInitialized = "true";
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const toggle = target?.closest("[data-site-language-toggle]");
    if (toggle) {
      event.preventDefault();
      if (toggle === activeLanguageToggle) closeLanguageSwitcher();
      else openLanguageSwitcher(toggle);
      return;
    }
    const option = target?.closest("[data-site-language-option]");
    if (option) {
      if (option.getAttribute("aria-current") === "true") {
        event.preventDefault();
        closeLanguageSwitcher(true);
      } else closeLanguageSwitcher();
      return;
    }
    if (activeLanguageSwitcher && !target?.closest("[data-site-language-switcher]")) closeLanguageSwitcher();
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const toggle = target?.closest("[data-site-language-toggle]");
    if (toggle && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openLanguageSwitcher(toggle, event.key === "ArrowDown" ? 0 : -1);
      return;
    }
    if (event.key === "Escape" && activeLanguageSwitcher) {
      event.preventDefault();
      closeLanguageSwitcher(true);
      return;
    }
    const option = target?.closest("[data-site-language-option]");
    if (!option || !activeLanguagePanel?.contains(option)) return;
    const options = getLanguageOptions();
    const currentIndex = options.indexOf(option);
    let nextIndex = null;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length;
    else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = options.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      options[nextIndex]?.focus({ preventScroll: true });
    }
  });
  document.addEventListener("focusin", (event) => {
    if (!activeLanguageSwitcher || !(event.target instanceof Node)) return;
    if (!activeLanguageSwitcher.contains(event.target)) closeLanguageSwitcher();
  });
  window.addEventListener(PAGE_WILL_SWAP_EVENT$1, () => closeLanguageSwitcher());
  window.addEventListener("resize", () => closeLanguageSwitcher(), { passive: true });
  window.addEventListener("pagehide", () => closeLanguageSwitcher());
};
var clearMobileMenuTimers = () => {
  if (mobileMenuOpenFrameId !== null) {
    window.cancelAnimationFrame(mobileMenuOpenFrameId);
    mobileMenuOpenFrameId = null;
  }
  if (mobileMenuCloseTimerId !== null) {
    window.clearTimeout(mobileMenuCloseTimerId);
    mobileMenuCloseTimerId = null;
  }
  if (mobileMenuFocusTimerId !== null) {
    window.clearTimeout(mobileMenuFocusTimerId);
    mobileMenuFocusTimerId = null;
  }
};
var updateMobileToggleState = (toggle, expanded) => {
  const openLabel = toggle.querySelector(".site-header__toggle-label--open");
  const closeLabel = toggle.querySelector(".site-header__toggle-label--close");
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggle.setAttribute("aria-label", expanded ? toggle.dataset.closeLabel ?? "Close menu" : toggle.dataset.openLabel ?? "Open menu");
  openLabel?.setAttribute("aria-hidden", expanded ? "true" : "false");
  closeLabel?.setAttribute("aria-hidden", expanded ? "false" : "true");
};
var setPageContentInert = () => {
  mobileMenuInertStates = [];
  document.querySelectorAll("#main-content, .site-footer, [data-site-footer-reveal-spacer]").forEach((element) => {
    mobileMenuInertStates.push({
      element,
      inert: element.inert
    });
    element.inert = true;
  });
};
var restorePageContentInert = () => {
  mobileMenuInertStates.forEach(({ element, inert }) => {
    element.inert = inert;
  });
  mobileMenuInertStates = [];
};
var mayResumeSmoothScroll = () => {
  const root = document.documentElement;
  return !root.classList.contains("is-page-transitioning") && !root.classList.contains("is-home-intro-loading");
};
var getMobileMenuFocusables = () => {
  const elements = [];
  if (activeMobilePanel) elements.push(...activeMobilePanel.querySelectorAll("a[href], button:not([disabled]), summary, [tabindex]:not([tabindex=\"-1\"])"));
  return elements.filter((element) => !element.hasAttribute("disabled") && !element.inert && element.getClientRects().length > 0);
};
var mobileCareerAnimations = /* @__PURE__ */ new WeakMap();
var toggleMobileCareers = (disclosure) => {
  const summary = disclosure.querySelector("summary");
  const content = disclosure.querySelector(".site-header__mobile-submenu");
  if (!summary || !content) return;
  const previous = mobileCareerAnimations.get(disclosure);
  const open = !(previous?.open ?? disclosure.open);
  const startHeight = disclosure.getBoundingClientRect().height;
  previous?.animation.cancel();
  mobileCareerAnimations.delete(disclosure);
  content.inert = !open;
  disclosure.classList.toggle("is-mobile-careers-expanded", open);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    disclosure.open = open;
    return;
  }
  disclosure.open = open;
  const endHeight = disclosure.getBoundingClientRect().height;
  disclosure.open = true;
  const animation = disclosure.animate([{
    height: `${startHeight}px`,
    overflow: "hidden"
  }, {
    height: `${endHeight}px`,
    overflow: "hidden"
  }], {
    duration: 360,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "both"
  });
  mobileCareerAnimations.set(disclosure, {
    animation,
    open
  });
  animation.onfinish = () => {
    if (mobileCareerAnimations.get(disclosure)?.animation !== animation) return;
    disclosure.open = open;
    animation.cancel();
    mobileCareerAnimations.delete(disclosure);
  };
};
var finishMobileMenuClose = (restoreFocus) => {
  const header = activeMobileHeader;
  const restoreTarget = mobileMenuRestoreTarget;
  clearMobileMenuTimers();
  activeMobilePanel?.querySelectorAll("[data-site-mobile-careers]").forEach((disclosure) => {
    mobileCareerAnimations.get(disclosure)?.animation.cancel();
    mobileCareerAnimations.delete(disclosure);
    disclosure.open = false;
    disclosure.classList.remove("is-mobile-careers-expanded");
  });
  header?.classList.remove(MOBILE_MENU_OPEN_CLASS, MOBILE_MENU_VISIBLE_CLASS, MOBILE_MENU_CLOSING_CLASS);
  document.documentElement.classList.remove(MOBILE_MENU_OPEN_CLASS);
  document.body.classList.remove(MOBILE_MENU_OPEN_CLASS);
  restorePageContentInert();
  if (mayResumeSmoothScroll()) window.lenis?.start();
  activeMobileHeader = null;
  activeMobilePanel = null;
  activeMobileToggle = null;
  mobileMenuRestoreTarget = null;
  if (restoreFocus && restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
};
var closeMobileMenu = (immediate = false, restoreFocus = true) => {
  if (!activeMobileHeader || !activeMobilePanel || !activeMobileToggle) {
    document.documentElement.classList.remove(MOBILE_MENU_OPEN_CLASS);
    document.body.classList.remove(MOBILE_MENU_OPEN_CLASS);
    restorePageContentInert();
    return;
  }
  clearMobileMenuTimers();
  activeMobilePanel.setAttribute("aria-hidden", "true");
  activeMobilePanel.inert = true;
  updateMobileToggleState(activeMobileToggle, false);
  activeMobilePanel.querySelectorAll("[data-site-mobile-careers]").forEach((disclosure) => {
    mobileCareerAnimations.get(disclosure)?.animation.pause();
  });
  activeMobilePanel.querySelectorAll("[data-site-mobile-menu-reveal]").forEach((element) => element.style.setProperty("--site-header-mobile-reveal-delay", "0ms"));
  if (immediate) {
    finishMobileMenuClose(restoreFocus);
    return;
  }
  activeMobileHeader.classList.add(MOBILE_MENU_CLOSING_CLASS);
  mobileMenuCloseTimerId = window.setTimeout(() => {
    mobileMenuCloseTimerId = null;
    activeMobileHeader?.classList.remove(MOBILE_MENU_VISIBLE_CLASS);
    mobileMenuCloseTimerId = window.setTimeout(() => {
      mobileMenuCloseTimerId = null;
      finishMobileMenuClose(restoreFocus);
    }, MOBILE_MENU_CLOSE_DURATION);
  }, MOBILE_MENU_CONTENT_EXIT_LEAD);
};
var openMobileMenu = (toggle) => {
  if (!usesMobileHeader()) return;
  const header = toggle.closest(".site-header");
  const panelId = toggle.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!header || !(panel instanceof HTMLElement)) return;
  if (activeMobileHeader && activeMobileHeader !== header) closeMobileMenu(true, false);
  clearMobileMenuTimers();
  activeMobileHeader = header;
  activeMobilePanel = panel;
  activeMobileToggle = toggle;
  panel.querySelectorAll("[data-site-mobile-careers]").forEach((disclosure) => {
    mobileCareerAnimations.get(disclosure)?.animation.play();
  });
  mobileMenuRestoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
  panel.querySelectorAll("[data-site-mobile-menu-reveal]").forEach((element, index) => {
    element.style.setProperty("--site-header-mobile-reveal-delay", `${120 + index * 52}ms`);
  });
  setPageContentInert();
  window.lenis?.stop();
  document.documentElement.classList.add(MOBILE_MENU_OPEN_CLASS);
  document.body.classList.add(MOBILE_MENU_OPEN_CLASS);
  header.classList.remove(MOBILE_MENU_CLOSING_CLASS);
  header.classList.add(MOBILE_MENU_OPEN_CLASS);
  panel.inert = false;
  panel.setAttribute("aria-hidden", "false");
  updateMobileToggleState(toggle, true);
  mobileMenuOpenFrameId = window.requestAnimationFrame(() => {
    mobileMenuOpenFrameId = null;
    header.classList.add(MOBILE_MENU_VISIBLE_CLASS);
    mobileMenuFocusTimerId = window.setTimeout(() => {
      mobileMenuFocusTimerId = null;
      panel.querySelector("[data-site-mobile-menu-link], a[href]")?.focus({ preventScroll: true });
    }, MOBILE_MENU_FOCUS_DELAY);
  });
};
var initializeSiteMobileMenu = () => {
  const root = document.documentElement;
  if (root.dataset.siteMobileMenuInitialized === "true") return;
  root.dataset.siteMobileMenuInitialized = "true";
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const careerSummary = target?.closest("[data-site-mobile-careers] > summary");
    if (careerSummary) {
      const disclosure = careerSummary.parentElement;
      if (disclosure instanceof HTMLDetailsElement) {
        event.preventDefault();
        toggleMobileCareers(disclosure);
      }
      return;
    }
    const toggle = target?.closest("[data-site-mobile-menu-toggle]");
    if (toggle) {
      if (toggle.getAttribute("aria-expanded") === "true") closeMobileMenu();
      else openMobileMenu(toggle);
      return;
    }
    if (target?.closest("[data-site-mobile-menu-close]")) {
      closeMobileMenu();
      return;
    }
    if (target?.closest("[data-site-mobile-menu-panel] a[href]")) closeMobileMenu(false, false);
  });
  document.addEventListener("keydown", (event) => {
    if (!activeMobileHeader?.classList.contains(MOBILE_MENU_OPEN_CLASS)) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const focusableElements = getMobileMenuFocusables();
    if (focusableElements.length === 0) {
      event.preventDefault();
      activeMobileToggle?.focus({ preventScroll: true });
      return;
    }
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
  window.addEventListener("resize", () => {
    if (!usesMobileHeader()) closeMobileMenu(true, false);
  }, { passive: true });
  window.addEventListener(PAGE_WILL_SWAP_EVENT$1, () => closeMobileMenu(true, false));
  window.addEventListener("pagehide", () => closeMobileMenu(true, false));
};
initializeSiteHeaderFooterVisibility();
initializeSiteLanguageSwitcher();
var initializeSiteCareerMenu = () => {
  if (document.documentElement.dataset.siteCareerMenuInitialized === "true") return;
  document.documentElement.dataset.siteCareerMenuInitialized = "true";
  const getMenu = (target) => target instanceof Element ? target.closest("[data-site-career-menu]") : null;
  const setOpen = (menu, open) => {
    const toggle = menu?.querySelector("[data-site-career-toggle]");
    const panel = menu?.querySelector(".site-header__submenu");
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  };
  document.addEventListener("pointerover", (event) => {
    const menu = getMenu(event.target);
    if (event.pointerType === "touch" || !menu) return;
    if (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget)) setOpen(menu, true);
  });
  document.addEventListener("pointerout", (event) => {
    const menu = getMenu(event.target);
    if (!menu || menu.contains(document.activeElement)) return;
    if (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget)) setOpen(menu, false);
  });
  document.addEventListener("click", (event) => {
    const menu = getMenu(event.target);
    const link = event.target instanceof Element ? event.target.closest(".site-header__submenu a[href]") : null;
    if (menu && link) {
      const restoreFocus = menu.querySelector(".site-header__submenu")?.contains(document.activeElement);
      setOpen(menu, false);
      if (restoreFocus) menu.querySelector("[data-site-career-toggle]")?.focus({ preventScroll: true });
      return;
    }
    const toggle = event.target instanceof Element ? event.target.closest("[data-site-career-toggle]") : null;
    if (toggle) setOpen(getMenu(toggle), toggle.getAttribute("aria-expanded") !== "true");
    else if (!getMenu(event.target)) setOpen(document.querySelector("[data-site-career-menu]"), false);
  }, { capture: true });
  document.addEventListener("focusout", (event) => {
    const menu = getMenu(event.target);
    if (menu && (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget))) setOpen(menu, false);
  });
  document.addEventListener("keydown", (event) => {
    const menu = getMenu(event.target);
    const toggle = menu?.querySelector("[data-site-career-toggle]");
    if (!menu || !toggle) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(menu, false);
      toggle.focus();
    } else if (event.key === "ArrowDown" && event.target === toggle) {
      event.preventDefault();
      setOpen(menu, true);
      menu.querySelector(".site-header__submenu a")?.focus();
    }
  });
  window.addEventListener(PAGE_WILL_SWAP_EVENT$1, () => {
    setOpen(document.querySelector("[data-site-career-menu]"), false);
  });
};
initializeSiteCareerMenu();
initializeSiteMobileMenu();
var initializeResponsiveHeader = () => {
  const root = document.documentElement;
  if (root.dataset.responsiveHeaderInitialized === "true") return;
  root.dataset.responsiveHeaderInitialized = "true";
  const sync = () => {
    const header = document.querySelector(".site-header");
    const nav = header?.querySelector(".site-header__navigation--desktop");
    const theme = document.querySelector(".site-header__theme-slot");
    if (!header || !nav || !theme) return;
    let compact = window.matchMedia(MOBILE_MENU_QUERY).matches;
    if (!compact) {
      root.classList.remove(COMPACT_HEADER_CLASS);
      compact = nav.getBoundingClientRect().left - theme.getBoundingClientRect().right < HEADER_MENU_MIN_GAP;
    }
    root.classList.toggle(COMPACT_HEADER_CLASS, compact);
    if (!compact) closeMobileMenu(true, false);
  };
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("pageshow", sync);
  window.addEventListener("l-portfolio:page-swapped", sync);
  document.fonts?.ready.then(sync);
  sync();
};
initializeResponsiveHeader();
//#endregion
//#region resources/ts/scroll-idle.ts
/** Keep one-time GPU setup out of active wheel/touch scrolling. */
var waitForScrollIdle = (ready, cancelled, prioritized = () => false) => new Promise((resolve) => {
  let lastActivity = performance.now();
  const activity = () => {
    lastActivity = performance.now();
  };
  const events = [
    "scroll",
    "wheel",
    "touchmove"
  ];
  events.forEach((event) => window.addEventListener(event, activity, { passive: true }));
  const finish = (value) => {
    events.forEach((event) => window.removeEventListener(event, activity));
    resolve(value);
  };
  const poll = () => {
    if (cancelled()) return finish(false);
    if (prioritized() && ready() && !document.hidden) return finish(true);
    if (!ready() || document.hidden || performance.now() - lastActivity < 220) {
      window.setTimeout(poll, 64);
      return;
    }
    if ("requestIdleCallback" in window) window.requestIdleCallback((deadline) => {
      if (cancelled()) return finish(false);
      if (prioritized() && ready() && !document.hidden) return finish(true);
      const idleDuration = performance.now() - lastActivity;
      if (ready() && !document.hidden && idleDuration >= 220 && (deadline.timeRemaining() >= 8 || deadline.didTimeout || idleDuration >= 600)) finish(true);
      else window.setTimeout(poll, 64);
    }, { timeout: 400 });
    else finish(true);
  };
  poll();
});
//#endregion
//#region resources/ts/site-footer-glass.ts
var FOOTER_SELECTOR$1 = ".site-footer";
var TARGET_SELECTOR = "[data-site-footer-glass-target]";
var REVEAL_SPACER_SELECTOR = "[data-site-footer-reveal-spacer]";
var CAMERA_FOV = 38;
var CAMERA_Z = 5.4;
var BACKDROP_DISTANCE = 2.6;
var ROTATION_EASING = .075;
var SCALE_EASING = .11;
var MOTION_EPSILON = 8e-4;
var SCALE_EPSILON = .001;
var HOVER_SCALE = 1.12;
var OBJECT_WIDTH_FILL = .8;
var OBJECT_HEIGHT_FILL = .75;
var BASE_POSITION_Y = 0;
var BASE_ROTATION = {
  x: -.12,
  y: .2,
  z: .015
};
var FOOTER_3D_VISIBILITY_EVENT = "l-portfolio:site-footer-3d-visibility";
var ENTRY_DELAY = 0;
var ENTRY_DURATION = 1900;
var ENTRY_Y_ROTATION = Math.PI * 1.5;
var activeCleanup$1 = null;
var clamp$2 = (value, min, max) => Math.min(max, Math.max(min, value));
var destroySiteFooterGlass = () => {
  const cleanup = activeCleanup$1;
  activeCleanup$1 = null;
  cleanup?.();
};
var initializeSiteFooterGlass = () => {
  destroySiteFooterGlass();
  const footer = document.querySelector(FOOTER_SELECTOR$1);
  const target = footer?.querySelector(TARGET_SELECTOR);
  const revealSpacer = document.querySelector(REVEAL_SPACER_SELECTOR);
  if (!footer || !target || footer.dataset.siteFooterVersion !== "v1" || footer.dataset.siteFooterGlassInitialized === "true") return;
  footer.dataset.siteFooterGlassInitialized = "true";
  const surface = footer;
  const canvas = document.createElement("canvas");
  canvas.className = "site-footer__glass-canvas";
  canvas.dataset.siteFooterGlass = "true";
  canvas.setAttribute("aria-hidden", "true");
  footer.prepend(canvas);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const revealObserverTargets = revealSpacer ? [footer, revealSpacer] : [footer];
  const activeRevealTarget = () => revealSpacer && revealSpacer.getBoundingClientRect().height > 0 ? revealSpacer : footer;
  const isWithinViewport = (element, margin = 0) => {
    const bounds = element.getBoundingClientRect();
    return bounds.height > 0 && bounds.bottom >= -margin && bounds.top <= window.innerHeight + margin;
  };
  let destroyed = false;
  let initialized = false;
  let initializing = false;
  let nearViewport = isWithinViewport(activeRevealTarget());
  let contextLost = false;
  let frameId = null;
  let resizeFrameId = null;
  let fittedScale = 1;
  let fittedPositionX = 0;
  let fittedPositionY = BASE_POSITION_Y;
  let currentHoverScale = 1;
  let targetHoverScale = 1;
  let previousFrameTime = performance.now();
  let lastMobileIdleFrameTime = 0;
  let mobileIdleElapsedSeconds = 0;
  let currentRotation = { ...BASE_ROTATION };
  let targetRotation = { ...BASE_ROTATION };
  let entryVisible = footer.classList.contains("is-site-footer-3d-visible");
  let entryStartedAt = entryVisible ? (Number(footer.dataset.siteFooter3dRevealStartedAt) || performance.now()) + ENTRY_DELAY : null;
  let entryProgress = entryVisible && reducedMotion.matches ? 1 : 0;
  let renderer = null;
  let scene = null;
  let camera = null;
  let glassObject = null;
  let backdropMesh = null;
  let backdropMaterial = null;
  let resizeObserver = null;
  const renderScene = () => {
    if (destroyed || !renderer || !scene || !camera || !nearViewport || document.hidden) return;
    renderer.render(scene, camera);
  };
  const requestRender = () => {
    if (!destroyed && initialized && nearViewport && !document.hidden && frameId === null) {
      previousFrameTime = performance.now();
      frameId = window.requestAnimationFrame(renderFrame);
    }
  };
  const fitObject = () => {
    if (!camera || !glassObject) return;
    const visibleHeight = 2 * Math.tan(camera.fov * Math.PI / 180 / 2) * camera.position.z;
    const visibleWidth = visibleHeight * camera.aspect;
    const surfaceBounds = surface.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    if (surfaceBounds.width <= 0 || surfaceBounds.height <= 0) return;
    const objectAspect = glassObject.geometrySize.x / Math.max(glassObject.geometrySize.y, .001);
    fittedScale = Math.min(targetBounds.width / surfaceBounds.width * visibleWidth * OBJECT_WIDTH_FILL, targetBounds.height / surfaceBounds.height * visibleHeight * OBJECT_HEIGHT_FILL * objectAspect) / Math.max(glassObject.geometrySize.x, .001);
    fittedPositionX = ((targetBounds.left + targetBounds.width / 2 - surfaceBounds.left) / surfaceBounds.width - .5) * visibleWidth;
    fittedPositionY = (.5 - (targetBounds.top + targetBounds.height / 2 - surfaceBounds.top) / surfaceBounds.height) * visibleHeight + BASE_POSITION_Y;
    const easedEntryScale = 1 - Math.pow(1 - entryProgress, 3);
    glassObject.group.scale.setScalar(fittedScale * currentHoverScale * easedEntryScale);
  };
  const fitBackdrop = () => {
    if (!camera || !backdropMesh) return;
    const distance = camera.position.z + BACKDROP_DISTANCE;
    const visibleHeight = 2 * Math.tan(camera.fov * Math.PI / 180 / 2) * distance;
    backdropMesh.scale.set(visibleHeight * camera.aspect, visibleHeight, 1);
  };
  const resize = () => {
    resizeFrameId = null;
    if (destroyed || !renderer || !camera || !nearViewport || document.hidden) return;
    const width = Math.max(1, Math.round(surface.clientWidth));
    const height = Math.max(1, Math.round(surface.clientHeight));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1, 1920 / width, Math.sqrt(18e5 / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitObject();
    fitBackdrop();
    renderScene();
  };
  const scheduleResize = () => {
    if (nearViewport && !document.hidden && resizeFrameId === null) resizeFrameId = window.requestAnimationFrame(() => {
      resize();
      requestRender();
    });
  };
  function renderFrame(frameTime) {
    frameId = null;
    if (!glassObject || !nearViewport || document.hidden || contextLost) return;
    const throttleMobileIdle = !finePointer.matches && !reducedMotion.matches && entryVisible && entryProgress >= 1;
    if (throttleMobileIdle && lastMobileIdleFrameTime > 0 && frameTime - lastMobileIdleFrameTime < 1e3 / 30) {
      frameId = window.requestAnimationFrame(renderFrame);
      return;
    }
    if (throttleMobileIdle) lastMobileIdleFrameTime = frameTime;
    const deltaSeconds = Math.min(Math.max((frameTime - previousFrameTime) / 1e3, 0), .05);
    previousFrameTime = frameTime;
    if (!entryVisible) entryProgress = 0;
    else if (reducedMotion.matches) entryProgress = 1;
    else if (entryStartedAt !== null) {
      entryProgress = clamp$2((frameTime - entryStartedAt) / ENTRY_DURATION, 0, 1);
      if (entryProgress >= 1) entryStartedAt = null;
    }
    if (reducedMotion.matches) {
      currentRotation = { ...BASE_ROTATION };
      currentHoverScale = targetHoverScale;
    } else currentHoverScale += (targetHoverScale - currentHoverScale) * SCALE_EASING;
    const mobileIdleActive = !finePointer.matches && !reducedMotion.matches && entryVisible && entryProgress >= 1;
    if (mobileIdleActive) mobileIdleElapsedSeconds += deltaSeconds;
    const desiredRotation = mobileIdleActive ? getMakervilMobileIdleRotation(mobileIdleElapsedSeconds, BASE_ROTATION) : targetRotation;
    if (!reducedMotion.matches) {
      currentRotation.x += (desiredRotation.x - currentRotation.x) * ROTATION_EASING;
      currentRotation.y += (desiredRotation.y - currentRotation.y) * ROTATION_EASING;
      currentRotation.z += (desiredRotation.z - currentRotation.z) * ROTATION_EASING;
    }
    const easedEntryScale = 1 - Math.pow(1 - entryProgress, 3);
    const entryRotationY = entryProgress < 1 ? -(1 - easedEntryScale) * ENTRY_Y_ROTATION : 0;
    glassObject.group.rotation.set(currentRotation.x, currentRotation.y + entryRotationY, currentRotation.z);
    glassObject.group.scale.setScalar(fittedScale * currentHoverScale * easedEntryScale);
    glassObject.group.position.set(fittedPositionX, fittedPositionY, 0);
    renderScene();
    const rotationIsMoving = Math.abs(desiredRotation.x - currentRotation.x) > MOTION_EPSILON || Math.abs(desiredRotation.y - currentRotation.y) > MOTION_EPSILON || Math.abs(desiredRotation.z - currentRotation.z) > MOTION_EPSILON;
    const scaleIsMoving = Math.abs(targetHoverScale - currentHoverScale) > SCALE_EPSILON;
    const entryIsMoving = entryVisible && entryProgress < 1;
    if (!reducedMotion.matches && (rotationIsMoving || scaleIsMoving || entryIsMoving || mobileIdleActive)) frameId = window.requestAnimationFrame(renderFrame);
  }
  const initializeThree = async () => {
    if (initialized || initializing || destroyed || !nearViewport || document.hidden || !("WebGLRenderingContext" in window)) return;
    initializing = true;
    try {
      const THREE = await __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url);
      if (!await waitForScrollIdle(() => nearViewport && !document.hidden, () => destroyed || !document.documentElement.contains(footer), () => entryVisible)) return;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.transmissionResolutionScale = .5;
      renderer.setClearColor(0, 0);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, .1, 60);
      camera.position.set(0, 0, CAMERA_Z);
      glassObject = createMakervilGlassObject({
        THREE,
        renderer
      });
      glassObject.group.rotation.set(BASE_ROTATION.x, BASE_ROTATION.y, BASE_ROTATION.z);
      scene.add(glassObject.group);
      scene.environment = glassObject.environmentRenderTarget.texture;
      backdropMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#000000"),
        toneMapped: false
      });
      backdropMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backdropMaterial);
      backdropMesh.position.z = -2.6;
      backdropMesh.onBeforeRender = (activeRenderer) => {
        const isTransmissionPass = activeRenderer.getRenderTarget() !== null;
        if (backdropMaterial) {
          backdropMaterial.colorWrite = isTransmissionPass;
          backdropMaterial.depthWrite = isTransmissionPass;
        }
      };
      scene.add(backdropMesh);
      initialized = true;
      footer.classList.add("is-site-footer-glass-ready");
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(surface);
      resizeObserver.observe(target);
      resize();
      requestRender();
    } catch (_error) {
      canvas.hidden = true;
    } finally {
      initializing = false;
    }
  };
  const resetRotation = () => {
    targetRotation = { ...BASE_ROTATION };
  };
  const entryInteractionIsLocked = () => !entryVisible || !reducedMotion.matches && entryProgress < 1;
  const handlePointerMove = (event) => {
    if (entryInteractionIsLocked() || !nearViewport || reducedMotion.matches || !finePointer.matches) return;
    const bounds = footer.getBoundingClientRect();
    if (!(event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom)) {
      resetRotation();
      return;
    }
    const normalizedX = clamp$2((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
    const normalizedY = clamp$2((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
    targetRotation = {
      x: BASE_ROTATION.x - normalizedY * .46,
      y: BASE_ROTATION.y + normalizedX * .56,
      z: BASE_ROTATION.z - normalizedX * .04
    };
    requestRender();
  };
  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
        resizeFrameId = null;
      }
    } else if (nearViewport) initializeThree().then(() => {
      resize();
      requestRender();
    });
  };
  const handleReducedMotionChange = () => {
    entryProgress = entryVisible && reducedMotion.matches ? 1 : entryProgress;
    resetRotation();
    requestRender();
  };
  const handleEntryVisibility = (event) => {
    const detail = event.detail;
    if (detail?.footer && detail.footer !== footer) return;
    entryVisible = detail?.visible === true;
    entryStartedAt = entryVisible ? (typeof detail.startedAt === "number" ? detail.startedAt : performance.now()) + ENTRY_DELAY : null;
    entryProgress = entryVisible && reducedMotion.matches ? 1 : 0;
    currentHoverScale = 1;
    targetHoverScale = 1;
    resetRotation();
    if (glassObject) {
      glassObject.group.scale.setScalar(entryProgress >= 1 ? fittedScale : 0);
      glassObject.group.rotation.set(BASE_ROTATION.x, BASE_ROTATION.y, BASE_ROTATION.z);
      renderScene();
    }
    requestRender();
  };
  const handlePointerEnter = () => {
    if (entryInteractionIsLocked() || !finePointer.matches) return;
    targetHoverScale = HOVER_SCALE;
    requestRender();
  };
  const handlePointerLeave = () => {
    targetHoverScale = 1;
    resetRotation();
    requestRender();
  };
  const preloadObserver = "IntersectionObserver" in window ? new IntersectionObserver((_entries, observer) => {
    if (!isWithinViewport(activeRevealTarget(), window.innerHeight)) return;
    observer.disconnect();
    __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url).catch(() => void 0);
  }, { rootMargin: "100% 0px 100% 0px" }) : null;
  const visibilityObserver = "IntersectionObserver" in window ? new IntersectionObserver(() => {
    nearViewport = isWithinViewport(activeRevealTarget());
    if (nearViewport) initializeThree().then(() => {
      resize();
      requestRender();
    });
    else {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
        resizeFrameId = null;
      }
    }
  }, { threshold: 0 }) : null;
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  target.addEventListener("pointerenter", handlePointerEnter);
  target.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotion.addEventListener("change", handleReducedMotionChange);
  footer.addEventListener(FOOTER_3D_VISIBILITY_EVENT, handleEntryVisibility);
  revealObserverTargets.forEach((element) => {
    preloadObserver?.observe(element);
    visibilityObserver?.observe(element);
  });
  if (!preloadObserver || !visibilityObserver) {
    nearViewport = true;
    initializeThree();
  }
  activeCleanup$1 = () => {
    destroyed = true;
    preloadObserver?.disconnect();
    visibilityObserver?.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    target.removeEventListener("pointerenter", handlePointerEnter);
    target.removeEventListener("pointerleave", handlePointerLeave);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.removeEventListener("change", handleReducedMotionChange);
    footer.removeEventListener(FOOTER_3D_VISIBILITY_EVENT, handleEntryVisibility);
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    if (resizeFrameId !== null) window.cancelAnimationFrame(resizeFrameId);
    if (scene && glassObject) {
      scene.remove(glassObject.group);
      scene.environment = null;
    }
    if (scene && backdropMesh) scene.remove(backdropMesh);
    backdropMesh?.geometry.dispose();
    backdropMaterial?.dispose();
    glassObject?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    canvas.remove();
    footer.classList.remove("is-site-footer-glass-ready");
    delete footer.dataset.siteFooterGlassInitialized;
  };
};
//#endregion
//#region resources/ts/site-footer-astronaut.ts
var ASTRONAUT_LAYER = 1;
var clamp$1 = (value, min, max) => Math.min(max, Math.max(min, value));
var lerp$1 = (from, to, amount) => from + (to - from) * amount;
var createSiteFooterAstronaut = async ({ THREE, camera, scene, target }) => {
  const { RoundedBoxGeometry } = await __vitePreload(async () => {
    const { RoundedBoxGeometry } = await import("./chunks/RoundedBoxGeometry-DbW1yx3M.js");
    return { RoundedBoxGeometry };
  }, [], import.meta.url);
  const geometries = /* @__PURE__ */ new Set();
  const materials = /* @__PURE__ */ new Set();
  const model = new THREE.Group();
  const suitMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: .26,
    clearcoatRoughness: .34,
    color: 16777215,
    metalness: .02,
    roughness: .4
  });
  const softSuitMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: .12,
    color: 16777215,
    metalness: 0,
    roughness: .66
  });
  const darkMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: .92,
    clearcoatRoughness: .08,
    color: 1118481,
    metalness: .22,
    roughness: .16
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: .025,
    color: 1118481,
    metalness: .16,
    opacity: .96,
    roughness: .035,
    transparent: true
  });
  const detailMaterial = new THREE.MeshStandardMaterial({
    color: 1118481,
    metalness: .12,
    roughness: .38
  });
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 16777215,
    metalness: .72,
    roughness: .2
  });
  const seamMaterial = new THREE.MeshStandardMaterial({
    color: 1118481,
    metalness: .02,
    roughness: .62
  });
  [
    suitMaterial,
    softSuitMaterial,
    darkMaterial,
    glassMaterial,
    detailMaterial,
    metalMaterial,
    seamMaterial
  ].forEach((material) => materials.add(material));
  const addMesh = (parent, geometry, material, position, scale = [
    1,
    1,
    1
  ], rotation = [
    0,
    0,
    0
  ]) => {
    geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.set(...rotation);
    mesh.layers.set(ASTRONAUT_LAYER);
    mesh.frustumCulled = false;
    parent.add(mesh);
    return mesh;
  };
  const torsoProfile = [
    new THREE.Vector2(.38, -.58),
    new THREE.Vector2(.5, -.5),
    new THREE.Vector2(.57, -.24),
    new THREE.Vector2(.58, .12),
    new THREE.Vector2(.53, .4),
    new THREE.Vector2(.41, .54)
  ];
  addMesh(model, new THREE.LatheGeometry(torsoProfile, 64), softSuitMaterial, [
    0,
    .08,
    0
  ], [
    1.05,
    1,
    .77
  ]);
  addMesh(model, new THREE.SphereGeometry(.48, 40, 28), suitMaterial, [
    0,
    -.44,
    0
  ], [
    1.08,
    .58,
    .84
  ]);
  addMesh(model, new THREE.TorusGeometry(.43, .038, 14, 48), metalMaterial, [
    0,
    -.35,
    .08
  ], [
    1.05,
    .76,
    1
  ]);
  const backpack = addMesh(model, new RoundedBoxGeometry(.88, 1.16, .42, 8, .13), suitMaterial, [
    0,
    .13,
    -.52
  ]);
  backpack.rotation.x = -.035;
  [-.31, .31].forEach((x) => {
    addMesh(model, new THREE.CapsuleGeometry(.105, .64, 8, 18), metalMaterial, [
      x,
      .16,
      -.77
    ], [
      1,
      1,
      1
    ]);
  });
  addMesh(model, new RoundedBoxGeometry(.76, .46, .16, 6, .065), darkMaterial, [
    0,
    .16,
    .45
  ]);
  addMesh(model, new RoundedBoxGeometry(.64, .29, .08, 5, .035), metalMaterial, [
    0,
    .19,
    .565
  ]);
  addMesh(model, new RoundedBoxGeometry(.5, .09, .055, 3, .02), detailMaterial, [
    0,
    .29,
    .62
  ]);
  [
    -.22,
    0,
    .22
  ].forEach((x, index) => {
    addMesh(model, new THREE.CylinderGeometry(.045, .045, .032, 20), index === 1 ? darkMaterial : suitMaterial, [
      x,
      .08,
      .625
    ], [
      1,
      1,
      1
    ], [
      Math.PI * .5,
      0,
      0
    ]);
  });
  [-.31, .31].forEach((x) => {
    addMesh(model, new RoundedBoxGeometry(.06, .78, .035, 3, .015), seamMaterial, [
      x,
      -.02,
      .4
    ]);
  });
  [-.34, .34].forEach((x) => {
    addMesh(model, new THREE.CapsuleGeometry(.055, .35, 6, 12), softSuitMaterial, [
      x,
      -.03,
      .36
    ], [
      1,
      1,
      .72
    ]);
  });
  addMesh(model, new THREE.SphereGeometry(.76, 56, 40), suitMaterial, [
    0,
    1.08,
    -.04
  ], [
    1.01,
    .98,
    .86
  ]);
  addMesh(model, new THREE.SphereGeometry(.56, 56, 40), glassMaterial, [
    0,
    1.1,
    .53
  ], [
    .94,
    .86,
    .38
  ], [
    .025,
    0,
    0
  ]);
  addMesh(model, new THREE.TorusGeometry(.56, .052, 18, 56), metalMaterial, [
    0,
    1.09,
    .75
  ], [
    1,
    .9,
    1
  ]);
  addMesh(model, new THREE.CylinderGeometry(.48, .46, .09, 40), detailMaterial, [
    0,
    .43,
    -.015
  ], [
    1,
    1,
    .86
  ]);
  addMesh(model, new THREE.CylinderGeometry(.43, .45, .12, 40), metalMaterial, [
    0,
    .38,
    .005
  ], [
    1,
    1,
    .84
  ]);
  [-1, 1].forEach((side) => {
    addMesh(model, new THREE.CylinderGeometry(.13, .13, .11, 24), metalMaterial, [
      side * .66,
      1.08,
      .01
    ], [
      1,
      1,
      1
    ], [
      0,
      0,
      Math.PI * .5
    ]);
  });
  addMesh(model, new RoundedBoxGeometry(.16, .055, .028, 3, .015), suitMaterial, [
    -.2,
    1.35,
    .755
  ], [
    1,
    1,
    1
  ], [
    0,
    0,
    -.18
  ]);
  const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.31, .37, .56),
    new THREE.Vector3(.57, .5, .5),
    new THREE.Vector3(.61, .75, .22),
    new THREE.Vector3(.5, .9, -.16)
  ]);
  addMesh(model, new THREE.TubeGeometry(hoseCurve, 36, .035, 10, false), darkMaterial, [
    0,
    0,
    0
  ]);
  const addJointRing = (parent, y) => {
    addMesh(parent, new THREE.TorusGeometry(.185, .048, 12, 32), metalMaterial, [
      0,
      y,
      0
    ], [
      1,
      1,
      .9
    ], [
      Math.PI * .5,
      0,
      0
    ]);
  };
  const leftArm = new THREE.Group();
  leftArm.position.set(-.59, .45, .02);
  leftArm.rotation.z = -.38;
  model.add(leftArm);
  addJointRing(leftArm, 0);
  addMesh(leftArm, new THREE.SphereGeometry(.235, 28, 20), suitMaterial, [
    0,
    -.05,
    0
  ], [
    1,
    .78,
    .86
  ]);
  addMesh(leftArm, new THREE.CapsuleGeometry(.18, .32, 12, 28), softSuitMaterial, [
    0,
    -.31,
    0
  ], [
    1.04,
    1,
    .88
  ]);
  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -.62, .02);
  leftForearm.rotation.z = .23;
  leftArm.add(leftForearm);
  addJointRing(leftForearm, 0);
  addMesh(leftForearm, new THREE.CapsuleGeometry(.16, .28, 12, 26), suitMaterial, [
    0,
    -.28,
    0
  ], [
    1,
    1,
    .84
  ]);
  addMesh(leftForearm, new THREE.CylinderGeometry(.17, .17, .08, 24), detailMaterial, [
    0,
    -.48,
    .02
  ], [
    1,
    1,
    .84
  ]);
  addMesh(leftForearm, new THREE.CapsuleGeometry(.145, .08, 10, 28), suitMaterial, [
    .01,
    -.61,
    .04
  ], [
    1,
    1,
    .72
  ]);
  const waveArm = new THREE.Group();
  waveArm.position.set(.6, .48, .12);
  waveArm.rotation.z = 2.5;
  model.add(waveArm);
  addJointRing(waveArm, 0);
  addMesh(waveArm, new THREE.SphereGeometry(.235, 28, 20), suitMaterial, [
    0,
    -.05,
    0
  ], [
    1,
    .78,
    .86
  ]);
  addMesh(waveArm, new THREE.CapsuleGeometry(.18, .32, 12, 28), softSuitMaterial, [
    0,
    -.31,
    0
  ], [
    1.04,
    1,
    .88
  ]);
  const waveForearm = new THREE.Group();
  waveForearm.position.set(0, -.62, .04);
  waveForearm.rotation.z = .64;
  waveArm.add(waveForearm);
  addJointRing(waveForearm, 0);
  addMesh(waveForearm, new THREE.CapsuleGeometry(.16, .28, 12, 26), suitMaterial, [
    0,
    -.28,
    0
  ], [
    1,
    1,
    .84
  ]);
  const wavingHand = new THREE.Group();
  wavingHand.position.set(0, -.57, .07);
  waveForearm.add(wavingHand);
  addMesh(wavingHand, new THREE.CylinderGeometry(.17, .17, .08, 24), detailMaterial, [
    0,
    .17,
    -.01
  ], [
    1,
    1,
    .84
  ]);
  addMesh(wavingHand, new THREE.CapsuleGeometry(.145, .08, 10, 28), suitMaterial, [
    0,
    -.02,
    0
  ], [
    1,
    1,
    .72
  ]);
  const addLeg = (side) => {
    const leg = new THREE.Group();
    leg.position.set(side * .3, side === -1 ? -.49 : -.43, -.02);
    leg.rotation.z = side === -1 ? -.045 : .055;
    leg.rotation.x = side === -1 ? -.035 : .045;
    model.add(leg);
    addMesh(leg, new THREE.CapsuleGeometry(.205, .2, 12, 28), softSuitMaterial, [
      0,
      -.24,
      0
    ], [
      1,
      1,
      .9
    ]);
    const lowerLeg = new THREE.Group();
    lowerLeg.position.set(0, -.5, side === -1 ? .03 : .09);
    lowerLeg.rotation.z = side === -1 ? -.015 : .025;
    leg.add(lowerLeg);
    addJointRing(lowerLeg, 0);
    addMesh(lowerLeg, new THREE.CapsuleGeometry(.18, .16, 12, 28), suitMaterial, [
      0,
      -.22,
      0
    ], [
      1,
      1,
      .88
    ]);
    addMesh(lowerLeg, new RoundedBoxGeometry(.46, .32, .6, 7, .115), suitMaterial, [
      side * .025,
      -.51,
      .2
    ], [
      1,
      1,
      1
    ], [
      side === -1 ? .045 : -.015,
      0,
      side * .025
    ]);
    addMesh(lowerLeg, new RoundedBoxGeometry(.38, .06, .55, 4, .022), detailMaterial, [
      side * .025,
      -.675,
      .2
    ]);
  };
  addLeg(-1);
  addLeg(1);
  model.traverse((object) => object.layers.set(ASTRONAUT_LAYER));
  const modelBounds = new THREE.Box3().setFromObject(model);
  const modelCenter = modelBounds.getCenter(new THREE.Vector3());
  const modelSize = modelBounds.getSize(new THREE.Vector3());
  const modelHeight = Math.max(modelSize.y, 1);
  const modelAspect = Math.max(.1, modelSize.x / modelHeight);
  model.position.set(-modelCenter.x, -modelCenter.y, -modelCenter.z);
  target.style.setProperty("--site-footer-astronaut-aspect", Math.max(.62, modelAspect * 1.08).toFixed(4));
  const modelPivot = new THREE.Group();
  modelPivot.add(model);
  const floatingRoot = new THREE.Group();
  floatingRoot.layers.set(ASTRONAUT_LAYER);
  floatingRoot.add(modelPivot);
  scene.add(floatingRoot);
  camera.layers.enable(ASTRONAUT_LAYER);
  const keyLight = new THREE.DirectionalLight(16777215, 1.6);
  keyLight.layers.set(ASTRONAUT_LAYER);
  keyLight.position.set(-360, 460, 520);
  const fillLight = new THREE.DirectionalLight(16777215, .52);
  fillLight.layers.set(ASTRONAUT_LAYER);
  fillLight.position.set(420, -180, 360);
  const rimLight = new THREE.DirectionalLight(16777215, 1.18);
  rimLight.layers.set(ASTRONAUT_LAYER);
  rimLight.position.set(280, 260, -520);
  scene.add(keyLight, fillLight, rimLight);
  let disposed = false;
  let reducedMotion = false;
  let elapsed = 0;
  let anchorX = 0;
  let anchorY = 0;
  let currentX = 0;
  let currentY = 0;
  let currentWorldWidth = 1;
  let targetHalfWidth = 1;
  let horizontalSpeed = 46;
  let floatY = 8;
  let targetTranslateX = 0;
  let targetTranslateY = 0;
  let hasLayout = false;
  let colliderHalfHeight = 1;
  let colliderHalfWidth = 1;
  let hoverActive = false;
  let hoverInfluence = 0;
  let hoverSwayAmplitude = 3;
  let velocityX = -horizontalSpeed;
  let velocityY = 0;
  const baseRotationX = -.045;
  const baseRotationY = -.08;
  const baseRotationZ = -.025;
  let rotationX = baseRotationX;
  let rotationY = baseRotationY;
  let rotationZ = baseRotationZ;
  let angularVelocityX = .01;
  let angularVelocityY = -.012;
  let angularVelocityZ = .014;
  const applyPose = () => {
    const hoverOffsetX = reducedMotion ? 0 : Math.sin(elapsed * 2.35 + .25) * hoverSwayAmplitude * hoverInfluence;
    floatingRoot.position.set(currentX + hoverOffsetX, currentY, 28);
    floatingRoot.rotation.set(rotationX, rotationY, rotationZ);
    targetTranslateX = currentX - anchorX;
    targetTranslateY = -(currentY - anchorY);
    target.style.setProperty("--site-footer-astronaut-x", `${targetTranslateX.toFixed(2)}px`);
    target.style.setProperty("--site-footer-astronaut-y", `${targetTranslateY.toFixed(2)}px`);
  };
  const updateWave = () => {
    const wave = reducedMotion ? 0 : Math.sin(elapsed * 1.08 + .4);
    const secondaryWave = reducedMotion ? 0 : Math.sin(elapsed * 1.08 - .35);
    waveArm.rotation.z = 2.5 + wave * .05;
    waveArm.rotation.x = secondaryWave * .02;
    waveForearm.rotation.z = .64 + secondaryWave * .09;
    waveForearm.rotation.y = wave * .025;
    wavingHand.rotation.y = wave * .035;
    wavingHand.rotation.z = secondaryWave * .12;
  };
  const setReducedMotion = (reduced) => {
    reducedMotion = reduced;
    updateWave();
    applyPose();
  };
  const resize = ({ bodyHeight, driftSpeed, footerBounds, targetBounds, worldWidth }) => {
    if (disposed) return;
    const targetCenterX = (targetBounds.left + targetBounds.right) * .5 - footerBounds.left;
    const targetCenterY = (targetBounds.top + targetBounds.bottom) * .5 - footerBounds.top;
    anchorX = targetCenterX - worldWidth * .5 - targetTranslateX;
    anchorY = footerBounds.height * .5 - targetCenterY + targetTranslateY;
    horizontalSpeed = Math.max(1, driftSpeed);
    if (!hasLayout) {
      currentX = worldWidth * .24;
      currentY = anchorY;
      velocityX = -horizontalSpeed;
      hasLayout = true;
    } else if (currentWorldWidth > 1) currentX *= worldWidth / currentWorldWidth;
    currentWorldWidth = worldWidth;
    targetHalfWidth = Math.max(1, targetBounds.width * .5);
    const targetHeight = Math.max(1, bodyHeight * 1.04);
    modelPivot.scale.setScalar(targetHeight / modelHeight);
    colliderHalfWidth = Math.max(1, targetHeight * modelAspect * .52);
    colliderHalfHeight = Math.max(1, targetHeight * .5);
    floatY = Math.max(5, targetHeight * .07);
    hoverSwayAmplitude = Math.max(2, targetHeight * .018);
    applyPose();
  };
  const update = (delta) => {
    if (disposed || reducedMotion || !hasLayout) return;
    const safeDelta = Math.min(.05, Math.max(0, delta));
    elapsed += safeDelta;
    const driftBlend = 1 - Math.exp(-1.6 * safeDelta);
    const floatDamping = Math.exp(-2.2 * safeDelta);
    const spinBlend = 1 - Math.exp(-2.4 * safeDelta);
    const hoverBlend = 1 - Math.exp(-(hoverActive ? 5.2 : 7.5) * safeDelta);
    hoverInfluence = lerp$1(hoverInfluence, hoverActive ? 1 : 0, hoverBlend);
    const targetY = anchorY + Math.sin(elapsed * .58 + .8) * floatY;
    velocityX = lerp$1(velocityX, -horizontalSpeed, driftBlend);
    velocityY += (targetY - currentY) * 2.4 * safeDelta;
    velocityY *= floatDamping;
    angularVelocityX = lerp$1(angularVelocityX, (baseRotationX - rotationX) * .55, spinBlend);
    angularVelocityY = lerp$1(angularVelocityY, (baseRotationY - rotationY) * .55, spinBlend);
    angularVelocityZ = lerp$1(angularVelocityZ, (baseRotationZ - rotationZ) * .55 + Math.sin(elapsed * .28) * .012, spinBlend);
    velocityX = clamp$1(velocityX, -620, 620);
    velocityY = clamp$1(velocityY, -620, 620);
    angularVelocityX = clamp$1(angularVelocityX, -.11, .11);
    angularVelocityY = clamp$1(angularVelocityY, -.11, .11);
    angularVelocityZ = clamp$1(angularVelocityZ, -.11, .11);
    currentX += velocityX * safeDelta;
    currentY += velocityY * safeDelta;
    rotationX += angularVelocityX * safeDelta;
    rotationY += angularVelocityY * safeDelta;
    rotationZ += angularVelocityZ * safeDelta;
    rotationX = clamp$1(rotationX, baseRotationX - .1, .05500000000000001);
    rotationY = clamp$1(rotationY, baseRotationY - .12, .039999999999999994);
    rotationZ = clamp$1(rotationZ, baseRotationZ - .1, .07500000000000001);
    const leftWrapEdge = -currentWorldWidth * .5 + targetHalfWidth * .18;
    if (currentX < leftWrapEdge) {
      currentX = currentWorldWidth * .5 - targetHalfWidth * .32;
      velocityX = -horizontalSpeed;
    }
    updateWave();
    applyPose();
  };
  const handlePointerEnter = () => {
    hoverActive = true;
  };
  const handlePointerLeave = () => {
    hoverActive = false;
  };
  target.addEventListener("pointerenter", handlePointerEnter);
  target.addEventListener("pointerleave", handlePointerLeave);
  const applyImpulse = (impulse) => {
    if (disposed || reducedMotion || !hasLayout) return;
    currentX += impulse.positionX ?? 0;
    currentY += impulse.positionY ?? 0;
    velocityX += impulse.velocityX ?? 0;
    velocityY += impulse.velocityY ?? 0;
    angularVelocityX += (impulse.angularVelocityX ?? 0) * .08;
    angularVelocityY += (impulse.angularVelocityY ?? 0) * .08;
    angularVelocityZ += (impulse.angularVelocityZ ?? 0) * .08;
    applyPose();
  };
  const getCollider = () => {
    if (disposed || !hasLayout) return null;
    return {
      halfHeight: colliderHalfHeight,
      halfWidth: colliderHalfWidth,
      velocityX: reducedMotion ? 0 : velocityX,
      velocityY: reducedMotion ? 0 : velocityY,
      x: currentX,
      y: currentY
    };
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    target.removeEventListener("pointerenter", handlePointerEnter);
    target.removeEventListener("pointerleave", handlePointerLeave);
    scene.remove(floatingRoot, keyLight, fillLight, rimLight);
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    target.style.removeProperty("--site-footer-astronaut-x");
    target.style.removeProperty("--site-footer-astronaut-y");
    target.style.removeProperty("--site-footer-astronaut-size");
    target.style.removeProperty("--site-footer-astronaut-aspect");
  };
  updateWave();
  return {
    applyImpulse,
    dispose,
    getCollider,
    resize,
    setReducedMotion,
    update
  };
};
//#endregion
//#region resources/ts/site-footer-glyphs.ts
var SITE_FOOTER_GLYPHS = [{"key": "c0", "width": 714, "height": 758, "parts": [{"height": 758, "y": 0, "path": "M369 0C107 0 0 164 0 384C0 638 129 758 364 758C569 758 693 669 712 472H492C477 537 435 564 370 564C301 564 230 529 230 373C230 244 285 194 371 194C429 194 479 222 494 286H714C698 112 596 0 369 0Z"}]}, {"key": "r1", "width": 665, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M665 721 637 688C628 645 622 605 615 529C609 461 574 421 514 398C592 368 641 311 641 213C641 62 527 16 432 5C395 1 367 0 324 0H0V730H224V505H302C368 505 382 520 388 579C395 641 398 681 403 730H665ZM224 325V180H324C381 180 411 203 411 254C411 301 381 325 324 325Z"}]}, {"key": "e2", "width": 569, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M563 0H0V730H569V540H224V449H541V279H224V190H563Z"}]}, {"key": "a3", "width": 768, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M537 0H237L0 730H231L268 616H497L532 730H768ZM305 446 386 196 464 446Z"}]}, {"key": "t4", "width": 648, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M648 0H0V190H212V730H436V190H648Z"}]}, {"key": "i5", "width": 224, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M224 0H0V730H224Z"}]}, {"key": "v6", "width": 794, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M794 0H553L404 503L256 0H0L259 730H535Z"}]}, {"key": "e7", "width": 569, "height": 730, "parts": [{"height": 730, "y": 0, "path": "M563 0H0V730H569V540H224V449H541V279H224V190H563Z"}]}];
//#endregion
//#region resources/ts/site-footer-physics.ts
var FOOTER_SELECTOR = ".site-footer";
var SLOT_SELECTOR = "[data-site-footer-object-slot]";
var STAGE_SELECTOR = ".site-footer__stage";
var BAR_SELECTOR = ".site-footer__bar";
var ASTRONAUT_SELECTOR = "[data-site-footer-astronaut]";
var FIXED_STEP = 1 / 60;
var MAX_FRAME_DELTA = .05;
var BODY_SOLVER_ITERATIONS = 3;
var BODY_POSITION_CORRECTION = .4;
var BODY_COLLIDER_DIAGONAL_RATIO = .3;
var FLOOR_INSET = 2;
var POINTER_SURFACE_MARGIN_RATIO = .38;
var POINTER_PUSH_ACCELERATION = 1550;
var POINTER_VELOCITY_TRANSFER = 4.2;
var POINTER_SWEEP_VELOCITY_TRANSFER = .2;
var POINTER_TANGENTIAL_SPIN = 1.5;
var POINTER_TILT_SPIN = .3;
var FLOAT_STIFFNESS = 2.4;
var WRAP_ENTRY_INSET = 8;
var MAX_LINEAR_SPEED = 620;
var MAX_DEPTH_SPEED = 420;
var MAX_ANGULAR_SPEED = 2.8;
var MAX_GLYPH_DIAGONAL_RATIO = Math.max(...SITE_FOOTER_GLYPHS.map((glyph) => Math.hypot(glyph.width / glyph.height, 1)));
var activeCleanup = null;
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var dot = (left, right) => left.x * right.x + left.y * right.y;
var lerp = (from, to, amount) => from + (to - from) * amount;
var seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = Math.imul(state, 1664525) + 1013904223 >>> 0;
    return state / 4294967296;
  };
};
var bodyHeightForWidth = (width) => {
  return Math.min(width <= 560 ? 64 : width <= 959 ? 140 : 190, width * .88 / MAX_GLYPH_DIAGONAL_RATIO);
};
var astronautHeightForWidth = (width) => {
  if (width <= 560) return 82;
  if (width <= 959) return 140;
  return 190;
};
var activeBodyCountForWidth = (width) => {
  if (width <= 560) return Math.round(SITE_FOOTER_GLYPHS.length * 1.5);
  if (width <= 959) return Math.round(SITE_FOOTER_GLYPHS.length * 1.5);
  return SITE_FOOTER_GLYPHS.length * 2;
};
var driftSpeedForWidth = (width) => {
  if (width <= 560) return 24;
  if (width <= 959) return 34;
  return 46;
};
var axesFor = (body) => {
  const cosine = Math.cos(body.angle);
  const sine = Math.sin(body.angle);
  return [{
    x: cosine,
    y: sine
  }, {
    x: -sine,
    y: cosine
  }];
};
var pointerContactForBody = (body, pointerX, pointerY) => {
  const [axisX, axisY] = axesFor(body);
  const fromBody = {
    x: pointerX - body.x,
    y: pointerY - body.y
  };
  const localX = dot(fromBody, axisX);
  const localY = dot(fromBody, axisY);
  const closestX = clamp(localX, -body.visualHalfWidth, body.visualHalfWidth);
  const closestY = clamp(localY, -body.visualHalfHeight, body.visualHalfHeight);
  const closestPoint = {
    x: body.x + axisX.x * closestX + axisY.x * closestY,
    y: body.y + axisX.y * closestX + axisY.y * closestY
  };
  const fromPointer = {
    x: closestPoint.x - pointerX,
    y: closestPoint.y - pointerY
  };
  const distance = Math.hypot(fromPointer.x, fromPointer.y);
  if (distance > .001) return {
    direction: {
      x: fromPointer.x / distance,
      y: fromPointer.y / distance
    },
    distance
  };
  const towardCenter = {
    x: body.x - pointerX,
    y: body.y - pointerY
  };
  const centerDistance = Math.hypot(towardCenter.x, towardCenter.y);
  return {
    direction: centerDistance > .001 ? {
      x: towardCenter.x / centerDistance,
      y: towardCenter.y / centerDistance
    } : {
      x: 0,
      y: 1
    },
    distance: 0
  };
};
var pointerContactForAstronaut = (collider, pointerX, pointerY) => {
  const closestX = clamp(pointerX, collider.x - collider.halfWidth, collider.x + collider.halfWidth);
  const closestY = clamp(pointerY, collider.y - collider.halfHeight, collider.y + collider.halfHeight);
  const fromPointerX = closestX - pointerX;
  const fromPointerY = closestY - pointerY;
  const distance = Math.hypot(fromPointerX, fromPointerY);
  if (distance > .001) return {
    direction: {
      x: fromPointerX / distance,
      y: fromPointerY / distance
    },
    distance
  };
  const centerX = collider.x - pointerX;
  const centerY = collider.y - pointerY;
  const centerDistance = Math.max(Math.hypot(centerX, centerY), .001);
  return {
    direction: {
      x: centerX / centerDistance,
      y: centerY / centerDistance
    },
    distance: 0
  };
};
var updateProjectedExtents = (body) => {
  const cosineX = Math.cos(body.rotationX);
  const sineX = Math.sin(body.rotationX);
  const cosineY = Math.cos(body.rotationY);
  const sineY = Math.sin(body.rotationY);
  const cosineZ = Math.cos(body.angle);
  const sineZ = Math.sin(body.angle);
  const projectedHalfWidth = body.baseVisualHalfWidth * Math.abs(cosineY) + body.visualDepthHalf * Math.abs(sineY);
  const projectedHalfHeight = body.baseVisualHalfHeight * Math.abs(cosineX) + body.visualDepthHalf * Math.abs(sineX);
  const matrixXx = cosineY * cosineZ;
  const matrixXy = -cosineY * sineZ;
  const matrixXz = sineY;
  const matrixYx = cosineX * sineZ + sineX * cosineZ * sineY;
  const matrixYy = cosineX * cosineZ - sineX * sineZ * sineY;
  const matrixYz = -sineX * cosineY;
  body.visualHalfWidth = Math.max(body.visualDepthHalf, projectedHalfWidth);
  body.visualHalfHeight = Math.max(body.visualDepthHalf, projectedHalfHeight);
  body.boundaryHalfWidth = Math.abs(matrixXx) * body.baseVisualHalfWidth + Math.abs(matrixXy) * body.baseVisualHalfHeight + Math.abs(matrixXz) * body.visualDepthHalf;
  body.boundaryHalfHeight = Math.abs(matrixYx) * body.baseVisualHalfWidth + Math.abs(matrixYy) * body.baseVisualHalfHeight + Math.abs(matrixYz) * body.visualDepthHalf;
};
var resetInterpolation = (body) => {
  body.previousX = body.x;
  body.previousY = body.y;
  body.previousZ = body.z;
  body.previousAngle = body.angle;
  body.previousRotationX = body.rotationX;
  body.previousRotationY = body.rotationY;
};
var pathToShape = (THREE, path) => {
  const tokens = path.match(/[MLHVCZmlhvcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const subPaths = [];
  let current = null;
  let index = 0;
  let x = 0;
  let y = 0;
  let command = "";
  const read = () => Number.parseFloat(tokens[index++] ?? "0");
  while (index < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[index] ?? "")) command = tokens[index++] ?? "";
    switch (command) {
      case "M":
        x = read();
        y = read();
        current = new THREE.Path();
        current.moveTo(x, -y);
        subPaths.push(current);
        command = "L";
        break;
      case "L":
        x = read();
        y = read();
        current?.lineTo(x, -y);
        break;
      case "H":
        x = read();
        current?.lineTo(x, -y);
        break;
      case "V":
        y = read();
        current?.lineTo(x, -y);
        break;
      case "C": {
        const control1X = read();
        const control1Y = read();
        const control2X = read();
        const control2Y = read();
        x = read();
        y = read();
        current?.bezierCurveTo(control1X, -control1Y, control2X, -control2Y, x, -y);
        break;
      }
      case "Z":
      case "z":
        current?.closePath();
        command = "";
        break;
      default: index += 1;
    }
  }
  if (subPaths.length === 0) return new THREE.Shape();
  const getArea = (candidate) => {
    const points = candidate.getPoints(24);
    return Math.abs(points.reduce((area, point, pointIndex) => {
      const next = points[(pointIndex + 1) % points.length] ?? point;
      return area + point.x * next.y - next.x * point.y;
    }, 0) * .5);
  };
  let outerIndex = 0;
  for (let candidateIndex = 1; candidateIndex < subPaths.length; candidateIndex += 1) if (getArea(subPaths[candidateIndex]) > getArea(subPaths[outerIndex])) outerIndex = candidateIndex;
  const shape = new THREE.Shape(subPaths[outerIndex].getPoints(40));
  subPaths.forEach((subPath, subPathIndex) => {
    if (subPathIndex !== outerIndex) shape.holes.push(subPath);
  });
  return shape;
};
var buildGlyphTemplate = (THREE, glyph, material, geometries) => {
  const group = new THREE.Group();
  const sourceSize = Math.max(glyph.width, glyph.height);
  const depth = sourceSize * .18;
  const bevel = sourceSize * .035;
  glyph.parts.forEach((part) => {
    const geometry = new THREE.ExtrudeGeometry(pathToShape(THREE, part.path), {
      depth,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: bevel * .8,
      bevelSize: bevel,
      bevelOffset: -bevel,
      bevelSegments: 3
    });
    geometry.translate(-glyph.width * .5, part.height + part.y - glyph.height * .5, -depth * .5);
    geometry.computeVertexNormals();
    geometries.add(geometry);
    group.add(new THREE.Mesh(geometry, material));
  });
  return group;
};
var destroySiteFooterPhysics = () => {
  const cleanup = activeCleanup;
  activeCleanup = null;
  cleanup?.();
};
var initializeSiteFooterPhysics = () => {
  destroySiteFooterPhysics();
  const footer = document.querySelector(FOOTER_SELECTOR);
  const slot = footer?.querySelector(SLOT_SELECTOR);
  const stage = footer?.querySelector(STAGE_SELECTOR);
  const bar = footer?.querySelector(BAR_SELECTOR);
  const astronautTarget = footer?.querySelector(ASTRONAUT_SELECTOR);
  if (!footer || !slot || !stage || !bar || footer.dataset.siteFooterPhysicsInitialized === "true") return;
  footer.dataset.siteFooterPhysicsInitialized = "true";
  footer.dataset.siteFooterPhysicsState = "idle";
  const canvas = document.createElement("canvas");
  canvas.className = "site-footer__physics-canvas";
  canvas.dataset.siteFooterPhysicsCanvas = "true";
  canvas.dataset.siteFooterPhysicsMode = "drift";
  canvas.setAttribute("aria-hidden", "true");
  canvas.hidden = true;
  slot.append(canvas);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let destroyed = false;
  let triggered = false;
  let footerVisible = false;
  let initialized = false;
  let initializing = false;
  let started = false;
  let contextLost = false;
  let frameId = null;
  let resizeFrameId = null;
  let previousFrameTime = performance.now();
  let accumulator = 0;
  let simulationElapsed = 0;
  let worldWidth = 1;
  let worldHeight = 1;
  let footerBodyHeight = 1;
  let flowCenterX = 0;
  let flowCenterY = 0;
  let flowHalfHeight = 1;
  let floorY = -.5;
  let pointerInside = false;
  let hasPointerPosition = false;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerWorldX = 0;
  let pointerWorldY = 0;
  let pointerVelocityX = 0;
  let pointerVelocityY = 0;
  let renderer = null;
  let scene = null;
  let camera = null;
  let sharedMaterial = null;
  let environmentRenderTarget = null;
  let astronautController = null;
  let resizeObserver = null;
  const bodies = [];
  const geometries = /* @__PURE__ */ new Set();
  const setState = (state) => {
    footer.dataset.siteFooterPhysicsState = state;
  };
  const syncMeshes = (interpolation = 1) => {
    const amount = clamp(interpolation, 0, 1);
    bodies.forEach((body) => {
      body.mesh.visible = body.active;
      body.mesh.position.set(lerp(body.previousX, body.x, amount), lerp(body.previousY, body.y, amount), lerp(body.previousZ, body.z, amount));
      body.mesh.rotation.set(lerp(body.previousRotationX, body.rotationX, amount), lerp(body.previousRotationY, body.rotationY, amount), lerp(body.previousAngle, body.angle, amount));
    });
  };
  const render = (interpolation = 1) => {
    if (destroyed || !renderer || !scene || !camera || contextLost || !footerVisible || document.hidden) return;
    syncMeshes(interpolation);
    renderer.render(scene, camera);
  };
  const syncAstronautLayout = () => {
    if (!astronautController || !astronautTarget) return;
    const astronautBodyHeight = astronautHeightForWidth(worldWidth);
    astronautTarget.style.setProperty("--site-footer-astronaut-size", `${Math.max(1, astronautBodyHeight * 1.04).toFixed(2)}px`);
    astronautController.resize({
      bodyHeight: astronautBodyHeight,
      driftSpeed: driftSpeedForWidth(worldWidth),
      footerBounds: footer.getBoundingClientRect(),
      targetBounds: astronautTarget.getBoundingClientRect(),
      worldHeight,
      worldWidth
    });
  };
  const wakeBody = (body) => {
    body.sleeping = false;
    body.settledFrames = 0;
  };
  const wakeAllBodies = () => {
    bodies.forEach(wakeBody);
  };
  const resolveAstronautCollision = (body, collider) => {
    const differenceX = body.x - collider.x;
    const differenceY = body.y - collider.y;
    const radiusPadding = body.collisionRadius * 1.18;
    const radiusX = collider.halfWidth + radiusPadding;
    const radiusY = collider.halfHeight + radiusPadding;
    const normalizedX = differenceX / Math.max(radiusX, 1);
    const normalizedY = differenceY / Math.max(radiusY, 1);
    const normalizedDistance = Math.hypot(normalizedX, normalizedY);
    if (normalizedDistance >= 1) return;
    let normalX = differenceX / Math.max(radiusX * radiusX, 1);
    let normalY = differenceY / Math.max(radiusY * radiusY, 1);
    const normalLength = Math.hypot(normalX, normalY);
    if (normalLength < 1e-4) {
      normalX = 0;
      normalY = body.y >= collider.y ? 1 : -1;
    } else {
      normalX /= normalLength;
      normalY /= normalLength;
    }
    const correction = (1 - normalizedDistance) * Math.min(radiusX, radiusY) * BODY_POSITION_CORRECTION * .5;
    body.x += normalX * correction;
    body.y += normalY * correction;
    astronautController?.applyImpulse({
      positionX: -normalX * correction,
      positionY: -normalY * correction
    });
    const relativeVelocityX = body.velocityX - collider.velocityX;
    const relativeVelocityY = body.velocityY - collider.velocityY;
    const inwardVelocity = relativeVelocityX * normalX + relativeVelocityY * normalY;
    if (inwardVelocity < 0) {
      const impulse = -(1.04 * inwardVelocity) * .5;
      body.velocityX += normalX * impulse;
      body.velocityY += normalY * impulse;
      astronautController?.applyImpulse({
        velocityX: -normalX * impulse,
        velocityY: -normalY * impulse
      });
    }
    const torque = (normalX * relativeVelocityY - normalY * relativeVelocityX) * .0012;
    body.angularVelocity += torque;
    astronautController?.applyImpulse({ angularVelocityZ: -torque });
    wakeBody(body);
  };
  const clampBodyToFloor = (body, respondToImpact) => {
    const bottom = body.y - body.boundaryHalfHeight;
    if (bottom >= floorY) return;
    body.y += floorY - bottom;
    if (!respondToImpact) return;
    if (body.velocityY < 0) body.velocityY = -body.velocityY * .04;
    body.velocityX *= .96;
    body.velocityZ *= .96;
    body.angularVelocity *= .9;
    body.angularVelocityX *= .9;
    body.angularVelocityY *= .9;
  };
  const wrapBodyHorizontally = (body) => {
    const leftEdge = -worldWidth * .5;
    const rightEdge = worldWidth * .5;
    if (body.x + body.boundaryHalfWidth < leftEdge) {
      body.x = rightEdge + body.boundaryHalfWidth - WRAP_ENTRY_INSET;
      body.velocityX = -body.driftSpeed;
      resetInterpolation(body);
    } else if (body.x - body.boundaryHalfWidth > rightEdge) {
      body.x = leftEdge - body.boundaryHalfWidth + WRAP_ENTRY_INSET;
      body.velocityX = -body.driftSpeed;
      resetInterpolation(body);
    }
  };
  const resolveBodyCollision = (left, right) => {
    const differenceX = right.x - left.x;
    const differenceY = right.y - left.y;
    const minimumDistance = left.collisionRadius + right.collisionRadius;
    const distanceSquared = differenceX * differenceX + differenceY * differenceY;
    if (distanceSquared >= minimumDistance * minimumDistance) return;
    if (left.sleeping && right.sleeping) return;
    const distance = Math.max(Math.sqrt(distanceSquared), .001);
    const normalX = differenceX / distance;
    const normalY = differenceY / distance;
    const normalZ = 0;
    const penetration = minimumDistance - distance;
    wakeBody(left);
    wakeBody(right);
    const correction = penetration * BODY_POSITION_CORRECTION * .5;
    left.x -= normalX * correction;
    left.y -= normalY * correction;
    right.x += normalX * correction;
    right.y += normalY * correction;
    const relativeX = right.velocityX - left.velocityX;
    const relativeY = right.velocityY - left.velocityY;
    const relativeZ = right.velocityZ - left.velocityZ;
    const normalSpeed = relativeX * normalX + relativeY * normalY + relativeZ * normalZ;
    if (normalSpeed >= 0) return;
    const impulse = -(1.04 * normalSpeed) * .5;
    left.velocityX -= normalX * impulse;
    left.velocityY -= normalY * impulse;
    left.velocityZ -= normalZ * impulse;
    right.velocityX += normalX * impulse;
    right.velocityY += normalY * impulse;
    right.velocityZ += normalZ * impulse;
    const torqueScale = .12 / Math.max(minimumDistance, 1);
    const torqueX = normalY * relativeZ - normalZ * relativeY;
    const torqueY = normalZ * relativeX - normalX * relativeZ;
    const torqueZ = normalX * relativeY - normalY * relativeX;
    left.angularVelocityX -= torqueX * torqueScale;
    left.angularVelocityY -= torqueY * torqueScale;
    left.angularVelocity -= torqueZ * torqueScale;
    right.angularVelocityX += torqueX * torqueScale;
    right.angularVelocityY += torqueY * torqueScale;
    right.angularVelocity += torqueZ * torqueScale;
  };
  const applyPointerRepulsor = (body, timeStep, previousPointerX, previousPointerY) => {
    if (!pointerInside || !hasPointerPosition) {
      body.pointerInfluence *= Math.exp(-6 * timeStep);
      if (body.pointerInfluence < .001) body.pointerInfluence = 0;
      return false;
    }
    let interactionPointerX = pointerWorldX;
    let interactionPointerY = pointerWorldY;
    let contact = pointerContactForBody(body, interactionPointerX, interactionPointerY);
    let sweptInteraction = false;
    const pointerTravelX = pointerWorldX - previousPointerX;
    const pointerTravelY = pointerWorldY - previousPointerY;
    const pointerTravelSquared = pointerTravelX * pointerTravelX + pointerTravelY * pointerTravelY;
    if (pointerTravelSquared > 1) {
      const sweepProgress = clamp(((body.x - previousPointerX) * pointerTravelX + (body.y - previousPointerY) * pointerTravelY) / pointerTravelSquared, 0, 1);
      const sweepPointerX = previousPointerX + pointerTravelX * sweepProgress;
      const sweepPointerY = previousPointerY + pointerTravelY * sweepProgress;
      const sweepContact = pointerContactForBody(body, sweepPointerX, sweepPointerY);
      if (sweepContact.distance < contact.distance) {
        interactionPointerX = sweepPointerX;
        interactionPointerY = sweepPointerY;
        contact = sweepContact;
        sweptInteraction = true;
      }
    }
    const surfaceMargin = Math.max(28, footerBodyHeight * POINTER_SURFACE_MARGIN_RATIO);
    if (contact.distance >= surfaceMargin) {
      body.pointerInfluence *= Math.exp(-6 * timeStep);
      if (body.pointerInfluence < .001) body.pointerInfluence = 0;
      return false;
    }
    let directionX = contact.direction.x;
    let directionY = contact.direction.y;
    if (body.y - body.boundaryHalfHeight <= floorY + FLOOR_INSET + 1 && directionY < 0) {
      directionX = Math.sign(body.x - interactionPointerX) || Math.sign(pointerVelocityX) || -1;
      directionY = 0;
    }
    const falloff = 1 - contact.distance / surfaceMargin;
    const targetInfluence = falloff * falloff * (3 - 2 * falloff);
    const forceBlend = 1 - Math.exp(-24 * timeStep);
    const directionBlend = 1 - Math.exp(-12 * timeStep);
    if (body.pointerInfluence <= .001) {
      body.pointerDirectionX = directionX;
      body.pointerDirectionY = directionY;
    } else {
      body.pointerDirectionX = lerp(body.pointerDirectionX, directionX, directionBlend);
      body.pointerDirectionY = lerp(body.pointerDirectionY, directionY, directionBlend);
      const directionLength = Math.max(Math.hypot(body.pointerDirectionX, body.pointerDirectionY), .001);
      body.pointerDirectionX /= directionLength;
      body.pointerDirectionY /= directionLength;
    }
    body.pointerInfluence = lerp(body.pointerInfluence, targetInfluence, forceBlend);
    directionX = body.pointerDirectionX;
    directionY = body.pointerDirectionY;
    const depthInfluence = clamp(1 - Math.abs(body.z) / Math.max(footerBodyHeight * 1.6, 1), .55, 1);
    const pushAcceleration = POINTER_PUSH_ACCELERATION * body.pointerInfluence * depthInfluence;
    const velocityTransfer = Math.max(0, pointerVelocityX * directionX + pointerVelocityY * directionY) * POINTER_VELOCITY_TRANSFER * body.pointerInfluence * depthInfluence;
    body.velocityX += directionX * (pushAcceleration + velocityTransfer) * timeStep;
    body.velocityY += directionY * (pushAcceleration + velocityTransfer) * timeStep;
    if (sweptInteraction) {
      const sweepTransfer = POINTER_SWEEP_VELOCITY_TRANSFER * targetInfluence * depthInfluence;
      body.velocityX += pointerVelocityX * sweepTransfer;
      body.velocityY += pointerVelocityY * sweepTransfer;
    }
    const tangentialPointerSpeed = -directionY * pointerVelocityX + directionX * pointerVelocityY;
    const inverseVisualSize = 1 / Math.max(footerBodyHeight, 1);
    body.angularVelocity += tangentialPointerSpeed * inverseVisualSize * POINTER_TANGENTIAL_SPIN * timeStep * body.pointerInfluence;
    body.angularVelocityX -= directionY * pushAcceleration * timeStep * inverseVisualSize * POINTER_TILT_SPIN;
    body.angularVelocityY += directionX * pushAcceleration * timeStep * inverseVisualSize * POINTER_TILT_SPIN;
    body.pointerAffected = true;
    wakeBody(body);
    body.velocityX = clamp(body.velocityX, -620, MAX_LINEAR_SPEED);
    body.velocityY = clamp(body.velocityY, -620, MAX_LINEAR_SPEED);
    body.velocityZ = clamp(body.velocityZ, -420, MAX_DEPTH_SPEED);
    body.angularVelocity = clamp(body.angularVelocity, -2.8, MAX_ANGULAR_SPEED);
    body.angularVelocityX = clamp(body.angularVelocityX, -2.8, MAX_ANGULAR_SPEED);
    body.angularVelocityY = clamp(body.angularVelocityY, -2.8, MAX_ANGULAR_SPEED);
    return timeStep > 0;
  };
  const stepPhysics = (timeStep) => {
    simulationElapsed += timeStep;
    const previousPointerX = pointerWorldX;
    const previousPointerY = pointerWorldY;
    if (pointerInside && hasPointerPosition) {
      pointerWorldX = pointerTargetX;
      pointerWorldY = pointerTargetY;
      pointerVelocityX = clamp((pointerWorldX - previousPointerX) / timeStep, -620, MAX_LINEAR_SPEED);
      pointerVelocityY = clamp((pointerWorldY - previousPointerY) / timeStep, -620, MAX_LINEAR_SPEED);
    } else {
      pointerVelocityX = 0;
      pointerVelocityY = 0;
    }
    const driftBlend = 1 - Math.exp(-1.6 * timeStep);
    const floatDamping = Math.exp(-2.2 * timeStep);
    const spinBlend = 1 - Math.exp(-.7 * timeStep);
    const laneRange = Math.max(0, flowHalfHeight - footerBodyHeight * .58);
    astronautController?.update(timeStep);
    bodies.forEach((body) => {
      resetInterpolation(body);
      body.pointerAffected = false;
      if (!body.active) return;
      body.sleeping = false;
      const floatProgress = simulationElapsed * body.floatFrequency + body.floatPhase;
      const targetY = flowCenterY + body.laneOffset * laneRange + Math.sin(floatProgress) * body.floatAmplitude;
      const targetZ = body.depthTarget + Math.cos(floatProgress * .73) * body.floatAmplitude * .35;
      body.velocityX = lerp(body.velocityX, -body.driftSpeed, driftBlend);
      body.velocityY += (targetY - body.y) * FLOAT_STIFFNESS * timeStep;
      body.velocityZ += (targetZ - body.z) * FLOAT_STIFFNESS * .7 * timeStep;
      body.velocityY *= floatDamping;
      body.velocityZ *= floatDamping;
      body.angularVelocity = lerp(body.angularVelocity, body.spin, spinBlend);
      body.angularVelocityX = lerp(body.angularVelocityX, body.spinX, spinBlend);
      body.angularVelocityY = lerp(body.angularVelocityY, body.spinY, spinBlend);
      applyPointerRepulsor(body, timeStep, previousPointerX, previousPointerY);
      body.velocityX = clamp(body.velocityX, -620, MAX_LINEAR_SPEED);
      body.velocityY = clamp(body.velocityY, -620, MAX_LINEAR_SPEED);
      body.velocityZ = clamp(body.velocityZ, -420, MAX_DEPTH_SPEED);
      body.angularVelocity = clamp(body.angularVelocity, -2.8, MAX_ANGULAR_SPEED);
      body.angularVelocityX = clamp(body.angularVelocityX, -2.8, MAX_ANGULAR_SPEED);
      body.angularVelocityY = clamp(body.angularVelocityY, -2.8, MAX_ANGULAR_SPEED);
      body.x += body.velocityX * timeStep;
      body.y += body.velocityY * timeStep;
      body.z += body.velocityZ * timeStep;
      body.angle += body.angularVelocity * timeStep;
      body.rotationX += body.angularVelocityX * timeStep;
      body.rotationY += body.angularVelocityY * timeStep;
      updateProjectedExtents(body);
      clampBodyToFloor(body, true);
      wrapBodyHorizontally(body);
    });
    for (let iteration = 0; iteration < BODY_SOLVER_ITERATIONS; iteration += 1) {
      for (let leftIndex = 0; leftIndex < bodies.length; leftIndex += 1) {
        const left = bodies[leftIndex];
        if (!left.active) continue;
        for (let rightIndex = leftIndex + 1; rightIndex < bodies.length; rightIndex += 1) {
          const right = bodies[rightIndex];
          if (!right.active) continue;
          resolveBodyCollision(left, right);
        }
      }
      bodies.forEach((body) => {
        if (body.active) {
          const astronautCollider = astronautController?.getCollider() ?? null;
          if (astronautCollider) resolveAstronautCollision(body, astronautCollider);
          updateProjectedExtents(body);
          clampBodyToFloor(body, false);
        }
      });
    }
    bodies.forEach((body) => {
      if (!body.active) return;
      updateProjectedExtents(body);
      clampBodyToFloor(body, false);
      wrapBodyHorizontally(body);
    });
  };
  const scheduleFrame = () => {
    if (frameId !== null || destroyed || !initialized || !started || !footerVisible || document.hidden || contextLost || reducedMotion.matches) return;
    frameId = window.requestAnimationFrame((time) => {
      frameId = null;
      if (destroyed || !footerVisible || document.hidden || contextLost || reducedMotion.matches) return;
      const frameDelta = Math.min(MAX_FRAME_DELTA, Math.max(0, (time - previousFrameTime) / 1e3));
      previousFrameTime = time;
      accumulator += frameDelta;
      while (accumulator >= FIXED_STEP) {
        stepPhysics(FIXED_STEP);
        accumulator -= FIXED_STEP;
      }
      render(accumulator / FIXED_STEP);
      if (bodies.every((body) => body.active) && bodies.every((body) => body.sleeping)) {
        setState("settled");
        if (!astronautController) {
          render(1);
          return;
        }
      }
      scheduleFrame();
    });
  };
  const settleStaticComposition = () => {
    pointerInside = false;
    hasPointerPosition = false;
    simulationElapsed = Number.POSITIVE_INFINITY;
    const activeBodyCount = activeBodyCountForWidth(worldWidth);
    bodies.forEach((body, bodyIndex) => {
      body.active = bodyIndex < activeBodyCount;
      body.sleeping = true;
      body.mesh.visible = body.active;
      body.velocityX = 0;
      body.velocityY = 0;
      body.velocityZ = 0;
      body.angularVelocity = 0;
      body.angularVelocityX = 0;
      body.angularVelocityY = 0;
      resetInterpolation(body);
    });
    setState("static");
    render(1);
  };
  const startSimulation = () => {
    if (!initialized || started || !triggered) return;
    started = true;
    previousFrameTime = performance.now();
    if (reducedMotion.matches) {
      settleStaticComposition();
      return;
    }
    setState("floating");
    scheduleFrame();
  };
  const scaleBodies = (ratio) => {
    if (!Number.isFinite(ratio) || Math.abs(ratio - 1) < .001) return;
    bodies.forEach((body) => {
      body.mesh.scale.multiplyScalar(ratio);
      body.baseVisualHalfWidth *= ratio;
      body.baseVisualHalfHeight *= ratio;
      body.visualDepthHalf *= ratio;
      body.visualHalfWidth *= ratio;
      body.visualHalfHeight *= ratio;
      body.boundaryHalfWidth *= ratio;
      body.boundaryHalfHeight *= ratio;
      body.collisionRadius *= ratio;
      body.z *= ratio;
      body.depthTarget *= ratio;
      body.floatAmplitude *= ratio;
      body.velocityX *= ratio;
      body.velocityY *= ratio;
      body.velocityZ *= ratio;
      updateProjectedExtents(body);
      wakeBody(body);
      resetInterpolation(body);
    });
  };
  const resizeWorld = () => {
    resizeFrameId = null;
    if (destroyed || !renderer || !camera || !footerVisible || document.hidden) return;
    const bounds = footer.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(bounds.width));
    const nextHeight = Math.max(1, Math.round(footer.offsetHeight));
    const previousWidth = worldWidth;
    const previousHeight = worldHeight;
    const previousFlowX = flowCenterX;
    const previousFlowY = flowCenterY;
    const previousBodyHeight = footerBodyHeight;
    worldWidth = nextWidth;
    worldHeight = nextHeight;
    const stageBounds = stage.getBoundingClientRect();
    const stageCenterX = (stageBounds.left + stageBounds.right) * .5 - bounds.left;
    const stageCenterY = (stageBounds.top + stageBounds.bottom) * .5 - bounds.top;
    flowCenterX = stageCenterX - worldWidth * .5;
    flowCenterY = worldHeight * .5 - stageCenterY;
    flowHalfHeight = Math.max(1, stageBounds.height * .5);
    const barTop = clamp(bar.getBoundingClientRect().top - bounds.top, 0, worldHeight);
    floorY = worldHeight * .5 - barTop + FLOOR_INSET;
    camera.left = -worldWidth * .5;
    camera.right = worldWidth * .5;
    camera.top = worldHeight * .5;
    camera.bottom = -worldHeight * .5;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, worldWidth <= 560 ? 1.25 : 1.5));
    renderer.setSize(worldWidth, worldHeight, false);
    const nextBodyHeight = bodyHeightForWidth(worldWidth);
    if ((Math.abs(worldWidth - previousWidth) > 1 || Math.abs(worldHeight - previousHeight) > 1 || Math.abs(nextBodyHeight - previousBodyHeight) > .5) && bodies.length > 0 && previousWidth > 1 && previousHeight > 1) {
      const widthRatio = worldWidth / previousWidth;
      const heightRatio = worldHeight / previousHeight;
      const bodyScale = nextBodyHeight / Math.max(previousBodyHeight, 1);
      const driftScale = driftSpeedForWidth(worldWidth) / Math.max(driftSpeedForWidth(previousWidth), 1);
      bodies.forEach((body) => {
        body.x = flowCenterX + (body.x - previousFlowX) * widthRatio;
        body.y = flowCenterY + (body.y - previousFlowY) * heightRatio;
        body.driftSpeed *= driftScale;
      });
      scaleBodies(bodyScale);
      bodies.forEach((body) => {
        updateProjectedExtents(body);
        clampBodyToFloor(body, false);
        wakeBody(body);
        resetInterpolation(body);
      });
    }
    footerBodyHeight = nextBodyHeight;
    const activeBodyCount = activeBodyCountForWidth(worldWidth);
    bodies.forEach((body, bodyIndex) => {
      body.active = bodyIndex < activeBodyCount;
      body.mesh.visible = body.active;
    });
    canvas.dataset.siteFooterPhysicsBodyHeight = footerBodyHeight.toFixed(2);
    canvas.dataset.siteFooterPhysicsBodyCount = activeBodyCount.toString();
    syncAstronautLayout();
    render(1);
    if (started && !reducedMotion.matches) {
      setState("floating");
      previousFrameTime = performance.now();
      scheduleFrame();
    }
  };
  const scheduleResize = () => {
    if (footerVisible && !document.hidden && resizeFrameId === null) resizeFrameId = window.requestAnimationFrame(resizeWorld);
  };
  const createBodies = (THREE, material) => {
    const random = seededRandom(1296124741 + Math.round(worldWidth));
    const bodyCount = SITE_FOOTER_GLYPHS.length * 2;
    const activeBodyCount = activeBodyCountForWidth(worldWidth);
    footerBodyHeight = bodyHeightForWidth(worldWidth);
    const laneRange = Math.max(0, flowHalfHeight - footerBodyHeight * .62);
    const baseDriftSpeed = driftSpeedForWidth(worldWidth);
    const templates = /* @__PURE__ */ new Map();
    const layoutPoints = [];
    const layoutRadii = Array.from({ length: bodyCount }, (_, bodyIndex) => {
      const glyph = SITE_FOOTER_GLYPHS[bodyIndex % SITE_FOOTER_GLYPHS.length];
      const targetWidth = footerBodyHeight * (glyph.width / glyph.height);
      return Math.hypot(targetWidth, footerBodyHeight) * .36;
    });
    const horizontalLimit = Math.max(1, worldWidth * .47 - 8);
    const verticalLimit = Math.max(0, laneRange * .92);
    const horizontalSlotCount = worldWidth <= 560 ? activeBodyCount : clamp(Math.round(worldWidth / Math.max(footerBodyHeight * .72, 1)), 6, bodyCount);
    const horizontalSlotWidth = horizontalLimit * 2 / horizontalSlotCount;
    const horizontalSlotAssignments = Array.from({ length: bodyCount }, (_, bodyIndex) => bodyIndex % horizontalSlotCount);
    if (worldWidth > 560) for (let assignmentIndex = horizontalSlotAssignments.length - 1; assignmentIndex > 0; assignmentIndex -= 1) {
      const swapIndex = Math.floor(random() * (assignmentIndex + 1));
      const currentAssignment = horizontalSlotAssignments[assignmentIndex];
      horizontalSlotAssignments[assignmentIndex] = horizontalSlotAssignments[swapIndex];
      horizontalSlotAssignments[swapIndex] = currentAssignment;
    }
    const horizontalSlotCenters = horizontalSlotAssignments.map((slotIndex) => flowCenterX - horizontalLimit + (slotIndex + .5) * horizontalSlotWidth);
    for (let bodyIndex = 0; bodyIndex < bodyCount; bodyIndex += 1) {
      let selectedPoint = null;
      const slotCenterX = horizontalSlotCenters[bodyIndex] ?? flowCenterX;
      let fallbackPoint = {
        x: slotCenterX,
        y: flowCenterY
      };
      let fallbackClearance = -1;
      const mobileVerticalSlotCount = 6;
      const mobileVerticalSlotHeight = verticalLimit * 2 / mobileVerticalSlotCount;
      const mobileVerticalCenter = flowCenterY - verticalLimit + (bodyIndex % mobileVerticalSlotCount + .5) * mobileVerticalSlotHeight;
      for (let attempt = 0; attempt < 192; attempt += 1) {
        const candidate = {
          x: slotCenterX + (random() - .5) * horizontalSlotWidth * .68,
          y: worldWidth <= 560 && bodyIndex < activeBodyCount ? mobileVerticalCenter + (random() - .5) * mobileVerticalSlotHeight * .5 : flowCenterY + (random() * 2 - 1) * verticalLimit
        };
        const nearestClearance = layoutPoints.length === 0 ? Number.POSITIVE_INFINITY : Math.min(...layoutPoints.map((point, pointIndex) => Math.hypot(candidate.x - point.x, candidate.y - point.y) / Math.max((layoutRadii[bodyIndex] + layoutRadii[pointIndex]) * 1.08, 1)));
        if (nearestClearance > fallbackClearance) {
          fallbackPoint = candidate;
          fallbackClearance = nearestClearance;
        }
        if (nearestClearance >= 1) {
          selectedPoint = candidate;
          break;
        }
      }
      layoutPoints.push(selectedPoint ?? fallbackPoint);
    }
    for (let iteration = 0; iteration < 72; iteration += 1) {
      for (let leftIndex = 0; leftIndex < layoutPoints.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < layoutPoints.length; rightIndex += 1) {
        if (leftIndex >= activeBodyCount || rightIndex >= activeBodyCount) continue;
        const left = layoutPoints[leftIndex];
        const right = layoutPoints[rightIndex];
        const differenceX = right.x - left.x;
        const differenceY = right.y - left.y;
        const distance = Math.max(Math.hypot(differenceX, differenceY), .001);
        const minimumDistance = (layoutRadii[leftIndex] + layoutRadii[rightIndex]) * 1.04;
        if (distance >= minimumDistance) continue;
        const correction = (minimumDistance - distance) * .52;
        const normalX = distance > .01 ? differenceX / distance : Math.cos((leftIndex + 1) * 2.39996);
        const normalY = distance > .01 ? differenceY / distance : Math.sin((leftIndex + 1) * 2.39996);
        left.x -= normalX * correction;
        left.y -= normalY * correction;
        right.x += normalX * correction;
        right.y += normalY * correction;
      }
      layoutPoints.forEach((point, pointIndex) => {
        const slotCenterX = horizontalSlotCenters[pointIndex] ?? flowCenterX;
        point.x = clamp(point.x, slotCenterX - horizontalSlotWidth * .46, slotCenterX + horizontalSlotWidth * .46);
        point.y = clamp(point.y, flowCenterY - verticalLimit, flowCenterY + verticalLimit);
      });
    }
    SITE_FOOTER_GLYPHS.forEach((glyph) => {
      templates.set(glyph.key, buildGlyphTemplate(THREE, glyph, material, geometries));
    });
    for (let bodyIndex = 0; bodyIndex < bodyCount; bodyIndex += 1) {
      const glyph = SITE_FOOTER_GLYPHS[bodyIndex % SITE_FOOTER_GLYPHS.length];
      const template = templates.get(glyph.key);
      if (!template) continue;
      const targetHeight = footerBodyHeight;
      const targetWidth = targetHeight * (glyph.width / glyph.height);
      const baseVisualHalfWidth = targetWidth * .5;
      const baseVisualHalfHeight = targetHeight * .5;
      const visualDepthHalf = targetHeight * (Math.max(glyph.width, glyph.height) / glyph.height) * .12;
      const mesh = template.clone(true);
      mesh.scale.setScalar(targetHeight / glyph.height);
      mesh.visible = true;
      scene?.add(mesh);
      const layoutPoint = layoutPoints[bodyIndex] ?? {
        x: flowCenterX,
        y: flowCenterY
      };
      const laneOffset = laneRange > 0 ? clamp((layoutPoint.y - flowCenterY) / laneRange, -.92, .92) : 0;
      const x = layoutPoint.x;
      const y = layoutPoint.y;
      const depthTarget = (random() - .5) * targetHeight * .72;
      const z = depthTarget;
      const driftSpeed = baseDriftSpeed;
      const floatPhase = random() * Math.PI * 2;
      const floatFrequency = .42 + random() * .32;
      const floatAmplitude = targetHeight * (.055 + random() * .065);
      const angle = -Math.PI + random() * Math.PI * 2;
      const tiltRange = worldWidth <= 560 ? .52 : 1.05;
      const rotationX = -tiltRange + random() * tiltRange * 2;
      const rotationY = -tiltRange + random() * tiltRange * 2;
      const spin = (random() - .5) * .34;
      const tiltSpinRange = worldWidth <= 560 ? .045 : .26;
      const spinX = (random() - .5) * tiltSpinRange;
      const spinY = (random() - .5) * tiltSpinRange;
      const body = {
        mesh,
        baseVisualHalfWidth,
        baseVisualHalfHeight,
        visualDepthHalf,
        visualHalfWidth: baseVisualHalfWidth,
        visualHalfHeight: baseVisualHalfHeight,
        boundaryHalfWidth: baseVisualHalfWidth,
        boundaryHalfHeight: baseVisualHalfHeight,
        collisionRadius: Math.hypot(targetWidth, targetHeight) * BODY_COLLIDER_DIAGONAL_RATIO,
        x,
        y,
        z,
        previousX: x,
        previousY: y,
        previousZ: z,
        velocityX: -driftSpeed,
        velocityY: 0,
        velocityZ: 0,
        angle,
        rotationX,
        rotationY,
        previousAngle: angle,
        previousRotationX: rotationX,
        previousRotationY: rotationY,
        angularVelocity: spin,
        angularVelocityX: spinX,
        angularVelocityY: spinY,
        spin,
        spinX,
        spinY,
        laneOffset,
        depthTarget,
        driftSpeed,
        floatPhase,
        floatFrequency,
        floatAmplitude,
        active: bodyIndex < activeBodyCount,
        sleeping: false,
        pointerAffected: false,
        pointerInfluence: 0,
        pointerDirectionX: 0,
        pointerDirectionY: 1,
        settledFrames: 0
      };
      updateProjectedExtents(body);
      bodies.push(body);
    }
    canvas.dataset.siteFooterPhysicsBodyCount = activeBodyCount.toString();
    canvas.dataset.siteFooterPhysicsBodyHeight = footerBodyHeight.toFixed(2);
  };
  const initializeThree = async () => {
    if (initialized || initializing || destroyed || !footerVisible || document.hidden) return;
    if (!("WebGLRenderingContext" in window)) {
      setState("unavailable");
      return;
    }
    initializing = true;
    try {
      const THREE = await __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url);
      if (!await waitForScrollIdle(() => footerVisible && !document.hidden, () => destroyed || !document.documentElement.contains(footer))) return;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .98;
      renderer.transmissionResolutionScale = .55;
      renderer.setClearColor(0, 0);
      scene = new THREE.Scene();
      scene.background = null;
      camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, .1, 1600);
      camera.position.set(0, 0, 800);
      camera.lookAt(0, 0, 0);
      sharedMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(1118481),
        metalness: .56,
        roughness: .27,
        envMapIntensity: .68
      });
      const environmentWidth = 64;
      const environmentHeight = 256;
      const environmentData = new Float32Array(environmentWidth * environmentHeight * 4);
      const sharedEnvironmentReflection = {
        center: .5,
        width: .5,
        intensity: .72
      };
      const getEnvironmentLuminance = (value) => {
        const distance = Math.abs(value - sharedEnvironmentReflection.center) / sharedEnvironmentReflection.width;
        return distance < 1 ? .06 + sharedEnvironmentReflection.intensity * (1 - distance * distance) : .06;
      };
      for (let environmentY = 0; environmentY < environmentHeight; environmentY += 1) {
        const luminance = getEnvironmentLuminance(1 - environmentY / (environmentHeight - 1));
        for (let environmentX = 0; environmentX < environmentWidth; environmentX += 1) {
          const dataIndex = (environmentY * environmentWidth + environmentX) * 4;
          environmentData[dataIndex] = luminance;
          environmentData[dataIndex + 1] = luminance;
          environmentData[dataIndex + 2] = luminance;
          environmentData[dataIndex + 3] = 1;
        }
      }
      const environmentTexture = new THREE.DataTexture(environmentData, environmentWidth, environmentHeight, THREE.RGBAFormat, THREE.FloatType);
      environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
      environmentTexture.colorSpace = THREE.LinearSRGBColorSpace;
      environmentTexture.minFilter = THREE.LinearFilter;
      environmentTexture.magFilter = THREE.LinearFilter;
      environmentTexture.needsUpdate = true;
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      environmentRenderTarget = pmremGenerator.fromEquirectangular(environmentTexture);
      scene.environment = environmentRenderTarget.texture;
      pmremGenerator.dispose();
      environmentTexture.dispose();
      initialized = true;
      resizeWorld();
      createBodies(THREE, sharedMaterial);
      canvas.hidden = false;
      footer.classList.add("is-site-footer-physics-ready");
      setState("ready");
      render(1);
      if (astronautTarget) createSiteFooterAstronaut({
        THREE,
        camera,
        scene,
        target: astronautTarget
      }).then((controller) => {
        if (destroyed || !document.documentElement.contains(footer)) {
          controller.dispose();
          return;
        }
        astronautController = controller;
        astronautController.setReducedMotion(reducedMotion.matches);
        if (footerVisible && !document.hidden) syncAstronautLayout();
        footer.classList.add("is-site-footer-astronaut-ready");
        render(1);
        previousFrameTime = performance.now();
        scheduleFrame();
      }).catch(() => {
        footer.classList.remove("is-site-footer-astronaut-ready");
      });
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(footer);
      startSimulation();
    } catch (_error) {
      setState("unavailable");
      canvas.hidden = true;
    } finally {
      initializing = false;
    }
  };
  const updatePointerTarget = (event) => {
    if (!started || reducedMotion.matches || !footerVisible || !initialized || !hoverPointer.matches || event.pointerType !== "mouse" && event.pointerType !== "pen") return false;
    const bounds = footer.getBoundingClientRect();
    pointerTargetX = event.clientX - bounds.left - worldWidth * .5;
    pointerTargetY = worldHeight * .5 - (event.clientY - bounds.top);
    pointerInside = true;
    if (!hasPointerPosition) {
      pointerWorldX = pointerTargetX;
      pointerWorldY = pointerTargetY;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
      hasPointerPosition = true;
    }
    return true;
  };
  const handlePointerMove = (event) => {
    if (!updatePointerTarget(event)) return;
    const pointerMargin = Math.max(28, footerBodyHeight * POINTER_SURFACE_MARGIN_RATIO) + 24;
    let affectedBodyFound = false;
    bodies.forEach((body) => {
      if (!body.active) return;
      if (pointerContactForBody(body, pointerTargetX, pointerTargetY).distance < pointerMargin) {
        wakeBody(body);
        affectedBodyFound = true;
      }
    });
    const astronautCollider = astronautController?.getCollider() ?? null;
    if (astronautCollider && pointerContactForAstronaut(astronautCollider, pointerTargetX, pointerTargetY).distance < pointerMargin) affectedBodyFound = true;
    if (!affectedBodyFound) return;
    const simulationWasIdle = frameId === null;
    setState("floating");
    if (simulationWasIdle) {
      accumulator = Math.max(accumulator, FIXED_STEP);
      previousFrameTime = performance.now();
    }
    scheduleFrame();
  };
  const handlePointerLeave = () => {
    if (!pointerInside && !hasPointerPosition) return;
    pointerInside = false;
    hasPointerPosition = false;
    pointerVelocityX = 0;
    pointerVelocityY = 0;
    wakeAllBodies();
    setState("floating");
    previousFrameTime = performance.now();
    scheduleFrame();
  };
  const handleVisibilityChange = () => {
    if (document.hidden) {
      pointerInside = false;
      hasPointerPosition = false;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
        resizeFrameId = null;
      }
      return;
    }
    if (footerVisible) initializeThree().then(() => {
      resizeWorld();
      startSimulation();
      wakeAllBodies();
      previousFrameTime = performance.now();
      scheduleFrame();
    });
  };
  const handleReducedMotionChange = () => {
    if (!initialized || !started) return;
    if (reducedMotion.matches) {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      settleStaticComposition();
      astronautController?.setReducedMotion(true);
      render(1);
      return;
    }
    astronautController?.setReducedMotion(false);
    wakeAllBodies();
    setState("floating");
    previousFrameTime = performance.now();
    scheduleFrame();
  };
  const preloadObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url).catch(() => void 0);
  }, { rootMargin: "100% 0px 100% 0px" }) : null;
  const footerObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    footerVisible = entries.some((entry) => entry.isIntersecting);
    if (!footerVisible) {
      pointerInside = false;
      hasPointerPosition = false;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
        resizeFrameId = null;
      }
    } else initializeThree().then(() => {
      resizeWorld();
      startSimulation();
      previousFrameTime = performance.now();
      scheduleFrame();
    });
  }, { threshold: 0 }) : null;
  const triggerObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    triggered = true;
    initializeThree().then(startSimulation);
  }, { threshold: .18 }) : null;
  const handleContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    canvas.hidden = true;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
  };
  const handleContextRestored = () => {
    contextLost = false;
    canvas.hidden = false;
    wakeAllBodies();
    previousFrameTime = performance.now();
    render(1);
    scheduleFrame();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  footer.addEventListener("pointerenter", handlePointerMove, { passive: true });
  footer.addEventListener("pointermove", handlePointerMove, { passive: true });
  footer.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotion.addEventListener("change", handleReducedMotionChange);
  preloadObserver?.observe(footer);
  footerObserver?.observe(footer);
  triggerObserver?.observe(stage);
  if (!preloadObserver || !footerObserver || !triggerObserver) {
    footerVisible = true;
    triggered = true;
    initializeThree().then(startSimulation);
  }
  const handlePageHide = () => destroySiteFooterPhysics();
  window.addEventListener("pagehide", handlePageHide, { once: true });
  activeCleanup = () => {
    destroyed = true;
    preloadObserver?.disconnect();
    footerObserver?.disconnect();
    triggerObserver?.disconnect();
    resizeObserver?.disconnect();
    reducedMotion.removeEventListener("change", handleReducedMotionChange);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    footer.removeEventListener("pointerenter", handlePointerMove);
    footer.removeEventListener("pointermove", handlePointerMove);
    footer.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("pagehide", handlePageHide);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    if (resizeFrameId !== null) window.cancelAnimationFrame(resizeFrameId);
    bodies.forEach((body) => scene?.remove(body.mesh));
    astronautController?.dispose();
    astronautController = null;
    geometries.forEach((geometry) => geometry.dispose());
    sharedMaterial?.dispose();
    if (scene) scene.environment = null;
    environmentRenderTarget?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    canvas.remove();
    footer.classList.remove("is-site-footer-physics-ready");
    footer.classList.remove("is-site-footer-astronaut-ready");
    delete footer.dataset.siteFooterPhysicsInitialized;
    delete footer.dataset.siteFooterPhysicsState;
  };
};
//#endregion
//#region resources/ts/site-footer.ts
var SITE_FOOTER_VERSION_CHANGE_EVENT = "l-portfolio:site-footer-version-change";
var SITE_FOOTER_3D_VISIBILITY_EVENT = "l-portfolio:site-footer-3d-visibility";
var PAGE_SWAP_EVENT$1 = "l-portfolio:page-swapped";
var PAGE_WILL_SWAP_EVENT = "l-portfolio:page-will-swap";
var initializeSiteFooter = () => {
  const footer = document.querySelector(".site-footer");
  const page = footer?.closest(".site-page");
  const revealSpacer = document.querySelector("[data-site-footer-reveal-spacer]");
  const wordmark = footer?.querySelector("[data-site-footer-wordmark]");
  const toggle = footer?.querySelector("[data-site-footer-version-toggle]");
  const toggleLabel = toggle?.querySelector("[data-site-footer-version-toggle-label]");
  const panels = footer ? Array.from(footer.querySelectorAll("[data-site-footer-variant]")) : [];
  if (!footer || !page || !toggle || !toggleLabel || panels.length < 2 || footer.dataset.siteFooterControllerInitialized === "true") return;
  footer.dataset.siteFooterControllerInitialized = "true";
  let activationFrameId = null;
  let wordmarkRearmFrameId = null;
  let wordmarkObserver = null;
  const setThreeDimensionalContentVisible = (visible) => {
    const startedAt = visible ? performance.now() : null;
    footer.classList.toggle("is-site-footer-3d-visible", visible);
    if (startedAt === null) delete footer.dataset.siteFooter3dRevealStartedAt;
    else footer.dataset.siteFooter3dRevealStartedAt = String(startedAt);
    footer.dispatchEvent(new CustomEvent(SITE_FOOTER_3D_VISIBILITY_EVENT, { detail: {
      footer,
      visible,
      startedAt
    } }));
  };
  const markWordmarkVisible = () => {
    footer.classList.add("is-site-footer-wordmark-visible");
    setThreeDimensionalContentVisible(true);
    wordmarkObserver?.disconnect();
  };
  const activeRevealTarget = () => {
    if (footer.dataset.siteFooterVersion !== "v1" || !revealSpacer) return footer;
    return revealSpacer.getBoundingClientRect().height > 0 ? revealSpacer : footer;
  };
  const revealWordmarkWhenInView = () => {
    if (!wordmark || footer.classList.contains("is-site-footer-wordmark-visible")) return;
    const bounds = activeRevealTarget().getBoundingClientRect();
    if (Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0)) < Math.max(Math.min(bounds.height, window.innerHeight) * .6, 1)) return;
    markWordmarkVisible();
  };
  const observeWordmark = () => {
    if (!wordmark || !wordmarkObserver) return;
    wordmarkObserver.disconnect();
    wordmarkObserver.observe(footer);
    if (revealSpacer) wordmarkObserver.observe(revealSpacer);
  };
  if (wordmark) {
    footer.classList.add("is-site-footer-wordmark-managed");
    if ("IntersectionObserver" in window) {
      wordmarkObserver = new IntersectionObserver(revealWordmarkWhenInView, { threshold: [0, .6] });
      observeWordmark();
    } else markWordmarkVisible();
  }
  const activateRenderer = (version) => {
    activationFrameId = null;
    if (!document.documentElement.contains(footer)) return;
    if (version === "v2") {
      initializeSiteFooterPhysics();
      return;
    }
    initializeSiteFooterGlass();
  };
  const setVersion = (version, announce = true) => {
    if (activationFrameId !== null) {
      window.cancelAnimationFrame(activationFrameId);
      activationFrameId = null;
    }
    destroySiteFooterGlass();
    destroySiteFooterPhysics();
    footer.dataset.siteFooterVersion = version;
    footer.classList.toggle("is-site-footer-v1", version === "v1");
    footer.classList.toggle("is-site-footer-v2", version === "v2");
    page.dataset.siteFooterLayout = version;
    page.classList.toggle("site-page--footer-v1", version === "v1");
    page.classList.toggle("site-page--footer-v2", version === "v2");
    panels.forEach((panel) => {
      const active = panel.dataset.siteFooterVariant === version;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
      panel.toggleAttribute("inert", !active);
    });
    revealWordmarkWhenInView();
    const nextVersion = version === "v1" ? "v2" : "v1";
    toggleLabel.textContent = nextVersion.toUpperCase();
    toggle.setAttribute("aria-pressed", version === "v2" ? "true" : "false");
    toggle.setAttribute("aria-label", nextVersion === "v1" ? toggle.dataset.labelV1 || "Show footer version 1" : toggle.dataset.labelV2 || "Show footer version 2");
    activationFrameId = window.requestAnimationFrame(() => activateRenderer(version));
    if (announce) window.dispatchEvent(new CustomEvent(SITE_FOOTER_VERSION_CHANGE_EVENT, { detail: { version } }));
  };
  const handleToggle = () => {
    setVersion(footer.dataset.siteFooterVersion === "v2" ? "v1" : "v2");
  };
  const handlePageWillSwap = () => {
    if (!wordmark) return;
    if (wordmarkRearmFrameId !== null) {
      window.cancelAnimationFrame(wordmarkRearmFrameId);
      wordmarkRearmFrameId = null;
    }
    wordmarkObserver?.disconnect();
    footer.classList.add("is-site-footer-wordmark-resetting");
    footer.classList.remove("is-site-footer-wordmark-visible");
    setThreeDimensionalContentVisible(false);
    wordmark.offsetWidth;
  };
  const handlePageSwap = () => {
    if (!wordmark) return;
    if (wordmarkRearmFrameId !== null) window.cancelAnimationFrame(wordmarkRearmFrameId);
    wordmarkRearmFrameId = window.requestAnimationFrame(() => {
      wordmarkRearmFrameId = window.requestAnimationFrame(() => {
        wordmarkRearmFrameId = null;
        footer.classList.remove("is-site-footer-wordmark-resetting");
        if (wordmarkObserver) {
          observeWordmark();
          revealWordmarkWhenInView();
          return;
        }
        markWordmarkVisible();
      });
    });
  };
  const handlePageHide = () => {
    if (activationFrameId !== null) window.cancelAnimationFrame(activationFrameId);
    if (wordmarkRearmFrameId !== null) window.cancelAnimationFrame(wordmarkRearmFrameId);
    destroySiteFooterGlass();
    destroySiteFooterPhysics();
    wordmarkObserver?.disconnect();
    window.removeEventListener(PAGE_WILL_SWAP_EVENT, handlePageWillSwap);
    window.removeEventListener(PAGE_SWAP_EVENT$1, handlePageSwap);
  };
  toggle.addEventListener("click", handleToggle);
  window.addEventListener(PAGE_WILL_SWAP_EVENT, handlePageWillSwap);
  window.addEventListener(PAGE_SWAP_EVENT$1, handlePageSwap);
  window.addEventListener("pagehide", handlePageHide, { once: true });
  setVersion("v1", false);
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeSiteFooter, { once: true });
else initializeSiteFooter();
//#endregion
//#region resources/ts/site-cursor.ts
var POINTER_TARGET_CHANGE_EVENT = "l-portfolio:pointer-target-change";
var PAGE_SWAP_EVENT = "l-portfolio:page-swapped";
var PAGE_TRANSITION_START_EVENT = "l-portfolio:page-transition-start";
var PAGE_TRANSITION_CURSOR_RELEASE_DELAY = 180;
var cursor = document.querySelector("[data-makervil-cursor]");
var brandCursor = document.querySelector("[data-makervil-brand-cursor]");
if (cursor) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const root = document.documentElement;
  const hoverTargetSelector = [
    "a[href]",
    "button:not(:disabled)",
    "[role='button']:not([aria-disabled='true'])",
    "[role='link']:not([aria-disabled='true'])",
    "[data-makervil-cursor-hover]"
  ].join(",");
  const brandHoverTargetSelector = "[data-home-brand-media]";
  let frameId = null;
  let brandRevealFrameId = null;
  let pageTransitionCursorReleaseId = null;
  let pageTransitionCursorReleaseCleanupId = null;
  let pointerX = -20;
  let pointerY = -20;
  let enabled = false;
  let activated = false;
  let activeHoverTarget = null;
  let activeBrandHoverTarget = null;
  let pageTransitionTargetName = "Page";
  let pageTransitionCursorActive = root.classList.contains("is-page-transitioning") || root.classList.contains("has-pending-page-transition");
  let pageTransitionCursorReleased = root.classList.contains("has-pending-page-transition");
  const brandCursorNames = brandCursor ? Array.from(brandCursor.querySelectorAll("[data-makervil-brand-cursor-name]")) : [];
  const brandCursorYears = brandCursor ? Array.from(brandCursor.querySelectorAll("[data-makervil-brand-cursor-year]")) : [];
  const setBrandCursorContent = (title, year = "", isKorean = false) => {
    brandCursorNames.forEach((element) => {
      element.textContent = title;
      element.classList.toggle("makervil-brand-cursor__name--ko", isKorean);
    });
    brandCursorYears.forEach((element) => {
      element.textContent = year;
      element.hidden = year === "";
    });
  };
  const syncBrandCursorContent = (target) => {
    brandCursor?.style.setProperty("--makervil-brand-cursor-duration", target.dataset.homeBrandCursorDuration?.trim() || "5.6s");
    setBrandCursorContent(target.dataset.homeBrandCursorTitle?.trim() || "VIEW MORE", target.dataset.homeBrandCursorYear?.trim() || "", target.dataset.homeBrandCursorKorean === "true");
  };
  const resolvePageTransitionTargetName = (target) => {
    let targetUrl;
    try {
      targetUrl = target instanceof URL ? target : new URL(String(target ?? ""), window.location.href);
    } catch (_error) {
      return "Page";
    }
    const pathSegments = targetUrl.pathname.split("/").filter(Boolean);
    if ([
      "ko",
      "en",
      "ja",
      "zh"
    ].includes(pathSegments[0])) pathSegments.shift();
    const pageName = pathSegments[0] ?? "home";
    return decodeURIComponent(pageName).replace(/[-_]+/g, " ").replace(/\S+/g, (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`);
  };
  const setPageTransitionCursorContent = () => {
    brandCursor?.style.setProperty("--makervil-brand-cursor-duration", "5.6s");
    brandCursorNames.forEach((element, index) => {
      element.textContent = index % 2 === 0 ? "Loading" : pageTransitionTargetName;
      element.classList.remove("makervil-brand-cursor__name--ko");
    });
    brandCursorYears.forEach((element) => {
      element.textContent = "";
      element.hidden = true;
    });
  };
  const isPageTransitionActive = () => root.classList.contains("is-page-transitioning") || root.classList.contains("has-pending-page-transition");
  const dispatchPointerTarget = (target) => {
    window.dispatchEvent(new CustomEvent(POINTER_TARGET_CHANGE_EVENT, { detail: {
      target,
      clientX: pointerX,
      clientY: pointerY
    } }));
  };
  const syncCursorPosition = () => {
    cursor.style.setProperty("--makervil-cursor-x", `${pointerX}px`);
    cursor.style.setProperty("--makervil-cursor-y", `${pointerY}px`);
    cursor.style.setProperty("--makervil-cursor-core-x", `${pointerX}px`);
    cursor.style.setProperty("--makervil-cursor-core-y", `${pointerY}px`);
    brandCursor?.style.setProperty("--makervil-brand-cursor-x", `${pointerX}px`);
    brandCursor?.style.setProperty("--makervil-brand-cursor-y", `${pointerY}px`);
  };
  const render = () => {
    frameId = null;
    const target = activated ? document.elementFromPoint(pointerX, pointerY) : null;
    syncCursorPosition();
    syncHoverState(target);
  };
  const scheduleRender = () => {
    if (frameId === null) frameId = window.requestAnimationFrame(render);
  };
  const show = () => {
    root.classList.add("has-makervil-cursor");
    cursor.classList.add("is-visible");
  };
  const setBrandCursorVisible = (visible) => {
    if (!brandCursor) return;
    if (!visible) {
      if (brandRevealFrameId !== null) {
        window.cancelAnimationFrame(brandRevealFrameId);
        brandRevealFrameId = null;
      }
      brandCursor.classList.remove("is-visible");
      return;
    }
    if (brandCursor.classList.contains("is-visible") || brandRevealFrameId !== null) return;
    brandCursor.classList.remove("is-visible");
    brandCursor.offsetWidth;
    brandRevealFrameId = window.requestAnimationFrame(() => {
      brandCursor.classList.add("is-visible");
      brandRevealFrameId = null;
    });
  };
  const syncHoverState = (target = document.elementFromPoint(pointerX, pointerY)) => {
    if (!activated) return;
    if (isPageTransitionActive() && !pageTransitionCursorReleased) {
      activeHoverTarget?.classList.remove("is-makervil-pointer-hover");
      activeHoverTarget = null;
      activeBrandHoverTarget?.classList.remove("is-makervil-pointer-hover");
      activeBrandHoverTarget = null;
      setPageTransitionCursorContent();
      cursor.classList.remove("is-hovering");
      cursor.classList.add("is-brand-hovering");
      setBrandCursorVisible(true);
      dispatchPointerTarget(null);
      return;
    }
    const hoverTarget = target?.closest(hoverTargetSelector) ?? null;
    const brandHoverTarget = target?.closest(brandHoverTargetSelector) ?? null;
    if (hoverTarget !== activeHoverTarget) {
      activeHoverTarget?.classList.remove("is-makervil-pointer-hover");
      hoverTarget?.classList.add("is-makervil-pointer-hover");
      activeHoverTarget = hoverTarget;
    }
    if (brandHoverTarget !== activeBrandHoverTarget) {
      activeBrandHoverTarget?.classList.remove("is-makervil-pointer-hover");
      brandHoverTarget?.classList.add("is-makervil-pointer-hover");
      if (brandHoverTarget) syncBrandCursorContent(brandHoverTarget);
      activeBrandHoverTarget = brandHoverTarget;
    }
    cursor.classList.toggle("is-hovering", hoverTarget !== null);
    cursor.classList.toggle("is-brand-hovering", brandHoverTarget !== null);
    const brandCursorVisible = brandHoverTarget !== null && brandHoverTarget.dataset.homeBrandCursorVisible !== "false";
    setBrandCursorVisible(brandCursorVisible);
    dispatchPointerTarget(target);
  };
  const releasePageTransitionCursor = () => {
    if (pageTransitionCursorReleaseId !== null) {
      window.clearTimeout(pageTransitionCursorReleaseId);
      pageTransitionCursorReleaseId = null;
    }
    if (pageTransitionCursorReleaseCleanupId !== null) window.clearTimeout(pageTransitionCursorReleaseCleanupId);
    brandCursor?.classList.add("is-page-transition-releasing");
    pageTransitionCursorReleased = true;
    pageTransitionCursorReleaseCleanupId = window.setTimeout(() => {
      pageTransitionCursorReleaseCleanupId = null;
      brandCursor?.classList.remove("is-page-transition-releasing");
    }, 620);
  };
  const schedulePageTransitionCursorRelease = (delay = PAGE_TRANSITION_CURSOR_RELEASE_DELAY) => {
    if (pageTransitionCursorReleaseId !== null) window.clearTimeout(pageTransitionCursorReleaseId);
    pageTransitionCursorReleaseId = window.setTimeout(() => {
      releasePageTransitionCursor();
      syncHoverState();
    }, delay);
  };
  new MutationObserver(() => {
    const transitionActive = isPageTransitionActive();
    if (transitionActive === pageTransitionCursorActive) return;
    pageTransitionCursorActive = transitionActive;
    if (transitionActive) {
      pageTransitionCursorReleased = false;
      brandCursor?.classList.remove("is-page-transition-releasing");
      if (pageTransitionCursorReleaseId !== null) {
        window.clearTimeout(pageTransitionCursorReleaseId);
        pageTransitionCursorReleaseId = null;
      }
      if (pageTransitionCursorReleaseCleanupId !== null) {
        window.clearTimeout(pageTransitionCursorReleaseCleanupId);
        pageTransitionCursorReleaseCleanupId = null;
      }
    } else if (!pageTransitionCursorReleased) releasePageTransitionCursor();
    syncHoverState();
  }).observe(root, {
    attributes: true,
    attributeFilter: ["class"]
  });
  const onPageTransitionStart = (event) => {
    pageTransitionTargetName = resolvePageTransitionTargetName(event.detail?.to);
    if (isPageTransitionActive() && !pageTransitionCursorReleased) setPageTransitionCursorContent();
  };
  window.addEventListener(PAGE_TRANSITION_START_EVENT, onPageTransitionStart);
  const onPageSwap = () => {
    if (!isPageTransitionActive() || !activated) return;
    schedulePageTransitionCursorRelease();
  };
  window.addEventListener(PAGE_SWAP_EVENT, onPageSwap);
  const hide = () => {
    activated = false;
    root.classList.remove("has-makervil-cursor");
    cursor.classList.remove("is-visible");
    cursor.classList.remove("is-hovering");
    cursor.classList.remove("is-brand-hovering");
    activeHoverTarget?.classList.remove("is-makervil-pointer-hover");
    activeHoverTarget = null;
    activeBrandHoverTarget?.classList.remove("is-makervil-pointer-hover");
    activeBrandHoverTarget = null;
    setBrandCursorVisible(false);
    dispatchPointerTarget(null);
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    if (pageTransitionCursorReleaseId !== null) {
      window.clearTimeout(pageTransitionCursorReleaseId);
      pageTransitionCursorReleaseId = null;
    }
    if (pageTransitionCursorReleaseCleanupId !== null) {
      window.clearTimeout(pageTransitionCursorReleaseCleanupId);
      pageTransitionCursorReleaseCleanupId = null;
    }
    brandCursor?.classList.remove("is-page-transition-releasing");
  };
  const onPointerMove = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    const eventTarget = event.target instanceof Element ? event.target : null;
    if (!activated) {
      activated = true;
      render();
      show();
    } else {
      show();
      syncHoverState(eventTarget);
      scheduleRender();
    }
  };
  const onWheel = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!activated) {
      activated = true;
      render();
      show();
      return;
    }
    show();
    scheduleRender();
  };
  const enable = () => {
    if (enabled) return;
    enabled = true;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", scheduleRender, { passive: true });
    window.addEventListener("scroll", scheduleRender, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
  };
  const disable = () => {
    if (!enabled) return;
    enabled = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("blur", hide);
    window.removeEventListener("resize", scheduleRender);
    window.removeEventListener("scroll", scheduleRender);
    document.documentElement.removeEventListener("pointerleave", hide);
    hide();
  };
  const syncPointerMode = () => {
    if (finePointer.matches) {
      enable();
      return;
    }
    disable();
  };
  finePointer.addEventListener("change", syncPointerMode);
  syncPointerMode();
}
//#endregion
