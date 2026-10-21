import { a as SplitType, i as populateMetricRollers, r as getBrandCurveExitFactor, t as brandCurveVertexShader } from "./chunks/brand-curve-renderer-CpiL1r_Q.js";
import { t as __vitePreload } from "./chunks/preload-helper-DHlaQ_oz.js";
import { n as createMakervilGlassObject, t as getMakervilMobileIdleRotation } from "./chunks/makervil-glass-idle-RcJS0RnU.js";
//#region resources/ts/home-about.ts
var HOME_INTRO_COMPLETE_EVENT$5 = "l-portfolio:home-intro-complete";
var initializeHomeAbout = () => {
  const aboutSection = document.querySelector("[data-home-about]");
  if (!aboutSection || aboutSection.dataset.homeAboutInitialized === "true") return;
  aboutSection.dataset.homeAboutInitialized = "true";
  const statRoots = Array.from(aboutSection.querySelectorAll("[data-home-about-stat]"));
  const stats = aboutSection.querySelector(".home-about__stats");
  const splitTargets = Array.from(aboutSection.querySelectorAll("[data-home-about-split]"));
  const simpleRevealRoots = Array.from(aboutSection.querySelectorAll(".home-about__reveal--label, .home-about__reveal--cta"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;
  const splitInstances = [];
  const lineTargets = /* @__PURE__ */ new WeakMap();
  const startedTargets = /* @__PURE__ */ new WeakSet();
  const pendingLines = /* @__PURE__ */ new WeakSet();
  let previousViewportWidth = window.innerWidth;
  let resizeTimer = 0;
  let revealActivated = false;
  populateMetricRollers(statRoots, {
    classPrefix: "home-about",
    variablePrefix: "--home-about-stat",
    singlePass: true
  });
  aboutSection.classList.add("is-home-about-managed");
  const revealSimpleRoot = (root) => {
    root.classList.add("is-home-about-reveal-visible");
  };
  const revealStats = () => {
    if (!stats || stats.classList.contains("is-home-about-stats-visible")) return;
    stats.classList.add("is-home-about-stats-visible");
    if (reducedMotion || !supportsObserver) {
      stats.classList.add("is-home-about-stats-rolling");
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        stats.classList.add("is-home-about-stats-rolling");
      });
    });
  };
  const revealObserver = supportsObserver && !reducedMotion ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      revealSimpleRoot(entry.target);
    });
  }, {
    threshold: .2,
    rootMargin: "0px 0px -8% 0px"
  }) : null;
  const statsObserver = supportsObserver && !reducedMotion && stats ? new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    window.requestAnimationFrame(revealStats);
  }, {
    threshold: .08,
    rootMargin: "0px 0px -2% 0px"
  }) : null;
  const markLineVisible = (line) => {
    const target = lineTargets.get(line);
    if (target) startedTargets.add(target);
    line.classList.add("is-home-about-line-visible");
    if (target && !target.querySelector(".home-about__text-line:not(.is-home-about-line-visible)")) target.classList.add("is-home-about-text-revealed");
  };
  const lineObserver = supportsObserver && !reducedMotion ? new IntersectionObserver((entries, observer) => {
    entries.filter((entry) => entry.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top).forEach((entry, entryIndex) => {
      const line = entry.target;
      if (pendingLines.has(line)) return;
      pendingLines.add(line);
      observer.unobserve(line);
      window.setTimeout(() => {
        markLineVisible(line);
      }, entryIndex * 90);
    });
  }, {
    threshold: .18,
    rootMargin: "0px 0px -8% 0px"
  }) : null;
  const splitTextTargets = () => {
    lineObserver?.disconnect();
    splitInstances.splice(0).forEach((instance) => instance.revert());
    splitTargets.forEach((target) => {
      const split = new SplitType(target, {
        types: "lines",
        lineClass: "home-about__text-line"
      });
      const lines = split.lines ?? [];
      splitInstances.push(split);
      lines.forEach((line) => {
        const inner = document.createElement("span");
        inner.className = "home-about__text-line-inner";
        while (line.firstChild) inner.append(line.firstChild);
        line.append(inner);
        lineTargets.set(line, target);
        if (startedTargets.has(target)) {
          markLineVisible(line);
          return;
        }
        if (!revealActivated) return;
        if (reducedMotion || !lineObserver) {
          markLineVisible(line);
          return;
        }
        lineObserver.observe(line);
      });
    });
  };
  const activateReveals = () => {
    if (revealActivated) return;
    revealActivated = true;
    if (reducedMotion || !supportsObserver) {
      simpleRevealRoots.forEach(revealSimpleRoot);
      revealStats();
      splitTargets.forEach((target) => {
        target.querySelectorAll(".home-about__text-line").forEach(markLineVisible);
      });
      return;
    }
    simpleRevealRoots.forEach((root) => revealObserver?.observe(root));
    if (stats && statsObserver) statsObserver.observe(stats);
    splitTargets.forEach((target) => {
      target.querySelectorAll(".home-about__text-line").forEach((line) => lineObserver?.observe(line));
    });
  };
  if (document.querySelector("[data-home-intro]")) window.addEventListener(HOME_INTRO_COMPLETE_EVENT$5, activateReveals, { once: true });
  else window.requestAnimationFrame(activateReveals);
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    window.requestAnimationFrame(splitTextTargets);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth === previousViewportWidth) return;
    previousViewportWidth = window.innerWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(splitTextTargets, 160);
  }, { passive: true });
};
//#endregion
//#region resources/ts/home-brand-gallery.ts
var fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uPlaneSize;
    uniform vec2 uImageSize;
    uniform float uHoverZoom;
    varying vec2 vUv;

    void main() {
        float planeAspect = uPlaneSize.x / max(uPlaneSize.y, 1.0);
        float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
        vec2 coverScale = vec2(1.0);

        if (planeAspect > imageAspect) {
            coverScale.y = imageAspect / planeAspect;
        } else {
            coverScale.x = planeAspect / imageAspect;
        }

        vec2 textureUv = ((vUv - 0.5) * coverScale) / max(uHoverZoom, 1.0) + 0.5;
        gl_FragColor = texture2D(uTexture, textureUv);
        #include <colorspace_fragment>
    }
`;
var clamp$3 = (value, min, max) => Math.min(max, Math.max(min, value));
var getCurveBend = () => window.innerWidth <= 560 ? .135 : .16;
var waitForImage = async (image) => {
  if (!image.complete) await new Promise((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) return false;
  if (typeof image.decode === "function") await image.decode().catch(() => void 0);
  return true;
};
var initializeHomeBrandGallery = (section) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = Array.from(section.querySelectorAll("[data-home-brand-card]"));
  if (reducedMotion.matches || cards.length === 0 || !("WebGLRenderingContext" in window)) return () => void 0;
  let scenes = [];
  let isNearViewport = false;
  let frameId = null;
  let initializePromise = null;
  let destroyed = false;
  const resetScenes = () => {
    if (destroyed) return;
    const curveBend = getCurveBend();
    scenes.forEach((scene) => {
      scene.bend = curveBend;
      scene.driftY = 0;
      scene.hoverZoom = 1;
      scene.material.uniforms.uBend.value = curveBend;
      scene.material.uniforms.uHoverZoom.value = 1;
      scene.cardInner.style.setProperty("--home-brand-drift-y", "0px");
      scene.media.classList.add("is-webgl-motion-active");
    });
  };
  const resizeScenes = () => {
    if (destroyed) return;
    scenes.forEach((scene) => {
      scene.needsResize = true;
    });
    requestRender();
  };
  const renderFrame = () => {
    frameId = null;
    if (destroyed || !isNearViewport || scenes.length === 0 || document.hidden) return;
    const isMobile = window.innerWidth <= 560;
    const curveBend = getCurveBend();
    const maximumParallax = isMobile ? 48 : 240;
    const viewportHeight = Math.max(window.innerHeight, 1);
    const sectionBounds = section.getBoundingClientRect();
    const parallaxPhase = 1 - clamp$3((viewportHeight - sectionBounds.top) / (sectionBounds.height + viewportHeight), 0, 1) * 2;
    const sceneFrames = scenes.filter((scene) => !scene.contextLost).map((scene) => ({
      scene,
      bounds: scene.media.getBoundingClientRect(),
      width: scene.needsResize ? scene.media.clientWidth : void 0,
      height: scene.needsResize ? scene.media.clientHeight : void 0
    })).filter(({ bounds }) => bounds.bottom > 0 && bounds.top < viewportHeight);
    if (sceneFrames.length === 0) return;
    let needsNextFrame = false;
    const finalBottom = Math.max(...cards.map((card) => card.querySelector("[data-home-brand-media]")?.getBoundingClientRect().bottom ?? -Infinity));
    const exitDistance = Math.max(0, viewportHeight - finalBottom);
    const exitBlend = Math.max(1, viewportHeight * .12);
    const exitOffset = exitDistance < exitBlend ? exitDistance * exitDistance / (2 * exitBlend) : exitDistance - exitBlend / 2;
    const curveZoneCenterY = viewportHeight * (isMobile ? .4 : .38) - exitOffset;
    const exitFactor = getBrandCurveExitFactor(viewportHeight, finalBottom, viewportHeight * (isMobile ? .4 : .38));
    const viewportWidth = document.documentElement.clientWidth;
    const surfaceBounds = section.querySelector(".home-brands__frame")?.getBoundingClientRect() ?? sectionBounds;
    const surfaceCenter = surfaceBounds.left + surfaceBounds.width / 2;
    const curveZoneRadiusY = viewportHeight * (isMobile ? 1.82 : 1.78) * .5;
    sceneFrames.forEach(({ scene, bounds, width, height }) => {
      if (scene.needsResize) scene.resize(width, height);
      const driftTarget = parallaxPhase * maximumParallax * scene.motionFactor;
      const driftChanged = Math.abs(scene.driftY - driftTarget) > .01;
      scene.bend = curveBend * exitFactor;
      const hoverZoomTarget = scene.media.classList.contains("is-makervil-pointer-hover") || scene.media.matches(":hover") ? 1.04 : 1;
      scene.hoverZoom += (hoverZoomTarget - scene.hoverZoom) * .1;
      if (Math.abs(hoverZoomTarget - scene.hoverZoom) < 1e-4) scene.hoverZoom = hoverZoomTarget;
      else needsNextFrame = true;
      scene.driftY = driftTarget;
      scene.material.uniforms.uBend.value = scene.bend;
      scene.material.uniforms.uHoverZoom.value = scene.hoverZoom;
      scene.material.uniforms.uCurveCenter.value = curveZoneCenterY;
      scene.material.uniforms.uMediaBounds.value.set(bounds.left, bounds.top, bounds.width, bounds.height);
      scene.material.uniforms.uViewportSize.value.set(viewportWidth, viewportHeight);
      scene.material.uniforms.uSurfaceCenter.value = surfaceCenter;
      scene.material.uniforms.uCurveRadius.value = curveZoneRadiusY;
      scene.cardInner.style.setProperty("--home-brand-drift-y", `${scene.driftY.toFixed(2)}px`);
      scene.media.classList.toggle("is-webgl-motion-active", scene.bend > .003);
      const gutterX = (scene.renderWidth - scene.media.clientWidth) / 2;
      const gutterY = (scene.renderHeight - scene.media.clientHeight) / 2;
      scene.renderer.setViewport(-bounds.left + gutterX, bounds.bottom - viewportHeight + gutterY, viewportWidth, viewportHeight);
      scene.renderer.render(scene.scene, scene.camera);
      scene.media.classList.add("is-webgl-ready");
      scene.media.classList.remove("is-webgl-pending");
      const card = scene.media.closest("[data-home-brand-card]");
      if (driftChanged || card?.getAnimations().some((animation) => animation.playState === "running")) needsNextFrame = true;
    });
    if (needsNextFrame) frameId = window.requestAnimationFrame(renderFrame);
  };
  const requestRender = () => {
    if (!destroyed && frameId === null && isNearViewport && scenes.length > 0) frameId = window.requestAnimationFrame(renderFrame);
  };
  const createScenes = async () => {
    if (destroyed) return;
    if (initializePromise !== null) return initializePromise;
    initializePromise = (async () => {
      cards.forEach((card) => {
        const image = card.querySelector("[data-home-brand-image]");
        if (image) image.loading = "eager";
      });
      const THREE = await __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url);
      if (destroyed) return;
      const createdScenes = [];
      for (const card of cards) {
        const media = card.querySelector("[data-home-brand-media]");
        const cardInner = card.querySelector("[data-home-brand-card-inner]");
        const image = card.querySelector("[data-home-brand-image]");
        const canvas = card.querySelector("[data-home-brand-canvas]");
        if (!cardInner || !media || !image || !canvas || !await waitForImage(image) || destroyed) {
          media?.classList.remove("is-webgl-pending");
          continue;
        }
        try {
          const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          });
          renderer.setClearColor(1118481, 0);
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          const camera = new THREE.PerspectiveCamera(45, 1, .1, 10);
          camera.position.z = 2.5;
          const textureEdge = Math.min(1536, Math.ceil(Math.max(media.clientWidth, media.clientHeight) * 1.725));
          const textureScale = Math.min(1, textureEdge / Math.max(image.naturalWidth, image.naturalHeight));
          const bitmap = typeof createImageBitmap === "function" ? await createImageBitmap(image, {
            resizeWidth: Math.max(1, Math.round(image.naturalWidth * textureScale)),
            resizeHeight: Math.max(1, Math.round(image.naturalHeight * textureScale)),
            resizeQuality: "high",
            imageOrientation: "flipY",
            premultiplyAlpha: "none"
          }).catch(() => null) : null;
          if (destroyed) {
            bitmap?.close();
            renderer.dispose();
            return;
          }
          const texture = new THREE.Texture(bitmap ?? image);
          if (bitmap) texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.needsUpdate = true;
          const initialBend = getCurveBend();
          const material = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: texture },
              uPlaneSize: { value: new THREE.Vector2(1, 1) },
              uImageSize: { value: new THREE.Vector2(image.naturalWidth, image.naturalHeight) },
              uHoverZoom: { value: 1 },
              uBend: { value: initialBend },
              uAxis: { value: 0 },
              uMediaBounds: { value: new THREE.Vector4() },
              uViewportSize: { value: new THREE.Vector2(1, 1) },
              uSurfaceCenter: { value: 0 },
              uCurveCenter: { value: .5 },
              uCurveRadius: { value: .3 }
            },
            vertexShader: brandCurveVertexShader,
            fragmentShader,
            side: THREE.DoubleSide
          });
          const geometry = new THREE.PlaneGeometry(2, 2.25, 48, 64);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.frustumCulled = false;
          const scene = new THREE.Scene();
          scene.add(mesh);
          const brandScene = {
            cardInner,
            media,
            canvas,
            renderer,
            camera,
            scene,
            mesh,
            material,
            texture,
            bitmap,
            contextLost: false,
            bend: initialBend,
            driftY: 0,
            motionFactor: .9 + cards.indexOf(card) % 3 * .08,
            hoverZoom: 1,
            resize: () => void 0,
            needsResize: true,
            onContextLost: () => void 0,
            onContextRestored: () => void 0,
            renderWidth: 0,
            renderHeight: 0,
            pixelRatio: 0
          };
          brandScene.resize = (measuredWidth, measuredHeight) => {
            const width = Math.max(1, measuredWidth ?? media.clientWidth);
            const height = Math.max(1, measuredHeight ?? media.clientHeight);
            const overscanX = Math.ceil(Math.max(width * .075, window.innerWidth * .04));
            const overscanY = Math.ceil(height * .075);
            const renderWidth = width + overscanX * 2;
            const renderHeight = height + overscanY * 2;
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, 1536 / Math.max(renderWidth, renderHeight), Math.sqrt(14e5 / (renderWidth * renderHeight)));
            brandScene.needsResize = false;
            if (brandScene.renderWidth === renderWidth && brandScene.renderHeight === renderHeight && brandScene.pixelRatio === pixelRatio) return;
            cardInner.style.setProperty("--home-brand-canvas-gutter-x", `${overscanX}px`);
            cardInner.style.setProperty("--home-brand-canvas-gutter-y", `${overscanY}px`);
            brandScene.renderWidth = renderWidth;
            brandScene.renderHeight = renderHeight;
            brandScene.pixelRatio = pixelRatio;
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(renderWidth, renderHeight, false);
            camera.aspect = renderWidth / renderHeight;
            camera.updateProjectionMatrix();
            const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * camera.position.z;
            const mediaVisibleWidth = visibleHeight * camera.aspect * (width / renderWidth);
            const mediaVisibleHeight = visibleHeight * (height / renderHeight);
            mesh.scale.set(mediaVisibleWidth / 2, mediaVisibleHeight / 2.25, 1);
            material.uniforms.uPlaneSize.value.set(width, height);
          };
          brandScene.onContextLost = (event) => {
            event.preventDefault();
            brandScene.contextLost = true;
            media.classList.remove("is-webgl-ready", "is-webgl-pending");
          };
          brandScene.onContextRestored = () => {
            if (destroyed) return;
            brandScene.contextLost = false;
            texture.needsUpdate = true;
            brandScene.resize();
            requestRender();
          };
          canvas.addEventListener("webglcontextlost", brandScene.onContextLost);
          canvas.addEventListener("webglcontextrestored", brandScene.onContextRestored);
          await renderer.compileAsync(scene, camera);
          if (destroyed) {
            destroyScene(brandScene);
            return;
          }
          renderer.initTexture(texture);
          brandScene.resize();
          scenes.push(brandScene);
          requestRender();
          media.classList.add("is-webgl-motion-active");
          createdScenes.push(brandScene);
        } catch {
          media.classList.remove("is-webgl-ready", "is-webgl-pending");
        }
      }
      if (destroyed) return;
      scenes = createdScenes;
      requestRender();
    })().catch(() => {
      cards.forEach((card) => card.querySelector("[data-home-brand-media]")?.classList.remove("is-webgl-pending"));
    });
    return initializePromise;
  };
  const destroyScene = (brandScene) => {
    brandScene.canvas.removeEventListener("webglcontextlost", brandScene.onContextLost);
    brandScene.canvas.removeEventListener("webglcontextrestored", brandScene.onContextRestored);
    brandScene.media.classList.remove("is-webgl-ready", "is-webgl-motion-active");
    brandScene.cardInner.style.removeProperty("--home-brand-canvas-gutter-x");
    brandScene.cardInner.style.removeProperty("--home-brand-canvas-gutter-y");
    brandScene.cardInner.style.removeProperty("--home-brand-drift-y");
    brandScene.scene.remove(brandScene.mesh);
    brandScene.mesh.geometry.dispose();
    brandScene.material.dispose();
    brandScene.texture.dispose();
    brandScene.bitmap?.close();
    brandScene.renderer.dispose();
    brandScene.renderer.forceContextLoss();
  };
  const visibilityObserver = new IntersectionObserver((entries) => {
    if (destroyed) return;
    const sectionEntry = entries[0];
    isNearViewport = Boolean(sectionEntry?.isIntersecting);
    if (!isNearViewport) {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      resetScenes();
      return;
    }
    createScenes();
    requestRender();
  }, {
    rootMargin: "200% 0px",
    threshold: 0
  });
  cards.forEach((card) => card.querySelector("[data-home-brand-media]")?.classList.add("is-webgl-pending"));
  visibilityObserver.observe(section);
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", resizeScenes, { passive: true });
  section.addEventListener("pointermove", requestRender, { passive: true });
  section.addEventListener("pointerleave", requestRender, { passive: true });
  document.addEventListener("visibilitychange", requestRender);
  return () => {
    if (destroyed) return;
    destroyed = true;
    isNearViewport = false;
    visibilityObserver.disconnect();
    window.removeEventListener("scroll", requestRender);
    window.removeEventListener("resize", resizeScenes);
    section.removeEventListener("pointermove", requestRender);
    section.removeEventListener("pointerleave", requestRender);
    document.removeEventListener("visibilitychange", requestRender);
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    cards.forEach((card) => card.querySelector("[data-home-brand-media]")?.classList.remove("is-webgl-pending"));
    scenes.forEach(destroyScene);
    scenes = [];
  };
};
//#endregion
//#region resources/ts/home-brands.ts
var HOME_INTRO_COMPLETE_EVENT$4 = "l-portfolio:home-intro-complete";
var initializeHomeBrands = () => {
  const brandsSection = document.querySelector("[data-home-brands]");
  if (!brandsSection || brandsSection.dataset.homeBrandsInitialized === "true") return;
  brandsSection.dataset.homeBrandsInitialized = "true";
  initializeHomeBrandGallery(brandsSection);
  const brandCards = Array.from(brandsSection.querySelectorAll("[data-home-brand-card]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;
  const pendingCards = /* @__PURE__ */ new WeakSet();
  const headingRevealTarget = brandsSection.querySelector(".home-brands__label") ?? brandsSection;
  brandsSection.classList.add("is-home-brands-managed");
  const revealBrands = () => {
    if (brandsSection.classList.contains("is-home-brands-visible")) return;
    brandsSection.classList.add("is-home-brands-visible");
  };
  const revealCard = (card) => {
    card.classList.add("is-home-brand-visible");
  };
  const activateReveal = () => {
    if (reducedMotion || !supportsObserver) {
      revealBrands();
      brandCards.forEach(revealCard);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(revealBrands);
      });
    }, {
      threshold: .18,
      rootMargin: "0px 0px -10% 0px"
    });
    observer.observe(headingRevealTarget);
    if (brandCards.length === 0) return;
    const cardObserver = new IntersectionObserver((entries, currentObserver) => {
      entries.filter((entry) => entry.isIntersecting).sort((left, right) => {
        const topDifference = left.boundingClientRect.top - right.boundingClientRect.top;
        return Math.abs(topDifference) > 4 ? topDifference : left.boundingClientRect.left - right.boundingClientRect.left;
      }).forEach((entry, entryIndex) => {
        const card = entry.target;
        if (pendingCards.has(card)) return;
        pendingCards.add(card);
        currentObserver.unobserve(card);
        window.setTimeout(() => revealCard(card), entryIndex * 100);
      });
    }, {
      threshold: .14,
      rootMargin: "0px 0px -6% 0px"
    });
    brandCards.forEach((card) => cardObserver.observe(card));
  };
  if (document.querySelector("[data-home-intro]")) window.addEventListener(HOME_INTRO_COMPLETE_EVENT$4, activateReveal, { once: true });
  else window.requestAnimationFrame(activateReveal);
};
//#endregion
//#region resources/ts/home-hero-glass.ts
var HOME_INTRO_COMPLETE_EVENT$3 = "l-portfolio:home-intro-complete";
var SITE_THEME_CHANGE_EVENT = "l-portfolio:site-theme-change";
var HERO_SELECTOR = "[data-home-hero]";
var HERO_CANVAS_SELECTOR = "[data-home-hero-glass]";
var HERO_REFRACT_TEXT_SELECTOR = "[data-home-hero-refract]";
var HERO_BACKGROUND = "#111111";
var HERO_FOREGROUND = "#ffffff";
var HERO_TEXT_REFRACTION_MIN_WIDTH = 769;
var HERO_GLASS_FINAL_OPACITY = 1;
var HERO_THEME_SYNC_DURATION = 760;
var CAMERA_FOV = 38;
var CAMERA_Z = 5.4;
var BACKDROP_DISTANCE = 2.6;
var ROTATION_EASING = .075;
var OBJECT_REVEAL_DURATION = 1.2;
var OBJECT_REVEAL_OVERSHOOT = 1.035;
var OBJECT_REVEAL_EXPAND_END = .76;
var MOTION_EPSILON = 8e-4;
var WARMUP_RENDER_WIDTH = 320;
var MOBILE_OBJECT_WIDTH_RATIO = .84;
var BASE_ROTATION = {
  x: -.12,
  y: .2,
  z: .015
};
var clamp$2 = (value, min, max) => Math.min(max, Math.max(min, value));
var easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
var easeOutQuart = (value) => 1 - Math.pow(1 - value, 4);
var smoothStep = (value) => value * value * (3 - 2 * value);
var getObjectRevealScale = (progress) => {
  if (progress < OBJECT_REVEAL_EXPAND_END) return easeOutQuart(clamp$2(progress / OBJECT_REVEAL_EXPAND_END, 0, 1)) * OBJECT_REVEAL_OVERSHOOT;
  const settleProgress = clamp$2((progress - OBJECT_REVEAL_EXPAND_END) / (1 - OBJECT_REVEAL_EXPAND_END), 0, 1);
  return OBJECT_REVEAL_OVERSHOOT + (1 - OBJECT_REVEAL_OVERSHOOT) * smoothStep(settleProgress);
};
var isHeroInViewport = (hero) => {
  const bounds = hero.getBoundingClientRect();
  return bounds.bottom > 0 && bounds.top < window.innerHeight;
};
var initializeHomeHeroGlass = () => {
  const hero = document.querySelector(HERO_SELECTOR);
  const canvas = hero?.querySelector(HERO_CANVAS_SELECTOR);
  if (!hero || !canvas || hero.dataset.homeHeroGlassInitialized === "true") return;
  hero.dataset.homeHeroGlassInitialized = "true";
  const sculptureLayout = hero.dataset.homeHeroLayout === "sculpture";
  if (!("WebGLRenderingContext" in window)) {
    canvas.hidden = true;
    return;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let introComplete = !document.querySelector("[data-home-intro]");
  let initialized = false;
  let contextLost = false;
  let nearViewport = isHeroInViewport(hero);
  let frameId = null;
  let resizeFrameId = null;
  let resizeTimerId = null;
  let themeFrameId = null;
  let backdropDirty = false;
  let resizeDirty = false;
  let previousFrameTime = performance.now();
  let lastMobileIdleFrameTime = 0;
  let mobileIdleElapsedSeconds = 0;
  let currentRotation = { ...BASE_ROTATION };
  let targetRotation = { ...BASE_ROTATION };
  let fittedObjectScale = 1;
  let lastBackdropWidth = 0;
  let lastBackdropHeight = 0;
  let renderWidth = 0;
  let renderHeight = 0;
  let renderPixelRatio = 0;
  let renderIsWarmup = null;
  let objectRevealProgress = reducedMotion.matches ? 1 : 0;
  canvas.style.setProperty("--home-hero-glass-opacity", reducedMotion.matches ? HERO_GLASS_FINAL_OPACITY.toString() : "0");
  const showCanvasWhenReady = () => {
    hero.classList.toggle("is-home-hero-glass-active", initialized && introComplete && !contextLost);
  };
  const markUnavailable = () => {
    contextLost = true;
    hero.classList.remove("is-home-hero-glass-active");
    hero.classList.add("is-home-hero-glass-unavailable");
    canvas.hidden = true;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
  };
  (async () => {
    try {
      const THREE = await __vitePreload(() => import("./chunks/three.module-DbTyATjt.js"), [], import.meta.url);
      if (!document.documentElement.contains(hero)) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: !finePointer.matches
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.transmissionResolutionScale = .5;
      renderer.setClearColor(0, 0);
      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, .1, 60);
      camera.position.set(0, 0, CAMERA_Z);
      const glassObject = createMakervilGlassObject({
        THREE,
        renderer
      });
      const { group: glassGroup, geometrySize, environmentRenderTarget } = glassObject;
      const objectAspect = geometrySize.x / Math.max(geometrySize.y, .001);
      scene.add(glassGroup);
      scene.environment = environmentRenderTarget.texture;
      const backdropCanvas = document.createElement("canvas");
      const backdropTexture = new THREE.CanvasTexture(backdropCanvas);
      backdropTexture.colorSpace = THREE.SRGBColorSpace;
      backdropTexture.anisotropy = 1;
      backdropTexture.generateMipmaps = false;
      backdropTexture.minFilter = THREE.LinearFilter;
      backdropTexture.magFilter = THREE.LinearFilter;
      const backdropMaterial = new THREE.MeshBasicMaterial({
        map: backdropTexture,
        toneMapped: false
      });
      const backdropMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backdropMaterial);
      backdropMesh.position.z = -2.6;
      backdropMesh.onBeforeRender = (activeRenderer) => {
        const isTransmissionPass = activeRenderer.getRenderTarget() !== null;
        backdropMaterial.colorWrite = isTransmissionPass;
        backdropMaterial.depthWrite = isTransmissionPass;
      };
      scene.add(backdropMesh);
      const syncBackdrop = () => {
        if (initialized && (!nearViewport || document.hidden)) {
          backdropDirty = true;
          return;
        }
        backdropDirty = false;
        const canvasBounds = canvas.getBoundingClientRect();
        if (canvasBounds.width <= 0 || canvasBounds.height <= 0) return;
        const requestedScale = Math.min(window.devicePixelRatio || 1, 1.25);
        const textureScale = Math.min(requestedScale, 2048 / canvasBounds.width, 2048 / canvasBounds.height);
        const textureWidth = Math.max(1, Math.round(canvasBounds.width * textureScale));
        const textureHeight = Math.max(1, Math.round(canvasBounds.height * textureScale));
        if (lastBackdropWidth !== textureWidth || lastBackdropHeight !== textureHeight) {
          lastBackdropWidth = textureWidth;
          lastBackdropHeight = textureHeight;
          backdropCanvas.width = textureWidth;
          backdropCanvas.height = textureHeight;
        }
        const context = backdropCanvas.getContext("2d");
        if (!context) return;
        context.fillStyle = HERO_BACKGROUND;
        context.fillRect(0, 0, backdropCanvas.width, backdropCanvas.height);
        if (canvasBounds.width >= HERO_TEXT_REFRACTION_MIN_WIDTH) {
          const refractedLines = hero.querySelectorAll(HERO_REFRACT_TEXT_SELECTOR);
          context.save();
          context.scale(textureScale, textureScale);
          refractedLines.forEach((line) => {
            const textElement = line.querySelector(".makervil-ready__line-text");
            if (!textElement) return;
            const styles = window.getComputedStyle(textElement);
            if (styles.display === "none" || styles.visibility === "hidden" || Number.parseFloat(styles.opacity || "1") <= 0) return;
            const text = (textElement.textContent ?? "").trim();
            const lineBounds = line.getBoundingClientRect();
            if (!text || lineBounds.width <= 0 || lineBounds.height <= 0 || lineBounds.right <= canvasBounds.left || lineBounds.left >= canvasBounds.right || lineBounds.bottom <= canvasBounds.top || lineBounds.top >= canvasBounds.bottom) return;
            const textTransform = styles.textTransform;
            const renderedText = textTransform === "uppercase" ? text.toLocaleUpperCase() : textTransform === "lowercase" ? text.toLocaleLowerCase() : text;
            const textAlign = styles.textAlign;
            const isRightAligned = textAlign === "right" || textAlign === "end";
            const isCentered = textAlign === "center";
            const relativeLeft = lineBounds.left - canvasBounds.left;
            const relativeRight = lineBounds.right - canvasBounds.left;
            const drawX = isRightAligned ? relativeRight : isCentered ? (relativeLeft + relativeRight) / 2 : relativeLeft;
            const drawY = lineBounds.top - canvasBounds.top + lineBounds.height / 2;
            context.save();
            context.fillStyle = HERO_FOREGROUND;
            context.font = [
              styles.fontStyle,
              styles.fontWeight,
              styles.fontSize,
              styles.fontFamily
            ].filter(Boolean).join(" ");
            context.textAlign = isRightAligned ? "right" : isCentered ? "center" : "left";
            context.textBaseline = "middle";
            context.direction = styles.direction;
            const textContext = context;
            textContext.fontKerning = styles.fontKerning;
            textContext.letterSpacing = styles.letterSpacing === "normal" ? "0px" : styles.letterSpacing;
            context.fillText(renderedText, drawX, drawY);
            context.restore();
          });
          context.restore();
        }
        backdropTexture.needsUpdate = true;
      };
      const renderScene = () => {
        if (!document.hidden && (!initialized || nearViewport)) renderer.render(scene, camera);
      };
      const fitBackdrop = () => {
        const distance = camera.position.z + BACKDROP_DISTANCE;
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
        backdropMesh.scale.set(visibleHeight * camera.aspect, visibleHeight, 1);
      };
      const fitGlassObject = (width) => {
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        const visibleWidth = visibleHeight * camera.aspect;
        const mobile = width <= 560;
        const tablet = width <= 959;
        const widthRatio = sculptureLayout ? mobile ? .7 : tablet ? .58 : .44 : mobile ? MOBILE_OBJECT_WIDTH_RATIO : tablet ? .72 : .49;
        const heightRatio = sculptureLayout ? mobile ? .46 : tablet ? .54 : .61 : mobile ? .45 : tablet ? .59 : .69;
        fittedObjectScale = Math.min(visibleWidth * widthRatio, visibleHeight * heightRatio * objectAspect) / Math.max(geometrySize.x, .001);
        glassGroup.scale.setScalar(fittedObjectScale * getObjectRevealScale(objectRevealProgress));
      };
      const resize = (force = false) => {
        const width = Math.max(hero.clientWidth, 1);
        const height = Math.max(hero.clientHeight, 1);
        const isWarmup = !introComplete;
        const mobile = width <= 560;
        const nextRenderWidth = isWarmup ? Math.min(width, WARMUP_RENDER_WIDTH) : width;
        const nextRenderHeight = isWarmup ? Math.max(1, Math.round(nextRenderWidth * height / width)) : height;
        const nextPixelRatio = isWarmup ? 1 : Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25, 1920 / nextRenderWidth, Math.sqrt(18e5 / (nextRenderWidth * nextRenderHeight)));
        if (!force && renderWidth === nextRenderWidth && renderHeight === nextRenderHeight && renderPixelRatio === nextPixelRatio && renderIsWarmup === isWarmup) return false;
        renderWidth = nextRenderWidth;
        renderHeight = nextRenderHeight;
        renderPixelRatio = nextPixelRatio;
        renderIsWarmup = isWarmup;
        renderer.setDrawingBufferSize(nextRenderWidth, nextRenderHeight, nextPixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        fitGlassObject(width);
        if (!isWarmup) syncBackdrop();
        fitBackdrop();
        return true;
      };
      const renderFrame = (frameTime) => {
        frameId = null;
        if (!introComplete || !nearViewport || document.hidden || contextLost) return;
        const throttleMobileIdle = !finePointer.matches && !reducedMotion.matches && objectRevealProgress >= 1;
        if (throttleMobileIdle && lastMobileIdleFrameTime > 0 && frameTime - lastMobileIdleFrameTime < 1e3 / 30) {
          frameId = window.requestAnimationFrame(renderFrame);
          return;
        }
        if (throttleMobileIdle) lastMobileIdleFrameTime = frameTime;
        const deltaSeconds = Math.min(Math.max((frameTime - previousFrameTime) / 1e3, 0), .05);
        previousFrameTime = frameTime;
        if (reducedMotion.matches) {
          currentRotation = { ...BASE_ROTATION };
          objectRevealProgress = 1;
        } else objectRevealProgress = clamp$2(objectRevealProgress + deltaSeconds / OBJECT_REVEAL_DURATION, 0, 1);
        const mobileIdleActive = !finePointer.matches && !reducedMotion.matches && objectRevealProgress >= 1;
        if (mobileIdleActive) mobileIdleElapsedSeconds += deltaSeconds;
        const desiredRotation = mobileIdleActive ? getMakervilMobileIdleRotation(mobileIdleElapsedSeconds, BASE_ROTATION) : targetRotation;
        if (!reducedMotion.matches) {
          currentRotation.x += (desiredRotation.x - currentRotation.x) * ROTATION_EASING;
          currentRotation.y += (desiredRotation.y - currentRotation.y) * ROTATION_EASING;
          currentRotation.z += (desiredRotation.z - currentRotation.z) * ROTATION_EASING;
        }
        const revealScale = getObjectRevealScale(objectRevealProgress);
        const revealEase = easeOutCubic(objectRevealProgress);
        const revealTilt = reducedMotion.matches ? 0 : 1 - revealEase;
        const revealOpacity = reducedMotion.matches ? 1 : smoothStep(clamp$2(objectRevealProgress / .82, 0, 1));
        glassGroup.scale.setScalar(fittedObjectScale * revealScale);
        canvas.style.setProperty("--home-hero-glass-opacity", (revealOpacity * HERO_GLASS_FINAL_OPACITY).toFixed(4));
        glassGroup.rotation.set(currentRotation.x + revealTilt * .075, currentRotation.y - revealTilt * .14, currentRotation.z + revealTilt * .03);
        glassGroup.position.y = 0;
        glassGroup.position.z = reducedMotion.matches ? 0 : revealTilt * -.18;
        renderScene();
        const rotationIsMoving = Math.abs(desiredRotation.x - currentRotation.x) > MOTION_EPSILON || Math.abs(desiredRotation.y - currentRotation.y) > MOTION_EPSILON || Math.abs(desiredRotation.z - currentRotation.z) > MOTION_EPSILON;
        if (!reducedMotion.matches && (objectRevealProgress < 1 || rotationIsMoving || mobileIdleActive)) frameId = window.requestAnimationFrame(renderFrame);
      };
      const requestRender = () => {
        if (frameId === null && introComplete && nearViewport && !document.hidden && !contextLost) {
          previousFrameTime = performance.now();
          frameId = window.requestAnimationFrame(renderFrame);
        }
      };
      const handleThemeChange = () => {
        if (themeFrameId !== null) {
          window.cancelAnimationFrame(themeFrameId);
          themeFrameId = null;
        }
        if (!nearViewport || document.hidden) {
          backdropDirty = true;
          return;
        }
        const startedAt = performance.now();
        const syncThemeFrame = (frameTime) => {
          if (!nearViewport || document.hidden) {
            backdropDirty = true;
            themeFrameId = null;
            return;
          }
          syncBackdrop();
          renderScene();
          if (frameTime - startedAt < HERO_THEME_SYNC_DURATION) themeFrameId = window.requestAnimationFrame(syncThemeFrame);
          else themeFrameId = null;
        };
        themeFrameId = window.requestAnimationFrame(syncThemeFrame);
      };
      const commitResize = () => {
        if (resizeFrameId !== null) return;
        resizeFrameId = window.requestAnimationFrame(() => {
          resizeFrameId = null;
          if (initialized && (!nearViewport || document.hidden)) {
            resizeDirty = true;
            return;
          }
          resizeDirty = false;
          if (resize()) renderScene();
          requestRender();
        });
      };
      const scheduleResize = () => {
        if (!finePointer.matches && introComplete) {
          if (resizeTimerId !== null) window.clearTimeout(resizeTimerId);
          resizeTimerId = window.setTimeout(() => {
            resizeTimerId = null;
            commitResize();
          }, 160);
          return;
        }
        commitResize();
      };
      const resetPointerRotation = () => {
        targetRotation = { ...BASE_ROTATION };
      };
      const handlePointerMove = (event) => {
        if (!introComplete || !nearViewport || reducedMotion.matches || !finePointer.matches) return;
        const bounds = hero.getBoundingClientRect();
        if (!(event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom)) {
          resetPointerRotation();
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
      const visibilityObserver = new IntersectionObserver((entries) => {
        nearViewport = entries.some((entry) => entry.isIntersecting);
        if (nearViewport) {
          if (resizeDirty) commitResize();
          if (backdropDirty) syncBackdrop();
          requestRender();
        } else if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
      }, {
        threshold: 0,
        rootMargin: "0px"
      });
      visibilityObserver.observe(hero);
      const resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(hero);
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (frameId !== null) window.cancelAnimationFrame(frameId);
          frameId = null;
          if (themeFrameId !== null) {
            window.cancelAnimationFrame(themeFrameId);
            themeFrameId = null;
            backdropDirty = true;
          }
          return;
        }
        if (nearViewport) {
          if (resizeDirty) commitResize();
          if (backdropDirty) syncBackdrop();
          requestRender();
        }
      };
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("resize", scheduleResize, { passive: true });
      window.addEventListener(SITE_THEME_CHANGE_EVENT, handleThemeChange);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.addEventListener("change", () => {
        resetPointerRotation();
        requestRender();
      });
      canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        markUnavailable();
      });
      canvas.addEventListener("webglcontextrestored", () => {
        contextLost = false;
        canvas.hidden = false;
        hero.classList.remove("is-home-hero-glass-unavailable");
        resize(true);
        renderScene();
        showCanvasWhenReady();
        requestRender();
      });
      const activate = () => {
        introComplete = true;
        resize();
        renderScene();
        showCanvasWhenReady();
        requestRender();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            syncBackdrop();
            requestRender();
          });
        });
        window.setTimeout(() => {
          syncBackdrop();
          requestRender();
        }, 1700);
      };
      introComplete = introComplete || !document.querySelector("[data-home-intro]");
      if (introComplete) window.requestAnimationFrame(activate);
      else window.addEventListener(HOME_INTRO_COMPLETE_EVENT$3, activate, { once: true });
      resize();
      glassGroup.rotation.set(BASE_ROTATION.x, BASE_ROTATION.y, BASE_ROTATION.z);
      renderScene();
      initialized = true;
      showCanvasWhenReady();
      document.fonts?.ready.then(() => {
        syncBackdrop();
        requestRender();
      });
      window.addEventListener("pagehide", (event) => {
        if (event.persisted) return;
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        if (resizeFrameId !== null) window.cancelAnimationFrame(resizeFrameId);
        if (resizeTimerId !== null) window.clearTimeout(resizeTimerId);
        if (themeFrameId !== null) window.cancelAnimationFrame(themeFrameId);
        window.removeEventListener(SITE_THEME_CHANGE_EVENT, handleThemeChange);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        scene.remove(glassGroup);
        scene.environment = null;
        glassObject.dispose();
        backdropMesh.geometry.dispose();
        backdropMaterial.dispose();
        backdropTexture.dispose();
        renderer.dispose();
      }, { once: true });
    } catch (error) {
      console.error("[L Portfolio] Failed to initialize the home hero glass object.", error);
      markUnavailable();
    }
  })();
};
//#endregion
//#region resources/ts/home-news.ts
var HOME_INTRO_COMPLETE_EVENT$2 = "l-portfolio:home-intro-complete";
var NEWS_ROOT_SELECTOR = "[data-home-news]";
var NEWS_LIST_SELECTOR = "[data-home-news-list]";
var NEWS_ITEM_SELECTOR = "[data-home-news-item]";
var NEWS_PREVIEW_SELECTOR = "[data-home-news-preview]";
var NEWS_CURRENT_SELECTOR = "[data-home-news-preview-current]";
var NEWS_NEXT_SELECTOR = "[data-home-news-preview-next]";
var NEWS_DESKTOP_QUERY = "(min-width: 960px)";
var NEWS_CLIP_OPEN = "inset(0 0 0 0)";
var NEWS_CLIP_CLOSED_FROM_BOTTOM = "inset(100% 0 0 0)";
var NEWS_CLIP_CLOSED_FROM_TOP = "inset(0 0 100% 0)";
var NEWS_PREVIEW_CORE_SIZE = 28;
var POINTER_TARGET_CHANGE_EVENT = "l-portfolio:pointer-target-change";
var HomeNewsInteraction = class {
  constructor(root) {
    this.desktopQuery = window.matchMedia(NEWS_DESKTOP_QUERY);
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.activeItem = null;
    this.activeSource = "";
    this.stagedSource = "";
    this.transitionId = 0;
    this.layerAnimation = null;
    this.exitAnimation = null;
    this.returnAnimation = null;
    this.isExiting = false;
    this.trackPreviewDuringExit = (event) => {
      if (this.isExiting) this.movePreview(event.clientX, event.clientY);
    };
    this.syncPointerTarget = (event) => {
      if (!this.desktopQuery.matches) return;
      const { target, clientX, clientY } = event.detail;
      const item = target?.closest(NEWS_ITEM_SELECTOR) ?? null;
      if (!item || !this.list?.contains(item)) {
        if (this.activeItem) this.hidePreview();
        return;
      }
      if (item === this.activeItem) {
        this.movePreview(clientX, clientY);
        return;
      }
      this.activate(item, clientX, clientY);
    };
    this.hidePreview = () => {
      this.activeItem?.classList.remove("is-home-news-active");
      this.activeItem = null;
      this.transitionId += 1;
      if (this.layerAnimation && this.stagedSource) this.promoteStagedImage();
      this.stopLayerAnimation();
      if (!this.preview || !this.previewFrame || !this.root.classList.contains("is-home-news-preview-visible")) {
        this.resetPreview();
        return;
      }
      const interruptedReturnClip = this.cancelReturnAnimation();
      this.stopExitAnimation();
      if (this.reducedMotionQuery.matches || typeof this.preview.animate !== "function") {
        this.resetPreview();
        return;
      }
      this.isExiting = true;
      this.preview.classList.add("is-home-news-preview-exiting");
      document.documentElement.classList.add("is-home-news-cursor-preview-exiting");
      const computedClip = interruptedReturnClip ?? window.getComputedStyle(this.previewFrame).clipPath;
      const startClip = computedClip && computedClip !== "none" ? computedClip : NEWS_CLIP_OPEN;
      const frameBounds = this.previewFrame.getBoundingClientRect();
      const horizontalInset = Math.max(0, (frameBounds.width - NEWS_PREVIEW_CORE_SIZE) * .5);
      const verticalInset = Math.max(0, (frameBounds.height - NEWS_PREVIEW_CORE_SIZE) * .5);
      const coreClip = `inset(${verticalInset}px ${horizontalInset}px ${verticalInset}px ${horizontalInset}px)`;
      const animation = this.previewFrame.animate([{ clipPath: startClip }, { clipPath: coreClip }], {
        duration: 620,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "both"
      });
      this.exitAnimation = animation;
      animation.finished.then(() => {
        if (this.exitAnimation !== animation || this.activeItem) return;
        this.exitAnimation = null;
        this.resetPreview();
        animation.cancel();
      }, () => {
        if (this.exitAnimation === animation) this.exitAnimation = null;
      });
    };
    this.root = root;
    this.list = root.querySelector(NEWS_LIST_SELECTOR);
    this.items = Array.from(root.querySelectorAll(NEWS_ITEM_SELECTOR));
    this.preview = root.querySelector(NEWS_PREVIEW_SELECTOR);
    this.previewFrame = this.preview?.querySelector(".home-news__preview-frame") ?? null;
    this.currentLayer = root.querySelector(NEWS_CURRENT_SELECTOR);
    this.nextLayer = root.querySelector(NEWS_NEXT_SELECTOR);
    this.currentImage = this.currentLayer?.querySelector("img") ?? null;
    this.nextImage = this.nextLayer?.querySelector("img") ?? null;
  }
  mount() {
    if (!this.list || this.items.length === 0) return;
    if (this.preview) document.body.append(this.preview);
    this.items.forEach((item) => {
      item.addEventListener("pointerenter", (event) => this.activate(item, event.clientX, event.clientY));
      item.addEventListener("pointermove", (event) => this.movePreview(event.clientX, event.clientY));
      item.addEventListener("focus", () => {
        if (item === this.activeItem) return;
        const center = this.itemCenter(item);
        this.activate(item, center.x, center.y);
      });
    });
    this.list.addEventListener("pointermove", (event) => {
      if (this.activeItem) this.movePreview(event.clientX, event.clientY);
    });
    this.list.addEventListener("pointerleave", this.hidePreview);
    window.addEventListener("pointermove", this.trackPreviewDuringExit, { passive: true });
    window.addEventListener(POINTER_TARGET_CHANGE_EVENT, this.syncPointerTarget);
    this.list.addEventListener("focusout", (event) => {
      if (!this.list?.contains(event.relatedTarget)) this.hidePreview();
    });
    this.desktopQuery.addEventListener("change", () => {
      if (!this.desktopQuery.matches) this.hidePreview();
    });
  }
  itemCenter(item) {
    const bounds = item.getBoundingClientRect();
    return {
      x: bounds.left + bounds.width * .5,
      y: bounds.top + bounds.height * .5
    };
  }
  movePreview(clientX, clientY) {
    if (!this.preview || !this.desktopQuery.matches) return;
    this.preview.style.setProperty("--home-news-preview-x", `${clientX.toFixed(2)}px`);
    this.preview.style.setProperty("--home-news-preview-y", `${clientY.toFixed(2)}px`);
  }
  activate(item, clientX, clientY) {
    if (item === this.activeItem) {
      this.movePreview(clientX, clientY);
      return;
    }
    const previousItem = this.activeItem;
    const revealDirection = previousItem && item.getBoundingClientRect().top < previousItem.getBoundingClientRect().top ? "top" : "bottom";
    previousItem?.classList.remove("is-home-news-active");
    this.activeItem = item;
    this.activeItem.classList.add("is-home-news-active");
    this.movePreview(clientX, clientY);
    if (!this.desktopQuery.matches) return;
    const source = item.dataset.homeNewsImage ?? "";
    const alt = item.dataset.homeNewsAlt ?? "";
    this.showImage(source, alt, revealDirection);
  }
  stopExitAnimation() {
    this.exitAnimation?.cancel();
    this.exitAnimation = null;
    this.isExiting = false;
    this.preview?.classList.remove("is-home-news-preview-exiting");
    this.previewFrame?.style.removeProperty("clip-path");
    document.documentElement.classList.remove("is-home-news-cursor-preview-exiting");
    if (this.preview) this.preview.style.clipPath = NEWS_CLIP_OPEN;
  }
  clearReturnState() {
    this.preview?.classList.remove("is-home-news-preview-returning");
    document.documentElement.classList.remove("is-home-news-cursor-preview-returning");
    document.documentElement.style.removeProperty("--home-news-preview-return-duration");
  }
  cancelReturnAnimation() {
    const currentClip = this.returnAnimation && this.previewFrame ? window.getComputedStyle(this.previewFrame).clipPath : null;
    this.returnAnimation?.cancel();
    this.returnAnimation = null;
    this.clearReturnState();
    return currentClip && currentClip !== "none" ? currentClip : null;
  }
  resumePreviewFromExit() {
    if (!this.exitAnimation || !this.previewFrame) return;
    const currentClip = window.getComputedStyle(this.previewFrame).clipPath;
    const progress = Math.max(0, Math.min(1, Number(this.exitAnimation.effect?.getComputedTiming().progress ?? 1)));
    const duration = Math.max(220, Math.round(760 * progress));
    this.exitAnimation.cancel();
    this.exitAnimation = null;
    this.isExiting = false;
    document.documentElement.style.setProperty("--home-news-preview-return-duration", `${duration}ms`);
    document.documentElement.classList.add("is-home-news-cursor-preview-returning");
    this.preview?.classList.add("is-home-news-preview-returning");
    this.preview?.classList.remove("is-home-news-preview-exiting");
    document.documentElement.classList.remove("is-home-news-cursor-preview-exiting");
    const animation = this.previewFrame.animate([{ clipPath: currentClip }, { clipPath: NEWS_CLIP_OPEN }], {
      duration,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "both"
    });
    this.returnAnimation = animation;
    animation.finished.then(() => {
      if (this.returnAnimation !== animation) return;
      this.returnAnimation = null;
      this.clearReturnState();
      animation.cancel();
    }, () => {
      if (this.returnAnimation === animation) {
        this.returnAnimation = null;
        this.clearReturnState();
      }
    });
  }
  stopLayerAnimation() {
    this.layerAnimation?.cancel();
    this.layerAnimation = null;
    this.nextLayer?.getAnimations().forEach((animation) => animation.cancel());
  }
  promoteStagedImage() {
    if (!this.stagedSource || !this.currentImage || !this.currentLayer || !this.nextImage) return;
    this.currentImage.src = this.nextImage.currentSrc || this.nextImage.src;
    this.currentImage.alt = this.nextImage.alt;
    this.activeSource = this.stagedSource;
    this.currentLayer.style.clipPath = NEWS_CLIP_OPEN;
    this.stagedSource = "";
  }
  async stageImage(source, alt, transition) {
    if (!this.nextImage) return false;
    this.nextImage.src = source;
    this.nextImage.alt = alt;
    if (!this.nextImage.complete) await new Promise((resolve) => {
      const settle = () => {
        this.nextImage?.removeEventListener("load", settle);
        this.nextImage?.removeEventListener("error", settle);
        resolve();
      };
      this.nextImage?.addEventListener("load", settle, { once: true });
      this.nextImage?.addEventListener("error", settle, { once: true });
    });
    if (this.nextImage.naturalWidth <= 0) return false;
    await this.nextImage.decode?.().catch(() => void 0);
    return transition === this.transitionId && this.activeItem !== null;
  }
  commitStagedImage(source, alt) {
    if (!this.currentImage || !this.currentLayer || !this.nextLayer) return;
    this.currentImage.src = source;
    this.currentImage.alt = alt;
    this.activeSource = source;
    this.stagedSource = "";
    this.currentLayer.style.clipPath = NEWS_CLIP_OPEN;
    this.nextLayer.style.clipPath = NEWS_CLIP_CLOSED_FROM_BOTTOM;
  }
  showImage(source, alt, revealDirection) {
    if (!source || !this.preview || !this.currentLayer || !this.nextLayer || !this.currentImage || !this.nextImage) return;
    const revealStartClip = revealDirection === "top" ? NEWS_CLIP_CLOSED_FROM_TOP : NEWS_CLIP_CLOSED_FROM_BOTTOM;
    const transition = this.transitionId + 1;
    this.transitionId = transition;
    this.resumePreviewFromExit();
    if (this.layerAnimation && this.stagedSource) this.promoteStagedImage();
    this.stopLayerAnimation();
    this.nextLayer.style.clipPath = revealStartClip;
    if (this.activeSource === source && this.root.classList.contains("is-home-news-preview-visible")) return;
    const hasVisibleBase = this.root.classList.contains("is-home-news-preview-visible") && this.activeSource !== "";
    if (!hasVisibleBase) this.currentLayer.style.clipPath = NEWS_CLIP_CLOSED_FROM_BOTTOM;
    this.stageImage(source, alt, transition).then((ready) => {
      if (!ready || transition !== this.transitionId || !this.nextLayer) return;
      this.stagedSource = source;
      this.root.classList.add("is-home-news-preview-visible");
      this.preview?.classList.add("is-home-news-preview-visible");
      document.documentElement.classList.add("has-home-news-cursor-preview");
      this.preview?.style.setProperty("clip-path", NEWS_CLIP_OPEN);
      if (this.reducedMotionQuery.matches || typeof this.nextLayer.animate !== "function") {
        this.commitStagedImage(source, alt);
        return;
      }
      const animation = this.nextLayer.animate([{ clipPath: revealStartClip }, { clipPath: NEWS_CLIP_OPEN }], {
        duration: 1100,
        delay: hasVisibleBase ? 0 : 120,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      });
      this.layerAnimation = animation;
      animation.finished.then(() => {
        if (transition !== this.transitionId) return;
        this.commitStagedImage(source, alt);
        this.layerAnimation = null;
        animation.cancel();
      }, () => {
        if (this.layerAnimation === animation) this.layerAnimation = null;
      });
    });
  }
  resetPreview() {
    this.cancelReturnAnimation();
    this.root.classList.remove("is-home-news-preview-visible");
    this.preview?.classList.remove("is-home-news-preview-visible");
    this.preview?.classList.remove("is-home-news-preview-exiting");
    this.preview?.classList.remove("is-home-news-preview-returning");
    document.documentElement.classList.remove("has-home-news-cursor-preview");
    document.documentElement.classList.remove("is-home-news-cursor-preview-exiting");
    document.documentElement.classList.remove("is-home-news-cursor-preview-returning");
    this.isExiting = false;
    this.activeSource = "";
    this.stagedSource = "";
    this.currentLayer?.style.setProperty("clip-path", NEWS_CLIP_CLOSED_FROM_BOTTOM);
    this.nextLayer?.style.setProperty("clip-path", NEWS_CLIP_CLOSED_FROM_BOTTOM);
    this.preview?.style.setProperty("clip-path", NEWS_CLIP_OPEN);
    this.previewFrame?.style.removeProperty("clip-path");
  }
};
var initializeHomeNews = () => {
  const newsSection = document.querySelector(NEWS_ROOT_SELECTOR);
  if (!newsSection || newsSection.dataset.homeNewsInitialized === "true") return;
  newsSection.dataset.homeNewsInitialized = "true";
  newsSection.classList.add("is-home-news-managed");
  new HomeNewsInteraction(newsSection).mount();
  const revealNews = () => {
    if (!newsSection.classList.contains("is-home-news-visible")) newsSection.classList.add("is-home-news-visible");
  };
  const activateReveal = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealNews();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(revealNews);
      });
    }, {
      threshold: .12,
      rootMargin: "0px 0px -8% 0px"
    });
    observer.observe(newsSection);
  };
  if (document.querySelector("[data-home-intro]")) window.addEventListener(HOME_INTRO_COMPLETE_EVENT$2, activateReveal, { once: true });
  else window.requestAnimationFrame(activateReveal);
};
//#endregion
//#region resources/ts/home-service.ts
var HOME_INTRO_COMPLETE_EVENT$1 = "l-portfolio:home-intro-complete";
var DESKTOP_QUERY = "(min-width: 960px)";
var REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
var IMAGE_TRAVEL_PERCENT = 50;
var CARD_STARTS = [
  .04,
  .29,
  .54
];
var CARD_DURATION = .34;
var FOLLOW_EASING = .14;
var SETTLE_THRESHOLD = 5e-4;
var clamp$1 = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
var easeInOut = (progress) => progress * progress * (3 - 2 * progress);
var initializeHomeService = () => {
  const section = document.querySelector("[data-home-service]");
  if (!section || section.dataset.homeServiceInitialized === "true") return;
  section.dataset.homeServiceInitialized = "true";
  const sticky = section.querySelector(".home-service__sticky");
  const titleTarget = section.querySelector("[data-home-service-split]");
  const simpleRevealRoots = Array.from(section.querySelectorAll(".home-service__reveal--label, [data-home-service-card]"));
  const cards = Array.from(section.querySelectorAll("[data-home-service-card]"));
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const supportsObserver = "IntersectionObserver" in window;
  if (!sticky || cards.length === 0) return;
  let frameId = null;
  let activated = false;
  let hasRendered = false;
  let revealActivated = false;
  let titleStarted = false;
  let titleSplit = null;
  let previousViewportWidth = window.innerWidth;
  let resizeTimer = 0;
  let isNearViewport = !supportsObserver;
  const renderedProgresses = cards.map(() => 0);
  const imageTravelPercents = cards.map(() => IMAGE_TRAVEL_PERCENT);
  const pendingRevealRoots = /* @__PURE__ */ new WeakSet();
  section.classList.add("is-home-service-reveal-managed");
  const isManaged = () => desktop.matches && !reducedMotion.matches;
  const resetCards = () => {
    cards.forEach((card) => {
      card.style.removeProperty("--home-service-image-y");
      card.removeAttribute("data-home-service-progress");
    });
  };
  const syncMode = () => {
    const managed = isManaged();
    section.classList.toggle("is-home-service-managed", managed);
    if (managed) {
      const copyHeight = Math.max(...cards.map((card) => card.querySelector(".home-service__copy")?.offsetHeight ?? 0));
      cards.forEach((card, index) => {
        const media = card.querySelector(".home-service__media");
        imageTravelPercents[index] = media && media.offsetHeight > 0 ? Math.max(IMAGE_TRAVEL_PERCENT, (copyHeight + 2) / media.offsetHeight * 100) : IMAGE_TRAVEL_PERCENT;
      });
    }
    if (!managed) {
      hasRendered = false;
      resetCards();
    }
  };
  const render = () => {
    frameId = null;
    if (!activated || !isManaged() || !isNearViewport || document.hidden) return;
    const sectionRect = section.getBoundingClientRect();
    const scrollDistance = Math.max(section.offsetHeight - sticky.offsetHeight, 1);
    const sectionProgress = clamp$1(-sectionRect.top / scrollDistance);
    section.style.setProperty("--home-service-progress", sectionProgress.toFixed(4));
    let shouldContinue = false;
    cards.forEach((card, index) => {
      const start = CARD_STARTS[index] ?? CARD_STARTS[CARD_STARTS.length - 1];
      const targetProgress = easeInOut(clamp$1((sectionProgress - start) / CARD_DURATION));
      let renderedProgress = hasRendered ? renderedProgresses[index] + (targetProgress - renderedProgresses[index]) * FOLLOW_EASING : targetProgress;
      if (Math.abs(targetProgress - renderedProgress) <= SETTLE_THRESHOLD) renderedProgress = targetProgress;
      else shouldContinue = true;
      renderedProgresses[index] = renderedProgress;
      card.style.setProperty("--home-service-image-y", `${(renderedProgress * imageTravelPercents[index]).toFixed(3)}%`);
      card.dataset.homeServiceProgress = renderedProgress.toFixed(3);
    });
    hasRendered = true;
    if (shouldContinue) frameId = window.requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!activated || frameId !== null || !isNearViewport || !isManaged() || document.hidden) return;
    frameId = window.requestAnimationFrame(render);
  };
  const handleViewportChange = () => {
    syncMode();
    requestRender();
  };
  const revealRoot = (root) => {
    root.classList.add("is-home-service-reveal-visible");
    if (root.classList.contains("home-service__title-line")) titleStarted = true;
  };
  const revealObserver = supportsObserver && !reducedMotion.matches ? new IntersectionObserver((entries, observer) => {
    entries.filter((entry) => entry.isIntersecting).sort((left, right) => {
      const topDifference = left.boundingClientRect.top - right.boundingClientRect.top;
      return Math.abs(topDifference) > 4 ? topDifference : left.boundingClientRect.left - right.boundingClientRect.left;
    }).forEach((entry, entryIndex) => {
      const root = entry.target;
      if (pendingRevealRoots.has(root)) return;
      pendingRevealRoots.add(root);
      observer.unobserve(root);
      window.setTimeout(() => revealRoot(root), entryIndex * 90);
    });
  }, {
    threshold: .18,
    rootMargin: "0px 0px -8% 0px"
  }) : null;
  const observeRevealRoot = (root) => {
    if (reducedMotion.matches || !revealObserver) {
      revealRoot(root);
      return;
    }
    revealObserver.observe(root);
  };
  const splitTitle = () => {
    if (!titleTarget) return;
    titleSplit?.lines?.forEach((line) => revealObserver?.unobserve(line));
    titleSplit?.revert();
    titleTarget.classList.remove("is-home-service-split-ready");
    titleSplit = new SplitType(titleTarget, {
      types: "lines",
      lineClass: "home-service__title-line"
    });
    (titleSplit.lines ?? []).forEach((line) => {
      const inner = document.createElement("span");
      inner.className = "home-service__reveal-inner";
      line.classList.add("home-service__reveal");
      while (line.firstChild) inner.append(line.firstChild);
      line.append(inner);
      if (titleStarted) revealRoot(line);
      else if (revealActivated) observeRevealRoot(line);
    });
    titleTarget.classList.add("is-home-service-split-ready");
  };
  const activateReveal = () => {
    if (revealActivated) return;
    revealActivated = true;
    simpleRevealRoots.forEach(observeRevealRoot);
    titleTarget?.querySelectorAll(".home-service__title-line").forEach(observeRevealRoot);
  };
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    window.requestAnimationFrame(() => {
      splitTitle();
      handleViewportChange();
    });
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth === previousViewportWidth) return;
    previousViewportWidth = window.innerWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(splitTitle, 160);
  }, { passive: true });
  const activate = () => {
    if (activated) return;
    activated = true;
    syncMode();
    activateReveal();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener("pageshow", requestRender);
    desktop.addEventListener("change", handleViewportChange);
    reducedMotion.addEventListener("change", handleViewportChange);
    requestRender();
  };
  syncMode();
  if (supportsObserver) new IntersectionObserver((entries) => {
    isNearViewport = entries.some((entry) => entry.isIntersecting);
    if (isNearViewport) requestRender();
    else if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
  }, {
    rootMargin: "50% 0px 50% 0px",
    threshold: 0
  }).observe(section);
  if (document.querySelector("[data-home-intro]")) window.addEventListener(HOME_INTRO_COMPLETE_EVENT$1, activate, { once: true });
  else window.requestAnimationFrame(activate);
};
//#endregion
//#region resources/ts/home-intro.ts
var COUNTER_THRESHOLDS = [
  0,
  50,
  100
];
var DIGIT_ROLL_TOTAL_DURATIONS = [
  520,
  520,
  620
];
var FINAL_DIGIT_ROLL_TOTAL_DURATIONS = [
  520,
  620,
  700
];
var COUNTER_ROLL_GAP = 300;
var MINIMUM_LOADING_DURATION = 3e3;
var MAXIMUM_LOADING_DURATION = 3e3;
var HOME_INTRO_LAST_SHOWN_KEY = "l-portfolio:home-intro:last-shown";
var HOME_INTRO_REPLAY_INTERVAL = 1800 * 1e3;
var HOME_INTRO_RECENT_CLASS = "has-recent-home-intro";
var CUBE_ALIGNMENT_ANGLES = [
  0,
  90,
  180,
  270
];
var CUBE_ALIGNMENT_THRESHOLD = .999;
var CUBE_ALIGNMENT_ANGLE_EPSILON = .01;
var CUBE_SETTLE_REVERSE_WEIGHT = .3;
var CUBE_SETTLE_TRAVEL_WEIGHT = .02;
var HOME_INTRO_COMPLETE_EVENT = "l-portfolio:home-intro-complete";
var CUBE_BASIS_VECTORS = [
  {
    x: 1,
    y: 0,
    z: 0
  },
  {
    x: 0,
    y: 1,
    z: 0
  },
  {
    x: 0,
    y: 0,
    z: 1
  }
];
var CUBE_FACES = [
  {
    name: "front",
    normal: {
      x: 0,
      y: 0,
      z: 1
    },
    horizontal: {
      x: 1,
      y: 0,
      z: 0
    },
    vertical: {
      x: 0,
      y: 1,
      z: 0
    }
  },
  {
    name: "back",
    normal: {
      x: 0,
      y: 0,
      z: -1
    },
    horizontal: {
      x: -1,
      y: 0,
      z: 0
    },
    vertical: {
      x: 0,
      y: 1,
      z: 0
    }
  },
  {
    name: "right",
    normal: {
      x: 1,
      y: 0,
      z: 0
    },
    horizontal: {
      x: 0,
      y: 0,
      z: -1
    },
    vertical: {
      x: 0,
      y: 1,
      z: 0
    }
  },
  {
    name: "left",
    normal: {
      x: -1,
      y: 0,
      z: 0
    },
    horizontal: {
      x: 0,
      y: 0,
      z: 1
    },
    vertical: {
      x: 0,
      y: 1,
      z: 0
    }
  },
  {
    name: "top",
    normal: {
      x: 0,
      y: -1,
      z: 0
    },
    horizontal: {
      x: 1,
      y: 0,
      z: 0
    },
    vertical: {
      x: 0,
      y: 0,
      z: 1
    }
  },
  {
    name: "bottom",
    normal: {
      x: 0,
      y: 1,
      z: 0
    },
    horizontal: {
      x: 1,
      y: 0,
      z: 0
    },
    vertical: {
      x: 0,
      y: 0,
      z: -1
    }
  }
];
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var hasRecentHomeIntro = () => {
  try {
    const lastShownAt = Number(window.localStorage.getItem(HOME_INTRO_LAST_SHOWN_KEY));
    const elapsed = Date.now() - lastShownAt;
    return Number.isFinite(lastShownAt) && lastShownAt > 0 && elapsed >= 0 && elapsed < HOME_INTRO_REPLAY_INTERVAL;
  } catch (_error) {
    return false;
  }
};
var rememberHomeIntro = () => {
  document.documentElement.classList.add(HOME_INTRO_RECENT_CLASS);
  try {
    window.localStorage.setItem(HOME_INTRO_LAST_SHOWN_KEY, String(Date.now()));
  } catch (_error) {}
};
var persistHomeBackground = () => {
  document.documentElement.classList.add("has-home-intro-background");
  document.body.classList.add("has-home-intro-background");
};
var revealHomeIntroHeader = (afterReveal) => {
  const header = document.querySelector("[data-home-intro-header]");
  window.requestAnimationFrame(() => {
    header?.classList.add("is-home-intro-header-visible");
    document.documentElement.classList.add("is-home-hero-visible");
    afterReveal?.();
  });
};
var homeSectionsInitialized = false;
var initializeHomeSections = () => {
  if (homeSectionsInitialized) return;
  homeSectionsInitialized = true;
  initializeHomeHeroGlass();
  initializeHomeAbout();
  initializeHomeBrands();
  initializeHomeService();
  initializeHomeNews();
};
var activateHomeSections = () => {
  initializeHomeSections();
  window.dispatchEvent(new Event(HOME_INTRO_COMPLETE_EVENT));
};
var HomeIntro = class {
  constructor(root) {
    this.startedAt = performance.now();
    this.cubeAngles = {
      x: 0,
      y: 0,
      z: 0
    };
    this.settleFaceName = "front";
    this.displayedProgress = 0;
    this.targetProgress = 0;
    this.lastFrame = this.startedAt;
    this.frameId = 0;
    this.ready = false;
    this.completed = false;
    this.counterStopIndex = -1;
    this.counterQueue = [];
    this.counterRolling = false;
    this.counterIdleResolvers = [];
    this.activeCounterValue = 0;
    this.counterStartResolvers = [];
    this.cubeRotation = null;
    this.savedScrollY = 0;
    this.inertElements = [];
    this.tick = (now) => {
      if (this.completed) return;
      const elapsed = now - this.startedAt;
      const deltaSeconds = Math.min(.1, (now - this.lastFrame) / 1e3);
      this.lastFrame = now;
      const timeGate = Math.min(100, elapsed / this.minimumDuration * 100);
      const gatedTarget = Math.min(this.targetProgress, timeGate);
      const maxStep = (this.reducedMotion ? 320 : 28) * deltaSeconds;
      this.displayedProgress = Math.min(gatedTarget, this.displayedProgress + maxStep);
      if (elapsed >= MAXIMUM_LOADING_DURATION) {
        this.ready = true;
        this.targetProgress = 100;
        this.displayedProgress = 100;
      }
      if (this.ready && elapsed >= this.minimumDuration && this.displayedProgress >= 99) {
        this.displayedProgress = 100;
        this.completed = true;
        this.finish();
        return;
      }
      this.render(this.displayedProgress);
      this.frameId = requestAnimationFrame(this.tick);
    };
    const square = root.querySelector("[data-home-intro-square]");
    const counter = root.querySelector("[data-home-intro-counter]");
    if (!square || !counter) throw new Error("Home intro markup is incomplete.");
    this.root = root;
    this.square = square;
    this.counter = counter;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.minimumDuration = MINIMUM_LOADING_DURATION;
    this.counterValues = this.createCounterValues();
    this.cubeVelocity = this.createCubeVelocity();
    this.cubeAngles.y = -90 * this.randomInteger(0, 3);
    this.digits = Array.from(root.querySelectorAll("[data-home-intro-digit]")).map((cell) => {
      const currentFace = cell.querySelector("[data-home-intro-digit-current]");
      const nextFace = cell.querySelector("[data-home-intro-digit-next]");
      if (!currentFace || !nextFace) throw new Error("Home intro digit faces are missing.");
      return {
        cell,
        currentFace,
        nextFace,
        value: 0
      };
    });
  }
  start() {
    this.root.classList.add("is-managed");
    document.documentElement.classList.add("has-home-intro-managed");
    document.querySelector("[data-home-intro-header]")?.classList.add("is-home-intro-header-managed");
    if (this.reducedMotion) this.root.classList.add("is-reduced-motion");
    this.lockPage();
    this.startCubeMotion();
    this.render(0);
    this.trackRealLoading();
    this.frameId = requestAnimationFrame(this.tick);
  }
  render(progress, counterProgress = progress) {
    this.updateCounterForProgress(clamp(counterProgress, 0, 100));
  }
  createCounterValues() {
    return [
      0,
      this.randomInteger(36, 64),
      100
    ];
  }
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  createCubeVelocity() {
    return {
      x: 0,
      y: -52,
      z: 0
    };
  }
  startCubeMotion() {
    this.root.style.setProperty("--home-intro-cube-rotate-y", `${this.cubeAngles.y}deg`);
    if (this.reducedMotion) return;
    const durationSeconds = 3600;
    const target = {
      x: this.cubeAngles.x + this.cubeVelocity.x * durationSeconds,
      y: this.cubeAngles.y + this.cubeVelocity.y * durationSeconds,
      z: this.cubeAngles.z + this.cubeVelocity.z * durationSeconds
    };
    this.cubeRotation = this.square.animate([{ transform: this.cubeTransform(this.cubeAngles) }, { transform: this.cubeTransform(target) }], {
      duration: durationSeconds * 1e3,
      easing: "linear",
      fill: "forwards"
    });
  }
  cubeTransform(angles) {
    return `translate3d(-50%, -50%, 0) rotateX(${angles.x}deg) rotateY(${angles.y}deg) rotateZ(${angles.z}deg)`;
  }
  rotateCubeVector(vector, angles) {
    const xRadians = angles.x * (Math.PI / 180);
    const yRadians = angles.y * (Math.PI / 180);
    const zRadians = angles.z * (Math.PI / 180);
    const cosX = Math.cos(xRadians);
    const sinX = Math.sin(xRadians);
    const cosY = Math.cos(yRadians);
    const sinY = Math.sin(yRadians);
    const cosZ = Math.cos(zRadians);
    const sinZ = Math.sin(zRadians);
    const afterZ = {
      x: vector.x * cosZ - vector.y * sinZ,
      y: vector.x * sinZ + vector.y * cosZ,
      z: vector.z
    };
    const afterY = {
      x: afterZ.x * cosY + afterZ.z * sinY,
      y: afterZ.y,
      z: -afterZ.x * sinY + afterZ.z * cosY
    };
    return {
      x: afterY.x,
      y: afterY.y * cosX - afterY.z * sinX,
      z: afterY.y * sinX + afterY.z * cosX
    };
  }
  selectNextCubeFace() {
    const alignedAngles = {
      x: 0,
      y: Math.floor(this.cubeAngles.y / 90) * 90,
      z: 0
    };
    return CUBE_FACES.reduce((nearestFace, candidateFace) => {
      const nearestDepth = this.rotateCubeVector(nearestFace.normal, alignedAngles).z;
      return this.rotateCubeVector(candidateFace.normal, alignedAngles).z > nearestDepth ? candidateFace : nearestFace;
    }, CUBE_FACES[0]);
  }
  nearestAlignmentAngle(angle, alignedAngle, velocity) {
    const fullTurn = 360;
    let delta = ((alignedAngle - angle + 180) % fullTurn + fullTurn) % fullTurn - 180;
    if (Math.abs(delta) < CUBE_ALIGNMENT_ANGLE_EPSILON) delta = 0;
    else if (Math.abs(Math.abs(delta) - 180) < CUBE_ALIGNMENT_ANGLE_EPSILON) delta = velocity >= 0 ? 180 : -180;
    if (velocity < 0 && delta > 0) delta -= fullTurn;
    return angle + delta;
  }
  cubeOrientationDistance(from, to) {
    const angleCosine = clamp((CUBE_BASIS_VECTORS.reduce((total, basisVector) => {
      const fromVector = this.rotateCubeVector(basisVector, from);
      const toVector = this.rotateCubeVector(basisVector, to);
      return total + fromVector.x * toVector.x + fromVector.y * toVector.y + fromVector.z * toVector.z;
    }, 0) - 1) / 2, -1, 1);
    return Math.acos(angleCosine) * (180 / Math.PI);
  }
  cubeSettleScore(target) {
    const orientationDistance = this.cubeOrientationDistance(this.cubeAngles, target);
    let reverseDistance = 0;
    let travelDistance = 0;
    [
      "x",
      "y",
      "z"
    ].forEach((axis) => {
      const delta = target[axis] - this.cubeAngles[axis];
      travelDistance += Math.abs(delta);
      if (delta * this.cubeVelocity[axis] < 0) reverseDistance += Math.abs(delta);
    });
    return orientationDistance + reverseDistance * CUBE_SETTLE_REVERSE_WEIGHT + travelDistance * CUBE_SETTLE_TRAVEL_WEIGHT;
  }
  isFaceScreenAligned(face, angles) {
    const normal = this.rotateCubeVector(face.normal, angles);
    const horizontal = this.rotateCubeVector(face.horizontal, angles);
    const vertical = this.rotateCubeVector(face.vertical, angles);
    return normal.z > CUBE_ALIGNMENT_THRESHOLD && horizontal.x > CUBE_ALIGNMENT_THRESHOLD && vertical.y > CUBE_ALIGNMENT_THRESHOLD;
  }
  createCubeSettleTarget() {
    const settleFace = this.selectNextCubeFace();
    this.settleFaceName = settleFace.name;
    let bestTarget = null;
    let bestScore = Number.POSITIVE_INFINITY;
    CUBE_ALIGNMENT_ANGLES.forEach((x) => {
      CUBE_ALIGNMENT_ANGLES.forEach((y) => {
        CUBE_ALIGNMENT_ANGLES.forEach((z) => {
          if (x !== 0 || z !== 0) return;
          const alignedAngles = {
            x,
            y,
            z
          };
          if (!this.isFaceScreenAligned(settleFace, alignedAngles)) return;
          const target = {
            x: this.nearestAlignmentAngle(this.cubeAngles.x, x, this.cubeVelocity.x),
            y: this.nearestAlignmentAngle(this.cubeAngles.y, y, this.cubeVelocity.y),
            z: this.nearestAlignmentAngle(this.cubeAngles.z, z, this.cubeVelocity.z)
          };
          const score = this.cubeSettleScore(target);
          if (score < bestScore) {
            bestTarget = target;
            bestScore = score;
          }
        });
      });
    });
    return bestTarget ?? { ...this.cubeAngles };
  }
  beginCubeSettle() {
    if (this.cubeRotation) {
      const seconds = Number(this.cubeRotation.currentTime ?? 0) / 1e3;
      this.cubeAngles.x += this.cubeVelocity.x * seconds;
      this.cubeAngles.y += this.cubeVelocity.y * seconds;
      this.cubeAngles.z += this.cubeVelocity.z * seconds;
      this.cubeRotation.cancel();
      this.cubeRotation = null;
    }
    const target = this.createCubeSettleTarget();
    const naturalSettleDuration = this.cubeOrientationDistance(this.cubeAngles, target) / Math.hypot(this.cubeVelocity.x, this.cubeVelocity.y, this.cubeVelocity.z) * 900;
    const settleDuration = this.reducedMotion ? 1 : clamp(naturalSettleDuration, 700, 1500);
    this.root.style.setProperty("--home-intro-cube-settle-start-x", `${this.cubeAngles.x}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-start-y", `${this.cubeAngles.y}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-start-z", `${this.cubeAngles.z}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-end-x", `${target.x}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-end-y", `${target.y}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-end-z", `${target.z}deg`);
    this.root.style.setProperty("--home-intro-cube-settle-duration", `${settleDuration}ms`);
    this.square.querySelector(`.home-intro__cube-face--${this.settleFaceName}`)?.classList.add("is-expansion-face");
    this.cubeAngles = target;
    this.root.classList.add("is-settling");
    return settleDuration;
  }
  updateCounterForProgress(progress) {
    let nextIndex = this.counterStopIndex;
    for (let index = this.counterStopIndex + 1; index < COUNTER_THRESHOLDS.length; index += 1) {
      if (progress < COUNTER_THRESHOLDS[index]) break;
      nextIndex = index;
    }
    if (nextIndex === this.counterStopIndex) return;
    this.counterStopIndex = nextIndex;
    const value = this.counterValues[nextIndex];
    if (nextIndex === 0) {
      this.updateCounterAccessibility(value);
      return;
    }
    this.counterQueue.push(value);
    this.processCounterQueue();
  }
  async processCounterQueue() {
    if (this.counterRolling) return;
    const value = this.counterQueue.shift();
    if (value === void 0) {
      this.resolveCounterIdle();
      return;
    }
    this.counterRolling = true;
    this.activeCounterValue = value;
    this.resolveCounterStart(value);
    this.updateCounterAccessibility(value);
    const rollDuration = this.updateCounter(value);
    await this.delay(rollDuration + COUNTER_ROLL_GAP);
    this.counterRolling = false;
    if (this.counterQueue.length > 0) {
      this.processCounterQueue();
      return;
    }
    this.resolveCounterIdle();
  }
  updateCounterAccessibility(value) {
    this.root.setAttribute("aria-valuenow", String(value));
    this.root.setAttribute("aria-valuetext", `${value}%`);
  }
  waitForCounterIdle() {
    if (!this.counterRolling && this.counterQueue.length === 0) return Promise.resolve();
    return new Promise((resolve) => {
      this.counterIdleResolvers.push(resolve);
    });
  }
  resolveCounterIdle() {
    this.counterIdleResolvers.forEach((resolve) => resolve());
    this.counterIdleResolvers = [];
  }
  waitForCounterStart(value) {
    if (this.activeCounterValue === value) return Promise.resolve();
    return new Promise((resolve) => {
      this.counterStartResolvers.push({
        value,
        resolve
      });
    });
  }
  resolveCounterStart(value) {
    const remainingResolvers = [];
    this.counterStartResolvers.forEach((entry) => {
      if (entry.value === value) entry.resolve();
      else remainingResolvers.push(entry);
    });
    this.counterStartResolvers = remainingResolvers;
  }
  updateCounter(value) {
    const safeValue = clamp(value, 0, 100);
    const values = safeValue === 100 ? [
      1,
      0,
      0
    ] : [
      null,
      Math.floor(safeValue / 10),
      safeValue % 10
    ];
    const digitDurations = safeValue === 100 ? FINAL_DIGIT_ROLL_TOTAL_DURATIONS : DIGIT_ROLL_TOTAL_DURATIONS;
    let totalDuration = 0;
    this.counter.classList.toggle("is-three-digit", safeValue === 100);
    values.forEach((nextValue, index) => {
      if (nextValue === null) return;
      const state = this.digits[index];
      if (!state) return;
      if (state.timerId !== void 0) {
        window.clearTimeout(state.timerId);
        state.currentFace.textContent = String(state.value);
        state.cell.classList.remove("is-rolling");
      }
      state.nextFace.textContent = String(nextValue);
      state.cell.offsetWidth;
      state.cell.classList.add("is-rolling");
      state.value = nextValue;
      const digitDuration = digitDurations[index] ?? digitDurations[2];
      totalDuration = Math.max(totalDuration, digitDuration);
      state.timerId = window.setTimeout(() => {
        state.currentFace.textContent = String(nextValue);
        state.nextFace.textContent = String(nextValue);
        state.cell.classList.remove("is-rolling");
        state.timerId = void 0;
      }, digitDuration);
    });
    return totalDuration;
  }
  async trackRealLoading() {
    const tasks = this.collectTrackedTasks();
    let completedTasks = 0;
    const totalTasks = Math.max(1, tasks.length);
    this.targetProgress = 8;
    const tracked = tasks.map(async (task) => {
      try {
        await task;
      } finally {
        completedTasks += 1;
        const measured = 8 + completedTasks / totalTasks * 84;
        this.targetProgress = Math.max(this.targetProgress, Math.min(92, measured));
      }
    });
    const pageLoaded = this.waitForWindowLoad().then(() => {
      this.targetProgress = Math.max(this.targetProgress, 96);
    });
    await this.withTimeout(Promise.allSettled([...tracked, pageLoaded]), MAXIMUM_LOADING_DURATION);
    this.ready = true;
    this.targetProgress = 100;
  }
  collectTrackedTasks() {
    const tasks = [];
    if (document.fonts) {
      tasks.push(document.fonts.load("400 1em \"Nacelle\"", "Loading 0123456789"));
      tasks.push(document.fonts.load("400 1em \"Pretendard\"", "페이지 로딩 중"));
      tasks.push(document.fonts.load("600 1em \"Pretendard\"", "세상에 없던 카테고리를 만드는 메이커들의 집합체"));
      tasks.push(document.fonts.load("700 1em \"Pretendard\"", "일상의 모든 오브제를 다시 정의하는 메이커들의 세계"));
    }
    document.querySelectorAll("img:not([loading=\"lazy\"])").forEach((image) => {
      if (this.root.contains(image)) return;
      tasks.push(this.waitForImage(image));
    });
    document.querySelectorAll("video:not([preload=\"none\"])").forEach((video) => {
      tasks.push(this.waitForVideo(video));
    });
    return tasks;
  }
  waitForImage(image) {
    if (image.complete) {
      if (typeof image.decode === "function") return image.decode().catch(() => void 0);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      image.addEventListener("load", () => {
        if (typeof image.decode === "function") image.decode().catch(() => void 0).then(() => resolve());
        else resolve();
      }, { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  }
  waitForVideo(video) {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
    return new Promise((resolve) => {
      video.addEventListener("loadeddata", () => resolve(), { once: true });
      video.addEventListener("error", () => resolve(), { once: true });
    });
  }
  waitForWindowLoad() {
    if (document.readyState === "complete") return Promise.resolve();
    return new Promise((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  }
  withTimeout(promise, timeoutMs) {
    return Promise.race([promise, new Promise((resolve) => window.setTimeout(resolve, timeoutMs))]);
  }
  async finish() {
    try {
      this.render(100);
      await this.waitForCounterStart(100);
      const settleDuration = this.beginCubeSettle();
      await Promise.all([this.waitForCounterIdle(), this.delay(this.reducedMotion ? 40 : settleDuration)]);
      await this.delay(this.reducedMotion ? 80 : 300);
      this.root.classList.add("is-expanding");
      await this.delay(this.reducedMotion ? 140 : 900);
      this.root.classList.add("is-expanded");
      this.persistBackground();
      await this.delay(this.reducedMotion ? 1 : 40);
    } finally {
      this.cleanup();
    }
  }
  lockPage() {
    this.savedScrollY = window.scrollY;
    document.documentElement.classList.add("is-home-intro-loading");
    document.body.classList.add("is-home-intro-loading");
    document.querySelectorAll("[data-home-intro-content], .skip-link").forEach((element) => {
      element.inert = true;
      this.inertElements.push(element);
    });
    window.lenis?.stop?.();
  }
  unlockPage() {
    document.documentElement.classList.remove("is-home-intro-loading");
    document.body.classList.remove("is-home-intro-loading");
    this.inertElements.forEach((element) => {
      element.inert = false;
    });
    this.inertElements = [];
    window.lenis?.start?.();
    window.scrollTo(0, this.savedScrollY);
  }
  persistBackground() {
    persistHomeBackground();
  }
  cleanup() {
    cancelAnimationFrame(this.frameId);
    this.cubeRotation?.cancel();
    this.digits.forEach((state) => {
      if (state.timerId !== void 0) window.clearTimeout(state.timerId);
    });
    this.unlockPage();
    rememberHomeIntro();
    this.root.remove();
    revealHomeIntroHeader(activateHomeSections);
  }
  delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }
};
var introRoot = document.querySelector("[data-home-intro]");
var skipRecentIntro = document.documentElement.classList.contains(HOME_INTRO_RECENT_CLASS) || hasRecentHomeIntro();
if (introRoot && skipRecentIntro) {
  introRoot.remove();
  document.documentElement.classList.remove("is-home-intro-loading");
  document.body.classList.remove("is-home-intro-loading");
  persistHomeBackground();
  revealHomeIntroHeader(activateHomeSections);
} else if (introRoot) try {
  new HomeIntro(introRoot).start();
} catch (error) {
  console.error("[L Portfolio] Failed to start the home intro.", error);
  introRoot.remove();
  document.documentElement.classList.remove("is-home-intro-loading");
  document.body.classList.remove("is-home-intro-loading");
  revealHomeIntroHeader(activateHomeSections);
}
else revealHomeIntroHeader(activateHomeSections);
//#endregion
