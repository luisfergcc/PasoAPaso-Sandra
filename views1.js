/* Paso a Paso — pantallas: Hoy, Entrenar, Ejercicio, Revisión del día y Sesión guiada. */
'use strict';
const W = { chk: null, ses: null };
const np = (v, p) => `data-a="nav" data-v="${v}" data-p="${esc(JSON.stringify(p || {}))}"`;
const FACES = ['😊', '🙂', '😕', '😣'];

/* ---------- animación: bloque reutilizable ---------- */
function animHtml(id) {
  const d = window.ANIMS && ANIMS[id];
  if (!d) return `<div class="noanim">🎬 Este ejercicio todavía no tiene animación. Lee los pasos de abajo o pídele a Luis que grabe un vídeo contigo.</div>`;
  return `<div class="animbox"><div class="vidtabs" id="vidtabs"></div>
  <svg id="asvg" viewBox="0 -22 300 212" class="asvg" role="img" aria-label="Animación del ejercicio"></svg><video id="avid" class="avid" controls playsinline hidden></video>
  <div class="acap" id="acap">${esc(d.kf[0].cap)}</div><div class="adots" id="adots">${d.kf.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
  <div class="actrl"><button data-a="aprev" aria-label="Paso anterior">⏮</button><button data-a="aplay" id="aplay" aria-label="Pausa o seguir">⏸</button><button data-a="anext" aria-label="Paso siguiente">⏭</button><button data-a="aspeed" id="aspeed">🐢 Lento</button></div>
  <input type="range" id="aseek" min="0" max="1000" value="0" aria-label="Mover la animación"></div>`;
}
function mountAnim(id, opts) {
  const d = window.ANIMS && ANIMS[id]; if (!d || !$('#asvg')) return () => { };
  let slow = false, vurl = null;
  const pl = new Anim.Player($('#asvg'), d, {
    speed: 1,
    onstep: i => { const c = $('#acap'); if (c) c.textContent = d.kf[i].cap; $$('#adots i').forEach((x, j) => x.classList.toggle('on', j === i)); },
    onprog: u => { const s = $('#aseek'); if (s && document.activeElement !== s) s.value = Math.round(u * 1000); }
  });
  App.player = pl; pl.play();
  db.getFile('v-' + id).then(f => {
    if (!f || !$('#vidtabs')) return; vurl = URL.createObjectURL(f.blob);
    $('#vidtabs').innerHTML = `<button class="on" data-a="vtab" data-v="anim">🎞 Animación</button><button data-a="vtab" data-v="vid">🎥 Vídeo real</button>`;
    $('#avid').src = vurl;
  });
  ACT.aplay = () => { if (pl.playing) { pl.pause(); $('#aplay').textContent = '▶️'; } else { pl.play(); $('#aplay').textContent = '⏸'; } };
  ACT.aprev = () => { $('#aplay').textContent = '▶️'; pl.goStep(pl.step - 1); };
  ACT.anext = () => { $('#aplay').textContent = '▶️'; pl.goStep(pl.step + 1); };
  ACT.aspeed = () => { slow = !slow; pl.speed = slow ? 0.45 : 1; $('#aspeed').textContent = slow ? '🐇 Normal' : '🐢 Lento'; };
  ACT.vtab = el => { const v = el.dataset.v === 'vid'; $('#asvg').hidden = v; $('#acap').hidden = v; $('#adots').hidden = v; $('.actrl').hidden = v; $('#aseek').hidden = v; $('#avid').hidden = !v; if (v) pl.pause(); else $('#avid').pause(); $$('#vidtabs button').forEach(b => b.classList.toggle('on', b.dataset.v === el.dataset.v)); };
  const sk = $('#aseek'); if (sk) sk.addEventListener('input', () => { pl.pause(); $('#aplay').textContent = '▶️'; pl.seek(sk.value / 1000); });
  return () => { pl.destroy(); App.player = null; if (vurl) URL.revokeObjectURL(vurl); stopSpeak(); };
}

/* ---------- HOY ---------- */
V.hoy = () => {
  const p = profile(), s = cfg(), chk = todayCheck(), ses = todaySession(), ws = weekStats();
  const msg = MENSAJES[new Date().getDate() % MENSAJES.length];
  const pend = sessions().filter(x => !x.resp24 && x.date < today() && daysBetween(x.date, today()) <= 2).pop();
  let cta;
  if (ses) cta = `<div class="card done"><div class="big">✅</div><h2>¡Hoy ya has entrenado!</h2><p>${ses.ids.length} ejercicios · ${ses.durMin || '?'} min. Descansa y, si te apetece, sal a caminar un rato.</p></div>`;
  else if (!chk) cta = `<div class="card cta"><h2>Entrenamiento de hoy</h2><p>Unos ${s.minutos} minutos${toca_fuerza(null, false) ? ' (hoy toca fuerza: más ejercicios y con pesas, unos ' + s.minFuerza + ' min)' : ''}. Primero, un repaso rápido de cómo estás.</p><button class="btn xl" ${np('checkin')}>Empezar</button></div>`;
  else if (chk.semaforo === 'rojo') cta = `<div class="card red"><h2>Hoy no entrenes</h2><p>Lo que has marcado merece que lo vea un médico. Pulsa para ver qué hacer.</p><button class="btn xl" ${np('checkres')}>Ver qué hacer</button></div>`;
  else if (chk.semaforo === 'noche') cta = `<div class="card amber"><h2>Mejor mañana</h2><p>Con las pastillas de la noche, mejor no hacer ejercicio de pie. Mañana lo haces antes de tomarlas.</p></div>`;
  else cta = `<div class="card cta ${chk.semaforo}"><h2>${chk.semaforo === 'amarillo' ? 'Hoy, versión suave' : 'Todo listo para entrenar'}</h2><p>${chk.semaforo === 'amarillo' ? 'Menos repeticiones y sin ejercicios de equilibrio ni escalones.' : (toca_fuerza(chk, false) ? '💪 Hoy toca fuerza: unos ' + s.minFuerza + ' minutos, con descansos entre series.' : 'Unos ' + s.minutos + ' minutos, a tu ritmo.')}</p><button class="btn xl" data-a="startSes" data-v="${chk.semaforo === 'amarillo' ? 1 : 0}">Empezar ejercicios</button></div>`;
  const wk = walks().filter(w => w.date === today());
  const walkDone = wk.reduce((a, w) => a + w.durSec, 0) / 60;
  const pct = Math.min(100, Math.round(walkDone / s.walkTarget * 100));
  const dayL = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return { html: `
  <div class="hello"><div class="small">${esc(fdateLong(today()))}</div><h1>¡Hola, ${esc(p.nombre)}! 👋</h1><p class="msg">${esc(msg)}</p></div>
  ${pend ? `<div class="card ask"><b>¿Cómo te encontraste después de entrenar ${pend.date === addDays(today(), -1) ? 'ayer' : 'el ' + fdate(pend.date)}?</b><div class="row3"><button class="btn ghost" data-a="r24" data-v="mejor" data-d="${pend.date}">😊 Mejor</button><button class="btn ghost" data-a="r24" data-v="igual" data-d="${pend.date}">🙂 Igual</button><button class="btn ghost" data-a="r24" data-v="peor" data-d="${pend.date}">😕 Peor</button></div></div>` : ''}
  ${cta}
  <div class="card"><div class="rowb"><div><h3>🚶 Paseo de hoy</h3><p class="small">Objetivo: ${s.walkTarget} min${walkDone ? ' · llevas ' + Math.round(walkDone) + ' min' : ''}</p></div><div class="ring" style="--p:${pct}"><span>${pct}%</span></div></div><button class="btn" data-a="tab" data-v="caminar">${walkDone ? 'Ver paseos' : 'Salir a caminar'}</button></div>
  <div class="card"><h3>Esta semana</h3><div class="week">${ws.days.map((d, i) => `<div class="wd ${d.d === today() ? 'now' : ''}"><div class="dot ${d.walk || d.ses ? 'on' : ''}">${d.walk && d.ses ? '⭐' : d.walk || d.ses ? '✓' : ''}</div><small>${dayL[i]}</small></div>`).join('')}</div>
  <p class="small">${ws.sesN} entrenamientos · ${ws.n} paseos · ${ws.min} min caminando${ws.km ? ' · ' + ws.km.toFixed(1).replace('.', ',') + ' km' : ''}</p></div>
  <div class="foot"><button class="link" data-a="shareWeek">📤 Enviar resumen a Luis</button><button class="link" data-a="cuidador">🔒 Modo cuidador</button></div>` };
};
ACT.r24 = el => { const a = sessions().slice(); const s = a.find(x => x.date === el.dataset.d && !x.resp24); if (s) { s.resp24 = el.dataset.v; db.set('sesiones', a); } draw(true); toast(el.dataset.v === 'peor' ? 'Gracias. Hoy iremos con calma.' : '¡Gracias!'); };
ACT.shareWeek = () => {
  const ws = weekStats(), p = profile(); const t = `Resumen de ${p.nombre} (semana del ${fdate(weekStart())}): ${ws.sesN} entrenamientos, ${ws.n} paseos, ${ws.min} min caminando${ws.km ? ', ' + ws.km.toFixed(1) + ' km' : ''}.`;
  if (navigator.share) navigator.share({ text: t }).catch(() => { }); else { try { navigator.clipboard.writeText(t); toast('Resumen copiado'); } catch (e) { toast(t, 6000); } }
};
ACT.cuidador = async () => { if (await needPin()) nav('cuidador'); };
ACT.startSes = el => startSession(el.dataset.v === '1');

/* ---------- ENTRENAR (mapa de niveles) ---------- */
const STATE_UI = { dominado: ['✅', 'Superado', 'ok'], disponible: ['▶️', 'Disponible', 'go'], bloqueado: ['🔒', 'Bloqueado', 'lock'], visto: ['🩺', 'Pendiente de visto bueno', 'wait'], material: ['🧰', 'Falta material', 'wait'] };
V.entrenar = () => {
  const p = profile(); let html = `<h1>Mis ejercicios</h1><p class="lead">Vas superando ejercicios y se van abriendo otros más difíciles. Sin prisa.</p><div class="card"><h3>🔥 Calentamiento para caminar</h3><p class="small">5 minutos antes de salir: caderas, tobillos y piernas.</p><button class="btn ghost" ${np('calent')}>Verlo</button></div>`;
  if (p.metaEj && EX[p.metaEj]) {
    const chain = []; let e = EX[p.metaEj]; while (e) { chain.unshift(e); e = e.previo ? EX[e.previo] : null; }
    html += `<div class="card goal"><h3>🎯 Tu meta ahora</h3><p><b>${esc(p.metaTxt || EX[p.metaEj].nombre)}</b></p><div class="chain">${chain.map((c, i) => { const st = exState(c); return `<button class="node ${STATE_UI[st][2]}" ${np('ejercicio', { id: c.id })}><span>${STATE_UI[st][0]}</span><small>${esc(c.nombre)}</small></button>${i < chain.length - 1 ? '<i>→</i>' : ''}`; }).join('')}</div></div>`;
  }
  const nivs = Object.keys(NIVELES).map(Number);
  for (const n of nivs) {
    const L = NIVELES[n], list = EJERCICIOS.filter(e => e.nivel === n), done = list.filter(e => mastered()[e.id]).length, ok = levelApproved(n);
    if (!ok && n > 5 && !(n === 6 || levelApproved(n - 1))) { // niveles altos cerrados: una sola línea, para no abrumar
      html += `<div class="level locked"><div class="lh"><span class="le">${L.emoji}</span><div><b>Nivel ${n} · ${L.nombre}</b><small>${L.desc}</small></div><span class="lc">🔒</span></div></div>`; continue;
    }
    html += `<div class="level ${ok ? '' : 'locked'}"><div class="lh"><span class="le">${L.emoji}</span><div><b>Nivel ${n} · ${L.nombre}</b><small>${L.desc}</small></div><span class="lc">${done}/${list.length}</span></div><div class="bar"><i style="width:${done / list.length * 100}%"></i></div>
    ${ok ? '' : '<p class="small lockmsg">🩺 Este nivel se abre cuando Luis lo decide, con el visto bueno profesional.</p>' + (L.aviso ? '<p class="small">' + esc(L.aviso) + '</p>' : '')}
    <div class="exlist">${list.map(e => { const st = exState(e), u = STATE_UI[st], b = BLOQUES[e.bloque]; return `<button class="exrow ${u[2]}" ${np('ejercicio', { id: e.id })}><span class="ei">${b[1]}</span><span class="en"><b>${esc(e.nombre)}</b><small>${esc(b[0])} · ${e.min} min</small></span><span class="es">${u[0]}</span></button>`; }).join('')}</div></div>`;
  }
  return { html };
};

/* ---------- EJERCICIO (detalle) ---------- */
V.ejercicio = ({ id }) => {
  const e = EX[id], st = exState(e), u = STATE_UI[st], b = BLOQUES[e.bloque], mp = masteryProgress(e);
  const det = (t, x) => x ? `<details class="acc"><summary>${t}</summary><p>${esc(x)}</p></details>` : '';
  const kgBox = e.kg && (st === 'disponible' || st === 'dominado') ? `<div class="card"><h3>🏋️ Carga</h3><div class="kgrow"><button data-a="kgChg" data-id="${id}" data-d="-1" aria-label="Menos peso">−</button><b>${kgTxt(kgNow(e))}</b><button data-a="kgChg" data-id="${id}" data-d="1" aria-label="Más peso">+</button></div><p class="small">Escalera: ${e.kg.map((k, i) => i === kgIdx(e) ? '<b>' + kgTxt(k) + '</b>' : i > capIdx(e) ? '<s>' + kgTxt(k) + '</s>' : kgTxt(k)).join(' → ')}.${e.kg.length > 1 ? ' La app sube sola un peldaño tras dos sesiones seguidas “bien” con todas las repeticiones, y baja uno si te duele. Se considera superado al llegar a ' + kgTxt(e.kg[domIdx(e)]) + ' y cumplir las 6 veces “bien”.' : ''}</p></div>` : '';
  const html = `<h2 class="exh">${b[1]} ${esc(e.nombre)}</h2>
  ${animHtml(id)}
  <div class="chips"><span class="chip">${u[0]} ${u[1]}</span><span class="chip">⏱ ${e.min} min</span><span class="chip">${e.bloque === 'calent' ? 'Calentamiento' : 'Nivel ' + e.nivel}</span></div>
  <div class="card"><h3>¿Para qué sirve?</h3><p>${esc(e.que)}</p></div>
  ${animSteps(id)}
  <div class="card"><h3>Cuánto</h3><p>${esc(e.dosis)}${e.descanso ? ' Descanso entre series: ' + e.descanso + ' s.' : ''}</p>${e.respiracion ? `<p class="small">🫁 ${esc(e.respiracion)}</p>` : ''}</div>
  <div class="card stop"><h3>⛔ Para si…</h3><p>${esc(e.parar)}</p></div>
  ${kgBox}
  ${det('Cómo colocarte', e.posicion)}${det('Qué deberías notar', e.esperadas)}${det('Errores frecuentes', e.errores)}${det('Si te cuesta: versión más fácil', e.facil)}${det('Cuando lo domines', e.progresion)}
  ${e.bloque === 'calent' ? '' : st !== 'bloqueado' && st !== 'visto' && st !== 'material' ? `<div class="card"><h3>Tu progreso</h3><div class="bar"><i style="width:${Math.min(100, mp.bien / mp.need * 100)}%"></i></div><p class="small">${st === 'dominado' ? '¡Ejercicio superado! ' + (mastered()[e.id] ? 'Desde el ' + fdate(mastered()[e.id]) + '.' : '') : mp.bien + ' de ' + mp.need + ' veces “bien” en las últimas 3 semanas.'}</p></div>` : `<div class="card lockc"><p>🔒 ${esc(lockReason(e))}</p></div>`}
  <div class="stickybtns"><button class="btn ghost" data-a="speakEx" data-id="${id}">🔊 Escuchar</button>${st === 'disponible' || st === 'dominado' ? `<button class="btn" data-a="soloEx" data-id="${id}">Hacerlo ahora</button>` : ''}</div>
  <div class="foot"><button class="link" data-a="exAdmin" data-id="${id}">🔒 Cuidador: vídeo y estado</button></div>`;
  return { title: 'Ejercicio', html, mount: () => mountAnim(id) };
};
function animSteps(id) { const d = window.ANIMS && ANIMS[id]; if (!d) return `<div class="card"><h3>Cómo se hace</h3><p>${esc(EX[id].ejecucion)}</p></div>`; return `<div class="card"><h3>Cómo se hace</h3><ol class="steps">${d.kf.filter((k, i) => !(d.cycle && i === d.kf.length - 1 && d.kf.length > 3 && i > 0 && false)).map(k => `<li>${esc(k.cap)}</li>`).join('')}</ol></div>`; }
ACT.kgChg = el => { const e = EX[el.dataset.id]; setKg(e, kgIdx(e) + (+el.dataset.d)); draw(true); };
ACT.speakEx = el => { const e = EX[el.dataset.id]; speak(`${e.nombre}. ${e.que} ${e.ejecucion} Para si: ${e.parar}`); };
ACT.soloEx = el => { const e = EX[el.dataset.id]; if (!todayCheck()) { toast('Primero, un repaso rápido de cómo estás'); return nav('checkin', { solo: e.id }); } startSession(false, [e], e.bloque === 'calent' ? 'calent' : '', e.bloque === 'calent' ? { stage: 'solo' } : {}); };
ACT.exAdmin = async el => {
  if (!await needPin()) return; const id = el.dataset.id, f = await db.getFile('v-' + id), st = exState(EX[id]);
  const m = modal(`<h3>${esc(EX[id].nombre)}</h3><p class="small">Estado: ${STATE_UI[st][1]}</p>
  <label class="btn ghost filebtn">🎥 ${f ? 'Cambiar' : 'Añadir'} vídeo real<input type="file" accept="video/*" data-c="vid" data-id="${id}" hidden></label>
  ${f ? `<button class="btn ghost" data-a="vidDel" data-id="${id}">🗑 Quitar vídeo</button>` : ''}
  ${st === 'dominado' ? `<button class="btn ghost" data-a="exReopen" data-id="${id}">↩︎ Reabrir (volver a practicarlo)</button>` : st === 'disponible' ? `<button class="btn ghost" data-a="exMaster" data-id="${id}">✅ Marcar como superado</button>` : ''}
  <button class="btn" data-a="close">Cerrar</button>`);
};
CHG.vid = async el => { const f = el.files[0]; if (!f) return; toast('Guardando vídeo…'); try { await db.putFile('v-' + el.dataset.id, f, { name: f.name, type: f.type }); try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { } closeModal(); toast('Vídeo guardado en este móvil'); draw(true); } catch (e) { toast('No se pudo guardar el vídeo (poco espacio).'); } };
ACT.vidDel = async el => { await db.delFile('v-' + el.dataset.id); closeModal(); toast('Vídeo quitado'); draw(true); };
ACT.exMaster = el => { const m = Object.assign({}, mastered()); m[el.dataset.id] = today(); db.set('dominados', m); closeModal(); draw(true); };
ACT.exReopen = el => { const m = Object.assign({}, mastered()); delete m[el.dataset.id]; db.set('dominados', m); closeModal(); draw(true); };

/* ---------- REVISIÓN DEL DÍA ---------- */
V.checkin = (params) => {
  if (!W.chk || W.chk.done) { const p = profile(); W.chk = { step: 0, lumbar: p.baseLumbar, pierna: p.basePierna, rodilla: 0, mareo: 0, sueno: 0, pastillas: false, alarmas: [], solo: params && params.solo, calent: params && params.calent }; }
  const c = W.chk;
  const stepper = (k, lab, ico) => `<div class="stp"><div class="sl">${ico} ${lab}</div><div class="sc"><button data-a="stp" data-k="${k}" data-d="-1" aria-label="Menos">−</button><div class="sv v${c[k]}">${c[k]}</div><button data-a="stp" data-k="${k}" data-d="1" aria-label="Más">+</button></div></div>`;
  const opt = (k, lab, vals) => `<div class="optq"><b>${lab}</b><div class="opts">${vals.map((v, i) => `<button class="${c[k] === i ? 'on' : ''}" data-a="opt" data-k="${k}" data-i="${i}">${v}</button>`).join('')}</div></div>`;
  let html;
  if (c.step === 0) html = `<h2>¿Cómo estás hoy?</h2><p class="lead">0 es “nada de dolor” y 10 “el peor dolor”.</p>${stepper('lumbar', 'Espalda', '🔙')}${stepper('pierna', 'Pierna (ciática)', '🦵')}${stepper('rodilla', 'Rodilla', '🦿')}<button class="btn xl" data-a="chkNext">Siguiente</button>`;
  else if (c.step === 1) html = `<h2>¿Cómo te sientes?</h2>${opt('mareo', 'Mareo', ['No', 'Un poco', 'Mucho'])}${opt('sueno', 'Sueño o cansancio', ['Normal', 'Algo', 'Mucho'])}
    <div class="optq"><b>¿Ya te has tomado las pastillas de la noche?</b><div class="opts"><button class="${!c.pastillas ? 'on' : ''}" data-a="past" data-v="0">No</button><button class="${c.pastillas ? 'on' : ''}" data-a="past" data-v="1">Sí</button></div></div>
    <button class="btn xl" data-a="chkNext">Siguiente</button>`;
  else html = `<h2>¿Notas alguna de estas cosas?</h2><p class="lead">Si no te pasa nada de esto, pulsa el botón verde.</p>
    <div class="alarms">${ALARMAS.map(a => `<label class="al ${c.alarmas.indexOf(a.id) >= 0 ? 'on' : ''}"><input type="checkbox" data-c="alarm" data-id="${a.id}" ${c.alarmas.indexOf(a.id) >= 0 ? 'checked' : ''}><span>${esc(a.texto)}</span></label>`).join('')}</div>
    <button class="btn xl ${c.alarmas.length ? 'warn' : ''}" data-a="chkFinish">${c.alarmas.length ? 'Continuar' : 'No me pasa nada de esto'}</button>`;
  return { title: 'Revisión de hoy (' + (c.step + 1) + '/3)', html };
};
ACT.stp = el => { const c = W.chk, k = el.dataset.k; c[k] = Math.max(0, Math.min(10, c[k] + +el.dataset.d)); draw(true); };
ACT.opt = el => { W.chk[el.dataset.k] = +el.dataset.i; draw(true); };
ACT.past = el => { W.chk.pastillas = el.dataset.v === '1'; draw(true); };
CHG.alarm = el => { const c = W.chk, i = c.alarmas.indexOf(el.dataset.id); if (el.checked && i < 0) c.alarmas.push(el.dataset.id); if (!el.checked && i >= 0) c.alarmas.splice(i, 1); draw(true); };
ACT.chkNext = () => { W.chk.step++; draw(); };
ACT.chkFinish = async () => {
  const c = W.chk; c.date = today(); c.semaforo = semaforo(c); c.done = true; const solo = c.solo, cal = c.calent;
  await db.push('checks', { date: c.date, lumbar: c.lumbar, pierna: c.pierna, rodilla: c.rodilla, mareo: c.mareo, sueno: c.sueno, pastillas: c.pastillas, alarmas: c.alarmas.slice(), semaforo: c.semaforo });
  App.stack.pop(); if (c.semaforo === 'verde' || c.semaforo === 'amarillo') { if (cal) { App.stack = []; App.tab = 'caminar'; ACT.calGo({ dataset: { s: String(cal) } }); return; } if (solo) { App.stack = []; startSession(c.semaforo === 'amarillo', [EX[solo]]); return; } }
  nav('checkres');
};
V.checkres = () => {
  const c = todayCheck() || { semaforo: 'verde', alarmas: [] }; const urg = c.alarmas.some(id => (ALARMAS.find(a => a.id === id) || {}).nivel === 'urgente');
  let html;
  if (c.semaforo === 'rojo') html = `<div class="card red"><div class="big">🛑</div><h2>Hoy no hagas ejercicio</h2>
    <p>Lo que has marcado no tiene por qué ser grave, pero es mejor que lo valore un médico.</p>
    ${urg ? `<p><b>Si se trata de la zona íntima dormida, de no controlar el pis o la caca, o de no poder caminar, ve hoy mismo a Urgencias o llama al 112.</b></p><a class="btn xl danger" href="tel:112">📞 Llamar al 112</a>` : `<p>Habla hoy con tu centro de salud o tu médico. Si empeora o te da miedo, ve a Urgencias.</p>`}
    <button class="btn" data-a="shareAlarm">📤 Avisar a Luis</button></div>`;
  else if (c.semaforo === 'noche') html = `<div class="card amber"><div class="big">🌙</div><h2>Mejor mañana</h2><p>Después de las pastillas de la noche, el ejercicio de pie puede ser peligroso (mareo, caídas). Mañana lo haces antes de tomarlas.</p></div>`;
  else if (c.semaforo === 'amarillo') html = `<div class="card amber"><div class="big">🟡</div><h2>Hoy, versión suave</h2><p>Hay más molestia o cansancio de lo normal. Haremos menos repeticiones y sin equilibrio ni escalones. Un día así no es un fracaso.</p><button class="btn xl" data-a="startSes" data-v="1">Empezar versión suave</button></div>`;
  else html = `<div class="card ok"><div class="big">🟢</div><h2>¡Todo bien!</h2><p>Puedes hacer tu entrenamiento de hoy.</p><button class="btn xl" data-a="startSes" data-v="0">Empezar ejercicios</button></div>`;
  return { title: 'Resultado', html };
};
ACT.shareAlarm = () => { const t = 'Hoy tengo algo de lo que me preocupa (señales de alarma en la app). No he hecho ejercicio. Llámame.'; if (navigator.share) navigator.share({ text: t }).catch(() => { }); else { try { navigator.clipboard.writeText(t); toast('Mensaje copiado'); } catch (e) { } } };

/* ---------- SESIÓN GUIADA ---------- */
function startSession(light, only, kind, meta) {
  const c = todayCheck(); const list = only || buildSession(c, light);
  if (!list.length) return toast('No hay ejercicios disponibles hoy');
  W.ses = { list, i: 0, light: !!light, start: Date.now(), results: [], phase: 'ex', r: 0, n: 0, t0: 0, rest: 0, kind: kind || '', meta: meta || {} };
  App.stack = [{ view: 'sesion' }]; draw();
}
function sesRounds(e, light) {
  let reps = repsFor(e); if (light) reps = e.timed ? Math.max(5, Math.round(reps * 0.6)) : Math.max(2, Math.ceil(reps / 2));
  const out = [], lados = e.lado ? ['derecho', 'izquierdo'] : [null];
  for (let s = 0; s < e.series; s++) lados.forEach(l => out.push({ target: reps, label: [e.lado ? 'Lado ' + l : '', e.series > 1 ? 'Serie ' + (s + 1) + ' de ' + e.series : ''].filter(Boolean).join(' · ') }));
  return out;
}
V.sesion = () => {
  const S = W.ses; if (!S) return { html: '<p>No hay sesión.</p>', hideTabs: true };
  if (S.phase === 'end') return sesEnd();
  const e = S.list[S.i], total = S.list.length;
  const head = `<div class="sesh"><button class="link" data-a="sesStop">✕ Parar</button><div class="sprog">${S.list.map((_, i) => `<i class="${i < S.i ? 'done' : i === S.i ? 'on' : ''}"></i>`).join('')}</div><span class="small">${S.i + 1}/${total}</span></div>`;
  if (S.phase === 'rest') return { hideTabs: true, nobar: true, html: `${head}<div class="rest"><div class="big">😮‍💨</div><h2>Descansa y respira</h2><div class="timer" id="rest">${S.rest}</div><p>${S.setRest ? 'Siguiente: serie ' + (S.r + 1) + ' de <b>' + esc(S.list[S.i].nombre) + '</b>' + (S.list[S.i].kg ? ' · ' + kgTxt(kgNow(S.list[S.i])) : '') : 'Siguiente: <b>' + esc(S.list[S.i].nombre) + '</b>'}</p><button class="btn xl" data-a="restSkip">Ya estoy lista</button></div>`, mount: () => { const t = setInterval(() => { S.rest--; const r = $('#rest'); if (r) r.textContent = Math.max(0, S.rest); if (S.rest <= 0) { clearInterval(t); beep(2); S.phase = 'ex'; if (!S.setRest) S.r = 0; S.setRest = false; S.n = 0; draw(); } }, 1000); return () => clearInterval(t); } };
  const rounds = sesRounds(e, S.light), R = rounds[S.r];
  if (S.phase === 'fb') return { hideTabs: true, nobar: true, html: `${head}<div class="fb"><h2>${esc(e.nombre)}</h2><h3>¿Cómo te ha ido?</h3>
    <button class="btn fbtn" data-a="sesFb" data-v="bien">😊 Bien</button><button class="btn fbtn" data-a="sesFb" data-v="costo">😐 Me ha costado</button><button class="btn fbtn warn" data-a="sesFb" data-v="dolor">😣 Me ha dolido</button></div>` };
  const timed = e.timed;
  const ctr = timed ? `<div class="ctr"><div class="rl">${esc(R.label)}</div><button class="bigtap" id="tbtn" data-a="timerGo">▶ Empezar<small>${R.target} segundos</small></button></div>`
    : `<div class="ctr"><div class="rl">${esc(R.label) || '&nbsp;'}</div><button class="bigtap" id="cbtn" data-a="repTap"><b id="cn">${S.n}</b><small>de ${R.target} · toca en cada repetición</small></button><button class="link" data-a="repUndo">Quitar una</button></div>`;
  return { hideTabs: true, nobar: true, cls: 'ses', html: `${head}<h2 class="exh">${BLOQUES[e.bloque][1]} ${esc(e.nombre)}</h2>${animHtml(e.id)}<div class="dose">${S.light ? '🟡 Versión suave · ' : ''}${doseTxt(e, S.light)}</div>${e.kg ? kgSes(e) : ''}${ctr}
    <div class="stopline">⛔ Para si: ${esc(e.parar)}</div><div class="row2"><button class="btn ghost" data-a="speakEx" data-id="${e.id}">🔊</button><button class="btn ghost" data-a="sesSkip">Saltar</button></div>`, mount: () => mountAnim(e.id) };
};
function doseTxt(e, light) {
  if (!e.kg) return esc(e.dosis);
  const reps = sesRounds(e, light)[0].target, n = e.series * (e.lado ? 2 : 1);
  return `<b>${kgTxt(kgNow(e))}</b> · ${e.series} serie${e.series > 1 ? 's' : ''} de ${reps}${e.timed ? ' segundos' : ' repeticiones'}${e.lado ? ' por lado' : ''}${e.descanso ? ' · descanso ' + e.descanso + ' s' : ''}`;
}
function kgSes(e) { return `<div class="kgrow sm"><button data-a="kgSes" data-d="-1" aria-label="Menos peso">−</button><span>🏋️ ${kgTxt(kgNow(e))}</span><button data-a="kgSes" data-d="1" aria-label="Más peso">+</button></div>`; }
ACT.kgSes = el => { const S = W.ses, e = S.list[S.i]; setKg(e, kgIdx(e) + (+el.dataset.d)); draw(); };
function sesNextRound() {
  const S = W.ses, e = S.list[S.i], rounds = sesRounds(e, S.light);
  beep(1); S.r++; S.n = 0;
  if (S.r >= rounds.length) S.phase = 'fb';
  else if (e.descanso && !S.light) { S.phase = 'rest'; S.setRest = true; S.rest = e.descanso; }
  draw();
}
ACT.repTap = () => { const S = W.ses, e = S.list[S.i], R = sesRounds(e, S.light)[S.r]; S.n++; try { navigator.vibrate && navigator.vibrate(25); } catch (x) { } if (S.n >= R.target) sesNextRound(); else { const n = $('#cn'); if (n) n.textContent = S.n; } };
ACT.repUndo = () => { const S = W.ses; if (S.n > 0) { S.n--; $('#cn').textContent = S.n; } };
ACT.timerGo = () => {
  const S = W.ses, e = S.list[S.i], R = sesRounds(e, S.light)[S.r]; let left = R.target; const b = $('#tbtn'); b.disabled = true;
  b.innerHTML = `<b>${left}</b><small>segundos · agárrate bien</small>`; if (S.timer) clearInterval(S.timer);
  S.timer = setInterval(() => { left--; const bb = $('#tbtn'); if (!bb) { clearInterval(S.timer); return; } if (left <= 0) { clearInterval(S.timer); sesNextRound(); } else bb.querySelector('b').textContent = left; }, 1000);
};
ACT.sesFb = el => {
  const S = W.ses, e = S.list[S.i]; S.results.push({ id: e.id, estado: el.dataset.v, reps: repsFor(e), kg: e.kg ? kgNow(e) : undefined });
  if (el.dataset.v === 'dolor') { const n = S.results.filter(r => r.estado === 'dolor').length; if (n >= 2) { toast('Dos ejercicios con dolor: lo dejamos por hoy.', 4000); return sesFinish(); } toast('Anotado. Si el dolor es fuerte o raro, para y avisa a Luis.', 4000); }
  if (S.i + 1 >= S.list.length) return sesFinish();
  S.i++; S.r = 0; S.n = 0; S.phase = 'rest'; S.setRest = false; S.rest = S.kind === 'calent' ? 5 : S.list[S.i].kg ? 40 : 20; draw();
};
ACT.sesSkip = () => { const S = W.ses; S.setRest = false; if (S.i + 1 >= S.list.length) return sesFinish(); S.i++; S.r = 0; S.n = 0; S.phase = 'ex'; draw(); };
ACT.restSkip = () => { const S = W.ses; S.rest = 0; S.phase = 'ex'; if (!S.setRest) S.r = 0; S.setRest = false; S.n = 0; draw(); };
ACT.sesStop = async () => { if (await ask('¿Parar el entrenamiento?', 'Se guardará lo que has hecho hasta ahora.', 'Sí, parar', 'Seguir')) sesFinish(); };
async function sesFinish() {
  const S = W.ses; if (S.timer) clearInterval(S.timer);
  const dur = Math.max(1, Math.round((Date.now() - S.start) / 60000)), subidos = [];
  if (S.kind === 'calent') {
    for (const r of S.results) await db.push('exlog', { id: r.id, date: today(), estado: r.estado, reps: r.reps });
    if (S.results.length) await db.push('calent', { date: today(), stage: S.meta.stage, ids: S.results.map(r => r.id), durMin: dur, dolor: S.results.some(r => r.estado === 'dolor') });
    S.phase = 'end'; S.dur = dur; S.subidos = []; draw(); return;
  }
  S.cargas = [];
  for (const r of S.results) {
    await db.push('exlog', { id: r.id, date: today(), estado: r.estado, reps: r.reps, kg: r.kg });
    const e = EX[r.id]; if (e.kg && (!S.light || r.estado === 'dolor')) { const aj = ajustaCarga(e, r.estado, r.reps); if (aj) S.cargas.push({ id: r.id, aj, kg: kgNow(e) }); }
    if (r.estado !== 'dolor' && checkMastery(e)) subidos.push(r.id);
  }
  if (S.results.length) await db.push('sesiones', { date: today(), fuerza: S.results.some(r => esFuerza(EX[r.id])), ids: S.results.map(r => r.id), durMin: dur, resp24: null, light: S.light, semaforo: (todayCheck() || {}).semaforo || '', dolor: S.results.some(r => r.estado === 'dolor') });
  S.phase = 'end'; S.dur = dur; S.subidos = subidos; draw();
}
function sesEnd() {
  const S = W.ses, n = S.results.length, nuevos = [];
  if (S.kind === 'calent') {
    const pre = typeof S.meta.stage === 'number', dolor = S.results.some(r => r.estado === 'dolor');
    return { hideTabs: true, nobar: true, html: `<div class="end"><div class="big">${pre ? '🔥' : '🧊'}</div><h1>${pre ? '¡Lista para salir!' : '¡Bien hecho!'}</h1><p>${n} ejercicio${n === 1 ? '' : 's'} · ${S.dur} min</p>
    ${dolor ? '<div class="card amber"><p>Algún ejercicio te ha dolido. Hoy mejor un paseo muy corto, o descansa. Si el dolor es fuerte o raro, avisa a Luis.</p></div>' : ''}
    <p class="lead">${pre ? 'Empieza el paseo despacio: los primeros 3 minutos, a ritmo lento. Después, a tu ritmo.' : 'Bebe un poco de agua y descansa.'}</p>
    ${pre ? `<button class="btn xl" data-a="calWalk">▶ Salir a caminar</button><button class="btn ghost" data-a="sesDone">Ahora no</button>` : `<button class="btn xl" data-a="sesDone">Terminar</button>`}</div>` };
  }
  S.subidos.forEach(id => EJERCICIOS.filter(x => x.previo === id).forEach(x => { if (exState(x) === 'disponible') nuevos.push(x); }));
  return { hideTabs: true, nobar: true, html: `<div class="end"><div class="big">${n ? '🎉' : '👍'}</div><h1>${n ? '¡Entrenamiento hecho!' : 'Hasta aquí por hoy'}</h1><p>${n} ejercicio${n === 1 ? '' : 's'} · ${S.dur} min</p>
  ${S.subidos.map(id => `<div class="card ok"><h3>⭐ ¡Has superado un ejercicio!</h3><p><b>${esc(EX[id].nombre)}</b></p></div>`).join('')}
  ${(S.cargas || []).map(c => `<div class="card ${c.aj === 'sube' ? 'ok' : 'amber'}"><h3>${c.aj === 'sube' ? '⬆️ Siguiente vez, un poco más de peso' : '⬇️ Siguiente vez, un poco menos de peso'}</h3><p><b>${esc(EX[c.id].nombre)}</b>: ${kgTxt(c.kg)}</p></div>`).join('')}
  ${nuevos.map(x => `<div class="card cta"><h3>🆕 Se ha abierto uno nuevo</h3><p><b>${esc(x.nombre)}</b></p><button class="btn" ${np('ejercicio', { id: x.id })}>Verlo</button></div>`).join('')}
  ${S.subidos.some(id => EJERCICIOS.some(x => x.previo === id && exState(x) === 'visto')) ? '<div class="card"><p>🩺 Hay ejercicios nuevos que esperan el visto bueno de la fisioterapeuta (se lo dirás a Luis).</p></div>' : ''}
  <p class="lead">Mañana te preguntaré cómo te encuentras. Descansa, bebe agua y estírate si te apetece.</p><button class="btn xl" data-a="sesDone">Terminar</button></div>` };
}
ACT.sesDone = () => { const k = W.ses && W.ses.kind; W.ses = null; App.stack = []; App.tab = k === 'calent' ? 'caminar' : 'hoy'; draw(); };
ACT.calWalk = () => { W.ses = null; App.stack = []; App.tab = 'caminar'; ACT.wkGo({ skipCal: true }); };
