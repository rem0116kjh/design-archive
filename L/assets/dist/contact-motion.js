var HOME_INTRO_COMPLETE_EVENT = "l-portfolio:home-intro-complete";
var SYMBOL_TRAVEL_VIEWPORT_RATIO = .14;
var SYMBOL_TRAVEL_MIN = 80;
var SYMBOL_TRAVEL_MAX = 160;
var SYMBOL_FOLLOW_EASING = .12;
var SYMBOL_SETTLE_THRESHOLD = .08;
var clamp$2 = (value) => Math.min(Math.max(value, 0), 1);
var activeCleanup$6 = null;
var destroyHomeContact = () => {
  const cleanup = activeCleanup$6;
  activeCleanup$6 = null;
  cleanup?.();
};
var initializeHomeContact = (root = document) => {
  const section = root.querySelector("[data-home-contact]");
  if (!section || section.dataset.homeContactInitialized === "true") return;
  destroyHomeContact();
  section.dataset.homeContactInitialized = "true";
  section.classList.add("is-home-contact-managed");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsObserver = "IntersectionObserver" in window;
  const symbol = section.querySelector("[data-home-contact-symbol]");
  let activated = false;
  let symbolMotionEnabled = false;
  let symbolFrameId = null;
  let renderedSymbolY = 0;
  let hasRenderedSymbol = false;
  let activationFrameId = null;
  let revealObserver = null;
  let proximityObserver = null;
  let destroyed = false;
  let isNearViewport = !supportsObserver;
  const stopSymbolFrame = () => {
    if (symbolFrameId === null) return;
    window.cancelAnimationFrame(symbolFrameId);
    symbolFrameId = null;
  };
  const setSymbolY = (value) => {
    section.style.setProperty("--home-contact-symbol-y", `${value.toFixed(2)}px`);
  };
  const renderSymbol = () => {
    symbolFrameId = null;
    if (!symbol || reducedMotion.matches) {
      renderedSymbolY = 0;
      hasRenderedSymbol = true;
      setSymbolY(0);
      return;
    }
    const viewportHeight = Math.max(window.innerHeight, 1);
    const sectionBounds = section.getBoundingClientRect();
    const progress = clamp$2((viewportHeight - sectionBounds.top) / (viewportHeight + sectionBounds.height));
    const travel = Math.min(Math.max(viewportHeight * SYMBOL_TRAVEL_VIEWPORT_RATIO, SYMBOL_TRAVEL_MIN), SYMBOL_TRAVEL_MAX);
    const targetSymbolY = (progress - .5) * travel;
    renderedSymbolY = hasRenderedSymbol ? renderedSymbolY + (targetSymbolY - renderedSymbolY) * SYMBOL_FOLLOW_EASING : targetSymbolY;
    hasRenderedSymbol = true;
    if (Math.abs(targetSymbolY - renderedSymbolY) <= SYMBOL_SETTLE_THRESHOLD) renderedSymbolY = targetSymbolY;
    setSymbolY(renderedSymbolY);
    if (renderedSymbolY !== targetSymbolY) symbolFrameId = window.requestAnimationFrame(renderSymbol);
  };
  const requestSymbolRender = () => {
    if (symbolFrameId === null) symbolFrameId = window.requestAnimationFrame(renderSymbol);
  };
  const enableSymbolMotion = () => {
    if (!symbol || symbolMotionEnabled) return;
    symbolMotionEnabled = true;
    window.addEventListener("scroll", requestSymbolRender, { passive: true });
    window.addEventListener("resize", requestSymbolRender, { passive: true });
    window.addEventListener("pageshow", requestSymbolRender, { passive: true });
    requestSymbolRender();
  };
  const disableSymbolMotion = () => {
    if (symbolMotionEnabled) {
      window.removeEventListener("scroll", requestSymbolRender);
      window.removeEventListener("resize", requestSymbolRender);
      window.removeEventListener("pageshow", requestSymbolRender);
      symbolMotionEnabled = false;
    }
    stopSymbolFrame();
    renderedSymbolY = 0;
    hasRenderedSymbol = false;
    setSymbolY(0);
  };
  const syncSymbolMotion = () => {
    if (!activated || reducedMotion.matches || !isNearViewport) {
      disableSymbolMotion();
      return;
    }
    enableSymbolMotion();
  };
  const reveal = () => {
    if (!destroyed) section.classList.add("is-home-contact-visible");
  };
  const activate = () => {
    activationFrameId = null;
    if (activated || destroyed) return;
    activated = true;
    syncSymbolMotion();
    if (reducedMotion.matches || !supportsObserver) {
      section.classList.add("is-home-contact-near");
      reveal();
    } else {
      revealObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        revealObserver = null;
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(reveal);
        });
      }, {
        threshold: .32,
        rootMargin: "0px 0px -12% 0px"
      });
      proximityObserver = new IntersectionObserver((entries) => {
        const isNear = entries.some((entry) => entry.isIntersecting);
        isNearViewport = isNear;
        section.classList.toggle("is-home-contact-near", isNear);
        syncSymbolMotion();
      }, {
        threshold: 0,
        rootMargin: "60% 0px 60% 0px"
      });
      revealObserver.observe(section);
      proximityObserver.observe(section);
    }
  };
  reducedMotion.addEventListener("change", syncSymbolMotion);
  if (root.querySelector("[data-home-intro]")) window.addEventListener(HOME_INTRO_COMPLETE_EVENT, activate, { once: true });
  else activationFrameId = window.requestAnimationFrame(activate);
  activeCleanup$6 = () => {
    destroyed = true;
    window.removeEventListener(HOME_INTRO_COMPLETE_EVENT, activate);
    reducedMotion.removeEventListener("change", syncSymbolMotion);
    revealObserver?.disconnect();
    proximityObserver?.disconnect();
    disableSymbolMotion();
    if (activationFrameId !== null) window.cancelAnimationFrame(activationFrameId);
    section.classList.remove("is-home-contact-managed", "is-home-contact-visible", "is-home-contact-near");
    section.style.removeProperty("--home-contact-symbol-y");
    delete section.dataset.homeContactInitialized;
  };
};

initializeHomeContact();
