/* Paso a Paso — animaciones de cada ejercicio (posturas clave). */
(function (G) {
  'use strict';
  const { P, S } = G.Anim;
  const K = (t, hold, cap, pose, hi) => ({ t, hold, cap, pose, hi: hi || [] });
  const A = {};

  /* ===== helpers de escena ===== */
  const chair = o => [S.chair(110, o)];
  const bed = () => [S.bed()];
  const atCounter = () => [S.counter(166)];
  const atBar = () => [S.bar(60, 240, 82)];

  /* ===== sentada ===== */
  const sitB = o => P.sit(o);
  const sitSet = (name, caps, mk) => { A[name] = { view: 'side', cycle: true, scene: chair(), kf: mk(caps) }; };

  A.r1 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 1200, 'Siéntate recta, con la espalda apoyada. Pon una mano sobre la tripa.', sitB({ nhx: 122, nhy: 99 })),
    K(2600, 400, 'Coge aire por la nariz, despacio: la tripa se hincha.', sitB({ nhx: 126, nhy: 99, br: 12 }), ['core']),
    K(2800, 400, 'Suelta el aire por la boca, todavía más despacio.', sitB({ nhx: 122, nhy: 99, br: 0 }), ['core']),
    K(1200, 300, 'Repite con calma.', sitB({ nhx: 122, nhy: 99 }))] };

  A.t1 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 600, 'Sentada, con los talones en el suelo.', sitB({})),
    K(800, 300, 'Sube las puntas de los pies.', sitB({ nfa: -38, ffa: -38 }), ['nl', 'fl']),
    K(800, 300, 'Ahora bájalas, como si pisaras un pedal.', sitB({ nfa: 28, ffa: 28, nay: 160, fay: 160 }), ['nl', 'fl']),
    K(700, 300, 'Sigue alternando, sin prisa.', sitB({}))] };

  const kext = (long, last) => [
    K(0, 600, 'Sentada con la espalda apoyada y los pies en el suelo.', sitB({})),
    K(1400, long ? 2600 : 600, long ? 'Estira la rodilla y aprieta el muslo. Aguanta contando hasta 3.' : 'Estira una pierna hacia delante, hasta donde puedas.', sitB({ nax: 194, nay: 128, nfa: -28 }), ['nl']),
    K(1600, 400, last || 'Baja la pierna despacio, con control.', sitB({}))];
  A.k1 = { view: 'side', cycle: true, scene: chair(), kf: kext(false) };
  A.k2 = { view: 'side', cycle: true, scene: chair(), kf: kext(true) };
  A.k3 = { view: 'side', cycle: true, scene: chair(), kf: kext(true, 'Baja despacio. Con la tobillera pesa un poco más: ve con calma.') };

  A.h1 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 500, 'Sentada recta, con las manos en los muslos.', sitB({})),
    K(1200, 700, 'Sube una rodilla hacia el pecho, sin echar la espalda atrás.', sitB({ nax: 150, nay: 148, nfa: 10 }), ['nl']),
    K(1200, 300, 'Baja con control. Después, la otra pierna.', sitB({}))] };

  A.h2 = { view: 'side', cycle: true, scene: chair().concat(['<ellipse cx="148" cy="116" rx="7" ry="10" class="cush"/>']), kf: [
    K(0, 500, 'Sentada, con un cojín o una toalla doblada entre las rodillas.', sitB({})),
    K(900, 2500, 'Aprieta el cojín con suavidad y cuenta hasta 5.', sitB({}), ['nl', 'fl']),
    K(900, 300, 'Suelta despacio.', sitB({}))] };

  A.t2 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 400, 'Levanta un pie del suelo.', sitB({ nax: 158, nay: 156, nfa: 0 })),
    K(700, 100, 'Dibuja un círculo con la punta del pie: arriba…', sitB({ nax: 158, nay: 156, nfa: -32 }), ['nl']),
    K(700, 100, '…delante…', sitB({ nax: 158, nay: 156, nfa: 0 }), ['nl']),
    K(700, 100, '…abajo…', sitB({ nax: 158, nay: 156, nfa: 34 }), ['nl']),
    K(700, 100, '…y vuelve. Después, hazlo al otro lado.', sitB({ nax: 158, nay: 156, nfa: 0 }), ['nl'])] };

  A.m1 = { view: 'side', cycle: true, scene: chair({ noback: true }), kf: [
    K(0, 500, 'Siéntate en el borde de la silla, con los pies apoyados.', sitB({})),
    K(1400, 500, 'Arquea un poquito la espalda baja (saca el pecho).', sitB({ arch: 6, t: -3 }), ['core']),
    K(1600, 500, 'Ahora redondéala un poquito (mira el ombligo).', sitB({ arch: -5, t: 5 }), ['core']),
    K(1400, 200, 'Movimientos pequeños y cómodos. Sigue así.', sitB({}))] };

  A.p1 = { view: 'side', cycle: true, scene: chair({ noback: true }), kf: [
    K(0, 500, 'Siéntate recta, con la espalda separada del respaldo.', sitB({ nhr: [28, 14], fhr: [24, 16], ednx: -0.2, edny: 1, edfx: -0.2, edfy: 1 })),
    K(1200, 2000, 'Junta los omóplatos hacia atrás y abajo. Aguanta 3 segundos.', sitB({ nhr: [4, 20], fhr: [2, 22], ednx: -1, edny: 0.3, edfx: -1, edfy: 0.3 }), ['na', 'fa']),
    K(1200, 300, 'Suelta despacio.', sitB({ nhr: [28, 14], fhr: [24, 16], ednx: -0.2, edny: 1, edfx: -0.2, edfy: 1 }))] };

  A.p2 = { view: 'side', cycle: true, scene: chair({ noback: true }), kf: [
    K(0, 500, 'Sentada, con los brazos estirados hacia delante agarrando la banda o la toalla.', sitB({ nhr: [50, 2], fhr: [50, 6], ednx: 0, edny: 1, edfx: 0, edfy: 1 })),
    K(1400, 800, 'Tira hacia atrás con los codos pegados al cuerpo, juntando los omóplatos.', sitB({ nhr: [8, 22], fhr: [6, 24], ednx: -1, edny: 0.4, edfx: -1, edfy: 0.4 }), ['na', 'fa']),
    K(1600, 300, 'Vuelve despacio, sin soltar de golpe.', sitB({ nhr: [50, 2], fhr: [50, 6], ednx: 0, edny: 1, edfx: 0, edfy: 1 }))] };

  /* ===== levantarse y sentarse ===== */
  function sts(o) {
    o = o || {}; const hy0 = o.high ? 114 : 122; const sc = chair({ arms: o.hands === 'rails' || o.hands === 'one', high: o.high });
    const ank = { nax: 140, nay: 166, fax: 146, fay: 166 };
    const hands = (phase) => {
      if (o.hands === 'rails') return phase === 'up' ? { nhx: 128, nhy: 97, fhx: 126, fhy: 97, ednx: -1, edny: 0.5, edfx: -1, edfy: 0.5 } : { nhr: [3, 48], fhr: [0, 48] };
      if (o.hands === 'one') return phase === 'up' ? { nhx: 128, nhy: 97, fhr: [44, 6], ednx: -1, edny: 0.5, edfx: 0, edfy: 1 } : { nhr: [3, 48], fhr: [0, 48] };
      return { nhr: [11, 14], fhr: [8, 16], ednx: 0.5, edny: 0.8, edfx: 0.5, edfy: 0.8 };
    };
    const si = (p) => P.sit(Object.assign({}, ank, p));
    const st = (p) => P.stand(Object.assign({}, ank, p));
    const dn = o.slow ? 3200 : 1500;
    const A0 = si(Object.assign({ hx: 110, hy: hy0 }, hands('up')));
    const cap0 = o.hands === 'rails' ? 'Siéntate en el borde de la silla, pies algo por detrás de las rodillas y manos en los reposabrazos.' :
      o.hands === 'one' ? 'Pies algo por detrás de las rodillas. Una mano en el reposabrazos.' : 'Brazos cruzados sobre el pecho, pies algo por detrás de las rodillas.';
    return { view: 'side', cycle: true, scene: sc, kf: [
      K(0, 800, cap0, A0),
      K(1100, 300, 'Inclina el cuerpo hacia delante' + (o.hands === 'rails' ? ' y empuja con las manos.' : o.hands === 'one' ? ' y empuja solo con una mano.' : ', mirando al frente.'), si(Object.assign({ hx: 113, hy: hy0, t: 38 }, hands('up'))), ['core', 'na']),
      K(1100, 100, 'Estira las piernas para ponerte de pie.', st(Object.assign({ hx: 126, hy: 101, t: 26 }, hands('up'))), ['nl', 'fl']),
      K(1000, 1200, 'De pie, derecha. Respira.', st(Object.assign({ hx: 139, hy: 86, t: 0 }, hands('down'))), ['nl', 'fl']),
      K(dn, 300, o.slow ? 'Baja despacio contando 3 segundos, con las piernas haciendo fuerza.' : 'Para sentarte: echa el culo hacia atrás y baja despacio.', st(Object.assign({ hx: 122, hy: 104, t: 28 }, hands('up'))), ['nl', 'fl']),
      K(dn, 300, 'Siéntate sin dejarte caer.', A0)] };
  }
  A.s1 = sts({ hands: 'rails' });
  A.s2 = sts({ hands: 'one' });
  A.s3 = sts({ hands: 'cross', high: true });
  A.s4 = sts({ hands: 'cross' });
  A.s5 = sts({ hands: 'cross', slow: true });

  /* ===== tumbada ===== */
  const lie = o => P.lie(o);
  const bridgePose = (up, extra) => {
    const hy = 153 - up, dx = Math.sqrt(2500 - up * up), hx = 110 + dx, t = -Math.asin(dx / 50) * 180 / Math.PI - 0;
    // torso: de la cadera al hombro fijo (110,153)
    const tt = -(180 - Math.asin(up / 50) * 180 / Math.PI - 90) - 0; void tt;
    const ang = -90 - Math.asin(up / 50) * 180 / Math.PI;
    return lie(Object.assign({ hx, hy, t: ang, nax: 200, fax: 206 }, extra || {}));
  };

  A.c1 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 600, 'Tumbada boca arriba, rodillas dobladas y pies apoyados en la cama.', lie({ nax: 200, fax: 206, arch: 5 })),
    K(1600, 2200, 'Aprieta suavemente la tripa: la espalda baja se pega a la cama. Aguanta 3 segundos.', lie({ nax: 200, fax: 206, arch: 0 }), ['core']),
    K(1400, 300, 'Suelta despacio.', lie({ nax: 200, fax: 206, arch: 5 }))] };

  A.r2 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 600, 'Tumbada boca arriba, rodillas dobladas.', lie({ nax: 200, fax: 206, arch: 5 })),
    K(2200, 400, 'Coge aire por la nariz, despacio.', lie({ nax: 200, fax: 206, arch: 5, br: 12 })),
    K(2600, 400, 'Suelta el aire y mete el ombligo hacia dentro, sin mover la espalda.', lie({ nax: 200, fax: 206, arch: 1, br: 0 }), ['core']),
    K(900, 200, 'Repite con calma.', lie({ nax: 200, fax: 206, arch: 5 }))] };

  A.c2 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 600, 'Tumbada, rodillas dobladas, pies a la anchura de las caderas.', bridgePose(0, { arch: 3 })),
    K(1400, 400, 'Aprieta la tripa y sube la cadera solo unos centímetros.', bridgePose(9), ['nl', 'fl', 'core']),
    K(1500, 300, 'Baja despacio.', bridgePose(0, { arch: 3 }))] };
  A.c3 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 600, 'Tumbada, rodillas dobladas, pies apoyados.', bridgePose(0, { arch: 3 })),
    K(1600, 2400, 'Sube la cadera hasta donde sea cómodo y aguanta contando hasta 5.', bridgePose(19), ['nl', 'fl', 'core']),
    K(2200, 300, 'Baja despacio, poco a poco.', bridgePose(0, { arch: 3 }))] };
  A.c4 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 400, 'Tumbada, rodillas dobladas.', bridgePose(0, { arch: 3 })),
    K(1400, 300, 'Sube la cadera unos centímetros.', bridgePose(10), ['nl', 'fl', 'core']),
    K(900, 500, 'Despega un pie unos centímetros, sin que la cadera se caiga.', bridgePose(10, { nay: 146, nax: 198 }), ['nl', 'core']),
    K(800, 200, 'Apóyalo y cambia de pie.', bridgePose(10), ['core']),
    K(900, 500, 'Despega el otro pie.', bridgePose(10, { fay: 146, fax: 204 }), ['fl', 'core']),
    K(1000, 200, 'Baja la cadera despacio.', bridgePose(0, { arch: 3 }))] };

  A.c5 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 500, 'Tumbada, rodillas dobladas. Mantén la tripa suave y firme.', lie({ nax: 200, fax: 206, arch: 1 }), ['core']),
    K(1400, 300, 'Desliza un talón por la cama estirando la pierna.', lie({ nax: 232, fax: 206, arch: 1 }), ['nl', 'core']),
    K(1300, 200, 'Vuelve. Ahora la otra pierna.', lie({ nax: 200, fax: 206, arch: 1 }), ['core']),
    K(1400, 300, 'Desliza el otro talón.', lie({ nax: 200, fax: 238, arch: 1 }), ['fl', 'core']),
    K(1300, 200, 'Vuelve despacio.', lie({ nax: 200, fax: 206, arch: 1 }), ['core'])] };

  A.c6 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 500, 'Tumbada, brazos hacia el techo y rodillas dobladas. Tripa firme.', lie({ nax: 200, fax: 206, arch: 1, nhx: 110, nhy: 106, fhx: 112, fhy: 106, ednx: 0, edny: 0, edfx: 0, edfy: 0 }), ['core']),
    K(1500, 400, 'Lleva un brazo hacia atrás y estira la pierna contraria.', lie({ nax: 200, fax: 236, arch: 1, nhx: 60, nhy: 148, fhx: 112, fhy: 106, ednx: 0, edny: 0, edfx: 0, edfy: 0 }), ['na', 'fl', 'core']),
    K(1500, 200, 'Vuelve al centro.', lie({ nax: 200, fax: 206, arch: 1, nhx: 110, nhy: 106, fhx: 112, fhy: 106, ednx: 0, edny: 0, edfx: 0, edfy: 0 }), ['core']),
    K(1500, 400, 'Ahora el otro lado.', lie({ nax: 232, fax: 206, arch: 1, nhx: 110, nhy: 106, fhx: 62, fhy: 150, ednx: 0, edny: 0, edfx: 0, edfy: 0 }), ['fa', 'nl', 'core']),
    K(1500, 200, 'Vuelve despacio.', lie({ nax: 200, fax: 206, arch: 1, nhx: 110, nhy: 106, fhx: 112, fhy: 106, ednx: 0, edny: 0, edfx: 0, edfy: 0 }), ['core'])] };

  /* almeja (esquema: tumbada de lado, vista desde delante) */
  const clam = up => P.lie({ hx: 160, hy: 148, t: -90, nuk: 1, nkx: 192, nky: 160 - up, nax: 168, nay: 156, fuk: 1, fkx: 190, fky: 164, fax: 168, fay: 158, nhx: 120, nhy: 158, fhx: 118, fhy: 160, kdnx: 0, kdny: 1 });
  A.a1 = { view: 'side', cycle: true, scene: bed(), kf: [
    K(0, 600, 'Tumbada de lado, caderas y rodillas dobladas, pies juntos.', clam(0)),
    K(1300, 800, 'Sin separar los pies, abre la rodilla de arriba unos centímetros.', clam(16), ['nl']),
    K(1300, 300, 'Baja despacio.', clam(0))] };

  /* ===== de pie con apoyo (vista lateral, encimera) ===== */
  const sc = o => P.stand(Object.assign({ hx: 140, t: 8, nhx: 172, nhy: 82, fhx: 168, fhy: 82, ednx: -0.2, edny: 1, edfx: -0.2, edfy: 1 }, o));
  A.t3 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 600, 'De pie frente a la encimera, con las dos manos apoyadas.', sc({})),
    K(1300, 500, 'Sube de puntillas, despacio.', sc({ hy: 76, nay: 157, fay: 157, nfa: 35, ffa: 35 }), ['nl', 'fl']),
    K(1500, 200, 'Baja con control.', sc({}))] };
  A.t4 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 600, 'De pie junto a la encimera, con una mano apoyada.', sc({ fhr: [0, 48] })),
    K(1300, 500, 'Sube de puntillas, despacio.', sc({ hy: 76, nay: 157, fay: 157, nfa: 35, ffa: 35, fhr: [0, 48] }), ['nl', 'fl']),
    K(1500, 200, 'Baja con control.', sc({ fhr: [0, 48] }))] };

  A.b2 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie, con las dos manos en la encimera.', sc({})),
    K(900, 200, 'Levanta un pie, como si caminaras en el sitio.', sc({ nax: 152, nay: 146, nfa: 8 }), ['nl']),
    K(800, 100, 'Apóyalo y levanta el otro.', sc({}), []),
    K(900, 200, 'Despacio y con control.', sc({ fax: 158, fay: 146, ffa: 8 }), ['fl']),
    K(800, 100, 'Sigue alternando.', sc({}))] };

  A.h4 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie, manos en la encimera, ligeramente inclinada hacia delante.', sc({ t: 10 })),
    K(1300, 900, 'Lleva una pierna estirada hacia atrás, sin arquear la espalda.', sc({ t: 10, nax: 122, nay: 152, nfa: 30 }), ['nl']),
    K(1300, 200, 'Vuelve despacio.', sc({ t: 10 }))] };
  A.k4 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie, con las dos manos en la encimera.', sc({})),
    K(1300, 700, 'Dobla una rodilla llevando el talón hacia el glúteo.', sc({ nax: 118, nay: 136, nfa: 70, kdnx: 0.4, kdny: 1 }), ['nl']),
    K(1400, 200, 'Baja despacio.', sc({}))] };
  A.b4 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie junto a la encimera, con una mano apoyada.', sc({ fhr: [0, 48], nax: 140, fax: 142 })),
    K(1200, 3000, 'Pon un pie medio paso por delante y mantén el equilibrio, mirando al frente.', sc({ fhr: [0, 48], nax: 152, fax: 138 }), ['nl', 'fl']),
    K(1200, 200, 'Vuelve a juntar los pies.', sc({ fhr: [0, 48], nax: 140, fax: 142 }))] };
  A.b5 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie junto a la encimera, con la mano rozando.', sc({ fhr: [0, 48], nax: 140, fax: 142 })),
    K(1200, 3000, 'Pon un pie justo delante del otro (talón con punta). Mantén.', sc({ fhr: [0, 48], nax: 162, fax: 136 }), ['nl', 'fl']),
    K(1200, 200, 'Vuelve a juntar los pies.', sc({ fhr: [0, 48], nax: 140, fax: 142 }))] };
  A.e1 = { view: 'side', cycle: true, scene: atCounter(), kf: [
    K(0, 500, 'De pie junto a la encimera, una o dos manos apoyadas.', sc({})),
    K(1100, 300, 'Da un paso corto hacia delante.', sc({ nax: 164, nay: 166 }), ['nl']),
    K(900, 400, 'Pasa el peso del cuerpo al pie de delante.', sc({ hx: 154, nax: 164, nay: 166, fax: 140 }), ['nl', 'fl']),
    K(1300, 200, 'Vuelve atrás despacio.', sc({}))] };

  /* ===== de pie con apoyo (vista frontal, barra) ===== */
  const fr = o => P.front(Object.assign({ nhx: 172, nhy: 81, fhx: 128, fhy: 81, ednx: 1, edny: 0.4, edfx: -1, edfy: 0.4 }, o));
  A.b1 = { view: 'front', cycle: true, scene: atBar(), kf: [
    K(0, 600, 'De pie, agarrada con las dos manos, pies separados a la anchura de las caderas.', fr({})),
    K(1300, 600, 'Pasa el peso del cuerpo a la pierna derecha, sin soltar las manos.', fr({ hx: 158, t: 2 }), ['nl']),
    K(1500, 600, 'Ahora pasa el peso a la izquierda.', fr({ hx: 142, t: -2 }), ['fl']),
    K(1300, 200, 'Vuelve al centro.', fr({}))] };
  A.b3 = { view: 'front', cycle: true, scene: atBar(), kf: [
    K(0, 500, 'De pie, con una mano apoyada en la encimera.', fr({ fhr: [-14, 48], nax: 164, fax: 136 })),
    K(1200, 3000, 'Junta los pies y mantén la posición, mirando al frente.', fr({ fhr: [-14, 48], nax: 156, fax: 144 }), ['nl', 'fl']),
    K(1200, 200, 'Separa los pies otra vez.', fr({ fhr: [-14, 48], nax: 164, fax: 136 }))] };
  A.b6 = { view: 'front', cycle: true, scene: atBar(), kf: [
    K(0, 500, 'De pie frente a la encimera, con las dos manos apoyadas.', fr({})),
    K(1200, 2200, 'Levanta un pie unos centímetros y mantén. Apóyate bien con las manos.', fr({ hx: 154, nax: 166, nay: 160 }), ['nl']),
    K(1200, 200, 'Apóyalo con suavidad.', fr({}))] };
  A.h3 = { view: 'front', cycle: true, scene: atBar(), kf: [
    K(0, 500, 'De pie, con las dos manos en la encimera.', fr({ nax: 160, fax: 140 })),
    K(1300, 600, 'Lleva una pierna hacia el lado, sin inclinar el cuerpo.', fr({ nax: 190, nay: 164, kdnx: 0.2, kdny: 0 }), ['nl']),
    K(1300, 200, 'Vuelve despacio.', fr({ nax: 160, fax: 140 }))] };
  A.h5 = { view: 'front', cycle: true, scene: atBar(), kf: [
    K(0, 500, 'De cara a la encimera, con las manos apoyadas.', fr({ nax: 164, fax: 136 })),
    K(1200, 200, 'Da un paso corto hacia un lado.', fr({ hx: 160, nax: 186, fax: 136, nhx: 180 }), ['nl']),
    K(1100, 300, 'Acerca el otro pie.', fr({ hx: 168, nax: 186, fax: 160, nhx: 180, fhx: 140 }), ['fl']),
    K(1400, 300, 'Repite hacia el lado contrario al volver.', fr({ nax: 164, fax: 136 }))] };

  /* ===== escalón ===== */
  function stepAnim(label) {
    const H = 14, sceneS = [S.step(172, H), S.rail(120, 84, 262, 84)];
    const st = o => P.stand(Object.assign({ hx: 138, hy: 85, t: 6, nhx: 168, nhy: 84, fhx: 164, fhy: 84, ednx: -0.3, edny: 1, edfx: -0.3, edfy: 1 }, o));
    return { view: 'side', cycle: true, scene: sceneS, kf: [
      K(0, 500, 'De pie frente al escalón, agarrada a la barandilla.', st({})),
      K(1100, 200, 'Sube con la pierna más fuerte. («Sube la buena»)', st({ nax: 186, nay: 172 - H - 6, nfa: 0 }), ['nl']),
      K(1100, 300, 'Estira la pierna y sube el cuerpo, agarrada siempre.', st({ hx: 184, hy: 85 - H, t: 4, nax: 188, nay: 172 - H - 6, fax: 168, fay: 160, ffa: 12 }), ['nl', 'fl']),
      K(1000, 300, 'Baja primero con la pierna más débil. («Baja la mala»)', st({ hx: 176, hy: 85 - H + 2, t: 6, nax: 188, nay: 172 - H - 6, fax: 160, fay: 166 }), ['fl']),
      K(1000, 200, label || 'Baja el otro pie y vuelve a empezar.', st({}))] };
  }
  A.e2 = stepAnim();
  A.e3 = stepAnim('Cuando lo domines, repite con 2-3 escalones seguidos.');

  G.ANIMS = A;
})(window);
