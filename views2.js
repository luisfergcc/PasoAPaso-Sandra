/* Paso a Paso — Caminar (GPS), Historial, Pruebas, Cuidador y datos. */
'use strict';
const WK = { s: null, form: null };

/* ================= CAMINAR ================= */
function wkElapsed() { const s = WK.s; if (!s) return 0; const now = s.paused ? s.pauseT : Date.now(); return Math.max(0, (now - s.t0 - s.pausedAcc) / 1000); }
async function wkStart(gps) {
  WK.s = { t0: Date.now(), paused: false, pausedAcc: 0, pauseT: 0, pts: [], dist: 0, gps, acc: null, last: null, gaps: 0, nextPausa: cfg().pausaMin };
  if (gps) {
    if (!navigator.geolocation) { WK.s.gps = false; toast('Este móvil no permite GPS: se medirá solo el tiempo.'); }
    else WK.s.watch = navigator.geolocation.watchPosition(wkPos, e => { WK.s && (WK.s.err = e.code === 1 ? 'Sin permiso de ubicación' : 'Buscando señal…'); }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 30000 });
  }
  try { if (navigator.wakeLock) WK.s.wl = await navigator.wakeLock.request('screen'); } catch (e) { }
  draw();
}
function wkPos(p) {
  const s = WK.s; if (!s) return; s.acc = p.coords.accuracy; s.err = null; if (s.paused) return;
  if (p.coords.accuracy > 35) return;
  const pt = [p.coords.latitude, p.coords.longitude, p.timestamp];
  if (s.last) {
    const d = hav(s.last, pt), dt = Math.max(1, (pt[2] - s.last[2]) / 1000), v = d / dt;
    if (d < 4) return;                       // ruido parada
    if (v > 3.2) return;                     // salto imposible a pie
    if (dt > 45) s.gaps++;                   // se perdió la señal un rato
    s.dist += d;
  }
  s.last = pt; s.pts.push(pt);
}
function wkStopWatch() { const s = WK.s; if (!s) return; if (s.watch != null) navigator.geolocation.clearWatch(s.watch); try { s.wl && s.wl.release(); } catch (e) { } }
document.addEventListener('visibilitychange', async () => { const s = WK.s; if (s && document.visibilityState === 'visible' && !s.paused) { try { if (navigator.wakeLock && (!s.wl || s.wl.released)) s.wl = await navigator.wakeLock.request('screen'); } catch (e) { } } });

V.caminar = () => {
  const s = WK.s, cf = cfg();
  if (s) {
    const html = `<div class="wlive"><div class="small gps ${s.acc && s.acc <= 35 ? 'ok' : ''}" id="wgps">${!s.gps ? 'Solo tiempo (sin GPS)' : s.err || (s.acc ? (s.acc <= 20 ? '🟢 Buena señal GPS' : s.acc <= 35 ? '🟡 Señal GPS regular' : '🟠 Buscando mejor señal…') : '🛰 Buscando señal…')}</div>
    <div class="wtime" id="wtime">0:00</div><div class="wlab">tiempo</div>
    <div class="wstats"><div><b id="wdist">0,00</b><small>km</small></div><div><b id="wsteps">0</b><small>pasos aprox.</small></div><div><b id="wpace">–</b><small>min/km</small></div></div>
    <div class="wgoal"><div class="bar"><i id="wbar" style="width:0%"></i></div><small id="wgt">Objetivo: ${cf.walkTarget} min</small></div>
    <div class="wbtns"><button class="btn xl" id="wpause" data-a="wkPause">⏸ Pausa</button><button class="btn xl danger" data-a="wkFinish">⏹ Terminar</button></div>
    <p class="small">📱 Mantén la pantalla encendida y esta aplicación abierta. Si bloqueas el móvil, el GPS puede dejar de contar.</p>
    <div class="stopline">⛔ Si te duele mucho, te mareas, o notas hormigueo o menos fuerza: para y siéntate.</div></div>`;
    return { html, hideTabs: false, mount: () => { const t = setInterval(wkTick, 1000); wkTick(); return () => clearInterval(t); } };
  }
  const st = weekStats(), all = walks().slice().reverse();
  const html = `<h1>Caminar</h1>
  <div class="card cta"><div class="rowb"><div><h3>Objetivo de hoy</h3><p class="big2">${cf.walkTarget} min</p><small>A tu ritmo, sin prisa</small></div><div class="ring" style="--p:${Math.min(100, Math.round(walks().filter(w => w.date === today()).reduce((a, w) => a + w.durSec, 0) / 60 / cf.walkTarget * 100))}"><span>🚶</span></div></div>
  ${walkWarn()}
  ${calCard()}
  <button class="btn xl" data-a="wkGo">▶ Empezar paseo</button>
  <label class="chk"><input type="checkbox" id="usegps" ${cf.gps === false ? '' : 'checked'} data-c="gpsopt"> Usar GPS para medir los km</label>
  <button class="link" data-a="wkManual">+ Añadir un paseo sin GPS (por ejemplo, por casa)</button></div>
  <div class="card"><h3>Esta semana</h3><div class="wstats"><div><b>${st.min}</b><small>minutos</small></div><div><b>${st.km.toFixed(1).replace('.', ',')}</b><small>km</small></div><div><b>${st.n}</b><small>paseos</small></div></div></div>
  <h3 class="sec">Mis paseos</h3>${all.length ? all.slice(0, 30).map(w => `<button class="wrow" ${np('paseo', { id: w.id })}><span class="wf">${FACES[w.animo != null ? w.animo : 1]}</span><span class="wi"><b>${fdate(w.date)}${w.start ? ' · ' + w.start : ''}</b><small>${Math.round(w.durSec / 60)} min${w.distM ? ' · ' + fmtKm(w.distM) + ' km' : ''}${w.pasos ? ' · ~' + w.pasos + ' pasos' : ''}</small></span><span class="dotc ${w.semaforo}"></span></button>`).join('') : '<div class="empty">Aún no hay paseos. ¡El primero es el más importante!</div>'}`;
  return { html };
};
CHG.gpsopt = el => setCfg({ gps: el.checked });
function walkWarn() {
  const c = todayCheck(); let h = '';
  if (c && c.semaforo === 'rojo') h += '<div class="card red"><p><b>Hoy no salgas a caminar.</b> Lo que marcaste en la revisión merece que lo vea un médico.</p><button class="btn" data-a="nav" data-v="checkres">Ver qué hacer</button></div>';
  else if (c && c.semaforo === 'noche') h += '<div class="card amber"><p>🌙 Con las pastillas de la noche, mejor no salgas a caminar: puede haber mareo o caídas. Mañana, antes de tomarlas.</p></div>';
  if (kneeOff()) h += '<div class="card amber"><p>🦵 Hay una pausa de rodilla activa. Antes de salir a caminar, confirma con Luis qué ha dicho el médico.</p></div>';
  return h;
}
function calCard() {
  const cur = calCurrent(), E = CAL_ETAPAS[cur], c = todayCheck(), r = calList(cur, c), done = calToday();
  return `<div class="card"><h3>🔥 Antes de salir</h3><p class="small">Calentamiento · ${E.emoji} ${E.nombre} · unos ${calMin(r.list)} min${done ? ' · ✅ hecho hoy' : ''}</p>
  <button class="btn ${done ? 'ghost' : ''}" data-a="calGo">${done ? 'Repetir el calentamiento' : 'Calentar ahora'}</button>
  ${cur > 1 ? '<button class="link" data-a="calGo" data-s="1">Hoy prefiero la versión sentada</button>' : ''}
  <button class="link" data-a="nav" data-v="calent">Ver ejercicios y etapas</button></div>`;
}
V.calent = () => {
  const cur = calCurrent(), c = todayCheck();
  const need = { 2: 'Se abre tras 4 calentamientos sentada sin dolor.', 3: 'Se abre tras 6 calentamientos de pie y con el visto bueno de la fisio (lo activa Luis).' };
  const stage = n => {
    const E = CAL_ETAPAS[n], ok = calStageOk(n), isCur = n === cur, r = calList(n, c);
    return `<div class="level ${ok ? '' : 'locked'}"><div class="lh"><span class="le">${E.emoji}</span><div><b>Etapa ${n} · ${E.nombre}</b><small>${E.desc}</small></div>${isCur ? '<span class="lc">Tu etapa</span>' : ''}</div>
    ${ok ? '' : `<p class="small lockmsg">🔒 ${need[n]}</p>`}
    <div class="exlist">${CAL_ETAPAS[n].ids.map(i => { const e = EX[i], st = exState(e), b = BLOQUES.calent; return `<button class="exrow ${st === 'visto' ? 'wait' : ''}" ${np('ejercicio', { id: e.id })}><span class="ei">${b[1]}</span><span class="en"><b>${esc(e.nombre)}</b><small>${e.rodilla ? 'Carga la rodilla · ' : ''}${esc(e.dosis)}</small></span><span class="es">${st === 'visto' ? '🩺' : '▶️'}</span></button>`; }).join('')}</div>
    ${ok ? `<button class="btn ${isCur ? '' : 'ghost'}" data-a="calGo" data-s="${n}">Hacer la etapa ${n} (~${calMin(r.list)} min)</button>` : ''}</div>`;
  };
  const html = `<h1>Calentamiento</h1><p class="lead">Antes de caminar, 5 minutos de movimientos suaves: despiertan las caderas, los tobillos y las piernas, y ayudan a caminar más suelta. No es estirar a lo bruto ni hacerse daño.</p>
  <div class="card"><h3>Cómo funciona</h3><ul class="lst"><li>Empiezas siempre <b>sentada</b> y, cuando lleves unos días, pasas a ejercicios <b>de pie con apoyo</b>.</li><li>Si un día estás cansada o con más dolor, haz solo la etapa 1.</li><li>Los primeros 3 minutos del paseo, a ritmo lento.</li><li>Nunca después de las pastillas de la noche.</li></ul></div>
  ${stage(1)}${stage(2)}${stage(3)}
  <div class="card"><h3>🧊 Al volver</h3><p class="small">${CAL_ETAPAS.fin.desc}</p><button class="btn ghost" data-a="calGo" data-s="fin">Hacer 2 minutos</button></div>
  <p class="small">Estos ejercicios no se “superan”: se repiten cada día que salgas a caminar.</p>`;
  return { title: 'Calentamiento', html };
};
ACT.calGo = async el => {
  const raw = el && el.dataset && el.dataset.s; let stage = raw ? (raw === 'fin' ? 'fin' : +raw) : calCurrent();
  if (stage !== 'fin') {
    const c0 = todayCheck();
    if (!c0) { toast('Primero, un repaso rápido de cómo estás'); return nav('checkin', { calent: stage }); }
    if (c0.semaforo === 'rojo') return nav('checkres');
    if (c0.semaforo === 'noche') { modal('<h3>Mejor mañana</h3><p>Con las pastillas de la noche, mejor no hacer ejercicio de pie ni salir a caminar: puede haber mareo o caídas. Mañana lo haces antes de tomarlas.</p><button class="btn" data-a="close">Vale</button>'); return; }
    if (c0.semaforo === 'amarillo') stage = 1;
  }
  const c = todayCheck(), r = stage === 'fin' ? calList('fin') : calList(stage, c);
  if (!r.list.length) return toast('Hoy no hay ejercicios disponibles');
  if (r.fallback) toast('Por la rodilla, hoy el calentamiento es sentada.', 4000);
  startSession(!!(c && c.semaforo === 'amarillo' && stage !== 'fin'), r.list, 'calent', { stage: r.stage });
};
function wkTick() {
  const s = WK.s; if (!s) return; const cf = cfg(), el = wkElapsed(); const m = el / 60;
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('wtime', fmtTime(el)); set('wdist', fmtKm(s.dist)); set('wsteps', Math.round(s.dist / cf.stride));
  set('wpace', s.dist > 80 ? (() => { const p = el / 60 / (s.dist / 1000); return Math.floor(p) + ':' + pad(Math.round((p % 1) * 60) % 60); })() : '–');
  const b = document.getElementById('wbar'); if (b) b.style.width = Math.min(100, m / cf.walkTarget * 100) + '%';
  set('wgt', m >= cf.walkTarget ? '🎉 ¡Objetivo conseguido! Puedes seguir o terminar.' : 'Objetivo: ' + cf.walkTarget + ' min');
  const g = document.getElementById('wgps'); if (g && s.gps) g.textContent = s.err || (s.acc ? (s.acc <= 20 ? '🟢 Buena señal GPS' : s.acc <= 35 ? '🟡 Señal GPS regular' : '🟠 Buscando mejor señal…') : '🛰 Buscando señal…');
  if (s.nextPausa && !s.paused && m >= s.nextPausa) { s.nextPausa += cf.pausaMin; beep(2); toast('⏸ ¿Descansas un minuto? Siéntate si lo necesitas.', 6000); }
}
ACT.wkGo = async el => {
  const c = todayCheck();
  if (c && c.semaforo === 'rojo') return nav('checkres');
  if (c && c.semaforo === 'noche' && !(await ask('Con las pastillas de la noche', 'Salir a caminar ahora puede ser peligroso (mareo, caídas). Mejor mañana, antes de tomarlas. ¿Quieres salir igualmente?', 'Salir igualmente', 'Mejor no'))) return;
  if (!(el && el.skipCal) && cfg().calentar !== false && !calToday()) {
    if (await ask('Antes de salir', 'Son unos 5 minutos para despertar las caderas, las piernas y los tobillos. Así caminas más a gusto. ¿Calentamos?', 'Sí, calentar', 'Salir ya')) return ACT.calGo();
  }
  const gps = cfg().gps !== false;
  if (gps && navigator.permissions && navigator.permissions.query) { try { const r = await navigator.permissions.query({ name: 'geolocation' }); if (r.state === 'denied') { toast('La ubicación está bloqueada para esta app. Se medirá solo el tiempo.', 5000); return wkStart(false); } } catch (e) { } }
  wkStart(gps);
};
ACT.wkPause = () => { const s = WK.s; if (!s.paused) { s.paused = true; s.pauseT = Date.now(); $('#wpause').textContent = '▶ Seguir'; } else { s.pausedAcc += Date.now() - s.pauseT; s.paused = false; s.last = null; $('#wpause').textContent = '⏸ Pausa'; } };
ACT.wkFinish = async () => {
  const s = WK.s; if (wkElapsed() < 30 && !(await ask('¿Terminar ya?', 'El paseo dura menos de 30 segundos.', 'Terminar', 'Seguir'))) return;
  if (!await ask('¿Terminar el paseo?', 'Después te haré unas preguntas rápidas.', 'Terminar', 'Seguir')) return;
  const dur = wkElapsed(); wkStopWatch();
  WK.form = { durSec: Math.round(dur), distM: Math.round(s.dist), pts: s.pts.map(p => [p[0], p[1]]), gps: s.gps, gaps: s.gaps, start: new Date(s.t0).toTimeString().slice(0, 5), date: ymd(new Date(s.t0)), animo: 1, dolor: 0, parada: false, mejora: null, neuro: 0, partes: [] };
  WK.s = null; App.stack = [{ view: 'paseoform' }]; App.tab = 'caminar'; draw();
};
ACT.wkManual = () => {
  const m = modal(`<h3>Paseo sin GPS</h3><p>¿Cuántos minutos has caminado?</p><input type="number" id="mm" min="1" max="240" value="10" class="inp"><div class="row2"><button class="btn ghost" data-a="close">Cancelar</button><button class="btn" data-a="wkManualOk">Seguir</button></div>`);
};
ACT.wkManualOk = () => { const v = +$('#mm').value; if (!v || v < 1) return; closeModal(); WK.form = { durSec: Math.round(v * 60), distM: 0, pts: [], gps: false, start: '', date: today(), animo: 1, dolor: 0, parada: false, mejora: null, neuro: 0, partes: [] }; nav('paseoform'); };

V.paseoform = () => {
  const f = WK.form; if (!f) return { html: '<p>…</p>' };
  const sel = (k, vals, labs) => `<div class="opts">${vals.map((v, i) => `<button class="${f[k] === v ? 'on' : ''}" data-a="wf" data-k="${k}" data-v="${v}">${labs[i]}</button>`).join('')}</div>`;
  const html = `<div class="card ok"><h2>¡Paseo terminado! 🎉</h2><p><b>${Math.round(f.durSec / 60)} min</b>${f.distM ? ' · <b>' + fmtKm(f.distM) + ' km</b>' : ''}${f.distM ? ' · ~' + Math.round(f.distM / cfg().stride) + ' pasos' : ''}</p></div>
  <div class="optq"><b>¿Cómo te has sentido?</b>${sel('animo', [0, 1, 2, 3], FACES)}</div>
  <div class="stp"><div class="sl">¿Cuánto te dolió durante el paseo? (0-10)</div><div class="sc"><button data-a="wfd" data-d="-1">−</button><div class="sv v${f.dolor}">${f.dolor}</div><button data-a="wfd" data-d="1">+</button></div></div>
  <div class="optq"><b>¿Tuviste que parar por el dolor o el cansancio?</b>${sel('parada', [false, true], ['No', 'Sí'])}</div>
  ${f.parada ? `<div class="optq"><b>Al sentarte o inclinarte hacia delante, ¿mejoró?</b>${sel('mejora', [true, false, null], ['Sí', 'No', 'No sé'])}</div>` : ''}
  <div class="optq"><b>¿Hormigueo o menos fuerza en las piernas?</b>${sel('neuro', [0, 1, 2], ['Como siempre', 'Algo más', 'Nuevo o mucho más'])}</div>
  <button class="btn xl" data-a="wfSave">Guardar paseo</button>`;
  return { title: 'Después del paseo', html };
};
ACT.wf = el => { const f = WK.form, k = el.dataset.k; let v = el.dataset.v; v = v === 'true' ? true : v === 'false' ? false : v === 'null' ? null : +v; f[k] = v; if (k === 'parada' && !v) f.mejora = null; draw(true); };
ACT.wfd = el => { const f = WK.form; f.dolor = Math.max(0, Math.min(10, f.dolor + +el.dataset.d)); draw(true); };
ACT.wfSave = async () => {
  const f = WK.form, p = profile(); let sem = 'verde';
  if (f.neuro === 2) sem = 'rojo'; else if (f.neuro === 1 || f.parada || f.dolor >= p.baseLumbar + 3) sem = 'amarillo';
  const route = simplify(f.pts, 4).map(q => [+q[0].toFixed(5), +q[1].toFixed(5)]);
  const w = { id: uid(), date: f.date, start: f.start, durSec: f.durSec, distM: f.distM, pasos: f.distM ? Math.round(f.distM / cfg().stride) : 0, route, gps: f.gps, gaps: f.gaps || 0, animo: f.animo, dolor: f.dolor, parada: f.parada, mejora: f.mejora, neuro: f.neuro, semaforo: sem };
  const sube = walkTargetAdjust(w); await db.push('walks', w); WK.form = null; App.stack = []; App.tab = 'caminar'; draw();
  if (sem === 'rojo') modal(`<h3>🛑 Esto merece que lo vea un médico</h3><p>Has marcado hormigueo o pérdida de fuerza nuevos. No sigas caminando hoy y habla con tu médico. Si se te duerme la zona íntima, no controlas el pis o la caca, o no puedes caminar, ve a Urgencias o llama al 112.</p><a class="btn danger" href="tel:112">📞 112</a><button class="btn" data-a="close">Entendido</button>`);
  else toast(sube ? '🎉 ¡Paseo guardado! Tu objetivo sube 1 minuto.' : '¡Paseo guardado!', 3500);
};
V.paseo = ({ id }) => {
  const w = walks().find(x => x.id === id); if (!w) return { html: '<p>No encontrado</p>' };
  const sem = { verde: 'Fue bien', amarillo: 'Con alguna molestia', rojo: 'Con señales a vigilar' }[w.semaforo];
  return { title: 'Paseo', html: `<h2>${fdateLong(w.date)}${w.start ? ' · ' + w.start : ''}</h2>${routeSvg(w.route)}
  <div class="wstats"><div><b>${fmtTime(w.durSec)}</b><small>tiempo</small></div><div><b>${w.distM ? fmtKm(w.distM) : '–'}</b><small>km</small></div><div><b>${w.pasos || '–'}</b><small>pasos aprox.</small></div></div>
  <div class="card"><p>${FACES[w.animo != null ? w.animo : 1]} ${sem}</p><p class="small">Dolor durante el paseo: ${w.dolor != null ? w.dolor + '/10' : '–'}${w.parada ? ' · Tuvo que parar' + (w.mejora === true ? ' (mejoró al sentarse o inclinarse)' : w.mejora === false ? ' (no mejoró al sentarse)' : '') : ''}${w.neuro ? ' · Hormigueo/fuerza: ' + ['', 'algo más', 'nuevo o mucho más'][w.neuro] : ''}</p>${w.gaps ? '<p class="small">📡 Hubo ' + w.gaps + ' pérdida(s) de señal GPS: los km pueden ser algo menores.</p>' : ''}</div>
  <div class="foot"><button class="link" data-a="wDel" data-id="${id}">🗑 Borrar este paseo</button></div>` };
};
function routeSvg(r) {
  if (!r || r.length < 2) return '<div class="noroute">🗺 Sin ruta guardada (paseo sin GPS)</div>';
  const lat = r.map(p => p[0]), lon = r.map(p => p[1]), c = Math.cos(lat[0] * Math.PI / 180);
  const x0 = Math.min(...lon), x1 = Math.max(...lon), y0 = Math.min(...lat), y1 = Math.max(...lat);
  const w = Math.max((x1 - x0) * c, 1e-5), h = Math.max(y1 - y0, 1e-5), S = 260 / Math.max(w, h), ox = (300 - w * S) / 2, oy = (170 - h * S) / 2 + 5;
  const P = r.map(p => [(ox + (p[1] - x0) * c * S).toFixed(1), (oy + (y1 - p[0]) * S).toFixed(1)]);
  return `<svg viewBox="0 0 300 180" class="route"><polyline points="${P.map(p => p.join(',')).join(' ')}" class="rline"/><circle cx="${P[0][0]}" cy="${P[0][1]}" r="6" class="rs"/><circle cx="${P[P.length - 1][0]}" cy="${P[P.length - 1][1]}" r="6" class="re"/></svg>`;
}
ACT.wDel = async el => { if (!await needPin()) return; if (await ask('¿Borrar el paseo?', 'No se puede deshacer.', 'Borrar', 'No')) { db.set('walks', walks().filter(w => w.id !== el.dataset.id)); back(); } };

/* ================= HISTORIAL ================= */
const EST = { confirmado: ['Confirmado', 'ok'], referido: ['Referido', 'ref'], interpretacion: ['Interpretación posible', 'int'], pendiente: ['Pendiente de confirmar', 'pen'], hipotesis: ['Hipótesis', 'hip'] };
const MOM = { manana: 'Mañana', mediodia: 'Mediodía', noche: 'Noche', demanda: 'Cuando hace falta' };
W.hs = 'resumen';
V.historial = () => {
  const p = profile(); const tabs = [['resumen', 'Resumen'], ['evol', 'Evolución'], ['informes', 'Informes'], ['preg', 'Preguntas']];
  const body = { resumen: histResumen, evol: histEvol, informes: histInformes, preg: histPreg }[W.hs]();
  return { html: `<h1>Historial de ${esc(p.nombre)}</h1><div class="segc">${tabs.map(t => `<button class="${W.hs === t[0] ? 'on' : ''}" data-a="hs" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>${body}` };
};
ACT.hs = el => { W.hs = el.dataset.v; draw(); };
const chipE = e => `<span class="est ${EST[e] ? EST[e][1] : ''}">${EST[e] ? EST[e][0] : esc(e)}</span>`;
function histResumen() {
  const p = profile(), cl = db.get('clinical', []), meds = db.get('meds', []), pend = db.get('pend', {});
  const nov = cl.filter(c => c.fecha >= addDays(today(), -21)).sort((a, b) => b.fecha.localeCompare(a.fecha));
  let h = '';
  h += `<div class="card"><h3>Quién es</h3><p>${esc(p.nombreCompleto || p.nombre)}${p.edad ? ' · ' + p.edad + ' años' : ''}${p.altura ? ' · ' + String(p.altura).replace('.', ',') + ' m' : ''}${p.peso ? ' · ~' + p.peso + ' kg (referido)' : ''}</p>
  ${p.baseFecha ? `<p class="small">Punto de partida (${fdate(p.baseFecha)}): dolor de espalda ${p.baseLumbar}/10 · pierna ${p.basePierna}/10 · miedo a caerse ${p.baseMiedo}/10 · ~${p.basePasos} pasos/día · camina ~${p.baseCaminata} min · de pie ~${p.basePie} min.</p>` : ''}
  ${p.puede ? `<p><b>Puede:</b> ${esc(p.puede)}</p>` : ''}${p.cuesta ? `<p><b>Le cuesta:</b> ${esc(p.cuesta)}</p>` : ''}</div>`;
  h += `<div class="card new"><h3>🆕 Lo último</h3>${nov.length ? nov.map(c => `<div class="ci"><div class="cih"><b>${fdate(c.fecha)}</b> ${chipE(c.estado)}</div><p>${esc(c.texto)}</p>${c.notas ? `<p class="small">${esc(c.notas)}</p>` : ''}</div>`).join('') : '<p class="small">Nada nuevo en las últimas semanas.</p>'}</div>`;
  const grupos = ['confirmado', 'referido', 'interpretacion', 'pendiente', 'hipotesis'];
  h += '<h3 class="sec">Lo que sabemos</h3><p class="small">Separado por lo seguro que es cada dato.</p>';
  grupos.forEach((g, gi) => { const l = cl.filter(c => c.estado === g).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')); if (!l.length) return;
    h += `<details class="acc" ${gi === 0 ? '' : ''}><summary>${chipE(g)} <span class="cnt">${l.length}</span></summary>${l.map(c => `<div class="ci"><p>${esc(c.texto)}</p><p class="small">${esc(c.categoria || '')}${c.fuente ? ' · ' + esc(c.fuente) : ''}${c.fecha ? ' · ' + fdate(c.fecha) : ''}</p></div>`).join('')}</details>`; });
  h += '<h3 class="sec">Lo que falta por adjuntar</h3><div class="card">' + PENDIENTE_ADJUNTAR.map(a => `<div class="pend ${pend[a[0]] ? 'done' : ''}"><span>${pend[a[0]] ? '✅' : '⬜'}</span><div><b>${esc(a[1])}</b>${pend[a[0]] ? `<small>Adjuntado</small>` : `<label class="link filebtn">📎 Adjuntar foto o PDF<input type="file" accept="image/*,application/pdf" data-c="attach" data-id="${a[0]}" data-cat="${esc(a[2])}" data-t="${esc(a[1])}" hidden></label>`}</div></div>`).join('') + '</div>';
  if (meds.length) {
    h += '<h3 class="sec">Medicación (la que ella cuenta)</h3><div class="card warnc"><p class="small">⚠️ Es la pauta que ella ha contado. Esta app no la cambia ni da consejos sobre ella: cualquier duda, con su médico o farmacéutico.</p>' + ['manana', 'mediodia', 'noche', 'demanda'].map(m => { const l = meds.filter(x => x.momento === m); return l.length ? `<p><b>${MOM[m]}:</b> ${l.map(x => esc(x.nombre + ' ' + x.dosis)).join(' · ')}</p>` : ''; }).join('') + '</div>';
  }
  h += '<h3 class="sec">Señales de alarma</h3><div class="card"><p class="small">Si aparece alguna, no se hace ejercicio y se consulta:</p><ul class="al-list">' + ALARMAS.map(a => `<li class="${a.nivel}">${esc(a.texto)}</li>`).join('') + '</ul></div>';
  h += `<div class="foot"><button class="link" data-a="addInfo">➕ Añadir información al historial (cuidador)</button></div>`;
  return h;
}
CHG.attach = async el => {
  const f = el.files[0]; if (!f) return; const fid = 'd-' + uid(); toast('Guardando…');
  try { await db.putFile(fid, f, { name: f.name, type: f.type }); } catch (e) { return toast('No se pudo guardar (poco espacio)'); }
  const doc = { id: uid(), titulo: el.dataset.t, fecha: today(), categoria: el.dataset.cat, fileIds: [fid], notas: '' };
  await db.push('docs', doc); const pend = Object.assign({}, db.get('pend', {})); pend[el.dataset.id] = doc.id; await db.set('pend', pend); toast('Adjuntado ✔'); draw(true);
};
ACT.addInfo = async () => {
  if (!await needPin('Para añadir información al historial.')) return;
  modal(`<h3>Añadir al historial</h3><label>Qué ha pasado o qué sabemos<textarea id="ai-t" rows="3" class="inp"></textarea></label>
  <label>Qué tan seguro es<select id="ai-e" class="inp">${Object.keys(EST).map(k => `<option value="${k}" ${k === 'referido' ? 'selected' : ''}>${EST[k][0]}</option>`).join('')}</select></label>
  <label>Tipo<select id="ai-c" class="inp">${['Síntoma', 'Diagnóstico', 'Hallazgo de imagen', 'Antecedente', 'Tratamiento', 'Incertidumbre', 'Otro'].map(c => `<option>${c}</option>`).join('')}</select></label>
  <label>Fecha<input type="date" id="ai-d" class="inp" value="${today()}"></label>
  <div class="row2"><button class="btn ghost" data-a="close">Cancelar</button><button class="btn" data-a="addInfoOk">Guardar</button></div>`, { big: true });
};
ACT.addInfoOk = async () => { const t = $('#ai-t').value.trim(); if (!t) return toast('Escribe algo'); await db.push('clinical', { id: uid(), texto: t, estado: $('#ai-e').value, categoria: $('#ai-c').value, fuente: 'Añadido en la app', fecha: $('#ai-d').value || today(), notas: '' }); closeModal(); draw(true); toast('Añadido al historial'); };

function histEvol() {
  const tests = db.get('tests', []).slice().sort((a, b) => a.date.localeCompare(b.date)), ch = checks().slice(-30), ws = walks();
  const T = d => new Date(d + 'T12:00:00').getTime();
  let h = `<button class="btn" ${np('prueba')}>📏 Hacer las pruebas (cada 2 semanas)</button>`;
  const lastT = tests.slice(-1)[0], dd = lastT ? daysBetween(lastT.date, today()) : null;
  h += `<p class="small">${lastT ? 'Última prueba: ' + fdate(lastT.date) + ' (hace ' + dd + ' días).' : 'Todavía no hay pruebas. La primera será el punto de partida real.'}</p>`;
  const sts = tests.filter(t => t.valores && t.valores.sts30 != null);
  h += `<div class="card"><h3>🪑 Levantarse de la silla en 30 s</h3>${lineChart([{ name: 'veces', pts: sts.map(t => ({ x: T(t.date), y: t.valores.sts30 })) }], { min: 0 })}${sts.length ? `<p class="small">Último: ${sts.slice(-1)[0].valores.sts30} veces · manos: ${esc((sts.slice(-1)[0].extras || {}).brazos || '–')}</p>` : ''}<p class="small">Meta: hacerlo sin usar las manos.</p></div>`;
  h += `<div class="card"><h3>🚶 Minutos por paseo</h3>${lineChart([{ name: 'min', pts: ws.map(w => ({ x: T(w.date), y: Math.round(w.durSec / 60) })) }], { min: 0 })}</div>`;
  const wk = []; for (let i = 5; i >= 0; i--) { const s = addDays(weekStart(), -7 * i), e = addDays(s, 6); wk.push({ l: s.slice(8) + '/' + s.slice(5, 7), min: Math.round(ws.filter(w => w.date >= s && w.date <= e).reduce((a, w) => a + w.durSec, 0) / 60), ses: sessions().filter(x => x.date >= s && x.date <= e).length }); }
  h += `<div class="card"><h3>📅 Minutos caminados por semana</h3>${barChart(wk.map(x => x.min), wk.map(x => x.l))}</div><div class="card"><h3>💪 Entrenamientos por semana</h3>${barChart(wk.map(x => x.ses), wk.map(x => x.l))}</div>`;
  h += `<div class="card"><h3>🩹 Dolor (revisión diaria)</h3>${lineChart([{ name: 'Espalda', pts: ch.map(c => ({ x: T(c.date), y: c.lumbar })) }, { name: 'Pierna', pts: ch.map(c => ({ x: T(c.date), y: c.pierna })) }, { name: 'Rodilla', pts: ch.map(c => ({ x: T(c.date), y: c.rodilla })) }], { min: 0, max: 10 })}<p class="small">Un día suelto no dice nada: se miran las tendencias.</p></div>`;
  const pesos = tests.filter(t => t.valores && t.valores.peso != null); if (pesos.length) h += `<div class="card"><h3>⚖️ Peso (mensual)</h3>${lineChart([{ name: 'kg', pts: pesos.map(t => ({ x: T(t.date), y: t.valores.peso })) }])}</div>`;
  const dom = Object.keys(mastered()).length; h += `<div class="card"><h3>⭐ Ejercicios superados</h3><p class="big2">${dom} de ${EJERCICIOS.length}</p></div>`;
  return h;
}
V.prueba = () => {
  const html = `<p class="lead">Mejor con alguien al lado. Anota solo lo que hagas hoy.</p>` + PRUEBAS.map(t => `<div class="card"><h3>${esc(t.nombre)}</h3><p class="small">${esc(t.como)}</p><div class="inrow"><input type="number" inputmode="decimal" step="${t.step || 1}" min="0" ${t.max ? 'max="' + t.max + '"' : ''} class="inp" id="pr-${t.id}" placeholder="—"><span>${t.unidad}</span></div>${t.extra ? `<label>${esc(t.extra.label)}<select class="inp" id="pre-${t.id}">${t.extra.opts.map(o => `<option>${o}</option>`).join('')}</select></label>` : ''}</div>`).join('') + `<label>Notas<textarea id="pr-n" rows="2" class="inp"></textarea></label><button class="btn xl" data-a="prSave">Guardar pruebas</button>`;
  return { title: 'Pruebas', html };
};
ACT.prSave = async () => {
  const v = {}, ex = {}; PRUEBAS.forEach(t => { const x = $('#pr-' + t.id).value; if (x !== '') { v[t.id] = +x; if (t.extra) ex[t.extra.key] = $('#pre-' + t.id).value; } });
  if (!Object.keys(v).length) return toast('No has anotado nada');
  await db.push('tests', { id: uid(), date: today(), valores: v, extras: ex, notas: $('#pr-n').value }); back(); toast('Pruebas guardadas');
};
function histInformes() {
  const docs = db.get('docs', []).slice().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  return `<label class="btn ghost filebtn">📎 Adjuntar un informe (foto o PDF)<input type="file" accept="image/*,application/pdf" data-c="attachFree" hidden></label>` + (docs.length ? docs.map(d => `<div class="card doc"><div class="rowb"><div><b>${esc(d.titulo)}</b><p class="small">${fdate(d.fecha)} · ${esc(d.categoria || '')}</p></div>${(d.fileIds || []).length ? `<button class="btn ghost sm" data-a="openDoc" data-id="${d.id}">Ver</button>` : '<span class="est pen">Sin archivo</span>'}</div>
  ${d.literal ? `<details class="acc"><summary>Lo que dice el informe</summary><p class="pre">${esc(d.literal)}</p></details>` : ''}${d.notas ? `<details class="acc"><summary>Notas</summary><p class="pre">${esc(d.notas)}</p></details>` : ''}${d.preguntas ? `<details class="acc"><summary>Preguntas para el médico</summary><p class="pre">${esc(d.preguntas)}</p></details>` : ''}</div>`).join('') : '<div class="empty">Aún no hay informes.</div>');
}
CHG.attachFree = async el => { const f = el.files[0]; if (!f) return; const t = prompt ? null : null; void t; const fid = 'd-' + uid(); await db.putFile(fid, f, { name: f.name, type: f.type }); await db.push('docs', { id: uid(), titulo: f.name.replace(/\.[^.]+$/, ''), fecha: today(), categoria: 'Otros', fileIds: [fid], notas: '' }); toast('Informe guardado'); draw(true); };
ACT.openDoc = async el => { const d = db.get('docs', []).find(x => x.id === el.dataset.id); if (!d) return; const f = await db.getFile(d.fileIds[0]); if (!f) return toast('Archivo no encontrado'); const url = URL.createObjectURL(f.blob); if ((f.type || '').startsWith('image/')) modal(`<img src="${url}" class="docimg"><button class="btn" data-a="close">Cerrar</button>`, { big: true }); else window.open(url, '_blank'); };
function histPreg() {
  const q = db.get('questions', []); if (!q.length) return '<div class="empty">No hay preguntas guardadas.</div>';
  const por = {}; q.forEach(x => { (por[x.para] = por[x.para] || []).push(x); });
  return '<p class="small">Para llevar a las citas. Toca una para marcarla como resuelta.</p>' + Object.keys(por).map(k => `<h3 class="sec">${esc(k)}</h3>` + por[k].map(x => `<button class="qrow ${x.estado === 'resuelta' ? 'done' : ''}" data-a="qTog" data-id="${x.id}"><span>${x.estado === 'resuelta' ? '✅' : '❓'}</span><span>${esc(x.texto)}${x.respuesta ? `<small>Respuesta: ${esc(x.respuesta)}</small>` : ''}</span></button>`).join('')).join('');
}
ACT.qTog = el => { const q = db.get('questions', []).map(x => x.id === el.dataset.id ? Object.assign({}, x, { estado: x.estado === 'resuelta' ? 'pendiente' : 'resuelta' }) : x); db.set('questions', q); draw(true); };

/* ================= CUIDADOR ================= */
V.cuidador = () => {
  const s = cfg(), p = profile();
  const sw = (id, on, lab) => `<label class="sw"><input type="checkbox" data-c="${id.split(':')[0]}" data-id="${id.split(':')[1] || ''}" ${on ? 'checked' : ''}><span>${lab}</span></label>`;
  const fisioEx = EJERCICIOS.filter(e => e.fisio);
  const html = `<div class="card"><h3>🩺 Visto bueno de la fisioterapeuta</h3><p class="small">Del nivel 3 al 12 hay que abrirlos a mano, uno a uno. Los niveles 6-12 (pesas, mancuernas, gimnasio y barra) son una escalera de diseño propio, sin estudio que la valide para su espalda: ábrelos solo cuando lo hayáis hablado con un profesional que la haya explorado.</p>
  ${sw('gates:', s.gates, 'Pedir visto bueno (recomendado)')}${Object.keys(NIVELES).map(Number).filter(n => n >= 3).map(n => sw('lvl:' + n, s.aprobNiveles.indexOf(n) >= 0, 'Abrir nivel ' + n + ' · ' + NIVELES[n].nombre) + (NIVELES[n].aviso ? '<p class="small lvlnote">' + esc(NIVELES[n].aviso) + '</p>' : '')).join('')}
  <details class="acc"><summary>Ejercicios concretos que piden fisio (${fisioEx.length})</summary>${fisioEx.map(e => sw('exok:' + e.id, s.aprobEj.indexOf(e.id) >= 0, esc(e.nombre) + ' <small>(nivel ' + e.nivel + ')</small>')).join('')}</details></div>
  <div class="card"><h3>⏩ Empezar en un nivel más alto</h3><p class="small">Si los primeros ejercicios se le quedan cortos: marca como superados todos los de los niveles anteriores y abre hasta el nivel elegido. Los niveles anteriores se ocultan de la pantalla Entrenar (se pueden volver a mostrar ahí). Los ejercicios marcados “fisio” siguen pidiendo su propio visto bueno (arriba).</p>
  <label>Empezar en<select class="inp" id="skipN">${[2, 3, 4, 5].map(n => `<option value="${n}" ${n === 3 ? 'selected' : ''}>Nivel ${n} · ${esc(NIVELES[n].nombre)}</option>`).join('')}</select></label>
  <button class="btn ghost" data-a="skipLevels">Aplicar</button></div>
  <div class="card"><h3>🧰 Material que tiene</h3><p class="small">Los ejercicios que piden algo que no está marcado aparecen como “Falta material”.</p>
  ${Object.keys(MATERIALES).map(k => sw('mat:' + k, (s.mat || {})[k] !== undefined ? s.mat[k] : MATERIALES[k][1], MATERIALES[k][0])).join('')}
  <label>Mancuerna más pesada que tiene (kg)<input type="number" class="inp" data-c="set" data-k="kgMan" value="${s.kgMan}" min="1" max="60" step="0.5"></label>
  <label>Minutos de una sesión de fuerza<input type="number" class="inp" data-c="set" data-k="minFuerza" value="${s.minFuerza}" min="10" max="60"></label>
  <label>Sesiones de fuerza por semana (2 es lo habitual; siempre con un día entre medias)<input type="number" class="inp" data-c="set" data-k="fuerzaSem" value="${s.fuerzaSem}" min="1" max="3"></label></div>
  <div class="card"><h3>🔥 Calentamiento antes de caminar</h3>
  ${sw('calask:', s.calentar !== false, 'Preguntar si quiere calentar antes de empezar un paseo')}
  ${sw('exok:w13', s.aprobEj.indexOf('w13') >= 0, 'Abrir la etapa 3 (paso atrás para abrir la cadera). Pídelo a la fisio antes: con estenosis o espondilolistesis, el estiramiento de la cadera puede arquear la espalda.')}
  <label>Saltar directamente a la etapa<select class="inp" data-c="calmax"><option value="0" ${!s.calMax ? 'selected' : ''}>Automática</option><option value="2" ${s.calMax === 2 ? 'selected' : ''}>Etapa 2 ya abierta</option><option value="3" ${s.calMax === 3 ? 'selected' : ''}>Etapa 3 ya abierta</option></select></label></div>
  <div class="card"><h3>🦵 Rodilla</h3><p class="small">Pausa los ejercicios que cargan la rodilla (levantarse, escalones…) hasta la fecha que te diga el médico tras la infiltración. Esta app no sabe cuánto reposo hace falta: pregúntalo.</p>
  <label>Pausar hasta<input type="date" class="inp" data-c="kneeDate" value="${esc(s.rodillaHasta)}"></label><label>Rodilla infiltrada (nota)<input type="text" class="inp" data-c="kneeSide" value="${esc(s.rodillaLado)}" placeholder="derecha / izquierda / fecha"></label></div>
  <div class="card"><h3>⚙️ Ajustes</h3>
  <label>Minutos de entrenamiento<input type="number" class="inp" data-c="set" data-k="minutos" value="${s.minutos}" min="5" max="30"></label>
  <label>Objetivo de paseo (min)<input type="number" class="inp" data-c="set" data-k="walkTarget" value="${s.walkTarget}" min="3" max="60"></label>
  <label>Longitud de paso (m) para estimar pasos<input type="number" step="0.01" class="inp" data-c="set" data-k="stride" value="${s.stride}" min="0.3" max="1"></label>
  <label>Aviso de descanso durante el paseo cada (min, 0 = nunca)<input type="number" class="inp" data-c="set" data-k="pausaMin" value="${s.pausaMin}" min="0" max="30"></label>
  <label>Días mínimos entre un ejercicio superado y el siguiente<input type="number" class="inp" data-c="set" data-k="cadaDias" value="${s.cadaDias}" min="0" max="30"></label></div>
  <div class="card"><h3>🎯 Meta</h3><label>Ejercicio meta<select class="inp" data-c="meta"><option value="">—</option>${EJERCICIOS.map(e => `<option value="${e.id}" ${p.metaEj === e.id ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></label></div>
  <button class="btn" ${np('evidencia')}>📚 Evidencia científica del programa</button>
  <div class="card"><h3>💾 Datos</h3><p class="small">Todo se guarda solo en este móvil. Haz una copia de vez en cuando.</p>
  <button class="btn ghost" data-a="backup">Hacer copia de seguridad</button>
  <label class="btn ghost filebtn">Restaurar copia o datos iniciales<input type="file" accept=".json,application/json" data-c="restore" hidden></label>
  <button class="btn ghost" data-a="changePin">Cambiar PIN</button></div>`;
  return { title: 'Modo cuidador', html };
};
CHG.gates = el => { setCfg({ gates: el.checked }); draw(true); };
CHG.lvl = el => { const s = cfg(), n = +el.dataset.id, a = s.aprobNiveles.filter(x => x !== n); if (el.checked) a.push(n); setCfg({ aprobNiveles: a }); };
ACT.skipLevels = async () => {
  const n = +$('#skipN').value, bajos = EJERCICIOS.filter(e => e.nivel < n && e.bloque !== 'calent');
  if (!await ask('¿Empezar en el nivel ' + n + '?', 'Se marcarán como superados ' + bajos.length + ' ejercicios de los niveles anteriores y se abrirán los niveles hasta el ' + n + '. Úsalo solo si de verdad los hace con soltura y sin dolor.', 'Sí, empezar ahí', 'Cancelar')) return;
  const m = Object.assign({}, mastered()), d = addDays(today(), -30); bajos.forEach(e => { if (!m[e.id]) m[e.id] = d; }); db.set('dominados', m);
  const a = cfg().aprobNiveles.slice(); for (let k = 3; k <= n; k++) if (a.indexOf(k) < 0) a.push(k); setCfg({ aprobNiveles: a, cadaDias: Math.min(cfg().cadaDias, 3), ocultoHasta: n - 1, verOcultos: false });
  toast('Listo: empieza en el nivel ' + n); draw(true);
};
CHG.mat = el => { const m = Object.assign({}, DEFAULT_SETTINGS.mat, cfg().mat || {}); m[el.dataset.id] = el.checked; setCfg({ mat: m }); };
CHG.exok = el => { const s = cfg(), a = s.aprobEj.filter(x => x !== el.dataset.id); if (el.checked) a.push(el.dataset.id); setCfg({ aprobEj: a }); };
CHG.calask = el => setCfg({ calentar: el.checked }); CHG.calmax = el => setCfg({ calMax: +el.value });
CHG.kneeDate = el => setCfg({ rodillaHasta: el.value }); CHG.kneeSide = el => setCfg({ rodillaLado: el.value });
CHG.set = el => { const v = +el.value; if (!isNaN(v)) setCfg({ [el.dataset.k]: v }); };
CHG.meta = el => db.set('profile', Object.assign(profile(), { metaEj: el.value }));
ACT.changePin = async () => { await setCfg({ pin: '' }); App.unlockedUntil = 0; await needPin(); };
const b64 = blob => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1]); f.readAsDataURL(blob); });
ACT.backup = async () => {
  toast('Preparando copia…'); const files = await db.allFiles(); const out = { app: 'PasoAPaso', version: 1, exportedAt: new Date().toISOString(), kv: db.kv, files: [] };
  for (const f of files) out.files.push({ id: f.id, name: f.name, type: f.type, b64: await b64(f.blob) });
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' }), name = 'pasoapaso-copia-' + today() + '.json';
  try { const file = new File([blob], name, { type: 'application/json' }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
};
CHG.restore = async el => {
  const f = el.files[0]; if (!f) return; let o; try { o = JSON.parse(await f.text()); } catch (e) { return toast('El archivo no es válido'); }
  if (!o || o.app !== 'PasoAPaso' || !o.kv) return toast('Este archivo no es de Paso a Paso');
  if (!await ask('¿Cargar estos datos?', 'Se sustituirán los datos de este móvil por los del archivo' + (o.kind === 'datos-iniciales' ? ' (datos iniciales).' : '.'), 'Cargar', 'Cancelar')) return;
  for (const k of Object.keys(o.kv)) await db.set(k, o.kv[k]);
  for (const x of (o.files || [])) { const r = await fetch('data:' + (x.type || 'application/octet-stream') + ';base64,' + x.b64); await db.putFile(x.id, await r.blob(), { name: x.name, type: x.type }); }
  toast('Datos cargados'); App.stack = []; App.tab = 'hoy'; buildTabbar(); draw();
};

/* ================= EVIDENCIA ================= */
V.evidencia = () => {
  const ver = EVIDENCIA.filter(e => e.estado === 'verificado'), loc = EVIDENCIA.filter(e => e.estado !== 'verificado');
  const card = e => `<div class="card ev"><div class="rowb"><b>${esc(e.tema)}</b><span class="est ${e.estado === 'verificado' ? 'ok' : 'pen'}">${e.estado === 'verificado' ? 'Verificado' : 'Solo localizado'}</span></div><p class="small">${esc(e.cita)}</p><p>${esc(e.dice)}</p>${e.limites && e.limites !== '—' ? `<p class="small"><b>Límites:</b> ${esc(e.limites)}</p>` : ''}<p class="small"><b>Cómo lo usa la app:</b> ${esc(e.usa)}</p>${e.url ? `<a class="link" href="${esc(e.url)}" target="_blank" rel="noopener">Abrir fuente ↗</a>` : ''}</div>`;
  const html = `<p class="lead">Aquí solo hay fuentes que se han podido comprobar. “Verificado” significa que se leyó el resumen oficial y los datos salen de ahí; “solo localizado” significa que existe pero aún no se ha leído, y no se usa para decidir nada.</p>
  <h3 class="sec">Principios del programa</h3><div class="card">${PRINCIPIOS.map(p => `<p><b>${esc(p[0])}</b><br><small>${esc(p[2])} <i>(${esc((EVIDENCIA.find(e => e.id === p[1]) || {}).cita ? EVIDENCIA.find(e => e.id === p[1]).tema : '')})</i></small></p>`).join('')}</div>
  <h3 class="sec">Fuentes verificadas (${ver.length})</h3>${ver.map(card).join('')}<h3 class="sec">Pendientes de leer (${loc.length})</h3>${loc.map(card).join('')}
  <h3 class="sec">Lo que NO sabemos</h3><div class="card warnc">${NO_SABEMOS.map(t => `<p>${esc(t)}</p>`).join('')}</div>
  <p class="small">¿Quieres añadir más estudios? Pásame el enlace o el PDF y los reviso antes de meterlos aquí.</p>`;
  return { title: 'Evidencia', html };
};

/* ================= BIENVENIDA ================= */
V.bienvenida = () => ({ hideTabs: true, nobar: true, html: `<div class="welcome"><div class="big">🚶‍♀️</div><h1>Paso a Paso</h1><p class="lead">Ejercicios sencillos por niveles y paseos, a tu ritmo.</p>
  <label class="btn xl filebtn">Cargar los datos de Sandra<input type="file" accept=".json,application/json" data-c="restore" hidden></label><button class="btn ghost xl" data-a="skipWelcome">Empezar sin datos</button><p class="small">Los datos se guardan solo en este móvil.</p></div>` });
ACT.skipWelcome = async () => { await db.set('profile', { nombre: 'Sandra' }); App.stack = []; buildTabbar(); draw(); };
