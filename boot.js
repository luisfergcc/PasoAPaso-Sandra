/* Paso a Paso — arranque */
(async function boot() {
  try { await db.open(); } catch (e) { document.getElementById('main').innerHTML = '<div class="page"><div class="card">No se pudo abrir el almacenamiento del móvil (' + esc(e.message || e) + '). Si estás en modo privado, abre la app en modo normal.</div></div>'; return; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
  buildTabbar();
  if (!db.get('profile')) App.stack = [{ view: 'bienvenida' }];
  draw();
  let last = today();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && today() !== last) { last = today(); if (!App.stack.length && !WK.s) draw(true); } });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    try { const reg = await navigator.serviceWorker.register('sw.js'); reg.addEventListener('updatefound', () => { const w = reg.installing; if (!w) return; w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('Hay una versión nueva: cierra y vuelve a abrir la app', 6000); }); }); } catch (e) { console.warn('SW', e); }
  }
})();
