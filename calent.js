/* Paso a Paso — calentamiento antes de salir a caminar (y enfriamiento al volver).
   Son ejercicios aparte de los niveles: no se “superan”, se repiten cada día. */
(function (G) {
  'use strict';
  const mk = (id, nombre, o) => Object.assign({ id, nivel: 1, bloque: 'calent', min: 0.7, nombre, previo: null, fisio: false, lado: false, timed: 0, series: 1, rodilla: false, respiracion: '' }, o);
  const COMUN = 'dolor lumbar que aumenta, dolor que baja por la pierna, hormigueo o pérdida de fuerza nuevos, mareo o pérdida de equilibrio.';
  const L = [
    mk('w1', 'Respira y siéntate alta', { min: 0.8, n: [4, 6], que: 'Calma el cuerpo y te prepara para salir sin prisa.',
      posicion: 'Sentada en una silla firme, con la espalda apoyada y los pies en el suelo.', ejecucion: 'Una mano en la tripa. Coge aire por la nariz y suelta despacio por la boca. Cada respiración es una repetición.',
      dosis: '4-6 respiraciones lentas (menos de 1 minuto).', respiracion: 'Soltar el aire más despacio de lo que lo coges.', esperadas: 'Tranquilidad, la tripa sube y baja suave.',
      parar: 'mareo o sensación de falta de aire.', errores: 'Coger demasiado aire de golpe o levantar los hombros.', facil: 'Respira normal y solo cuenta las respiraciones.', progresion: 'Más respiraciones, siempre sin forzar.' }),
    mk('w2', 'Tobillos: pedal', { n: [10, 14], que: 'Calienta los tobillos y las pantorrillas, que van a trabajar mucho al caminar.',
      posicion: 'Sentada, con los talones en el suelo.', ejecucion: 'Sube las puntas de los pies y bájalas como si pisaras un pedal, despacio.', dosis: '10-14 movimientos (1 min).',
      respiracion: 'Respira normal.', esperadas: 'Un tirón suave en la espinilla y la pantorrilla.', parar: 'calambre fuerte, ' + COMUN, errores: 'Ir demasiado rápido.', facil: 'Mueve solo un pie cada vez.', progresion: 'Hazlo de pie con apoyo (ver puntillas).' }),
    mk('w3', 'Marcha sentada (músculos que suben la pierna)', { n: [10, 16], que: 'Despierta los flexores de la cadera: los músculos de delante de la cadera que levantan la pierna en cada paso.',
      posicion: 'Sentada en el borde de la silla, recta, con las manos en los muslos.', ejecucion: 'Sube una rodilla unos centímetros, bájala y sube la otra. Sin echar la espalda hacia atrás.', dosis: '10-16 elevaciones alternando (1 min).',
      respiracion: 'Suelta el aire al subir la rodilla.', esperadas: 'Trabajo suave en la parte de delante de la cadera.', parar: COMUN, errores: 'Echar el cuerpo atrás para subir la pierna.', facil: 'Sube menos la rodilla.', progresion: 'Mantén la rodilla arriba 2 segundos.' }),
    mk('w4', 'Estirar la rodilla sentada', { n: [6, 8], lado: true, que: 'Activa el muslo y suelta la rodilla antes de cargar peso.',
      posicion: 'Sentada, espalda apoyada, pies en el suelo.', ejecucion: 'Estira una pierna hacia delante hasta donde puedas, aprieta el muslo un segundo y baja con control.', dosis: '6-8 por pierna (1 min).',
      respiracion: 'Suelta el aire al estirar.', esperadas: 'Muslo trabajando; la rodilla se siente más suelta.', parar: 'dolor fuerte en la rodilla, ' + COMUN, errores: 'Dejar caer la pierna.', facil: 'Estira solo la mitad del recorrido.', progresion: 'Aguanta 3 segundos arriba.' }),
    mk('w5', 'Hombros atrás', { n: [5, 8], que: 'Abre el pecho y la espalda alta para caminar más erguida.',
      posicion: 'Sentada, recta, con la espalda separada del respaldo.', ejecucion: 'Junta los omóplatos hacia atrás y abajo, aguanta 3 segundos y suelta.', dosis: '5-8 repeticiones (1 min).',
      respiracion: 'Coge aire al juntar los omóplatos.', esperadas: 'Trabajo entre los omóplatos.', parar: COMUN, errores: 'Arquear la espalda baja o subir los hombros hacia las orejas.', facil: 'Hazlo con menos recorrido.', progresion: 'Aguanta 5 segundos.' }),
    mk('w6', 'Balanceo suave de la pelvis', { n: [6, 8], que: 'Suelta la zona lumbar con movimientos muy pequeños, sin forzar.',
      posicion: 'Sentada en el borde de la silla, con los pies apoyados.', ejecucion: 'Arquea un poquito la espalda baja y luego redondéala un poquito. Movimientos pequeños y cómodos.', dosis: '6-8 balanceos (1 min).',
      respiracion: 'Respira normal.', esperadas: 'Una sensación suave de soltar, nunca de pinchazo.', parar: COMUN, errores: 'Hacer el movimiento muy grande.', facil: 'Reduce el recorrido a la mitad.', progresion: 'Sin cambios: este ejercicio es de calentamiento.' }),
    mk('w7', 'Marcha en el sitio con apoyo', { n: [20, 40], timed: 1, rodilla: true, que: 'Activa los flexores de la cadera y las piernas de pie, justo antes de caminar.',
      posicion: 'De pie, frente a una encimera o mesa firme, con las dos manos apoyadas.', ejecucion: 'Levanta un pie unos centímetros, apóyalo y levanta el otro, como caminando en el sitio, despacio.', dosis: '20-40 segundos.',
      respiracion: 'Respira normal, sin aguantar el aire.', esperadas: 'Piernas y cadera calentándose.', parar: 'dolor fuerte en la rodilla, ' + COMUN, errores: 'Soltar las manos o ir muy rápido.', facil: 'Hazlo sentada (marcha sentada).', progresion: 'Sube un poco más la rodilla, siempre con apoyo.' }),
    mk('w8', 'Puntillas con apoyo', { n: [8, 12], que: 'Calienta las pantorrillas, que impulsan cada paso.',
      posicion: 'De pie, frente a la encimera, con las dos manos apoyadas.', ejecucion: 'Sube de puntillas despacio y baja con control.', dosis: '8-12 repeticiones.',
      respiracion: 'Suelta el aire al subir.', esperadas: 'Las pantorrillas trabajando.', parar: 'calambre fuerte, ' + COMUN, errores: 'Subir de golpe o soltar las manos.', facil: 'Sube solo un poco.', progresion: 'Hazlo con una mano apoyada.' }),
    mk('w9', 'Pierna hacia atrás con apoyo', { n: [6, 8], lado: true, rodilla: true, que: 'Activa el glúteo, que empuja al caminar, y abre con suavidad la parte de delante de la cadera.',
      posicion: 'De pie, con las manos en la encimera, algo inclinada hacia delante.', ejecucion: 'Lleva una pierna estirada hacia atrás unos centímetros, sin arquear la espalda, y vuelve despacio.', dosis: '6-8 por pierna.',
      respiracion: 'Suelta el aire al llevar la pierna atrás.', esperadas: 'Trabajo en el glúteo, no en la espalda.', parar: 'notas la espalda baja “apretada” o dolor, ' + COMUN, errores: 'Arquear la espalda en vez de mover la cadera.', facil: 'Menos recorrido.', progresion: 'Aguanta 2 segundos atrás.' }),
    mk('w10', 'Pierna hacia el lado con apoyo', { n: [6, 8], lado: true, rodilla: true, que: 'Activa los músculos laterales de la cadera, que te dan estabilidad al caminar.',
      posicion: 'De pie, de frente a la encimera, con las dos manos apoyadas.', ejecucion: 'Lleva una pierna hacia el lado sin inclinar el cuerpo y vuelve despacio.', dosis: '6-8 por pierna.',
      respiracion: 'Respira normal.', esperadas: 'Trabajo en el lateral de la cadera.', parar: COMUN, errores: 'Inclinar el cuerpo hacia el lado contrario.', facil: 'Menos recorrido.', progresion: 'Aguanta 2 segundos.' }),
    mk('w12', 'Pasar el peso de un pie al otro', { n: [6, 8], que: 'Te prepara para repartir el peso al caminar y gana confianza.',
      posicion: 'De pie, agarrada con las dos manos, pies a la anchura de las caderas.', ejecucion: 'Pasa el peso del cuerpo a una pierna, luego a la otra, sin soltar las manos.', dosis: '6-8 cambios.',
      respiracion: 'Respira normal.', esperadas: 'Notas cómo cada pierna sostiene el peso.', parar: 'mareo o inseguridad, ' + COMUN, errores: 'Soltar las manos o inclinar mucho el cuerpo.', facil: 'Cambia el peso menos.', progresion: 'Solo cuando la fisio lo indique.' }),
    mk('w13', 'Paso atrás: abrir la cadera con suavidad', { fisio: true, n: [8, 15], timed: 1, lado: true, rodilla: true, que: 'Estira con suavidad la parte de delante de la cadera (flexores), que se acorta con tanto tiempo sentada.',
      posicion: 'De pie, de lado junto a la encimera, con una mano apoyada.', ejecucion: 'Da un paso corto atrás con una pierna, con el cuerpo alto y la tripa suave. Siente el estiramiento delante de la cadera de la pierna de atrás. Sin arquear la espalda.', dosis: '8-15 segundos por lado.',
      respiracion: 'Respira normal, sin aguantar el aire.', esperadas: 'Un estiramiento suave delante de la cadera, nunca en la espalda.', parar: 'cualquier dolor o apretón en la espalda baja, dolor en la ingle, ' + COMUN, errores: 'Arquear la espalda baja para “llegar más”.', facil: 'Da un paso más corto.', progresion: 'Solo con el visto bueno de la fisioterapeuta.' })
  ];
  G.CALENT = L;
  L.forEach(e => { EX[e.id] = e; });

  /* animaciones: reutilizan las de los niveles y añaden marcha alternando y paso atrás */
  const A = G.ANIMS, { P, S } = G.Anim, K = (t, hold, cap, pose, hi) => ({ t, hold, cap, pose, hi: hi || [] });
  ['r1:w1', 't1:w2', 'k1:w4', 'p1:w5', 'm1:w6', 'b2:w7', 't3:w8', 'h4:w9', 'h3:w10', 'b1:w12'].forEach(x => { const [a, b] = x.split(':'); A[b] = A[a]; });
  const chair = [S.chair(110, {})], sitB = o => P.sit(o);
  A.w3 = { view: 'side', cycle: true, scene: chair, kf: [
    K(0, 400, 'Sentada recta, con las manos en los muslos.', sitB({})),
    K(900, 300, 'Sube una rodilla unos centímetros.', sitB({ nax: 150, nay: 148, nfa: 10 }), ['nl']),
    K(900, 100, 'Bájala…', sitB({}), []),
    K(900, 300, '…y sube la otra, alternando, sin echar la espalda atrás.', sitB({ fax: 156, fay: 148, ffa: 10 }), ['fl']),
    K(900, 100, 'Baja y sigue alternando.', sitB({}))] };
  const sc = o => P.stand(Object.assign({ hx: 140, t: 4, nhx: 172, nhy: 82, ednx: -0.2, edny: 1 }, o));
  A.w13 = { view: 'side', cycle: true, scene: [S.counter(166)], kf: [
    K(0, 500, 'De pie, de lado junto a la encimera, con una mano apoyada.', sc({})),
    K(1300, 300, 'Da un paso corto atrás con una pierna.', sc({ nax: 126, nay: 166 }), ['nl']),
    K(900, 3500, 'Cuerpo alto, tripa suave. Nota el estiramiento delante de la cadera de atrás. Sin arquear la espalda.', sc({ hx: 144, nax: 120, nay: 166 }), ['nl']),
    K(1300, 200, 'Vuelve al paso inicial y repite con la otra pierna.', sc({}))] };

  /* etapas */
  G.CAL_ETAPAS = {
    1: { nombre: 'Sentada', emoji: '🪑', ids: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], desc: 'Todo sentada. La más tranquila: sirve para cualquier día.' },
    2: { nombre: 'De pie con apoyo', emoji: '🧍', ids: ['w1', 'w2', 'w3', 'w7', 'w8', 'w9', 'w10', 'w12'], desc: 'Empiezas sentada y terminas de pie, agarrada a la encimera.' },
    3: { nombre: 'Con apertura de cadera', emoji: '🔥', ids: ['w1', 'w2', 'w3', 'w7', 'w8', 'w9', 'w10', 'w13', 'w12'], desc: 'Añade un estiramiento suave de la cadera (necesita el visto bueno de la fisio).' },
    fin: { nombre: 'Al volver', emoji: '🧊', ids: ['w1', 'w2', 'w4'], desc: '2 minutos sentada para que las piernas se relajen.' }
  };
})(window);
