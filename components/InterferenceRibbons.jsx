"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const RIBBON_DEFAULTS = {
  "colors": [
    "#6B3CFF",
    "#D46BFF"
  ],
  "backgroundColor": "#0A0A0A",
  "mode": "auto",
  "wires": 64,
  "lineWidth": 1.6,
  "ribbonWidth": 0.24,
  "amplitude": 0.6,
  "waveLength": 1,
  "angle": 42,
  "twist": 1.6,
  "curl": 0.25,
  "depth": 0.65,
  "stripes": 2.2,
  "colorFlow": 0.04,
  "glow": 0.45,
  "intensity": 1,
  "speed": 0.7,
  "spin": 0.35,
  "interactive": true,
  "hoverPulses": true,
  "clickPulse": true,
  "pulseSpeed": 1.1,
  "pulseStrength": 1,
  "hoverBoost": 1,
  "paused": false,
  "quality": 1
};

function createInterferenceRibbons(host, userOptions) {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const TAU = Math.PI * 2;
  const SEGS = 320, MAXP = 8, LEVELS = 6;

  const hexToRgb = (h) => {
    h = String(h).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };
  const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const rgbToOklab = (c) => {
    const r = toLin(c[0]), g = toLin(c[1]), b = toLin(c[2]);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
  };

  const VS_WIRE = `
precision highp float;
attribute vec4 a;
uniform vec2 u_res, u_dir;
uniform vec3 u_time;
uniform vec4 u_shape, u_w;
uniform vec3 u_misc;
uniform vec3 u_colA, u_colB;
uniform vec4 u_pulse[${MAXP}];
varying vec4 v_col;
varying vec2 v_edge;
const float TAU = 6.28318530718;
vec2 rib(float s, float u, float ph) {
  float H = u_res.y, p = s / H, wl = u_shape.y, T = u_time.x;
  float sw = u_shape.x * H * 0.5 * (0.8 * sin(TAU * p / (2.1 * wl) + T * 0.31 - 0.25) + 0.2 * sin(TAU * p / (1.15 * wl) - T * 0.23 + 1.7));
  float th = u_shape.z * TAU * (s / u_misc.x) + u_time.y + 0.35 * sin(TAU * p * 0.45 / wl + T * 0.17) + 0.05 * sin(ph + p * 1.9 + T * 0.4);
  float c = cos(th), sn = sin(th), yv = u_shape.w * (1.0 - u * u) * 1.6;
  float l = sw + (u * c - yv * sn) * u_w.x + 0.025 * u_w.x * sin(ph * 1.7 + p * 4.3 - T * 0.6);
  return vec2(l, clamp(u * sn + yv * c, -1.0, 1.0));
}
vec2 scr(float s, float l) { return u_res * 0.5 + u_dir * s + vec2(-u_dir.y, u_dir.x) * l; }
void main() {
  float u = a.x, ph = a.y, L = u_misc.x;
  float s = (a.z - 0.5) * L, e = L / ${SEGS}.0 * 0.5;
  vec2 r0 = rib(s, u, ph);
  vec2 P = scr(s, r0.x);
  vec2 A = scr(s - e, rib(s - e, u, ph).x), B = scr(s + e, rib(s + e, u, ph).x);
  vec2 t = normalize(B - A);
  float f = 0.5 + 0.5 * r0.y;
  float b = 0.0;
  for (int k = 0; k < ${MAXP}; k++) {
    vec4 q = u_pulse[k];
    float e1 = (s - q.x - q.y) / u_misc.z, e2 = (s - q.x + q.y) / u_misc.z;
    float w = q.w > 5.0 ? 1.0 : exp(-pow((u - q.w) / 0.1, 2.0));
    b += q.z * w * (exp(-e1 * e1) + exp(-e2 * e2));
  }
  float hw = 0.5 * u_w.y * (0.55 + 0.45 * f) * (1.0 + 0.5 * min(b, 2.0));
  float alpha = min(1.0, u_w.w * (0.6 + 0.4 * (1.0 - u * u)) * (1.0 - u_w.z * (1.0 - f)) * (1.0 + 3.0 * b));
  float ck = u_misc.y == 0.0 ? 0.0 : pow(0.5 - 0.5 * cos(TAU * (u_misc.y * (u * 0.5 + 0.5) + u_time.z)), 1.7);
  vec3 lab = mix(u_colA, u_colB, ck);
  vec3 lms = pow(vec3(lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z, lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z, lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z), vec3(3.0));
  vec3 lin = clamp(vec3(4.0767416621 * lms.x - 3.3077115913 * lms.y + 0.2309699292 * lms.z, -1.2684380046 * lms.x + 2.6097574011 * lms.y - 0.3413193965 * lms.z, -0.0041960863 * lms.x - 0.7034186147 * lms.y + 1.707614701 * lms.z), 0.0, 1.0);
  vec3 srgb = pow(lin, vec3(1.0 / 2.2));
  v_col = vec4(srgb, alpha);
  float ext = hw + 1.0;
  v_edge = vec2(a.w * ext, hw);
  vec2 pos = P + vec2(-t.y, t.x) * a.w * ext;
  gl_Position = vec4(pos.x / u_res.x * 2.0 - 1.0, 1.0 - pos.y / u_res.y * 2.0, 0.0, 1.0);
}`;
  const FS_WIRE = `
precision mediump float;
varying vec4 v_col;
varying vec2 v_edge;
void main() {
  float cov = clamp(v_edge.y + 0.5 - abs(v_edge.x), 0.0, 1.0);
  float al = v_col.a * cov;
  gl_FragColor = vec4(v_col.rgb * al, al);
}`;
  const VS_QUAD = `
attribute vec2 a;
varying vec2 v_uv;
void main() { v_uv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;
  const FS_DOWN = `
precision mediump float;
varying vec2 v_uv; uniform sampler2D u_tex; uniform vec2 u_px;
void main() {
  vec4 c = texture2D(u_tex, v_uv) * 4.0;
  c += texture2D(u_tex, v_uv + u_px) + texture2D(u_tex, v_uv - u_px);
  c += texture2D(u_tex, v_uv + vec2(u_px.x, -u_px.y)) + texture2D(u_tex, v_uv - vec2(u_px.x, -u_px.y));
  gl_FragColor = c / 8.0;
}`;
  const FS_UP = `
precision mediump float;
varying vec2 v_uv; uniform sampler2D u_tex; uniform vec2 u_px;
void main() {
  vec4 c = texture2D(u_tex, v_uv + vec2(-u_px.x * 2.0, 0.0)) + texture2D(u_tex, v_uv + vec2(u_px.x * 2.0, 0.0));
  c += texture2D(u_tex, v_uv + vec2(0.0, u_px.y * 2.0)) + texture2D(u_tex, v_uv + vec2(0.0, -u_px.y * 2.0));
  c += (texture2D(u_tex, v_uv + u_px) + texture2D(u_tex, v_uv - u_px) + texture2D(u_tex, v_uv + vec2(u_px.x, -u_px.y)) + texture2D(u_tex, v_uv + vec2(-u_px.x, u_px.y))) * 2.0;
  gl_FragColor = c / 12.0;
}`;
  const FS_COMP = `
precision mediump float;
varying vec2 v_uv; uniform sampler2D u_wire, u_bloom; uniform vec3 u_bg; uniform vec2 u_g;
void main() {
  vec4 w = texture2D(u_wire, v_uv), b = texture2D(u_bloom, v_uv);
  vec3 c;
  if (u_g.y > 0.5) {
    float ha = clamp(b.a * u_g.x, 0.0, 1.0);
    c = u_bg * (1.0 - ha) + b.rgb * u_g.x * (ha / max(b.a * u_g.x, 1e-4));
    c = c * (1.0 - w.a) + w.rgb;
  } else {
    c = u_bg + b.rgb * u_g.x + w.rgb;
  }
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(c + (n - 0.5) / 255.0, 1.0);
}`;

  let o = Object.assign({}, RIBBON_DEFAULTS, userOptions || {});
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
  host.appendChild(canvas);
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });

  let W = 0, H = 0, ratio = 1, nWires = 0, vertCount = 0;
  let T = 0, R = 0, C = 0, clock = 0, last = 0, hov = 0, hovering = false;
  let raf = 0, dead = false, pulses = [], ink = false, bg = [0, 0, 0], labA, labB;
  let pWire, pDown, pUp, pComp, bufWire, bufQuad, wireT, levels = [], U = {};

  const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const reduced = () => !!(mq && mq.matches);

  const prog = (vs, fs) => {
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.bindAttribLocation(p, 0, "a");
    gl.linkProgram(p);
    return p;
  };
  const uni = (p, names) => {
    const r = {};
    for (const n of names) r[n] = gl.getUniformLocation(p, n);
    return r;
  };
  const target = (w, h) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo, w, h };
  };
  const freeTargets = () => {
    for (const t of [wireT, ...levels]) if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); }
    wireT = null; levels = [];
  };

  const wireU = (i, n) => (n > 1 ? (i / (n - 1)) * 2 - 1 + 0.012 * Math.sin(i * 12.9898) : 0);
  const buildWires = () => {
    const n = Math.round(clamp(o.wires, 4, 160));
    if (n === nWires) return;
    nWires = n;
    const d = new Float32Array(n * SEGS * 6 * 4);
    let k = 0;
    const put = (u, ph, t, side) => { d[k++] = u; d[k++] = ph; d[k++] = t; d[k++] = side; };
    for (let i = 0; i < n; i++) {
      const u = wireU(i, n), ph = i * 2.399;
      for (let j = 0; j < SEGS; j++) {
        const t0 = j / SEGS, t1 = (j + 1) / SEGS;
        put(u, ph, t0, -1); put(u, ph, t0, 1); put(u, ph, t1, -1);
        put(u, ph, t1, -1); put(u, ph, t0, 1); put(u, ph, t1, 1);
      }
    }
    vertCount = k / 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufWire);
    gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
  };

  const applyOptions = () => {
    labA = rgbToOklab(hexToRgb(o.colors[0]));
    labB = rgbToOklab(hexToRgb(o.colors[1] || o.colors[0]));
    bg = hexToRgb(o.backgroundColor);
    const lum = 0.2126 * toLin(bg[0]) + 0.7152 * toLin(bg[1]) + 0.0722 * toLin(bg[2]);
    ink = o.mode === "ink" || (o.mode !== "glow" && lum > 0.35);
    if (gl) buildWires();
  };

  const init = () => {
    if (!gl) return;
    pWire = prog(VS_WIRE, FS_WIRE);
    pDown = prog(VS_QUAD, FS_DOWN);
    pUp = prog(VS_QUAD, FS_UP);
    pComp = prog(VS_QUAD, FS_COMP);
    U.wire = uni(pWire, ["u_res", "u_dir", "u_time", "u_shape", "u_w", "u_misc", "u_colA", "u_colB", "u_pulse"]);
    U.down = uni(pDown, ["u_tex", "u_px"]);
    U.up = uni(pUp, ["u_tex", "u_px"]);
    U.comp = uni(pComp, ["u_wire", "u_bloom", "u_bg", "u_g"]);
    bufWire = gl.createBuffer();
    bufQuad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufQuad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    nWires = 0; W = 0;
    freeTargets();
    applyOptions();
  };

  const resize = () => {
    const r = host.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2) * clamp(o.quality, 0.25, 1);
    const w = Math.max(2, Math.round(r.width * ratio)), h = Math.max(2, Math.round(r.height * ratio));
    if (w === W && h === H) return;
    W = w; H = h;
    canvas.width = W; canvas.height = H;
    if (!gl) return;
    freeTargets();
    wireT = target(W, H);
    let mw = W, mh = H;
    for (let i = 0; i < LEVELS; i++) {
      mw = Math.max(2, mw >> 1); mh = Math.max(2, mh >> 1);
      levels.push(target(mw, mh));
    }
    if (reduced()) draw();
  };

  const geo = () => {
    const a = (o.angle * Math.PI) / 180;
    const dx = Math.cos(a), dy = -Math.sin(a);
    const halfW = o.ribbonWidth * H * 0.5;
    const L = (Math.abs(W * dx) + Math.abs(H * dy)) * 1.08 + halfW * 4 + Math.abs(o.amplitude) * H * 0.6;
    return { dx, dy, halfW, L, wl: Math.max(0.05, o.waveLength) };
  };
  // CPU mirror of the shader's lateral offset, for hover picking
  const lateral = (g, s, u, ph) => {
    const p = s / H;
    const sw = o.amplitude * H * 0.5 * (0.8 * Math.sin((TAU * p) / (2.1 * g.wl) + T * 0.31 - 0.25) + 0.2 * Math.sin((TAU * p) / (1.15 * g.wl) - T * 0.23 + 1.7));
    const th = o.twist * TAU * (s / g.L) + R + 0.35 * Math.sin((TAU * p * 0.45) / g.wl + T * 0.17) + 0.05 * Math.sin(ph + p * 1.9 + T * 0.4);
    const yv = o.curl * (1 - u * u) * 1.6;
    return sw + (u * Math.cos(th) - yv * Math.sin(th)) * g.halfW + 0.025 * g.halfW * Math.sin(ph * 1.7 + p * 4.3 - T * 0.6);
  };

  const quad = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufQuad);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const draw = () => {
    if (!gl || !W || !wireT) return;
    const g = geo();
    pulses = pulses.filter((p) => clock - p.t0 < 3.2).slice(-MAXP);
    const pu = new Float32Array(MAXP * 4);
    pulses.forEach((p, i) => {
      const age = clock - p.t0;
      pu[i * 4] = p.s;
      pu[i * 4 + 1] = age * o.pulseSpeed * H * 0.9;
      pu[i * 4 + 2] = Math.exp(-age * 1.15) * p.k * clamp(o.pulseStrength, 0, 3);
      pu[i * 4 + 3] = p.u;
    });

    // 1. wires
    gl.bindFramebuffer(gl.FRAMEBUFFER, wireT.fbo);
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, ink ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
    gl.useProgram(pWire);
    const u = U.wire;
    gl.uniform2f(u.u_res, W, H);
    gl.uniform2f(u.u_dir, g.dx, g.dy);
    gl.uniform3f(u.u_time, T, R, C);
    gl.uniform4f(u.u_shape, o.amplitude, g.wl, o.twist, o.curl);
    const base = (ink ? 0.8 : 0.42) * o.intensity * (1 + 0.3 * hov * clamp(o.hoverBoost, 0, 2)) * Math.pow(64 / nWires, 0.35);
    gl.uniform4f(u.u_w, g.halfW, o.lineWidth * ratio, clamp(o.depth, 0, 1), base);
    gl.uniform3f(u.u_misc, g.L, o.stripes, 0.045 * H);
    gl.uniform3fv(u.u_colA, labA);
    gl.uniform3fv(u.u_colB, labB);
    gl.uniform4fv(u.u_pulse, pu);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufWire);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, vertCount);

    // 2. bloom
    const glow = clamp(o.glow, 0, 3);
    gl.activeTexture(gl.TEXTURE0);
    if (glow > 0) {
      gl.disable(gl.BLEND);
      gl.useProgram(pDown);
      gl.uniform1i(U.down.u_tex, 0);
      let src = wireT;
      for (const t of levels) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, t.w, t.h);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform2f(U.down.u_px, 1 / src.w, 1 / src.h);
        quad();
        src = t;
      }
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(pUp);
      gl.uniform1i(U.up.u_tex, 0);
      for (let k = LEVELS - 2; k >= 0; k--) {
        const t = levels[k], s = levels[k + 1];
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, t.w, t.h);
        gl.bindTexture(gl.TEXTURE_2D, s.tex);
        gl.uniform2f(U.up.u_px, 0.5 / s.w, 0.5 / s.h);
        quad();
      }
    }

    // 3. composite
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.disable(gl.BLEND);
    gl.useProgram(pComp);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, levels[0].tex);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wireT.tex);
    gl.uniform1i(U.comp.u_wire, 0);
    gl.uniform1i(U.comp.u_bloom, 1);
    gl.uniform3fv(U.comp.u_bg, bg);
    gl.uniform2f(U.comp.u_g, glow * (ink ? 0.25 : 2.4), ink ? 1 : 0);
    quad();
  };

  const frame = (now) => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    hov += ((hovering && o.interactive ? 1 : 0) - hov) * Math.min(1, dt * 4);
    if (!o.paused) {
      const k = 1 + 0.6 * hov * clamp(o.hoverBoost, 0, 2);
      T += dt * o.speed * k;
      R += dt * o.spin * k;
      C += dt * o.colorFlow;
    }
    clock += dt;
    draw();
  };
  const start = () => {
    cancelAnimationFrame(raf);
    last = 0;
    if (reduced()) { pulses = []; draw(); } else raf = requestAnimationFrame(frame);
  };

  // ---- interaction ----
  const addPulse = (s, u, k) => { if (!reduced()) pulses.push({ s, u, k, t0: clock }); };
  const local = (e) => {
    const r = host.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return null;
    return [x * ratio - W / 2, y * ratio - H / 2];
  };
  let lastHover = 0, lastPt = null;
  const onMove = (e) => {
    const p = local(e);
    hovering = !!p;
    if (!p || !o.interactive || !o.hoverPulses || !W) return;
    const now = performance.now();
    if (now - lastHover < 90) return;
    if (lastPt && Math.hypot(p[0] - lastPt[0], p[1] - lastPt[1]) < 6 * ratio) return;
    lastPt = p; lastHover = now;
    const g = geo();
    const s = p[0] * g.dx + p[1] * g.dy, l = -p[0] * g.dy + p[1] * g.dx;
    let best = 1e9, bu = 0;
    for (let i = 0; i < nWires; i++) {
      const u = wireU(i, nWires), d = Math.abs(lateral(g, s, u, i * 2.399) - l);
      if (d < best) { best = d; bu = u; }
    }
    if (best < 16 * ratio) addPulse(s, bu, 0.7);
  };
  const onDown = (e) => {
    const p = local(e);
    if (!p || !o.interactive || !o.clickPulse || !W) return;
    const g = geo();
    addPulse(p[0] * g.dx + p[1] * g.dy, 9, 1.2);
  };
  const onLeave = () => { hovering = false; };
  const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); };
  const onRestored = () => { init(); resize(); start(); };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  if (mq && mq.addEventListener) mq.addEventListener("change", start);

  // BeRocker addition: stop the render loop while the ribbon is scrolled out of view.
  let onScreen = true;
  const io = new IntersectionObserver((entries) => {
    const vis = entries[0] ? entries[0].isIntersecting : true;
    if (vis === onScreen) return;
    onScreen = vis;
    if (vis) start(); else cancelAnimationFrame(raf);
  }, { rootMargin: "120px" });
  io.observe(host);

  init();
  resize();
  start();

  return {
    update(next) {
      o = Object.assign({}, RIBBON_DEFAULTS, next || {});
      applyOptions();
      resize();
      if (reduced()) draw();
    },
    pulse(x) {
      const c = Math.cos((o.angle * Math.PI) / 180) || 1e-3;
      addPulse(((clamp(x == null ? 0.5 : x, 0, 1) - 0.5) * W) / c, 9, 1.2);
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", start);
      canvas.remove();
    },
  };
}

const InterferenceRibbons = forwardRef(function InterferenceRibbons(
  { children, className, style, ...options },
  ref
) {
  const host = useRef(null);
  const inst = useRef(null);
  const key = JSON.stringify(options);

  useEffect(() => {
    inst.current = createInterferenceRibbons(host.current, options);
    return () => inst.current && inst.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inst.current) inst.current.update(JSON.parse(key));
  }, [key]);

  useImperativeHandle(ref, () => ({ pulse: (x) => inst.current && inst.current.pulse(x) }), []);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", minHeight: 240, overflow: "hidden", ...style }}
    >
      <div ref={host} style={{ position: "absolute", inset: 0 }} />
      {children != null && <div style={{ position: "relative", zIndex: 1 }}>{children}</div>}
    </div>
  );
});

export default InterferenceRibbons;
