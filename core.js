/* Paso a Paso — núcleo: almacenamiento local, utilidades y lógica de niveles. */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => ymd(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fdate = s => { if (!s) return ''; const d = new Date(s + 'T12:00:00'); return d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); };
const fdateLong = s => { const d = new Date(s + 'T12:00:00'); return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; };
const fmtTime = sec => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' + pad(m) : m) + ':' + pad(s); };
const fmtKm = m => (m / 1000).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;

/* ---------- almacenamiento (IndexedDB, con caché en memoria) ---------- */
const db = {
  _d: null, kv: {},
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('pasoapaso', 1);
      r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('kv', { keyPath: 'key' }); d.createObjectStore('files', { keyPath: 'id' }); };
      r.onsuccess = () => {
        this._d = r.result; const tx = this._d.transaction('kv').objectStore('kv').getAll();
        tx.onsuccess = () => { tx.result.forEach(o => { this.kv[o.key] = o.value; }); res(); };
        tx.onerror = () => rej(tx.error);
      };
      r.onerror = () => rej(r.error);
    });
  },
  get(k, def) { return k in this.kv ? this.kv[k] : def; },
  set(k, v) {
    this.kv[k] = v;
    return new Promise(res => { const tx = this._d.transaction('kv', 'readwrite'); tx.objectStore('kv').put({ key: k, value: v }); tx.oncomplete = res; tx.onerror = res; });
  },
  push(k, item) { const a = this.get(k, []).slice(); a.push(item); return this.set(k, a); },
  putFile(id, blob, meta) { return new Promise((res, rej) => { const tx = this._d.transaction('files', 'readwrite'); tx.objectStore('files').put(Object.assign({ id, blob }, meta || {})); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  getFile(id) { return new Promise(res => { const r = this._d.transaction('files').objectStore('files').get(id); r.onsuccess = () => res(r.result); r.onerror = () => res(null); }); },
  delFile(id) { return new Promise(res => { const tx = this._d.transaction('files', 'readwrite'); tx.objectStore('files').delete(id); tx.oncomplete = res; tx.onerror = res; }); },
  allFiles() { return new Promise(res => { const r = this._d.transaction('files').objectStore('files').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => res([]); }); }
};

const DEFAULT_SETTINGS = { pin: '', gates: true, aprobNiveles: [1, 2], aprobEj: [], minutos: 10, walkTarget: 10, stride: 0.6, pausaMin: 0, voz: true, rodillaHasta: '', rodillaLado: '', cadaDias: 5,
  mat: { pesas: true, banda: true, agarre: true, mancuernas: false, gym: false }, kgMan: 10, minFuerza: 25, fuerzaSem: 2 };
const cfg = () => Object.assign({}, DEFAULT_SETTINGS, db.get('settings', {}));
const profile = () => Object.assign({ nombre: 'Sandra', baseLumbar: 5, basePierna: 5 }, db.get('profile', {}));
const setCfg = patch => db.set('settings', Object.assign(cfg(), patch));

async function sha(txt) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pasoapaso|' + txt)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch (e) { let h = 5381; for (const c of 'pasoapaso|' + txt) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'x' + h; }
}

/* ---------- ejercicios, niveles y progreso ---------- */
const EX = {}; EJERCICIOS.forEach(e => { EX[e.id] = e; });
const mastered = () => db.get('dominados', {});            // id -> fecha
const exLog = () => db.get('exlog', []);
const sessions = () => db.get('sesiones', []);
const checks = () => db.get('checks', []);
const walks = () => db.get('walks', []);

function levelApproved(n) { const s = cfg(); return !s.gates || n <= 2 || s.aprobNiveles.indexOf(n) >= 0; }
function exApproved(e) { const s = cfg(); return !s.gates || !e.fisio || s.aprobEj.indexOf(e.id) >= 0; }
/* estado de un ejercicio: bloqueado | visto | disponible | dominado */
/* material: ¿tiene lo que pide el ejercicio? */
function matFalta(e) {
  const m = Object.assign({}, DEFAULT_SETTINGS.mat, cfg().mat || {}), need = (e.mat || []).filter(k => !m[k]);
  if (!need.length && e.kg && (e.mat || []).indexOf('mancuernas') >= 0 && (e.mat || []).indexOf('gym') < 0 && e.kg[0] > cfg().kgMan) need.push('mancuernas más pesadas (hasta ' + e.kg[0] + ' kg)');
  return need.map(k => (MATERIALES[k] ? MATERIALES[k][0] : k));
}
function exState(e) {
  if (mastered()[e.id]) return 'dominado';
  if (e.previo && !mastered()[e.previo]) return 'bloqueado';
  if (!levelApproved(e.nivel) || !exApproved(e)) return 'visto';
  if (matFalta(e).length) return 'material';
  return 'disponible';
}
const exUsable = e => { const s = exState(e); return s === 'disponible' || s === 'dominado'; };
function lockReason(e) {
  const st = exState(e);
  if (st === 'bloqueado') { const p = EX[e.previo]; return 'Primero domina: ' + p.nombre; }
  if (st === 'visto') return levelApproved(e.nivel) ? 'Necesita el visto bueno de la fisioterapeuta (lo activa Luis).' : 'El nivel ' + e.nivel + ' se abre cuando Luis lo decide, con el visto bueno profesional.';
  if (st === 'material') return 'Falta material: ' + matFalta(e).join(', ') + '. Luis puede marcarlo en Ajustes.';
  return '';
}
function kneeOff() { const s = cfg(); return !!(s.rodillaHasta && s.rodillaHasta >= today()); }
function kneeSkip(e, check) { return e.rodilla && (kneeOff() || (check && check.rodilla >= 6)); }
function logsOf(id, days) { const lim = addDays(today(), -days); return exLog().filter(l => l.id === id && l.date >= lim); }
/* ---------- cargas (peso) ---------- */
const cargas = () => db.get('cargas', {});
function capIdx(e) { // último peldaño posible con su material
  if (!e.kg) return 0; const last = e.kg.length - 1;
  if ((e.mat || []).indexOf('gym') >= 0 || (e.mat || []).indexOf('mancuernas') < 0) return last;
  let i = 0; e.kg.forEach((k, j) => { if (k <= cfg().kgMan) i = j; }); return i;
}
function kgIdx(e) { if (!e.kg) return 0; const v = cargas()[e.id]; return Math.max(0, Math.min(v == null ? 0 : v, capIdx(e))); }
const kgNow = e => e.kg ? e.kg[kgIdx(e)] : null;
function domIdx(e) { if (!e.kg) return 0; return Math.min(capIdx(e), e.kg.length <= 3 ? e.kg.length - 1 : Math.ceil((e.kg.length - 1) * 0.6)); }
const kgTxt = v => v === 0 ? 'sin peso' : String(v).replace('.', ',') + ' kg';
function setKg(e, i) { const c = Object.assign({}, cargas()); c[e.id] = Math.max(0, Math.min(i, capIdx(e))); db.set('cargas', c); }
function repsFor(e) {
  const l = logsOf(e.id, 30).filter(x => x.estado === 'bien' && (!e.kg || x.kg === kgNow(e)));
  if (e.kg) return Math.min(e.n[1], e.n[0] + l.length * (e.timed ? 5 : 1));
  return Math.min(e.n[1], e.n[0] + Math.floor(l.length / 3) * (e.timed ? 5 : 1));
}
/* tras anotar una serie de ejercicio con peso: ¿sube o baja la carga? devuelve 'sube' | 'baja' | '' */
function ajustaCarga(e, estado, reps) {
  if (!e.kg) return ''; const i = kgIdx(e);
  if (estado === 'dolor') { if (i > 0) { setKg(e, i - 1); return 'baja'; } return ''; }
  if (estado !== 'bien' || i >= capIdx(e)) return '';
  const last = logsOf(e.id, 60).filter(x => x.kg === kgNow(e)).slice(-2);
  if (last.length === 2 && last.every(x => x.estado === 'bien' && x.reps >= e.n[1])) { setKg(e, i + 1); return 'sube'; }
  return '';
}
function masteryProgress(e) { const l = logsOf(e.id, 21); return { bien: l.filter(x => x.estado === 'bien').length, dolor: l.filter(x => x.estado === 'dolor').length, need: 6 }; }
function canAutoUnlock() {
  const last = Object.values(mastered()).sort().pop(); const s = cfg();
  if (last && daysBetween(last, today()) < s.cadaDias) return false;
  const ss = sessions().slice(-2); if (ss.some(x => x.resp24 === 'peor')) return false;
  const c = checks().slice(-3); if (c.some(x => x.semaforo === 'rojo' && daysBetween(x.date, today()) < 4)) return false;
  return true;
}
/* tras registrar un ejercicio: ¿se supera? */
function checkMastery(e) {
  if (mastered()[e.id]) return false;
  if (e.kg && kgIdx(e) < domIdx(e)) return false;
  const p = masteryProgress(e);
  if (p.bien >= p.need && p.dolor === 0 && canAutoUnlock()) { const m = Object.assign({}, mastered()); m[e.id] = today(); db.set('dominados', m); return true; }
  return false;
}
/* el ejercicio “activo” de cada bloque */
function activeIn(bloque) {
  const list = EJERCICIOS.filter(e => e.bloque === bloque).sort((a, b) => a.nivel - b.nivel);
  const avail = list.filter(e => exState(e) === 'disponible');
  if (avail.length) return avail[0];
  const done = list.filter(e => exState(e) === 'dominado');
  return done.length ? done[done.length - 1] : null; // mantenimiento
}
const esFuerza = e => ORDEN_FUERZA.indexOf(e.bloque) >= 0;
function fuerzaSesiones() { return sessions().filter(x => x.fuerza); }
function toca_fuerza(check, light) { // día de fuerza: ≥48 h desde la última y como máximo fuerzaSem por semana
  if (light || (check && (check.semaforo === 'rojo' || check.semaforo === 'amarillo' || check.semaforo === 'noche'))) return false;
  if (!ORDEN_FUERZA.some(b => { const e = activeIn(b); return e && exUsable(e); })) return false;
  const f = fuerzaSesiones(), last = f.length ? f[f.length - 1].date : null;
  if (last && daysBetween(last, today()) < 2) return false;
  return f.filter(x => x.date >= weekStart()).length < cfg().fuerzaSem;
}
function buildFuerza(check) {
  const s = cfg(), out = []; let used = 0; const rot = (fuerzaSesiones().length * 2) % ORDEN_FUERZA.length;
  const act = activeIn('cadera'); if (act && exUsable(act) && !kneeSkip(act, check) && act.min <= 3) { out.push(act); used += act.min; }
  for (let k = 0; k < ORDEN_FUERZA.length && out.length < 6; k++) {
    const b = ORDEN_FUERZA[(k + rot) % ORDEN_FUERZA.length]; let e = activeIn(b); if (!e || !exUsable(e) || out.indexOf(e) >= 0) continue;
    if (kneeSkip(e, check)) continue;
    if (used + e.min > s.minFuerza + 1.5) continue; out.push(e); used += e.min;
  }
  const co = activeIn('core'); if (co && exUsable(co) && !kneeSkip(co, check) && used + co.min <= s.minFuerza + 1.5 && out.indexOf(co) < 0) out.push(co);
  return out;
}
function buildSession(check, light) {
  if (toca_fuerza(check, light)) { const f = buildFuerza(check); if (f.filter(esFuerza).length >= 2) return f; }
  const s = cfg(); let budget = s.minutos * (light ? 0.6 : 1), out = [], used = 0;
  const parity = new Date().getDate() % 2;
  const blocks = ORDEN_SESION.filter(b => !light || ['resp', 'tobillo', 'rodilla', 'cadera', 'core', 'postura', 'movilidad'].indexOf(b) >= 0);
  const must = ['resp', 'levantarse', 'cadera', 'core', 'rodilla'];
  blocks.forEach((b, i) => {
    let e = activeIn(b); if (!e) return;
    if (kneeSkip(e, check)) { // alternativa sin carga de rodilla del mismo nivel o inferior
      const alt = EJERCICIOS.filter(x => x.bloque === b && !x.rodilla && exUsable(x)).pop(); e = alt || null; if (!e) return;
    }
    const opt = must.indexOf(b) < 0; if (opt && (i + parity) % 2) return;
    if (used + e.min > budget + 1.5) return;
    out.push(e); used += e.min;
  });
  return out;
}
/* ---------- calentamiento antes de caminar ---------- */
const calLog = () => db.get('calent', []);
function calCount(st) { return calLog().filter(x => x.stage === st && !x.dolor).length; }
function calStageOk(n) {
  const s = cfg(), mx = s.calMax || 0; if (n === 1 || n === 'fin') return true;
  if (n === 2) return calCount(1) >= 4 || mx >= 2;
  if (n === 3) return (calCount(2) + calCount(3) >= 6 || mx >= 3) && exApproved(EX.w13);
  return false;
}
const calCurrent = () => calStageOk(3) ? 3 : calStageOk(2) ? 2 : 1;
const calToday = () => calLog().filter(x => x.date === today() && typeof x.stage === 'number').pop();
function calList(stage, check) {
  const l = CAL_ETAPAS[stage].ids.map(i => EX[i]).filter(e => !kneeSkip(e, check) && exApproved(e));
  if (typeof stage === 'number' && stage > 1 && l.length < 5) return { stage: 1, fallback: true, list: calList(1, check).list };
  return { stage, list: l };
}
const calMin = l => Math.max(2, Math.round(l.reduce((a, e) => a + e.min * (e.lado ? 1.6 : 1), 0)));
function semaforo(c) {
  const p = profile();
  if (c.alarmas.some(id => (ALARMAS.find(a => a.id === id) || {}).nivel === 'urgente')) return 'rojo';
  if (c.alarmas.length) return 'rojo';
  if (c.pastillas) return 'noche';
  if (c.lumbar >= p.baseLumbar + 3 || c.pierna >= p.basePierna + 3 || c.mareo === 2 || c.sueno === 2 || c.rodilla >= 8) return 'amarillo';
  if (c.lumbar >= p.baseLumbar + 2 || c.pierna >= p.basePierna + 2 || c.mareo === 1 || c.sueno === 1 || c.rodilla >= 6) return 'amarillo';
  return 'verde';
}
const todayCheck = () => checks().filter(c => c.date === today()).pop();
const todaySession = () => sessions().filter(s => s.date === today()).pop();

/* ---------- caminatas ---------- */
const hav = (a, b) => { const R = 6371000, r = Math.PI / 180, dl = (b[0] - a[0]) * r, dn = (b[1] - a[1]) * r; const x = Math.sin(dl / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
function simplify(pts, tol) { // Douglas-Peucker sencillo en metros aproximados
  if (pts.length < 3) return pts; const k = 111320, c = Math.cos(pts[0][0] * Math.PI / 180);
  const P = pts.map(p => [p[1] * k * c, p[0] * k]); const keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true;
  (function rec(a, b) { let mx = 0, ix = -1; for (let i = a + 1; i < b; i++) { const d = dist(P[i], P[a], P[b]); if (d > mx) { mx = d; ix = i; } } if (mx > tol && ix > 0) { keep[ix] = true; rec(a, ix); rec(ix, b); } })(0, pts.length - 1);
  return pts.filter((_, i) => keep[i]);
  function dist(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy; if (!l) return Math.hypot(p[0] - a[0], p[1] - a[1]); let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
}
function weekStart(d) { const x = new Date((d || today()) + 'T12:00:00'); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); return ymd(x); }
function weekStats() {
  const ws = weekStart(), we = addDays(ws, 6); const w = walks().filter(x => x.date >= ws && x.date <= we);
  const sess = sessions().filter(x => x.date >= ws && x.date <= we);
  const days = []; for (let i = 0; i < 7; i++) { const d = addDays(ws, i); days.push({ d, walk: w.some(x => x.date === d), ses: sess.some(x => x.date === d) }); }
  return { min: Math.round(w.reduce((a, x) => a + x.durSec, 0) / 60), km: w.reduce((a, x) => a + (x.distM || 0), 0) / 1000, n: w.length, sesN: sess.length, days };
}
function walkTargetAdjust(w) { // +1 min tras 3 paseos verdes seguidos que alcanzan el objetivo
  const s = cfg(); const all = walks().concat([w]); const last3 = all.slice(-3);
  if (last3.length === 3 && last3.every(x => x.semaforo === 'verde' && x.durSec >= s.walkTarget * 60 - 20) && (!s.ultimoAjuste || s.ultimoAjuste < all[all.length - 3].date)) {
    setCfg({ walkTarget: Math.min(60, s.walkTarget + 1), ultimoAjuste: w.date }); return true; }
  return false;
}
