/* Paso a Paso — marco de la aplicación: navegación, diálogos y acciones. */
'use strict';
const App = { tab: 'hoy', stack: [], unmount: null, unlockedUntil: 0 };
const V = {}, ACT = {}, CHG = {};

function main() { return $('#main'); }
function draw(keepScroll) {
  const y = keepScroll ? window.scrollY : 0;
  if (App.unmount) { try { App.unmount(); } catch (e) { } App.unmount = null; }
  const top = App.stack[App.stack.length - 1];
  const v = top ? V[top.view](top.params || {}) : V[App.tab]();
  const bar = top && !v.nobar ? `<div class="topbar"><button class="back" data-a="back" aria-label="Volver">‹ Atrás</button><div class="ttl">${esc(v.title || '')}</div><div style="width:70px"></div></div>` : '';
  main().innerHTML = bar + `<div class="page ${v.cls || ''}">${v.html}</div>`;
  $$('.tabbar .tab').forEach(t => t.classList.toggle('on', t.dataset.v === App.tab));
  $('#tabbar').style.display = v.hideTabs ? 'none' : '';
  if (v.mount) App.unmount = v.mount() || null;
  window.scrollTo(0, y);
}
function nav(view, params) { App.stack.push({ view, params }); draw(); }
function back() { App.stack.pop(); draw(); }
function setTab(t) { App.tab = t; App.stack = []; draw(); }

/* ---------- diálogos ---------- */
function modal(html, opts) {
  closeModal(); const d = document.createElement('div'); d.className = 'modal'; d.id = 'modal';
  d.innerHTML = `<div class="sheet ${opts && opts.big ? 'big' : ''}">${html}</div>`;
  d.addEventListener('click', e => { if (e.target === d && !(opts && opts.sticky)) closeModal(); });
  document.body.appendChild(d); return d;
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); }
function toast(msg, ms) { let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.className = 'show'; clearTimeout(t._t); t._t = setTimeout(() => t.className = '', ms || 2600); }
function ask(title, text, yes, no) {
  return new Promise(res => {
    const m = modal(`<h3>${esc(title)}</h3><p>${text}</p><div class="row2"><button class="btn ghost" data-r="0">${esc(no || 'Cancelar')}</button><button class="btn" data-r="1">${esc(yes || 'Vale')}</button></div>`, { sticky: true });
    m.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) { closeModal(); res(b.dataset.r === '1'); } });
  });
}
/* acceso de cuidador (PIN) */
async function needPin(why) {
  if (Date.now() < App.unlockedUntil) return true;
  const s = cfg();
  return new Promise(res => {
    const creating = !s.pin; let val = '';
    const m = modal(`<h3>${creating ? 'Crea un PIN de cuidador' : 'Modo cuidador'}</h3><p>${creating ? 'Elige 4 números. Servirá para abrir niveles, editar el historial y cambiar ajustes.' : esc(why || 'Escribe el PIN de cuidador.')}</p>
      <div class="pin" id="pinshow">····</div><div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'OK'].map(k => `<button data-k="${k}">${k}</button>`).join('')}</div><button class="btn ghost" data-k="x">Cancelar</button>`, { sticky: true });
    const show = () => { $('#pinshow').textContent = (val + '····').slice(0, 4).replace(/\d/g, '●'); };
    m.addEventListener('click', async e => {
      const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k;
      if (k === 'x') { closeModal(); return res(false); }
      if (k === '←') val = val.slice(0, -1); else if (k === 'OK') {
        if (val.length < 4) return toast('Son 4 números');
        if (creating) { await setCfg({ pin: await sha(val) }); toast('PIN guardado'); App.unlockedUntil = Date.now() + 10 * 60 * 1000; closeModal(); return res(true); }
        if (await sha(val) === s.pin) { App.unlockedUntil = Date.now() + 10 * 60 * 1000; closeModal(); return res(true); }
        val = ''; toast('PIN incorrecto'); } else if (val.length < 4) val += k;
      show();
    });
  });
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const f = ACT[el.dataset.a]; if (f) { e.preventDefault(); f(el, e); }
});
document.addEventListener('change', e => { const el = e.target.closest('[data-c]'); if (el && CHG[el.dataset.c]) CHG[el.dataset.c](el, e); });
ACT.back = back; ACT.tab = el => setTab(el.dataset.v);
ACT.nav = el => nav(el.dataset.v, el.dataset.p ? JSON.parse(el.dataset.p) : {});
ACT.close = closeModal;

/* ---------- voz ---------- */
function speak(txt) {
  try { if (!window.speechSynthesis) return toast('Tu móvil no tiene voz disponible'); speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'es-ES'; u.rate = 0.92; speechSynthesis.speak(u); } catch (e) { }
}
function stopSpeak() { try { speechSynthesis.cancel(); } catch (e) { } }
function beep(n) { try { const C = window.AudioContext || window.webkitAudioContext, c = new C(); for (let i = 0; i < (n || 1); i++) { const o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(c.currentTime + i * 0.25); o.stop(c.currentTime + i * 0.25 + 0.15); } } catch (e) { } try { navigator.vibrate && navigator.vibrate(n === 2 ? [120, 80, 120] : 150); } catch (e) { } }

/* ---------- pestañas ---------- */
function buildTabbar() {
  const T = [['hoy', '🏠', 'Hoy'], ['entrenar', '💪', 'Entrenar'], ['caminar', '🚶', 'Caminar'], ['historial', '📋', 'Historial']];
  $('#tabbar').innerHTML = T.map(t => `<button class="tab" data-a="tab" data-v="${t[0]}"><span class="ic">${t[1]}</span><span>${t[2]}</span></button>`).join('');
}

/* ---------- gráficas sencillas ---------- */
function lineChart(series, o) {
  o = o || {}; const W = 320, H = o.h || 130, pl = 30, pr = 8, pt = 10, pb = 22;
  const pts = series.flatMap(s => s.pts); if (!pts.length) return '<div class="empty">Aún no hay datos.</div>';
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y); let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = o.min != null ? o.min : Math.min(...ys), y1 = o.max != null ? o.max : Math.max(...ys);
  if (x1 === x0) { x0 -= 86400000; x1 += 86400000; } if (y1 === y0) { y1 += 1; y0 -= 1; }
  const X = x => pl + (x - x0) / (x1 - x0) * (W - pl - pr), Y = y => pt + (1 - (y - y0) / (y1 - y0)) * (H - pt - pb);
  let g = ''; for (let i = 0; i <= 3; i++) { const v = y0 + (y1 - y0) * i / 3, y = Y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" class="gl"/><text x="${pl - 4}" y="${y + 3}" class="gt" text-anchor="end">${Math.round(v * 10) / 10}</text>`; }
  const fd = ms => { const d = new Date(ms); return d.getDate() + '/' + (d.getMonth() + 1); };
  g += `<text x="${pl}" y="${H - 6}" class="gt">${fd(x0)}</text><text x="${W - pr}" y="${H - 6}" class="gt" text-anchor="end">${fd(x1)}</text>`;
  series.forEach((s, i) => { if (!s.pts.length) return; const d = s.pts.map((p, j) => (j ? 'L' : 'M') + X(p.x).toFixed(1) + ',' + Y(p.y).toFixed(1)).join(' ');
    g += `<path d="${d}" class="gp c${i}" fill="none"/>` + s.pts.map(p => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3.5" class="gd c${i}"/>`).join(''); });
  return `<svg viewBox="0 0 ${W} ${H}" class="chart">${g}</svg>` + (series.length > 1 ? `<div class="legend">${series.map((s, i) => `<span><i class="c${i}"></i>${esc(s.name)}</span>`).join('')}</div>` : '');
}
function barChart(vals, labels, o) {
  o = o || {}; const W = 320, H = 120, mx = Math.max(1, ...vals), bw = (W - 20) / vals.length;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart">${vals.map((v, i) => { const h = (H - 34) * v / mx; return `<rect x="${10 + i * bw + 4}" y="${H - 22 - h}" width="${bw - 8}" height="${Math.max(h, v ? 2 : 0)}" rx="4" class="cbar"/><text x="${10 + i * bw + bw / 2}" y="${H - 7}" class="gt" text-anchor="middle">${esc(labels[i])}</text>${v ? `<text x="${10 + i * bw + bw / 2}" y="${H - 26 - h}" class="gt" text-anchor="middle">${v}</text>` : ''}`; }).join('')}</svg>`;
}
