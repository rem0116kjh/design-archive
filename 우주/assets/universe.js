'use strict';

/* A small dependency-free sphere renderer and DOM orbit controller.
   The application owns requestAnimationFrame; this class never starts a second loop. */
window.OrbitScene = class OrbitScene {
  constructor(stage, options = {}) {
    this.stage = stage;
    this.cards = [...stage.querySelectorAll('.orbit-card')];
    this.shell = stage.querySelector('.globe-shell');
    this.canvas = stage.querySelector('#globe-canvas');
    this.surface = stage.querySelector('.globe-surface');
    this.options = { mobile: false, motion: true, orbitSpeed: .19, globeSpeed: .09, scroll: 0, pointerX: 0, pointerY: 0, story: null, resolutionScale: 1, ...options };
    this.phase = .35;
    this.rotation = 1.9;
    this.drag = null;
    this.inertia = 0;
    this.hovered = false;
    this.focused = false;
    this.suppressClickUntil = 0;
    this.width = stage.clientWidth;
    this.renderer = null;
    const textures = window.ORBIT_TEXTURES;
    if (textures?.day) this.surface.style.backgroundImage = `url("${textures.day}")`;
    this.setupInput();
    this.initializeRenderer();
    this.resize();
    stage.classList.add('universe-ready');
    this.render(0);
  }

  setupInput() {
    const stage = this.stage;
    stage.addEventListener('dragstart', event => event.preventDefault());
    stage.addEventListener('pointerover', event => {
      if (event.pointerType !== 'touch') this.hovered = !!event.target.closest('.orbit-card');
    });
    stage.addEventListener('pointerout', event => {
      this.hovered = !!event.relatedTarget?.closest?.('.orbit-card');
    });
    stage.addEventListener('focusin', () => { this.focused = true; });
    stage.addEventListener('focusout', event => { this.focused = stage.contains(event.relatedTarget); });
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.orbit-controls')) return;
      this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, time: event.timeStamp, active: false, vertical: false };
      this.inertia = 0;
    });
    stage.addEventListener('pointermove', event => {
      const drag = this.drag;
      if (!drag || drag.id !== event.pointerId || drag.vertical) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active) {
        // A vertical touch remains a normal page scroll; require an explicit horizontal gesture.
        if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx) * 1.15) { drag.vertical = true; return; }
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
        drag.active = true;
        stage.setPointerCapture(event.pointerId);
        stage.classList.add('is-dragging');
      }
      const movement = event.clientX - drag.lastX;
      const elapsed = Math.max(8, event.timeStamp - drag.time);
      const change = movement * .009;
      this.phase += change;
      this.rotation += change * .65;
      this.inertia = Math.max(-1.8, Math.min(1.8, change / elapsed * 1000));
      drag.lastX = event.clientX;
      drag.time = event.timeStamp;
      this.render(0);
    });
    const release = event => {
      if (!this.drag || this.drag.id !== event.pointerId) return;
      if (this.drag.active) this.suppressClickUntil = performance.now() + 350;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      if (event.type === 'pointercancel') this.inertia = 0;
      this.drag = null;
      stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('lostpointercapture', event => {
      // Touch begins with implicit capture on a card. Its release bubbles here
      // when capture transfers to the stage; only the stage's own loss ends a drag.
      if (event.target !== stage) return;
      this.drag = null;
      stage.classList.remove('is-dragging');
    });
    stage.addEventListener('click', event => {
      if (performance.now() < this.suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    stage.querySelector('.orbit-prev').addEventListener('click', () => this.step(-1));
    stage.querySelector('.orbit-next').addEventListener('click', () => this.step(1));
    stage.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      this.step(event.key === 'ArrowLeft' ? -1 : 1);
    });
    this.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.renderer = null;
      this.shell.classList.remove('webgl-ready');
      this.shell.dataset.renderer = 'css-fallback';
    });
    this.canvas.addEventListener('webglcontextrestored', () => this.initializeRenderer());
  }

  step(direction) {
    this.phase += direction * Math.PI * 2 / this.cards.length;
    this.rotation += direction * .35;
    this.inertia = 0;
    this.render(0);
  }

  resize() {
    this.width = this.stage.clientWidth;
    const ratio = Math.min(devicePixelRatio || 1, this.options.mobile ? 1.25 : 1.5);
    const size = Math.min(this.options.mobile ? 840 : 1400, Math.round(this.canvas.clientWidth * ratio * this.options.resolutionScale));
    if (this.canvas.width !== size || this.canvas.height !== size) {
      this.canvas.width = size;
      this.canvas.height = size;
    }
    this.render(0);
  }

  setOptions(options) {
    Object.assign(this.options, options);
    if (!this.options.motion) this.inertia = 0;
  }

  render(delta) {
    const { motion, orbitSpeed, globeSpeed, scroll, pointerX, pointerY, story } = this.options;
    const camera = story?.enabled ? story : null;
    const mix = (a, b, t) => a + (b - a) * t;
    if (motion && !this.drag?.active) {
      this.rotation += delta * globeSpeed;
      if (!this.hovered && !this.focused) this.phase += delta * orbitSpeed;
      this.phase += this.inertia * delta;
      this.inertia *= Math.exp(-delta * 3.8);
    }
    const cameraPhase = this.phase + (camera ? scroll * 2.25 : (motion ? scroll * .65 : 0));
    const radiusX = this.width * .405 * (camera?.radiusScale || 1);
    const radiusY = this.width * (.115 + (motion ? scroll * .035 : 0)) * (camera?.radiusScale || 1);
    const shortMobile = camera?.mobile && camera.height < 720;
    const fanPositions = camera?.mobile
      ? (shortMobile
        ? [[.22,.27],[.79,.25],[.17,.79],[.83,.79],[.50,.82]]
        : [[.22,.27],[.79,.25],[.19,.69],[.80,.69],[.48,.86]])
      : [[.19,.27],[.81,.25],[.18,.73],[.82,.70],[.50,.84]];
    for (let index = 0; index < this.cards.length; index++) {
      const card = this.cards[index];
      const angle = cameraPhase + index / this.cards.length * Math.PI * 2;
      const depth = Math.sin(angle);
      let x = Math.cos(angle) * radiusX;
      let y = depth * radiusY - Math.cos(angle) * this.width * .075;
      let scale = .81 + depth * .19;
      const fan = camera?.fan || 0;
      const departure = camera?.departure || 0;
      if (camera) {
        const [fx, fy] = fanPositions[index % fanPositions.length];
        x = mix(x, fx * camera.width - camera.centerX, fan);
        y = mix(y, fy * camera.height - camera.centerY, fan);
        y -= departure * camera.height * (1.15 + index * .09);
        const fanScale = camera.mobile ? (shortMobile ? .85 : 1.19) : 1.53;
        scale = mix(scale, fanScale, fan) * (1 - departure * .4);
      }
      // Tangent-facing planes curve around the globe instead of floating as flat billboards.
      // Keep the yaw below 90 degrees so each project remains usable from either side.
      const yaw = mix(-Math.cos(angle) * 58, index % 2 ? -9 : 9, fan);
      const pitch = mix(-9 + depth * 5, index % 2 ? 5 : -5, fan);
      const roll = mix(-8 + Math.cos(angle) * 5, [-10, 7, 9, -8, 3][index % 5], fan);
      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)}) perspective(850px) rotateX(${pitch.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg)`;
      card.style.zIndex = fan > .35 || depth > 0 ? '16' : '5';
      card.style.opacity = String(mix(.85 + depth * .15, 1, fan) * (1 - departure));
      const worldX = camera ? camera.centerX + x : 0;
      const worldY = camera ? camera.centerY + y : 0;
      const outside = camera && (worldX < -40 || worldX > camera.width + 40 || worldY < 60 || worldY > camera.height + 60);
      card.inert = departure > .85 || !!outside;
    }
    if (camera) {
      this.stage.style.left = `${camera.centerX.toFixed(2)}px`;
      this.stage.style.top = `${camera.centerY.toFixed(2)}px`;
    } else {
      this.stage.style.removeProperty('left');
      this.stage.style.removeProperty('top');
    }
    this.stage.style.setProperty('--scene-lift', `${camera ? camera.lift : (motion ? -scroll * 55 : 0)}px`);
    this.stage.style.setProperty('--scene-roll', `${camera ? camera.roll : (motion ? scroll * -5 : 0)}deg`);
    this.shell.style.setProperty('--globe-scale', String(camera?.globeScale || 1));
    this.shell.style.opacity = String(camera?.globeOpacity ?? 1);
    this.stage.querySelector('.universe-orbit').style.opacity = String(camera?.ringOpacity ?? 1);
    this.stage.dataset.storyState = camera ? (camera.departure > .5 ? 'departure' : camera.fan > .6 ? 'projects' : camera.globeScale > 1.5 ? 'close-up' : 'orbit') : 'static';
    this.stage.inert = (camera?.departure || 0) > .85;
    this.stage.tabIndex = camera && camera.progress > .16 ? -1 : 0;
    this.shell.dataset.rotation = this.rotation.toFixed(4);
    this.stage.dataset.phase = this.phase.toFixed(4);
    const viewRotation = this.rotation + (camera?.rotation || 0) + (motion ? pointerX * .013 : 0);
    this.surface.style.backgroundPositionX = `${viewRotation / (Math.PI * 2) * 200}%`;
    this.shell.dataset.viewRotation = viewRotation.toFixed(4);
    this.renderer?.render(viewRotation, -.08 + (motion ? pointerY * .012 : 0));
  }

  initializeRenderer() {
    try {
      const gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
      if (!gl || !window.ORBIT_TEXTURES) throw new Error('Use CSS sphere fallback');
      const vertexSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
          v_uv = a_position * 0.5 + 0.5;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      // An analytic sphere uses just two triangles, with a cylindrical Earth texture.
      const fragmentSource = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec2 v_uv;
        uniform sampler2D u_day;
        uniform sampler2D u_clouds;
        uniform float u_rotation;
        uniform float u_tilt;
        const float PI = 3.14159265359;
        void main() {
          vec2 p = (v_uv - 0.5) * 2.18;
          float radius = length(p);
          if (radius > 1.0) {
            float halo = exp(-(radius - 1.0) * 48.0) * 0.28;
            gl_FragColor = vec4(0.22, 0.48, 0.8, halo);
            return;
          }
          vec3 normal = vec3(p, sqrt(max(0.0, 1.0 - dot(p, p))));
          float cs = cos(-0.18), sn = sin(-0.18);
          vec3 tilted = vec3(normal.x * cs - normal.y * sn, normal.x * sn + normal.y * cs, normal.z);
          float ct = cos(u_tilt), st = sin(u_tilt);
          tilted = vec3(tilted.x, tilted.y * ct - tilted.z * st, tilted.y * st + tilted.z * ct);
          float cr = cos(u_rotation), sr = sin(u_rotation);
          vec3 world = vec3(tilted.x * cr + tilted.z * sr, tilted.y, -tilted.x * sr + tilted.z * cr);
          vec2 uv = vec2(atan(world.x, world.z) / (2.0 * PI) + 0.5, 0.5 - asin(clamp(world.y, -1.0, 1.0)) / PI);
          vec3 earth = texture2D(u_day, uv).rgb;
          float cloud = texture2D(u_clouds, uv + vec2(u_rotation * 0.012, 0.0)).r;
          cloud = smoothstep(0.18, 0.91, cloud) * 0.72;
          vec3 surface = mix(earth, vec3(0.94, 0.96, 1.0), cloud);
          // Smooth the map's longitudinal singularity at the ice caps.
          float iceCap = smoothstep(0.975, 0.999, abs(world.y));
          surface = mix(surface, vec3(0.86, 0.91, 0.96), iceCap);
          vec3 lightDirection = normalize(vec3(-0.65, 0.6, 1.05));
          float diffuse = max(0.0, dot(normal, lightDirection));
          vec3 color = surface * (0.18 + 0.95 * pow(diffuse, 0.75));
          float rim = pow(1.0 - normal.z, 3.0);
          color += vec3(0.13, 0.35, 0.68) * rim * 0.55;
          float ocean = smoothstep(0.03, 0.18, earth.b - earth.r);
          float reflection = pow(max(0.0, dot(reflect(-lightDirection, normal), vec3(0.0, 0.0, 1.0))), 38.0);
          color += vec3(0.5, 0.67, 0.83) * reflection * ocean * 0.2;
          float edge = 1.0 - smoothstep(0.994, 1.0, radius);
          gl_FragColor = vec4(color, edge);
        }
      `;
      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error('Sphere shader unavailable'); }
        return shader;
      };
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Sphere program unavailable');
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const angleLocation = gl.getUniformLocation(program, 'u_rotation');
      const tiltLocation = gl.getUniformLocation(program, 'u_tilt');
      const loadTexture = (data, unit, name) => new Promise((resolve, reject) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.onload = () => {
          if (gl.isContextLost()) { reject(new Error('Context lost')); return; }
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.uniform1i(gl.getUniformLocation(program, name), unit);
          resolve();
        };
        image.onerror = reject;
        image.src = data;
      });
      Promise.all([
        loadTexture(window.ORBIT_TEXTURES.day, 0, 'u_day'),
        loadTexture(window.ORBIT_TEXTURES.clouds, 1, 'u_clouds')
      ]).then(() => {
        this.renderer = {
          render: (angle, tilt) => {
            if (gl.isContextLost()) return;
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.uniform1f(angleLocation, angle);
            gl.uniform1f(tiltLocation, tilt);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
          }
        };
        this.render(0);
        this.shell.classList.add('webgl-ready');
        this.shell.dataset.renderer = 'webgl';
      }).catch(() => {
        this.shell.classList.remove('webgl-ready');
        this.shell.dataset.renderer = 'css-fallback';
      });
    } catch {
      this.shell.dataset.renderer = 'css-fallback';
    }
  }
};
