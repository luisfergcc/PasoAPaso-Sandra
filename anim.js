/* Paso a Paso — motor de animación (muñeco articulado en SVG).
   Cada ejercicio = lista de posturas clave; el motor interpola entre ellas.
   Vista lateral ("side") o frontal ("front"). Sin dependencias externas. */
(function (G) {
  'use strict';
  const L = { torso: 50, neck: 7, head: 10, thigh: 42, shin: 40, foot: 15, ua: 28, fa: 26 };
  const FLOOR = 172;
  const KEYS = ['hx','hy','t','arch','nax','nay','fax','fay','nfa','ffa','nhx','nhy','fhx','fhy',
    'kdnx','kdny','kdfx','kdfy','ednx','edny','edfx','edfy','nuk','nkx','nky','fuk','fkx','fky','br','wt','wf'];
  const rad = d => d * Math.PI / 180;

  /* ---------- cinemática inversa de 2 segmentos ---------- */
  function ik(a, t, l1, l2, dir) {
    let dx = t[0] - a[0], dy = t[1] - a[1], d = Math.hypot(dx, dy) || 0.001;
    const maxd = l1 + l2 - 0.05, mind = Math.abs(l1 - l2) + 0.5;
    if (d > maxd) { const k = maxd / d; dx *= k; dy *= k; d = maxd; }
    if (d < mind) { const k = mind / d; dx *= k; dy *= k; d = mind; }
    const e = [a[0] + dx, a[1] + dy];
    const aa = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - aa * aa));
    const ux = dx / d, uy = dy / d, mx = a[0] + ux * aa, my = a[1] + uy * aa;
    const c1 = [mx - uy * h, my + ux * h], c2 = [mx + uy * h, my - ux * h];
    const s1 = (c1[0] - mx) * dir[0] + (c1[1] - my) * dir[1], s2 = (c2[0] - mx) * dir[0] + (c2[1] - my) * dir[1];
    return { j: s1 >= s2 ? c1 : c2, e };
  }

  /* ---------- construcción de posturas ---------- */
  function finish(p) {
    const t = rad(p.t), sx = p.hx + L.torso * Math.sin(t), sy = p.hy - L.torso * Math.cos(t);
    if (p.nhr) { p.nhx = sx + p.nhr[0]; p.nhy = sy + p.nhr[1]; }
    if (p.fhr) { p.fhx = sx + p.fhr[0]; p.fhy = sy + p.fhr[1]; }
    delete p.nhr; delete p.fhr;
    KEYS.forEach(k => { if (p[k] === undefined) p[k] = 0; });
    return p;
  }
  function base(o) {
    return Object.assign({ hx: 110, hy: 122, t: 0, arch: 0, nax: 152, nay: 166, fax: 158, fay: 166, nfa: 0, ffa: 0,
      kdnx: 1, kdny: 0, kdfx: 1, kdfy: 0, ednx: -0.4, edny: 1, edfx: -0.4, edfy: 1, br: 0 }, o);
  }
  const P = {
    sit(o) { o = Object.assign({}, o); const p = base(o); const hx = p.hx, hy = p.hy;
      if (o.nhx === undefined && !o.nhr) { p.nhx = hx + 34; p.nhy = hy - 7; }
      if (o.fhx === undefined && !o.fhr) { p.fhx = hx + 28; p.fhy = hy - 7; }
      return finish(p); },
    stand(o) { const p = base(Object.assign({ hx: 140, hy: 85, nax: 142, nay: 166, fax: 147, fay: 166, ednx: -0.3, edfx: -0.3 }, o));
      if (o.nhx === undefined && !o.nhr) p.nhr = [3, 48];
      if (o.fhx === undefined && !o.fhr) p.fhr = [0, 48];
      return finish(p); },
    lie(o) { const p = base(Object.assign({ hx: 160, hy: 153, t: -90, nax: 206, nay: 154, fax: 212, fay: 154, kdnx: 0, kdny: -1, kdfx: 0, kdfy: -1, ednx: 0, edny: 1, edfx: 0, edfy: 1 }, o));
      if (o.nhx === undefined && !o.nhr) p.nhr = [48, 5];
      if (o.fhx === undefined && !o.fhr) p.fhr = [48, 3];
      return finish(p); },
    front(o) { const p = base(Object.assign({ hx: 150, hy: 85, nax: 164, nay: 168, fax: 136, fay: 168, kdnx: 0.6, kdny: 0, kdfx: -0.6, kdfy: 0, ednx: 1, edny: 0.6, edfx: -1, edfy: 0.6 }, o));
      if (o.nhx === undefined && !o.nhr) p.nhr = [14, 48];
      if (o.fhx === undefined && !o.fhr) p.fhr = [-14, 48];
      return finish(p); }
  };

  /* ---------- geometría ---------- */
  function solveSide(p) {
    const t = rad(p.t), hip = [p.hx, p.hy];
    const sh = [p.hx + L.torso * Math.sin(t), p.hy - L.torso * Math.cos(t)];
    const ln = p.nuk > .5 ? { j: [p.nkx, p.nky], e: [p.nax, p.nay] } : ik(hip, [p.nax, p.nay], L.thigh, L.shin, [p.kdnx, p.kdny]);
    const lf = p.fuk > .5 ? { j: [p.fkx, p.fky], e: [p.fax, p.fay] } : ik(hip, [p.fax, p.fay], L.thigh, L.shin, [p.kdfx, p.kdfy]);
    const an = ik(sh, [p.nhx, p.nhy], L.ua, L.fa, [p.ednx, p.edny]);
    const af = ik(sh, [p.fhx, p.fhy], L.ua, L.fa, [p.edfx, p.edfy]);
    const dir = [Math.sin(t), -Math.cos(t)], nrm = [-dir[1], dir[0]];
    const hc = [sh[0] + dir[0] * (L.neck + L.head), sh[1] + dir[1] * (L.neck + L.head)];
    return { hip, sh, ln, lf, an, af, dir, nrm, hc };
  }
  const line = (a, b, w, cls) => `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke-width="${w}" class="${cls}"/>`;
  const poly = (pts, w, cls) => `<polyline points="${pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')}" stroke-width="${w}" class="${cls}" fill="none"/>`;
  const C = (hi, k) => hi.indexOf(k) >= 0 ? 'seg hi' : 'seg';

  /* pesos: wt = lo que sujeta la mano cercana (1 mancuerna, 2 barra vista de canto, 3 banda, 4 almohadilla de máquina), wf = mancuerna en la mano lejana */
  function gear(p, a, b, side) {
    let o = '';
    const f = q => q[0].toFixed(1) + '" cy="' + q[1].toFixed(1);
    if (p.wf > 0.5) o += `<circle cx="${f(b)}" r="5.5" class="dumb far"/>`;
    if (p.wt > 3.5) o += `<line x1="${(a[0] + 5).toFixed(1)}" y1="${(a[1] - 4).toFixed(1)}" x2="${(a[0] + 5).toFixed(1)}" y2="${(a[1] + 30).toFixed(1)}" stroke-width="7" class="seg pad"/>`;
    else if (p.wt > 2.5) o += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke-width="2.5" class="band"/>`;
    else if (p.wt > 1.5) o += `<circle cx="${f(a)}" r="12" class="plate"/><circle cx="${f(a)}" r="2.5" class="dumb"/>`;
    else if (p.wt > 0.5) o += `<circle cx="${f(a)}" r="6.5" class="dumb"/>`;
    return o;
  }

  function drawSide(p, hi) {
    const s = solveSide(p); let o = '';
    const foot = (a, ang, cls) => { const r = rad(ang); return line(a, [a[0] + L.foot * Math.cos(r), a[1] + L.foot * Math.sin(r)], 6, cls); };
    // lejanos (más claros)
    o += poly([s.hip, s.lf.j, s.lf.e], 8, 'seg far' + (hi.indexOf('fl') >= 0 ? ' hi' : '')) + foot(s.lf.e, p.ffa, 'seg far');
    o += poly([s.sh, s.af.j, s.af.e], 6, 'seg far' + (hi.indexOf('fa') >= 0 ? ' hi' : ''));
    // tronco
    const mid = [(s.hip[0] + s.sh[0]) / 2 + s.nrm[0] * p.arch, (s.hip[1] + s.sh[1]) / 2 + s.nrm[1] * p.arch];
    o += `<path d="M${s.hip[0].toFixed(1)},${s.hip[1].toFixed(1)} Q${mid[0].toFixed(1)},${mid[1].toFixed(1)} ${s.sh[0].toFixed(1)},${s.sh[1].toFixed(1)}" stroke-width="12" class="${C(hi, 'core')}" fill="none"/>`;
    if (p.br > 0.5) o += `<ellipse cx="${(s.hip[0] * .45 + s.sh[0] * .55 + s.nrm[0] * (6 + p.br * .6)).toFixed(1)}" cy="${(s.hip[1] * .45 + s.sh[1] * .55 + s.nrm[1] * (6 + p.br * .6)).toFixed(1)}" rx="${(5 + p.br).toFixed(1)}" ry="${(5 + p.br).toFixed(1)}" class="breath"/>`;
    // cercanos
    o += poly([s.hip, s.ln.j, s.ln.e], 9, C(hi, 'nl')) + foot(s.ln.e, p.nfa, C(hi, 'nl'));
    o += poly([s.sh, s.an.j, s.an.e], 7, C(hi, 'na'));
    o += gear(p, s.an.e, s.af.e, true);
    // cabeza
    o += `<circle cx="${s.hc[0].toFixed(1)}" cy="${s.hc[1].toFixed(1)}" r="${L.head}" class="head"/>`;
    o += `<circle cx="${(s.hc[0] + s.nrm[0] * 4.5 + s.dir[0] * 1).toFixed(1)}" cy="${(s.hc[1] + s.nrm[1] * 4.5 + s.dir[1] * 1).toFixed(1)}" r="1.6" class="eye"/>`;
    return o;
  }

  function drawFront(p, hi) {
    const t = rad(p.t), hw = 11, sw = 17;
    const hipC = [p.hx, p.hy], shC = [p.hx + L.torso * Math.sin(t), p.hy - L.torso * Math.cos(t)];
    const hipR = [hipC[0] + hw, hipC[1]], hipL = [hipC[0] - hw, hipC[1]];
    const shR = [shC[0] + sw, shC[1] + 1], shL = [shC[0] - sw, shC[1] + 1];
    const ln = p.nuk > .5 ? { j: [p.nkx, p.nky], e: [p.nax, p.nay] } : ik(hipR, [p.nax, p.nay], L.thigh, L.shin, [p.kdnx, p.kdny]);
    const lf = p.fuk > .5 ? { j: [p.fkx, p.fky], e: [p.fax, p.fay] } : ik(hipL, [p.fax, p.fay], L.thigh, L.shin, [p.kdfx, p.kdfy]);
    const an = ik(shR, [p.nhx, p.nhy], L.ua, L.fa, [p.ednx, p.edny]);
    const af = ik(shL, [p.fhx, p.fhy], L.ua, L.fa, [p.edfx, p.edfy]);
    const hc = [shC[0] + (L.neck + L.head) * Math.sin(t), shC[1] - (L.neck + L.head) * Math.cos(t)];
    let o = '';
    o += poly([hipL, lf.j, lf.e], 9, C(hi, 'fl')) + line(lf.e, [lf.e[0] - 9, lf.e[1] + 1], 6, C(hi, 'fl'));
    o += poly([hipR, ln.j, ln.e], 9, C(hi, 'nl')) + line(ln.e, [ln.e[0] + 9, ln.e[1] + 1], 6, C(hi, 'nl'));
    o += line(hipL, hipR, 10, C(hi, 'core'));
    o += line(hipC, shC, 14, C(hi, 'core')) + line(shL, shR, 9, C(hi, 'core'));
    o += poly([shL, af.j, af.e], 7, C(hi, 'fa')) + poly([shR, an.j, an.e], 7, C(hi, 'na'));
    if (p.wt > 2.5 && p.wt < 3.5) o += gear(p, af.e, an.e); else if (p.wt > 0.5 || p.wf > 0.5) o += gear(Object.assign({}, p, { wt: p.wt === 2 ? 2 : p.wt }), an.e, af.e);
    o += `<circle cx="${hc[0].toFixed(1)}" cy="${hc[1].toFixed(1)}" r="${L.head}" class="head"/>`;
    o += `<circle cx="${(hc[0] - 3.6).toFixed(1)}" cy="${(hc[1] - 1).toFixed(1)}" r="1.5" class="eye"/><circle cx="${(hc[0] + 3.6).toFixed(1)}" cy="${(hc[1] - 1).toFixed(1)}" r="1.5" class="eye"/>`;
    return o;
  }

  function drawPose(p, mode, hi) { hi = hi || []; return mode === 'front' ? drawFront(p, hi) : drawSide(p, hi); }

  /* ---------- escenarios ---------- */
  const S = {
    chair(x, o) { o = o || {}; const top = o.high ? 118 : 126, back = o.noback ? '' : `<line x1="${x - 15}" y1="${top}" x2="${x - 15}" y2="${top - 64}" class="prop thick"/>`;
      return `<rect x="${x - 17}" y="${top}" width="64" height="5" rx="2" class="propf"/><line x1="${x - 11}" y1="${top + 5}" x2="${x - 11}" y2="${FLOOR}" class="prop"/><line x1="${x + 41}" y1="${top + 5}" x2="${x + 41}" y2="${FLOOR}" class="prop"/>` + back +
        (o.arms ? `<line x1="${x - 15}" y1="98" x2="${x + 20}" y2="98" class="prop thick"/><line x1="${x + 20}" y1="98" x2="${x + 20}" y2="${top}" class="prop"/>` : '') +
        (o.high ? `<rect x="${x - 15}" y="${top - 1}" width="58" height="9" rx="4" class="cush"/>` : ''); },
    bed() { return `<rect x="0" y="160" width="300" height="12" rx="3" class="propf"/><ellipse cx="80" cy="157" rx="24" ry="5" class="cush"/>`; },
    counter(x) { return `<rect x="${x}" y="84" width="${300 - x}" height="6" rx="2" class="propf dark"/><rect x="${x + 6}" y="90" width="${300 - x}" height="${FLOOR - 90}" class="propf"/>`; },
    bar(x1, x2, y) { return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="6" rx="3" class="propf dark"/><line x1="${x1 + 8}" y1="${y + 6}" x2="${x1 + 8}" y2="${FLOOR}" class="prop"/><line x1="${x2 - 8}" y1="${y + 6}" x2="${x2 - 8}" y2="${FLOOR}" class="prop"/>`; },
    step(x, h) { return `<rect x="${x}" y="${FLOOR - h}" width="64" height="${h}" rx="2" class="propf dark"/>`; },
    rail(x1, y1, x2, y2) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="prop thick"/><line x1="${x1}" y1="${y1}" x2="${x1}" y2="${y1 + 34}" class="prop"/><line x1="${x2}" y1="${y2}" x2="${x2}" y2="${y2 + 34}" class="prop"/>`; },
    wall(x) { return `<rect x="${x}" y="0" width="${300 - x}" height="${FLOOR}" class="propf wall"/>`; },
    bench(x1, x2, y) { return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="8" rx="3" class="propf dark"/><line x1="${x1 + 8}" y1="${y + 8}" x2="${x1 + 8}" y2="${FLOOR}" class="prop"/><line x1="${x2 - 8}" y1="${y + 8}" x2="${x2 - 8}" y2="${FLOOR}" class="prop"/>`; },
    ground() { return `<line x1="0" y1="${FLOOR}" x2="300" y2="${FLOOR}" class="ground"/>`; }
  };

  /* ---------- interpolación y reproductor ---------- */
  const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  function mix(a, b, u) { const o = {}; KEYS.forEach(k => { o[k] = a[k] + (b[k] - a[k]) * u; }); return o; }

  function Player(svg, def, opts) {
    opts = opts || {};
    this.svg = svg; this.def = def; this.speed = opts.speed || 1; this.playing = false; this.step = 0; this.raf = 0;
    this.onstep = opts.onstep || function () {}; this.onprog = opts.onprog || function () {};
    const kf = def.kf; this.kf = kf; this.times = []; let t = 0;
    // cada keyframe: llegar en kf.t ms y mantener kf.hold ms. El último vuelve al primero.
    const seq = def.cycle ? kf.slice() : kf.concat([{ t: kf[0].t || 900, hold: 500, pose: kf[0].pose, hi: kf[0].hi, back: true }]);
    this.seq = seq; seq.forEach((k, i) => { const dur = i === 0 ? 0 : (k.t || 900); this.times.push({ start: t, arrive: t + dur, end: t + dur + (k.hold || 600) }); t += dur + (k.hold || 600); });
    this.total = t;
    this.svg.innerHTML = `<g class="scene">${(def.scene || []).join('')}${S.ground()}</g><g class="fig"></g>`;
    this.fig = this.svg.querySelector('.fig'); this.clock = 0; this.render(0);
  }
  Player.prototype.at = function (ms) {
    const T = this.times, seq = this.seq; ms = ((ms % this.total) + this.total) % this.total;
    for (let i = 0; i < seq.length; i++) {
      const tm = T[i];
      if (ms <= tm.end) {
        if (i === 0 || ms >= tm.arrive) return { pose: seq[i].pose, hi: seq[i].hi || [], idx: seq[i].back ? 0 : i };
        const u = ease((ms - tm.start) / (tm.arrive - tm.start)), prev = seq[i - 1];
        return { pose: mix(prev.pose, seq[i].pose, u), hi: (u < .5 ? prev.hi : seq[i].hi) || [], idx: seq[i].back ? 0 : i };
      }
    }
    return { pose: seq[0].pose, hi: [], idx: 0 };
  };
  Player.prototype.render = function (ms) {
    const r = this.at(ms); this.fig.innerHTML = drawPose(r.pose, this.def.view, r.hi);
    if (r.idx !== this.step) { this.step = r.idx; this.onstep(r.idx); }
    this.onprog(ms / this.total);
  };
  Player.prototype.play = function () {
    if (this.playing) return; this.playing = true; let last = performance.now();
    const loop = now => { if (!this.playing) return; this.clock += (now - last) * this.speed; last = now; this.render(this.clock); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  };
  Player.prototype.pause = function () { this.playing = false; cancelAnimationFrame(this.raf); };
  Player.prototype.seek = function (u) { this.clock = u * this.total; this.render(this.clock); };
  Player.prototype.goStep = function (i) { // salta al final de la llegada del paso i
    const n = this.kf.length; i = (i + n) % n; this.pause(); this.clock = this.times[i].arrive + 1; this.render(this.clock);
  };
  Player.prototype.destroy = function () { this.pause(); };

  G.Anim = { P, S, L, FLOOR, drawPose, Player, KEYS };
})(window);
