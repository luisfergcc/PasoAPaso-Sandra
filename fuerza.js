/* Paso a Paso — niveles 6 a 12: material ligero, cargas y gimnasio.
   Se añaden a EJERCICIOS antes de que core.js construya EX. Cada ejercicio con `kg` tiene una escalera de cargas. */
(function () {
  'use strict';
  const PC = 'dolor lumbar que aumenta, dolor que baja por la pierna, hormigueo o pérdida de fuerza nuevos, mareo o falta de aire';
  const PT = PC + ', o si no puedes mantener la espalda recta';
  function X(id, nivel, bloque, nombre, previo, o) {
    const e = Object.assign({ id, nivel, bloque, nombre, previo, fisio: false, lado: false, timed: 0, series: 2, rodilla: false, kg: null, mat: [],
      respiracion: 'Suelta el aire al hacer el esfuerzo. No aguantes la respiración.', esperadas: 'Cansancio muscular suave; nunca dolor agudo, hormigueo ni pinchazos.', parar: PC + '.', errores: '', facil: '', progresion: '' }, o);
    if (e.kg && !e.descanso) e.descanso = e.mat.indexOf('gym') >= 0 ? 90 : 60;
    if (e.kg && e.kg.length > 1 && !e.ritmo) e.ritmo = 2;
    const a = e.n[0], b = e.n[1];
    if (!e.dosis) e.dosis = e.series + ' series de ' + a + '-' + b + (e.timed ? ' segundos' : ' repeticiones') + (e.lado ? ' por lado' : '') + '.';
    return e;
  }
  function calcMin(e) { const b = e.n[1]; return Math.max(1.5, Math.round((e.series * (e.lado ? 2 : 1) * (e.timed ? (b / 60 + 0.3) : (b * 0.06 + 0.3)) + (e.descanso || 0) * (e.series * (e.lado ? 2 : 1) - 1) / 60) * 2) / 2); }
  const L = [
    /* ===== NIVEL 6 · Primeros pesos (pesas de 1 kg, banda, ejercitador) ===== */
    X('ag1', 6, 'agarre', 'Ejercitador de agarre', 'p1', { n: [8, 12], lado: true, mat: ['agarre'],
      que: 'Fortalece la mano y el antebrazo: te ayudan a agarrar, cargar bolsas y abrir botes. La fuerza de agarre también es un buen indicador de tu fuerza general.',
      posicion: 'Sentada, con el codo doblado y el antebrazo apoyado en el muslo o en una mesa.',
      ejecucion: 'Aprieta el ejercitador hasta cerrarlo, aguanta 1 segundo y ábrelo despacio, sin dejarlo abrirse de golpe. Haz todas las repeticiones con una mano y luego con la otra.',
      respiracion: 'Suelta el aire al apretar.', esperadas: 'Cansancio en el antebrazo.', parar: PC + ', dolor en la muñeca o el codo.',
      errores: 'Aguantar la respiración o cerrarlo de golpe.', facil: 'Aprieta solo la mitad del recorrido.', progresion: 'Aguantar cerrado 5 segundos (siguiente ejercicio).' }),
    X('br1', 6, 'brazos', 'Elevación de brazos hacia delante (1 kg)', 'p1', { n: [8, 15], kg: [1], mat: ['pesas'],
      que: 'Fortalece hombros y brazos para alcanzar, cargar y empujar con más soltura.',
      posicion: 'Sentada con la espalda apoyada, una pesa en cada mano y los brazos junto al cuerpo.',
      ejecucion: 'Sube los dos brazos estirados hacia delante hasta la altura de los hombros y bájalos despacio, contando 3.',
      esperadas: 'Cansancio en los hombros.', parar: PC + ', dolor en el hombro.', errores: 'Encoger los hombros o balancear el cuerpo para subir.', facil: 'Hazlo sin pesa.', progresion: 'Cuando llegues a 15 repeticiones con facilidad, pasa al press con mancuernas.' }),
    X('br2', 6, 'brazos', 'Curl de bíceps sentada (1 kg)', 'br1', { n: [8, 15], kg: [1], mat: ['pesas'],
      que: 'Fortalece los brazos para cargar bolsas y levantar objetos.',
      posicion: 'Sentada con la espalda apoyada, una pesa en cada mano, brazos estirados junto al cuerpo.',
      ejecucion: 'Dobla los codos subiendo las pesas hacia los hombros, sin mover los codos de sitio, y baja despacio.',
      esperadas: 'Cansancio en el bíceps.', errores: 'Balancear el cuerpo o levantar los codos.', facil: 'Una sola pesa o sin pesa.', progresion: 'Más repeticiones; después, el curl con mancuernas más pesadas.' }),
    X('tr1', 6, 'tiron', 'Apertura con banda (separar las manos)', 'p2', { n: [8, 12], mat: ['banda'],
      que: 'Fortalece la espalda alta y los hombros, que te ayudan a caminar y estar erguida.',
      posicion: 'Sentada o de pie, con los brazos estirados al frente y la banda sujeta con las manos a la anchura de los hombros.',
      ejecucion: 'Separa las manos hacia los lados estirando la banda, juntando los omóplatos, y vuelve despacio.',
      esperadas: 'Trabajo entre los omóplatos.', errores: 'Subir los hombros o arquear la espalda baja.', facil: 'Usa una banda más suave o agárrala más ancha.', progresion: 'Banda más dura, o el remo a una mano con mancuerna.' }),
    X('ch1', 6, 'cadera', 'Separar la pierna con banda (de pie)', 'h3', { n: [8, 12], lado: true, rodilla: true, mat: ['banda'],
      que: 'Fortalece los glúteos y el lateral de la cadera, que dan estabilidad al caminar.',
      posicion: 'De pie frente a la encimera, con las dos manos apoyadas y una banda elástica alrededor de los tobillos (o justo encima de las rodillas si te resulta más cómodo).',
      ejecucion: 'Lleva una pierna hacia el lado empujando contra la banda, sin inclinar el cuerpo, aguanta 1 segundo y vuelve despacio. Haz todas con una pierna y luego con la otra.',
      esperadas: 'Trabajo en el lateral de la cadera.', parar: 'mareo, pérdida de equilibrio o ' + PC + '.', errores: 'Inclinar el cuerpo o girar el pie hacia fuera.', facil: 'Banda más suave o sin banda.', progresion: 'Empuje de cadera con banco (nivel 9).' }),
    X('ba1', 6, 'bisagra', 'Bisagra de cadera con un palo', 'h4', { n: [6, 10],
      que: 'Aprende el movimiento de doblar la cadera con la espalda recta: es la base del peso muerto y de agacharte a coger algo del suelo.',
      posicion: 'De pie junto a la encimera, pies a la anchura de las caderas, rodillas un poco flexionadas y un palo de escoba pegado a la espalda (cabeza, espalda alta y glúteos tocándolo).',
      ejecucion: 'Lleva la cadera hacia atrás, como si cerraras una puerta con el culo. El tronco se inclina hacia delante con el palo pegado, solo hasta donde llegues cómoda (unos 30-45°). Vuelve empujando el suelo con los pies.',
      parar: PT + '.', errores: 'Redondear la espalda baja, o doblar tanto las rodillas que sea una sentadilla.', facil: 'Inclínate menos y apoya una mano en la encimera.', progresion: 'Hacerlo con mancuernas ligeras.' }),
    X('sq1', 6, 'sentadilla', 'Levantarse de la silla con una pesa al pecho', 's5', { n: [8, 12], kg: [1], mat: ['pesas'], rodilla: true,
      que: 'Fortalece las piernas y los glúteos con un peso pequeño, repitiendo el gesto que haces cada día.',
      posicion: 'Sentada en una silla firme, sujetando una pesa pegada al pecho con las dos manos y los pies algo por detrás de las rodillas.',
      ejecucion: 'Inclínate hacia delante, levántate sin apoyar las manos en la silla y vuelve a sentarte despacio, contando 3 al bajar.',
      esperadas: 'Trabajo en los muslos y los glúteos.', errores: 'Dejarte caer en la silla.', facil: 'Hazlo sin pesa.', progresion: 'Sentadilla copa con mancuernas más pesadas.' }),

    /* ===== NIVEL 7 · Cargas ligeras (mancuernas 2-10 kg) ===== */
    X('ag2', 7, 'agarre', 'Ejercitador de agarre: aguantar cerrado', 'ag1', { n: [6, 10], lado: true, mat: ['agarre'],
      que: 'Mejora la resistencia del agarre, útil para cargar bolsas durante más tiempo.',
      posicion: 'Sentada, con el antebrazo apoyado.', ejecucion: 'Cierra el ejercitador y aguanta 5 segundos respirando con normalidad; ábrelo despacio. Haz todas con una mano y luego con la otra.',
      respiracion: 'Respira con normalidad mientras aguantas.', esperadas: 'Cansancio en el antebrazo.', parar: PC + ', dolor en la muñeca o el codo.', errores: 'Aguantar la respiración.', facil: 'Aguanta 3 segundos.', progresion: 'Ejercitador con más resistencia.' }),
    X('pr1', 7, 'empuje', 'Press de hombros sentada con respaldo', 'br1', { n: [8, 12], kg: [2, 3, 4, 5, 6, 8, 10], mat: ['mancuernas'],
      que: 'Fortalece los hombros y los tríceps para empujar, alcanzar y colocar cosas en alto.',
      posicion: 'Sentada con toda la espalda pegada al respaldo, una mancuerna en cada mano a la altura de los hombros.',
      ejecucion: 'Empuja las mancuernas hacia arriba hasta estirar los brazos casi del todo sin arquear la espalda. Baja despacio hasta los hombros.',
      parar: PC + ', dolor en el hombro o el cuello.', errores: 'Arquear la zona lumbar o despegar la espalda del respaldo. Si pasa, baja el peso.', facil: 'Menos peso o empuja solo hasta la frente.', progresion: 'Press de pecho en banco o press de pie (más adelante).' }),
    X('tr2', 7, 'tiron', 'Remo a una mano con apoyo', 'tr1', { n: [8, 12], lado: true, kg: [2, 3, 4, 5, 6, 8, 10], mat: ['mancuernas'],
      que: 'Fortalece la espalda y los brazos tirando, lo contrario de empujar: equilibra los hombros y ayuda a la postura.',
      posicion: 'De pie junto a la encimera, una mano apoyada en ella, rodillas algo flexionadas, cadera atrás y espalda recta (tronco inclinado unos 30-40°). La mancuerna cuelga de la otra mano.',
      ejecucion: 'Tira del codo hacia la cadera, sin girar el tronco, y baja la mancuerna despacio.',
      parar: PT + '.', errores: 'Girar el tronco, redondear la espalda o tirar con el hombro.', facil: 'Menos peso o remo con banda sentada.', progresion: 'Jalón al pecho (nivel 9).' }),
    X('sq2', 7, 'sentadilla', 'Sentadilla copa a la silla', 'sq1', { n: [8, 12], series: 3, kg: [2, 3, 4, 5, 6, 8, 10], mat: ['mancuernas'], rodilla: true,
      que: 'Sentadilla con peso al pecho: fortalece piernas y glúteos con un gesto muy parecido a levantarte y sentarte.',
      posicion: 'De pie delante de una silla firme, pies a la anchura de las caderas, una mancuerna sujeta con las dos manos pegada al pecho.',
      ejecucion: 'Lleva la cadera atrás y baja hasta rozar la silla con el culo, con el pecho alto. Sube empujando el suelo con los pies.',
      parar: PC + ', dolor fuerte en la rodilla.', errores: 'Que las rodillas se vayan hacia dentro o redondear la espalda.', facil: 'Sin peso o con una silla más alta.', progresion: 'Sentadilla copa a una caja baja (nivel 8).' }),
    X('ba2', 7, 'bisagra', 'Bisagra con mancuernas ligeras', 'ba1', { n: [8, 12], kg: [2, 3, 4, 5, 6], mat: ['mancuernas'],
      que: 'Practica la bisagra de cadera con un peso en las manos; fortalece glúteos, parte de atrás del muslo y espalda.',
      posicion: 'De pie, pies a la anchura de las caderas, rodillas algo flexionadas, una mancuerna en cada mano frente a los muslos.',
      ejecucion: 'Lleva la cadera atrás y las mancuernas bajan pegadas a los muslos hasta justo por encima de las rodillas, con la espalda recta. Sube empujando el suelo y la cadera hacia delante.',
      parar: PT + '.', errores: 'Redondear la espalda o dejar las pesas lejos de las piernas.', facil: 'Sin peso (con el palo).', progresion: 'Peso muerto rumano con mancuernas (nivel 8).' }),
    X('cg1', 7, 'carga', 'Paseo con una pesa en una mano', 'ag2', { n: [20, 40], timed: 1, lado: true, kg: [2, 3, 4, 6, 8], mat: ['mancuernas'],
      que: 'Entrena el agarre y la estabilidad del tronco al caminar con una bolsa pesada, como cuando vas a la compra.',
      posicion: 'De pie en un pasillo despejado, con la pared o una encimera cerca, una pesa en una mano y el cuerpo recto.',
      ejecucion: 'Camina despacio, con el tronco recto y sin inclinarte hacia el lado de la pesa. Cuando termines el tiempo, cambia de mano.',
      respiracion: 'Respira con normalidad.', errores: 'Inclinarte hacia el lado de la pesa.', facil: 'Menos peso.', progresion: 'Paseo del granjero con dos pesas (nivel 8).' }),
    X('co1', 7, 'core', 'Plancha de pie contra la pared', 'c5', { n: [15, 30], timed: 1, series: 3,
      que: 'Fortalece la tripa y la espalda como un corsé natural, sin cargar la columna.',
      posicion: 'De pie frente a la pared, a un paso de ella, con las manos apoyadas a la altura de los hombros.',
      ejecucion: 'Inclínate hacia la pared con el cuerpo recto como una tabla, aprieta suavemente la tripa y aguanta respirando con normalidad.',
      respiracion: 'Respira con normalidad mientras aguantas.', errores: 'Dejar caer la cadera o arquear la espalda baja.', facil: 'Acércate más a la pared.', progresion: 'Pallof press con banda.' }),
    X('bq1', 7, 'equilibrio', 'Apoyo en un pie con una sola mano', 'b6', { n: [10, 30], timed: 1, lado: true, rodilla: true,
      que: 'Mejora el equilibrio sobre una pierna y la confianza al caminar.',
      posicion: 'De pie junto a la encimera, con una sola mano apoyada.', ejecucion: 'Levanta un pie unos centímetros y aguanta mirando al frente. Después, el otro pie.',
      respiracion: 'Respira con normalidad.', parar: 'mareo, pérdida de equilibrio o ' + PC + '.', errores: 'Mirar al suelo o apoyarte en la encimera con todo el peso.', facil: 'Con las dos manos apoyadas.', progresion: 'Caminar talón-punta (nivel 9).' }),

    /* ===== NIVEL 8 · Patrones con peso ===== */
    X('pr0', 8, 'empuje', 'Press de hombros sentada: más carga', 'pr1', { n: [8, 12], series: 3, kg: [8, 10], mat: ['mancuernas'],
      que: 'Continúa el press de hombros con más peso, cuando el anterior ya es fácil.', posicion: 'Igual que el press de hombros sentada: espalda pegada al respaldo.',
      ejecucion: 'Empuja hacia arriba y baja despacio, sin arquear la espalda.', parar: PC + ', dolor en el hombro o el cuello.', errores: 'Arquear la espalda.', facil: 'Vuelve a la carga anterior.', progresion: 'Press de pecho en banco (nivel 9).' }),
    X('ba3', 8, 'bisagra', 'Peso muerto rumano con mancuernas', 'ba2', { n: [8, 10], series: 3, kg: [4, 6, 8, 10], mat: ['mancuernas'], fisio: true,
      que: 'Fortalece glúteos, parte de atrás del muslo y toda la espalda con una bisagra de cadera cargada.',
      posicion: 'De pie, pies a la anchura de las caderas, rodillas algo flexionadas, mancuernas frente a los muslos y espalda recta.',
      ejecucion: 'Lleva la cadera atrás y baja las mancuernas pegadas a las piernas hasta justo debajo de la rodilla o hasta donde mantengas la espalda recta. Sube empujando la cadera hacia delante.',
      parar: PT + '.', errores: 'Redondear la espalda baja, mirar hacia arriba o despegar las pesas del cuerpo.', facil: 'Menos peso o rango más corto (hasta encima de la rodilla).', progresion: 'Peso muerto con mancuerna elevada (nivel 9).' }),
    X('sq3', 8, 'sentadilla', 'Sentadilla copa a una caja baja', 'sq2', { n: [8, 12], series: 3, kg: [10, 12, 14, 16, 18, 20], mat: ['mancuernas'], rodilla: true,
      que: 'Sentadilla con más peso y un poco más de recorrido: fuerza de piernas para levantarte, subir escaleras y agacharte.',
      posicion: 'De pie delante de una caja o banco unos 5 cm más bajo que una silla, con una mancuerna o kettlebell pegada al pecho.',
      ejecucion: 'Lleva la cadera atrás y baja hasta rozar la caja, con el pecho alto. Sube empujando el suelo con los pies.',
      parar: PC + ', dolor fuerte en la rodilla.', errores: 'Dejarte caer sobre la caja o que las rodillas se vayan hacia dentro.', facil: 'Caja más alta o menos peso.', progresion: 'Prensa de piernas (nivel 9).' }),
    X('cg2', 8, 'carga', 'Paseo del granjero con dos pesas', 'cg1', { n: [20, 40], timed: 1, series: 3, kg: [4, 6, 8, 10], mat: ['mancuernas'],
      que: 'Camina cargando como si llevaras dos bolsas de la compra: agarre, espalda, hombros y equilibrio.', posicion: 'De pie en un pasillo despejado, una pesa en cada mano a los lados, con la pared cerca.',
      ejecucion: 'Camina despacio con el cuerpo alto, hombros atrás y pasos cortos. Para y deja las pesas en el suelo doblando las rodillas, no la espalda.',
      respiracion: 'Respira con normalidad.', errores: 'Encorvarte o ir deprisa.', facil: 'Menos peso o menos tiempo.', progresion: 'Paseo del granjero pesado (nivel 10).' }),
    X('zn1', 8, 'escalon', 'Subir a un escalón con pesas ligeras', 'e3', { n: [6, 10], lado: true, kg: [2, 3, 4, 5, 6, 8], mat: ['mancuernas'], rodilla: true,
      que: 'Fortalece piernas y glúteos con el gesto de subir un escalón, ahora con peso.', posicion: 'De pie frente a un escalón bajo, una mancuerna en cada mano a los lados y una barandilla o pared cerca.',
      ejecucion: 'Sube con un pie, estira la pierna hasta quedar de pie y baja despacio con el mismo pie. Haz todas con una pierna y luego con la otra.',
      parar: 'dolor fuerte en la rodilla, mareo o ' + PC + '.', errores: 'Empujar con el pie de abajo o inclinarte hacia delante.', facil: 'Sin peso y agarrada a la barandilla.', progresion: 'Zancada atrás con apoyo (nivel 10).' }),
    X('co2', 8, 'core', 'Pallof press con banda', 'co1', { n: [8, 12], lado: true, mat: ['banda'],
      que: 'Fortalece la tripa para que la espalda no gire: estabiliza la columna al caminar y al cargar.', posicion: 'De pie, de lado a la puerta o a un punto fijo donde has atado la banda a la altura del pecho; agarra la banda con las dos manos pegadas al pecho.',
      ejecucion: 'Empuja las manos hacia delante hasta estirar los brazos, aguanta 2 segundos resistiendo que la banda te gire, y vuelve al pecho.',
      errores: 'Dejar que la banda te gire el cuerpo.', facil: 'Banda más suave o más cerca del anclaje.', progresion: 'Más repeticiones o más tensión.' }),

    /* ===== NIVEL 9 · Gimnasio I (máquinas y mancuernas en banco) ===== */
    X('pr2', 9, 'empuje', 'Press de pecho con mancuernas en banco', 'pr0', { n: [8, 12], series: 3, kg: [4, 5, 6, 8, 10, 12, 14, 16], mat: ['gym'],
      que: 'Fortalece el pecho, los hombros y los tríceps empujando hacia delante.', posicion: 'Tumbada en un banco con los pies en el suelo, la espalda baja con su curva natural y las mancuernas sobre el pecho. Alguien te acerca las mancuernas.',
      ejecucion: 'Baja las mancuernas hasta que los codos queden a la altura del pecho y empuja hacia arriba hasta estirar los brazos.',
      parar: PC + ', dolor en el hombro.', errores: 'Arquear mucho la espalda o dejar caer las mancuernas.', facil: 'Menos peso o press en máquina.', progresion: 'Press de banca con barra (nivel 11).' }),
    X('tr3', 9, 'tiron', 'Jalón al pecho', 'tr2', { n: [8, 12], series: 3, kg: [15, 20, 25, 30, 35, 40, 45], mat: ['gym'],
      que: 'Fortalece la espalda ancha y los brazos tirando desde arriba.', posicion: 'Sentada en la máquina con los muslos sujetos y las manos algo más anchas que los hombros en la barra.',
      ejecucion: 'Tira de la barra hacia la parte alta del pecho, llevando los codos abajo y atrás. Sube despacio hasta estirar los brazos.',
      errores: 'Inclinar mucho el tronco hacia atrás o tirar de la barra por detrás de la nuca.', facil: 'Menos peso o banda alta.', progresion: 'Remo en máquina (nivel 10).' }),
    X('sq4', 9, 'sentadilla', 'Prensa de piernas', 'sq3', { n: [10, 15], series: 3, kg: [30, 40, 50, 60, 70, 80, 90, 100], mat: ['gym'], rodilla: true,
      que: 'Fortalece los muslos y los glúteos con la espalda apoyada: una forma segura de cargar piernas.', posicion: 'Sentada en la máquina con la espalda y la cabeza apoyadas, pies a la anchura de las caderas en la plataforma.',
      ejecucion: 'Empuja la plataforma hasta estirar las piernas casi del todo (sin bloquear las rodillas) y vuelve despacio hasta unos 90° de rodilla.',
      parar: PC + ', dolor fuerte en la rodilla.', errores: 'Bloquear las rodillas, despegar la espalda del respaldo o bajar tanto que se levante la cadera.', facil: 'Menos peso o menos recorrido.', progresion: 'Sentadilla con barra a caja (nivel 10).' }),
    X('ba4', 9, 'bisagra', 'Peso muerto con mancuerna elevada', 'ba3', { n: [6, 10], series: 3, kg: [10, 12, 14, 16, 18, 20, 24], mat: ['gym'], fisio: true,
      que: 'Peso muerto con carga moderada desde una altura cómoda: aprendes a levantar del suelo con la espalda recta.',
      posicion: 'De pie con una mancuerna o kettlebell pesada sobre un banco bajo o bloques, a la altura de las espinillas; pies a la anchura de las caderas.',
      ejecucion: 'Lleva la cadera atrás, agarra la pesa con la espalda recta y sube empujando el suelo con los pies y la cadera hacia delante. Baja con la misma bisagra.',
      parar: PT + '.', errores: 'Tirar con la espalda o redondearla al agarrar.', facil: 'Desde una altura mayor o con menos peso.', progresion: 'Peso muerto con barra desde bloques (nivel 10).' }),
    X('ht1', 9, 'cadera', 'Empuje de cadera con banco', 'ch1', { n: [8, 12], series: 3, kg: [0, 4, 6, 8, 10], mat: ['mancuernas'],
      que: 'Fortalece mucho los glúteos, que sostienen la cadera y la espalda al caminar y levantarte.', posicion: 'Apoya la espalda alta en el borde de un banco, pies en el suelo a la anchura de las caderas y, con carga, la mancuerna apoyada sobre la cadera.',
      ejecucion: 'Sube la cadera apretando los glúteos hasta que el cuerpo quede recto de rodillas a hombros. Baja despacio sin tocar el suelo.',
      errores: 'Arquear la espalda baja al subir.', facil: 'Puente de glúteos en el suelo.', progresion: 'Empuje de cadera con barra (nivel 10).' }),
    X('bq2', 9, 'equilibrio', 'Caminar talón-punta junto a la pared', 'bq1', { n: [6, 10], lado: false, rodilla: true,
      que: 'Mejora el equilibrio dinámico al caminar con una base más estrecha.', posicion: 'De pie junto a una pared, con una mano rozándola.',
      ejecucion: 'Camina poniendo el talón de un pie justo delante de la punta del otro, mirando al frente. Cuenta cada paso como una repetición.',
      respiracion: 'Respira con normalidad.', parar: 'mareo, pérdida de equilibrio o ' + PC + '.', errores: 'Mirar al suelo o ir deprisa.', facil: 'Pasos más separados.', progresion: 'Sin tocar la pared, con alguien al lado.' }),

    /* ===== NIVEL 10 · Gimnasio II (barra con ayuda) ===== */
    X('pr3', 10, 'empuje', 'Press de hombros de pie con mancuernas', 'pr0', { n: [8, 10], series: 3, kg: [4, 5, 6, 8, 10, 12], mat: ['gym'], fisio: true,
      que: 'Empuje por encima de la cabeza de pie: fuerza de hombros y de todo el tronco.', posicion: 'De pie, pies a la anchura de las caderas, glúteos y tripa firmes, costillas “abajo”, mancuernas a la altura de los hombros.',
      ejecucion: 'Empuja las mancuernas hacia arriba sin arquear la espalda baja y baja despacio. Si la espalda baja se arquea, hazlo sentada con respaldo.',
      parar: PT + ', dolor en el hombro.', errores: 'Arquear la zona lumbar para subir el peso.', facil: 'Press sentada con respaldo.', progresion: 'Press militar con barra (nivel 11).' }),
    X('tr4', 10, 'tiron', 'Remo en máquina con apoyo en el pecho', 'tr3', { n: [8, 12], series: 3, kg: [20, 25, 30, 35, 40, 45, 50], mat: ['gym'],
      que: 'Fortalece la espalda con el pecho apoyado, sin cargar la zona lumbar.', posicion: 'Sentada con el pecho apoyado en la almohadilla y las manos en los agarres.',
      ejecucion: 'Tira de los agarres llevando los codos atrás y junta los omóplatos; vuelve despacio.', errores: 'Encoger los hombros o dar tirones.', facil: 'Menos peso.', progresion: 'Remo con barra inclinado (nivel 11).' }),
    X('sq5', 10, 'sentadilla', 'Sentadilla con barra a una caja', 'sq4', { n: [6, 10], series: 3, kg: [20, 25, 30, 35, 40, 45, 50], mat: ['gym'], rodilla: true, fisio: true,
      que: 'Sentadilla con barra sobre la espalda, parando en una caja para controlar la profundidad.', posicion: 'Barra apoyada en la parte alta de la espalda dentro de un rack con topes de seguridad, de espaldas a una caja baja.',
      ejecucion: 'Lleva la cadera atrás y baja hasta rozar la caja con el pecho alto y la espalda recta. Sube empujando el suelo con los pies.',
      parar: PT + ', dolor fuerte en la rodilla.', errores: 'Dejarte caer en la caja, redondear la espalda o hacerlo sin rack ni topes.', facil: 'Sentadilla copa con mancuerna.', progresion: 'Sentadilla con barra (nivel 11).' }),
    X('ba5', 10, 'bisagra', 'Peso muerto con barra desde bloques', 'ba4', { n: [5, 8], series: 3, kg: [30, 35, 40, 45, 50], mat: ['gym'], fisio: true,
      que: 'Peso muerto con barra desde una altura cómoda (bloques), con la técnica ya aprendida.', posicion: 'Barra con discos sobre bloques a unos 20-25 cm del suelo, pies bajo la barra a la anchura de las caderas.',
      ejecucion: 'Lleva la cadera atrás, agarra la barra con la espalda recta y los brazos estirados, y sube empujando el suelo. Baja con la misma bisagra, la barra pegada a las piernas.',
      parar: PT + '.', errores: 'Tirar de la barra con la espalda o dejarla lejos del cuerpo.', facil: 'Peso muerto con mancuerna elevada.', progresion: 'Peso muerto convencional desde el suelo (nivel 11).' }),
    X('ht2', 10, 'cadera', 'Empuje de cadera con barra', 'ht1', { n: [8, 12], series: 3, kg: [20, 30, 40, 50, 60], mat: ['gym'],
      que: 'Gran ejercicio de glúteos con más carga, con la espalda apoyada y bajo riesgo para la columna.', posicion: 'Espalda alta en el borde de un banco y la barra con una almohadilla sobre la cadera.',
      ejecucion: 'Sube la cadera apretando los glúteos hasta que el cuerpo quede recto, aguanta 1 segundo y baja despacio.', errores: 'Arquear la espalda baja arriba.', facil: 'Empuje de cadera con mancuerna.', progresion: 'Más carga.' }),
    X('cg3', 10, 'carga', 'Paseo del granjero pesado', 'cg2', { n: [20, 40], timed: 1, series: 3, kg: [12, 14, 16, 18, 20, 24], mat: ['gym'],
      que: 'Cargar peso de verdad caminando: agarre, espalda, hombros y piernas.', posicion: 'Una mancuerna o kettlebell pesada en cada mano a los lados, de pie en un pasillo despejado.',
      ejecucion: 'Camina despacio, alta y firme, con pasos cortos. Deja las pesas doblando las rodillas, no la espalda.', respiracion: 'Respira con normalidad.', errores: 'Ir deprisa o inclinarte.', facil: 'Menos peso.', progresion: 'Paseo del granjero: carga alta.' }),
    X('zn2', 10, 'escalon', 'Zancada atrás con apoyo', 'zn1', { n: [6, 10], lado: true, kg: [0, 2, 4, 6, 8, 10], mat: ['mancuernas'], rodilla: true,
      que: 'Fortalece piernas y glúteos y mejora el equilibrio en un paso, con apoyo.', posicion: 'De pie junto a la encimera con una mano apoyada.',
      ejecucion: 'Da un paso atrás y baja la rodilla de atrás hacia el suelo sin tocarlo, con el tronco alto. Vuelve empujando con la pierna de delante. Haz todas con una pierna y luego con la otra.',
      parar: 'dolor fuerte en la rodilla, mareo o ' + PC + '.', errores: 'Inclinar el tronco o que la rodilla de delante se vaya hacia dentro.', facil: 'Un paso más corto o menos bajada.', progresion: 'Sentadilla dividida con mancuernas.' }),

    /* ===== NIVEL 11 · Gimnasio III (básicos libres) ===== */
    X('pr4', 11, 'empuje', 'Press de banca con barra', 'pr2', { n: [6, 10], series: 3, kg: [20, 22.5, 25, 30, 35, 40, 45, 50], mat: ['gym'], fisio: true,
      que: 'El empuje básico del gimnasio: pecho, hombros y tríceps.', posicion: 'Tumbada en el banco con los pies en el suelo, siempre con alguien que te asegure o con topes de seguridad.',
      ejecucion: 'Baja la barra con control hasta rozar el pecho y empuja hacia arriba hasta estirar los brazos.', parar: PC + ', dolor en el hombro.', errores: 'Arquear mucho la espalda, rebotar la barra o hacerlo sin seguro.', facil: 'Press con mancuernas.', progresion: 'Más carga, poco a poco.' }),
    X('pr5', 11, 'empuje', 'Press militar con barra (de pie)', 'pr3', { n: [5, 8], series: 3, kg: [10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30], mat: ['gym'], fisio: true,
      que: 'El press militar clásico: fuerza de hombros y de todo el tronco.', posicion: 'De pie, barra a la altura de la clavícula, glúteos y tripa firmes, costillas “abajo”.',
      ejecucion: 'Empuja la barra hacia arriba pasando cerca de la cara, sin arquear la espalda baja, y baja despacio.', parar: PT + ', dolor en el hombro.', errores: 'Arquear la zona lumbar para subir la barra.', facil: 'Press de pie con mancuernas o sentada con respaldo.', progresion: 'Press militar: carga alta.' }),
    X('tr5', 11, 'tiron', 'Remo con barra inclinado', 'tr4', { n: [6, 10], series: 3, kg: [20, 25, 30, 35, 40, 45], mat: ['gym'], fisio: true,
      que: 'Remo con barra desde una bisagra de cadera: espalda y agarre fuertes.', posicion: 'De pie, bisagra de cadera con el tronco inclinado unos 45° y la barra colgando.',
      ejecucion: 'Tira de la barra hacia el ombligo, juntando los omóplatos, y baja con control manteniendo el tronco quieto.', parar: PT + '.', errores: 'Redondear la espalda o incorporarte para subir la barra.', facil: 'Remo en máquina con apoyo.', progresion: 'Más carga.' }),
    X('ba6', 11, 'bisagra', 'Peso muerto convencional', 'ba5', { n: [5, 8], series: 3, kg: [40, 45, 50, 55, 60], mat: ['gym'], fisio: true,
      que: 'El peso muerto desde el suelo: el ejercicio de fuerza más completo para glúteos, piernas y espalda.', posicion: 'Barra sobre el suelo pegada a las espinillas, pies a la anchura de las caderas, manos fuera de las rodillas.',
      ejecucion: 'Aprieta la tripa, espalda recta, y sube empujando el suelo con las piernas hasta quedar de pie. Baja con la bisagra de cadera, la barra pegada a las piernas.',
      parar: PT + '.', errores: 'Despegar primero la cadera y luego las piernas, o redondear la espalda.', facil: 'Desde bloques.', progresion: 'Peso muerto: carga alta.' }),
    X('sq6', 11, 'sentadilla', 'Sentadilla con barra', 'sq5', { n: [5, 8], series: 3, kg: [30, 35, 40, 45, 50, 55, 60], mat: ['gym'], rodilla: true, fisio: true,
      que: 'La sentadilla básica con barra: piernas, glúteos y tronco fuertes.', posicion: 'Barra en la parte alta de la espalda dentro de un rack con topes de seguridad.',
      ejecucion: 'Baja con la cadera atrás y el pecho alto hasta donde mantengas la espalda recta y sube empujando el suelo.', parar: PT + ', dolor fuerte en la rodilla.', errores: 'Hacerlo sin rack, dejar que las rodillas se vayan hacia dentro o redondear la espalda.', facil: 'Sentadilla con barra a caja.', progresion: 'Sentadilla con barra: carga alta.' }),
    X('zn3', 11, 'escalon', 'Sentadilla dividida con mancuernas', 'zn2', { n: [6, 10], lado: true, kg: [6, 8, 10, 12, 14, 16], mat: ['gym'], rodilla: true,
      que: 'Fuerza y equilibrio en una pierna cada vez, con carga.', posicion: 'Un pie delante y otro detrás, a un paso largo, una mancuerna en cada mano y una mano libre cerca de un apoyo.',
      ejecucion: 'Baja recto hasta que la rodilla de atrás casi roce el suelo y sube empujando con el pie de delante. Haz todas con una pierna y luego con la otra.', parar: 'dolor fuerte en la rodilla, mareo o ' + PC + '.', errores: 'Inclinar el tronco o dar un paso demasiado corto.', facil: 'Zancada atrás con apoyo.', progresion: 'Más carga.' }),

    /* ===== NIVEL 12 · Sin techo: más kilos, poco a poco ===== */
    X('pr6', 12, 'empuje', 'Press militar con barra: carga alta', 'pr5', { n: [3, 6], series: 3, kg: [30, 32.5, 35, 37.5, 40, 42.5, 45], mat: ['gym'], fisio: true, 
      que: 'Más fuerza de hombros y tronco con cargas mayores, subiendo muy despacio.', posicion: 'Igual que el press militar con barra.', ejecucion: 'Igual que el press militar con barra, con la técnica siempre por delante del peso.', parar: PT + ', dolor en el hombro.', errores: 'Arquear la espalda.', facil: 'Vuelve a la carga anterior.', progresion: 'Mantener y disfrutar de lo conseguido.' }),
    X('ba7', 12, 'bisagra', 'Peso muerto: carga alta', 'ba6', { n: [3, 5], series: 3, kg: [60, 65, 70, 75, 80], mat: ['gym'], fisio: true, 
      que: 'Más fuerza con cargas altas, subiendo con mucha paciencia.', posicion: 'Igual que el peso muerto convencional.', ejecucion: 'Igual que el peso muerto convencional, con la técnica siempre por delante del peso.', parar: PT + '.', errores: 'Perder la espalda recta en las últimas repeticiones.', facil: 'Vuelve a la carga anterior.', progresion: 'Mantener y disfrutar de lo conseguido.' }),
    X('sq7', 12, 'sentadilla', 'Sentadilla con barra: carga alta', 'sq6', { n: [3, 6], series: 3, kg: [60, 65, 70, 75, 80, 85, 90], mat: ['gym'], rodilla: true, fisio: true, 
      que: 'Más fuerza de piernas y glúteos con cargas altas, subiendo con mucha paciencia.', posicion: 'Igual que la sentadilla con barra, dentro del rack.', ejecucion: 'Igual que la sentadilla con barra, con la técnica por delante del peso.', parar: PT + ', dolor fuerte en la rodilla.', errores: 'Perder la técnica en las últimas repeticiones.', facil: 'Vuelve a la carga anterior.', progresion: 'Mantener y disfrutar de lo conseguido.' }),
    X('cg4', 12, 'carga', 'Paseo del granjero: carga alta', 'cg3', { n: [20, 40], timed: 1, series: 3, kg: [24, 26, 28, 30, 32], mat: ['gym'], descanso: 90,
      que: 'Cargar mucho peso caminando: agarre, espalda y piernas.', posicion: 'Una mancuerna o kettlebell pesada en cada mano.', ejecucion: 'Camina con pasos cortos, alta y firme.', respiracion: 'Respira con normalidad.', errores: 'Ir deprisa o inclinarte.', facil: 'Menos peso.', progresion: 'Mantener.' })
  ];
  const BARRA = ['pr4', 'pr5', 'pr6', 'tr5', 'ba5', 'ba6', 'ba7', 'sq5', 'sq6', 'sq7', 'ht2'];
  const PESADOS = ['pr4', 'pr5', 'pr6', 'ba5', 'ba6', 'ba7', 'sq5', 'sq6', 'sq7'];
  L.forEach(e => {
    if (BARRA.indexOf(e.id) >= 0) { e.barra = true; e.dosis += ' Los kilos son el peso TOTAL, incluida la barra.'; }
    if (PESADOS.indexOf(e.id) >= 0) e.descanso = e.nivel >= 12 ? 150 : 120;
    if (e.kg) e.dosis += ' Si dudas de la técnica o notas algo raro, baja el peso: la técnica va primero.';
    e.min = calcMin(e); EJERCICIOS.push(e);
  });
})();

/* ===== animaciones de los niveles 6-12 ===== */
(function (G) {
  'use strict';
  const A = G.ANIMS, { P, S } = G.Anim, K = (t, hold, cap, pose, hi) => ({ t, hold, cap, pose, hi: hi || [] });
  const W = (a, wt, wf) => Object.assign({}, a, { kf: a.kf.map(k => Object.assign({}, k, { pose: Object.assign({}, k.pose, { wt: wt, wf: wf || 0 }) })) });
  const wp = (o, wt, wf) => Object.assign(o, { wt: wt || 0, wf: wf || 0 });
  const chair = (o) => [S.chair(110, o || {})], counter = () => [S.counter(166)], bar = () => [S.bar(60, 240, 82)];
  const sit = (o, wt, wf) => wp(P.sit(o), wt, wf), st = (o, wt, wf) => wp(P.stand(o), wt, wf), fr = (o, wt) => wp(P.front(Object.assign({ nhx: 172, nhy: 81, fhx: 128, fhy: 81, ednx: 1, edny: 0.4, edfx: -1, edfy: 0.4 }, o)), wt);
  const SH = { arm: [2, 52] };

  /* agarre */
  const grip = (cap1, cap2, hold) => ({ view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 500, 'Sentada, con el antebrazo apoyado en el muslo y el ejercitador en la mano.', sit({ nhx: 134, nhy: 112 }, 1)),
    K(700, hold, cap1, sit({ nhx: 134, nhy: 112 }, 1), ['na']),
    K(900, 300, cap2, sit({ nhx: 134, nhy: 112 }, 1))] });
  A.ag1 = grip('Aprieta hasta cerrarlo.', 'Ábrelo despacio, sin soltarlo de golpe.', 500);
  A.ag2 = grip('Cierra y aguanta 5 segundos respirando con normalidad.', 'Ábrelo despacio.', 3500);

  /* brazos, sentada */
  A.br1 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 500, 'Sentada con la espalda apoyada y una pesa en cada mano.', sit({ nhr: [2, 52], fhr: [1, 52] }, 1, 1)),
    K(1300, 500, 'Sube los dos brazos estirados hasta la altura de los hombros.', sit({ nhr: [50, 0], fhr: [48, 0], ednx: 0, edny: 1, edfx: 0, edfy: 1 }, 1, 1), ['na', 'fa']),
    K(2000, 300, 'Baja despacio, contando 3.', sit({ nhr: [2, 52], fhr: [1, 52] }, 1, 1))] };
  A.br2 = { view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 500, 'Sentada, brazos estirados junto al cuerpo.', sit({ nhr: [2, 52], fhr: [1, 52] }, 1, 1)),
    K(1200, 400, 'Dobla los codos subiendo las pesas hacia los hombros, sin mover los codos.', sit({ nhr: [24, -12], fhr: [22, -12], ednx: -0.3, edny: 1, edfx: -0.3, edfy: 1 }, 1, 1), ['na', 'fa']),
    K(1800, 300, 'Baja despacio.', sit({ nhr: [2, 52], fhr: [1, 52] }, 1, 1))] };
  const pressSit = (wt, cap) => ({ view: 'side', cycle: true, scene: chair(), kf: [
    K(0, 500, cap || 'Sentada con la espalda pegada al respaldo, mancuernas a la altura de los hombros.', sit({ nhr: [10, 2], fhr: [8, 2], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 1, 1)),
    K(1300, 500, 'Empuja hacia arriba sin arquear la espalda.', sit({ nhr: [4, -50], fhr: [2, -50], ednx: -0.3, edny: 0.2, edfx: -0.3, edfy: 0.2 }, 1, 1), ['na', 'fa']),
    K(1800, 300, 'Baja despacio hasta los hombros.', sit({ nhr: [10, 2], fhr: [8, 2], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 1, 1))] });
  A.pr1 = pressSit(1); A.pr0 = pressSit(1);
  A.pr3 = { view: 'side', cycle: true, scene: [], kf: [
    K(0, 500, 'De pie, glúteos y tripa firmes, mancuernas a la altura de los hombros.', st({ nhr: [12, 4], fhr: [10, 4], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 1, 1)),
    K(1400, 500, 'Empuja hacia arriba sin arquear la espalda baja.', st({ nhr: [4, -50], fhr: [2, -50], ednx: -0.3, edny: 0.2, edfx: -0.3, edfy: 0.2 }, 1, 1), ['na', 'fa', 'core']),
    K(1800, 300, 'Baja con control.', st({ nhr: [12, 4], fhr: [10, 4], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 1, 1))] };
  A.pr5 = { view: 'side', cycle: true, scene: [], kf: [
    K(0, 500, 'De pie, barra a la altura de la clavícula, glúteos y tripa firmes.', st({ nhr: [12, 4], fhr: [12, 4], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 2)),
    K(1500, 500, 'Empuja la barra hacia arriba sin arquear la espalda baja.', st({ nhr: [4, -52], fhr: [4, -52], ednx: -0.3, edny: 0.2, edfx: -0.3, edfy: 0.2 }, 2), ['na', 'fa', 'core']),
    K(2000, 300, 'Baja la barra con control.', st({ nhr: [12, 4], fhr: [12, 4], ednx: -0.5, edny: 1, edfx: -0.5, edfy: 1 }, 2))] };
  A.pr6 = A.pr5;
  /* press en banco */
  const bench = () => [S.bench(30, 205, 160)];
  const lieB = (o, wt, wf) => wp(P.lie(Object.assign({ hx: 150, hy: 151, t: -90, nax: 200, nay: 166, fax: 206, fay: 166, kdnx: 0.2, kdny: -1, kdfx: 0.2, kdfy: -1 }, o)), wt, wf);
  const benchPress = (wt, wf, hold) => ({ view: 'side', cycle: true, scene: bench(), kf: [
    K(0, 500, 'Tumbada en el banco, pies en el suelo y las pesas sobre el pecho (con ayuda).', lieB({ nhr: [0, -50], fhr: [0, -50], ednx: 0, edny: 0, edfx: 0, edfy: 0 }, wt, wf)),
    K(1500, 300, 'Baja las pesas con control hasta el pecho.', lieB({ nhr: [3, -26], fhr: [2, -26], ednx: 0.9, edny: 0.7, edfx: 0.9, edfy: 0.7 }, wt, wf), ['na', 'fa']),
    K(1200, 300, 'Empuja hacia arriba hasta estirar los brazos.', lieB({ nhr: [0, -50], fhr: [0, -50], ednx: 0, edny: 0, edfx: 0, edfy: 0 }, wt, wf), ['na', 'fa', 'core'])] });
  A.pr2 = benchPress(1, 1); A.pr4 = benchPress(2, 0);

  /* tirón */
  A.tr1 = { view: 'front', cycle: true, scene: [], kf: [
    K(0, 500, 'De pie, con la banda entre las manos, brazos al frente.', fr({ nhr: [9, 10], fhr: [-9, 10], ednx: 0.4, edny: 1, edfx: -0.4, edfy: 1 }, 3)),
    K(1300, 500, 'Separa las manos hacia los lados juntando los omóplatos.', fr({ nhr: [44, 8], fhr: [-44, 8], ednx: 0.5, edny: 0.5, edfx: -0.5, edfy: 0.5 }, 3), ['na', 'fa']),
    K(1500, 300, 'Vuelve despacio.', fr({ nhr: [9, 10], fhr: [-9, 10], ednx: 0.4, edny: 1, edfx: -0.4, edfy: 1 }, 3))] };
  const hing = o => st(Object.assign({ hx: 120, hy: 91, t: 42, nax: 142, nay: 166, fax: 147, fay: 166, kdnx: 1, kdny: 0.2, kdfx: 1, kdfy: 0.2 }, o));
  A.tr2 = { view: 'side', cycle: true, scene: counter(), kf: [
    K(0, 500, 'Una mano apoyada en la encimera, cadera atrás, espalda recta. La pesa cuelga.', hing({ nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [1, 52], edfx: -1, edfy: 0.4 }, 0, 1)),
    K(1200, 400, 'Tira del codo hacia la cadera, sin girar el tronco.', hing({ nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [-10, 6], edfx: -1, edfy: 0.1 }, 0, 1), ['fa']),
    K(1500, 300, 'Baja la pesa despacio.', hing({ nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [1, 52], edfx: -1, edfy: 0.4 }, 0, 1))] };
  A.tr3 = { view: 'side', cycle: true, scene: chair({ noback: true }), kf: [
    K(0, 500, 'Sentada con los muslos sujetos y la barra sobre la cabeza.', sit({ nhr: [14, -50], fhr: [12, -50], ednx: -0.3, edny: 0.2, edfx: -0.3, edfy: 0.2 }, 1, 1)),
    K(1400, 400, 'Tira de la barra hacia la parte alta del pecho, codos abajo y atrás.', sit({ nhr: [16, 6], fhr: [14, 6], ednx: -1, edny: 0.6, edfx: -1, edfy: 0.6 }, 1, 1), ['na', 'fa', 'core']),
    K(1800, 300, 'Sube despacio hasta estirar los brazos.', sit({ nhr: [14, -50], fhr: [12, -50], ednx: -0.3, edny: 0.2, edfx: -0.3, edfy: 0.2 }, 1, 1))] };
  A.tr4 = { view: 'side', cycle: true, scene: chair().concat(['<rect x="118" y="58" width="6" height="44" rx="3" class="propf dark"/>']), kf: [
    K(0, 500, 'Sentada con el pecho apoyado en la almohadilla, agarres delante.', sit({ nhr: [46, 8], fhr: [44, 8], ednx: 0, edny: 1, edfx: 0, edfy: 1 }, 1, 1)),
    K(1400, 400, 'Tira de los agarres llevando los codos atrás y junta los omóplatos.', sit({ nhr: [8, 10], fhr: [6, 10], ednx: -1, edny: 0.3, edfx: -1, edfy: 0.3 }, 1, 1), ['na', 'fa']),
    K(1800, 300, 'Vuelve despacio.', sit({ nhr: [46, 8], fhr: [44, 8], ednx: 0, edny: 1, edfx: 0, edfy: 1 }, 1, 1))] };
  A.tr5 = { view: 'side', cycle: true, scene: [], kf: [
    K(0, 500, 'Bisagra de cadera, espalda recta y la barra colgando.', hing({ t: 45, nhr: [1, 52], fhr: [1, 52], edfx: -1, edfy: 0.4, ednx: -1, edny: 0.4 }, 2)),
    K(1300, 400, 'Tira de la barra hacia el ombligo, juntando los omóplatos.', hing({ t: 45, nhr: [-4, 12], fhr: [-4, 12], ednx: -1, edny: 0.1, edfx: -1, edfy: 0.1 }, 2), ['na', 'fa', 'core']),
    K(1600, 300, 'Baja con control, el tronco quieto.', hing({ t: 45, nhr: [1, 52], fhr: [1, 52], edfx: -1, edfy: 0.4, ednx: -1, edny: 0.4 }, 2))] };

  /* sentadillas con peso (reaprovecha el levantarse de la silla) */
  const chestW = a => Object.assign({}, a, { kf: a.kf.map(k => Object.assign({}, k, { pose: Object.assign({}, k.pose, { wt: 1 }) })) });
  A.sq1 = chestW(A.s5); A.sq2 = chestW(A.s4); A.sq3 = chestW(A.s4);
  const rack = (open) => [S.chair(110, { noback: true, high: false })];
  /* prensa de piernas */
  const prensa = o => wp(P.sit(Object.assign({ hx: 92, hy: 138, t: -50, nhr: [8, 34], fhr: [8, 34], nax: 170, nay: 104, fax: 174, fay: 108, kdnx: 0.3, kdny: -1, kdfx: 0.3, kdfy: -1, ffa: 0, nfa: 0 }, o)), 4);
  A.sq4 = { view: 'side', cycle: true, scene: ['<line x1="40" y1="116" x2="100" y2="152" class="prop thick"/><line x1="100" y1="152" x2="104" y2="164" class="prop"/><line x1="44" y1="120" x2="44" y2="166" class="prop"/>'], kf: [
    K(0, 500, 'Sentada con la espalda y la cabeza apoyadas, pies en la plataforma.', prensa({ nax: 132, nay: 112, fax: 136, fay: 116 })),
    K(1400, 400, 'Empuja la plataforma hasta estirar las piernas casi del todo, sin bloquear las rodillas.', prensa({}), ['nl', 'fl']),
    K(1800, 300, 'Vuelve despacio hasta unos 90° de rodilla.', prensa({ nax: 132, nay: 112, fax: 136, fay: 116 }))] };
  const sqBar = (cap0) => ({ view: 'side', cycle: true, scene: chair({ noback: true }), kf: [
    K(0, 600, cap0, st({ hx: 140, hy: 85, nhr: [-8, -2], fhr: [-8, -2], ednx: -0.5, edny: 0.8, edfx: -0.5, edfy: 0.8 }, 2)),
    K(1400, 300, 'Lleva la cadera atrás y baja con el pecho alto.', st({ hx: 122, hy: 112, t: 26, nax: 142, nay: 166, fax: 147, fay: 166, kdnx: 1, kdny: 0, kdfx: 1, kdfy: 0, nhr: [-8, -2], fhr: [-8, -2], ednx: -0.5, edny: 0.8, edfx: -0.5, edfy: 0.8 }, 2), ['nl', 'fl', 'core']),
    K(1400, 200, 'Sube empujando el suelo con los pies.', st({ hx: 140, hy: 85, nhr: [-8, -2], fhr: [-8, -2], ednx: -0.5, edny: 0.8, edfx: -0.5, edfy: 0.8 }, 2), ['nl', 'fl'])] });
  A.sq5 = sqBar('De espaldas a la caja, barra en la parte alta de la espalda (con rack de seguridad).');
  A.sq6 = sqBar('Barra en la parte alta de la espalda, dentro del rack con topes de seguridad.');
  A.sq7 = A.sq6;

  /* bisagras */
  const ba = (wt, wf, bottom, caps) => ({ view: 'side', cycle: true, scene: counter(), kf: [
    K(0, 500, caps[0], st({ nhr: [2, 52], fhr: [1, 52] }, wt, wf)),
    K(1500, 500, caps[1], st(Object.assign({ hx: 118, hy: 92, t: bottom, nax: 142, fax: 147, kdnx: 1, kdny: 0.2, kdfx: 1, kdfy: 0.2, nhr: [1, 52], fhr: [1, 52] }), wt, wf), ['core', 'nl', 'fl']),
    K(1500, 300, caps[2], st({ nhr: [2, 52], fhr: [1, 52] }, wt, wf), ['nl', 'fl'])] });
  const stand0 = ['De pie, pies a la anchura de las caderas, rodillas un poco flexionadas.', 'Lleva la cadera hacia atrás, el tronco se inclina con la espalda recta.', 'Sube empujando el suelo y la cadera hacia delante.'];
  A.ba1 = ba(0, 0, 38, stand0);
  A.ba2 = ba(1, 1, 38, stand0);
  A.ba3 = ba(1, 1, 45, ['De pie con las mancuernas delante de los muslos.', 'Cadera atrás, las pesas bajan pegadas a las piernas, espalda recta.', 'Sube empujando la cadera hacia delante.']);
  A.ba4 = ba(1, 1, 52, ['De pie con la mancuerna pesada sobre un banco bajo, a la altura de las espinillas.', 'Cadera atrás, agarra la pesa con la espalda recta.', 'Sube empujando el suelo con los pies y la cadera.']);
  const dead = (cap) => ({ view: 'side', cycle: true, scene: [], kf: [
    K(0, 600, cap[0], st({ hx: 118, hy: 100, t: 55, nax: 142, fax: 147, kdnx: 1, kdny: 0.2, kdfx: 1, kdfy: 0.2, nhr: [0, 52], fhr: [0, 52] }, 2)),
    K(1600, 400, cap[1], st({ hx: 132, hy: 88, t: 38, nax: 142, fax: 147, nhr: [0, 52], fhr: [0, 52] }, 2), ['nl', 'fl', 'core']),
    K(1000, 800, cap[2], st({ hx: 140, hy: 85, t: 0, nhr: [2, 52], fhr: [1, 52] }, 2), ['nl', 'fl']),
    K(1800, 300, 'Baja con la misma bisagra, la barra pegada a las piernas.', st({ hx: 118, hy: 100, t: 55, nax: 142, fax: 147, kdnx: 1, kdny: 0.2, kdfx: 1, kdfy: 0.2, nhr: [0, 52], fhr: [0, 52] }, 2))] });
  A.ba5 = dead(['Barra sobre bloques, espalda recta, cadera atrás.', 'Empuja el suelo con los pies; la barra sube pegada a las piernas.', 'De pie, hombros atrás, sin arquear la espalda.']);
  A.ba6 = dead(['Barra en el suelo pegada a las espinillas, espalda recta.', 'Empuja el suelo con las piernas; la barra sube pegada al cuerpo.', 'De pie, hombros atrás, sin arquear la espalda.']);
  A.ba7 = A.ba6;

  /* glúteo */
  const hip = (o, wt) => wp(P.lie(Object.assign({ nax: 150, nay: 166, fax: 154, fay: 166, kdnx: 0.2, kdny: -1, kdfx: 0.2, kdfy: -1, nhx: 112, nhy: 100, fhx: 112, fhy: 100 }, o)), wt);
  const thrust = (wt) => ({ view: 'side', cycle: true, scene: ['<rect x="34" y="132" width="44" height="7" rx="3" class="propf dark"/><line x1="42" y1="139" x2="42" y2="166" class="prop"/><line x1="70" y1="139" x2="70" y2="166" class="prop"/>'], kf: [
    K(0, 500, 'Espalda alta en el borde del banco, pies en el suelo.', hip({ hx: 108, hy: 152, t: -62, nhx: 108, nhy: 144, fhx: 108, fhy: 144 }, wt)),
    K(1300, 700, 'Sube la cadera apretando los glúteos hasta quedar recta de rodillas a hombros.', hip({ hx: 110, hy: 118, t: -88, nhx: 110, nhy: 112, fhx: 110, fhy: 112 }, wt), ['nl', 'fl']),
    K(1500, 300, 'Baja despacio.', hip({ hx: 108, hy: 152, t: -62, nhx: 108, nhy: 144, fhx: 108, fhy: 144 }, wt))] });
  A.ht1 = thrust(1); A.ht2 = thrust(2);
  A.ch1 = A.h3;

  /* tronco */
  A.co1 = { view: 'side', cycle: true, scene: [S.wall(212)], kf: [
    K(0, 500, 'De pie frente a la pared, a un paso, manos a la altura de los hombros.', st({ hx: 134, hy: 85, t: 6, nax: 130, fax: 134, nhx: 196, nhy: 52, fhx: 194, fhy: 52, ednx: 0, edny: 1, edfx: 0, edfy: 1 })),
    K(1300, 3500, 'Inclínate con el cuerpo recto como una tabla, tripa suave, y aguanta respirando.', st({ hx: 141, hy: 87, t: 16, nax: 118, fax: 122, nhx: 205, nhy: 54, fhx: 203, fhy: 54, ednx: 0, edny: 1, edfx: 0, edfy: 1 }), ['core']),
    K(1300, 200, 'Vuelve a la posición inicial.', st({ hx: 134, hy: 85, t: 6, nax: 130, fax: 134, nhx: 196, nhy: 52, fhx: 194, fhy: 52, ednx: 0, edny: 1, edfx: 0, edfy: 1 }))] };
  A.co2 = { view: 'side', cycle: true, scene: ['<line x1="258" y1="30" x2="258" y2="172" class="prop thick"/>'], kf: [
    K(0, 500, 'De pie, de lado al anclaje de la banda, manos pegadas al pecho.', st({ nhr: [16, 22], fhr: [14, 22], ednx: -0.3, edny: 1, edfx: -0.3, edfy: 1 }, 3)),
    K(1300, 2000, 'Estira los brazos al frente y resiste que la banda te gire. (Visto de lado.)', st({ nhr: [52, 20], fhr: [50, 20], ednx: 0, edny: 1, edfx: 0, edfy: 1 }, 3), ['core', 'na', 'fa']),
    K(1300, 200, 'Vuelve al pecho.', st({ nhr: [16, 22], fhr: [14, 22], ednx: -0.3, edny: 1, edfx: -0.3, edfy: 1 }, 3))] };
  /* la banda de Pallof se dibuja hasta el poste: se lo indicamos con una pose lejana */
  const bandToPost = a => a;

  /* equilibrio */
  A.bq1 = { view: 'front', cycle: true, scene: bar(), kf: [
    K(0, 500, 'De pie junto a la encimera con una sola mano apoyada.', fr({ fhr: [-14, 48], nax: 164, fax: 136 })),
    K(1200, 2500, 'Levanta un pie unos centímetros y mantén, mirando al frente.', fr({ hx: 156, fhr: [-14, 48], nax: 168, nay: 160, fax: 140 }), ['nl']),
    K(1200, 200, 'Apoya el pie con suavidad.', fr({ fhr: [-14, 48], nax: 164, fax: 136 }))] };
  const heel = o => st(Object.assign({ nhx: 172, nhy: 82, fhx: 170, fhy: 82, ednx: 0, edny: 1, edfx: 0, edfy: 1 }, o));
  A.bq2 = { view: 'side', cycle: true, scene: counter(), kf: [
    K(0, 500, 'De pie junto a la pared o la encimera, con una mano rozándola.', heel({ nax: 140, fax: 144 })),
    K(1100, 500, 'Pon un pie justo delante del otro: talón con punta.', heel({ hx: 146, nax: 166, fax: 130 }), ['nl']),
    K(1100, 500, 'Ahora el otro pie delante, talón con punta.', heel({ hx: 150, nax: 134, fax: 160 }), ['fl']),
    K(900, 200, 'Sigue paso a paso, mirando al frente.', heel({ nax: 140, fax: 144 }))] };

  /* cargas caminando */
  const walk = (wt, wf, cap) => ({ view: 'side', cycle: true, scene: [], kf: [
    K(0, 400, cap, st({ nax: 146, fax: 134, nhr: [2, 52], fhr: [1, 52] }, wt, wf)),
    K(1000, 100, 'Pasos cortos, cuerpo alto, hombros atrás.', st({ hx: 143, nax: 158, fax: 124, nhr: [2, 52], fhr: [1, 52] }, wt, wf), ['nl']),
    K(1000, 100, 'Sin inclinarte hacia ningún lado.', st({ hx: 143, nax: 124, fax: 158, nhr: [2, 52], fhr: [1, 52] }, wt, wf), ['fl']),
    K(1000, 100, 'Respira con normalidad.', st({ nax: 146, fax: 134, nhr: [2, 52], fhr: [1, 52] }, wt, wf))] });
  A.cg1 = walk(1, 0, 'De pie, una pesa en una mano, cuerpo recto.');
  A.cg2 = walk(1, 1, 'De pie, una pesa en cada mano, hombros atrás.');
  A.cg3 = A.cg2; A.cg4 = A.cg2;

  /* escalones y zancadas con peso */
  const stepW = (H, wt, wf, cap0) => {
    const o = x => st(Object.assign({ hx: 138, hy: 85, t: 4, nhr: [2, 52], fhr: [1, 52] }, x), wt, wf);
    return { view: 'side', cycle: true, scene: [S.step(172, H), S.rail(120, 84, 262, 84)], kf: [
      K(0, 500, cap0, o({})),
      K(1100, 200, 'Sube con un pie al escalón.', o({ nax: 186, nay: 172 - H - 6 }), ['nl']),
      K(1100, 300, 'Estira la pierna y sube el cuerpo, derecha.', o({ hx: 184, hy: 85 - H, nax: 188, nay: 172 - H - 6, fax: 168, fay: 160, ffa: 12 }), ['nl', 'fl']),
      K(1100, 200, 'Baja despacio con el mismo pie.', o({ hx: 176, hy: 85 - H + 2, nax: 188, nay: 172 - H - 6, fax: 160, fay: 166 }), ['fl']),
      K(900, 200, 'Vuelve a empezar.', o({}))] };
  };
  A.zn1 = stepW(14, 1, 1, 'De pie frente al escalón con una pesa en cada mano; barandilla cerca.');
  const lung = (o, wt, wf) => st(Object.assign({ nax: 150, nay: 166 }, o), wt, wf);
  A.zn2 = { view: 'side', cycle: true, scene: counter(), kf: [
    K(0, 500, 'De pie junto a la encimera, una mano apoyada.', lung({ nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [1, 52], nax: 140, fax: 144 }, 0, 1)),
    K(1400, 600, 'Da un paso atrás y baja la rodilla de atrás hacia el suelo, tronco alto.', lung({ hx: 128, hy: 110, nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [1, 52], nax: 152, nay: 166, fax: 98, fay: 160, kdnx: 1, kdny: 0.1, kdfx: 1, kdfy: 0.4, ffa: 20 }, 0, 1), ['nl', 'fl']),
    K(1400, 300, 'Vuelve empujando con la pierna de delante.', lung({ nhx: 172, nhy: 82, ednx: 0, edny: 1, fhr: [1, 52], nax: 140, fax: 144 }, 0, 1))] };
  A.zn3 = { view: 'side', cycle: true, scene: [], kf: [
    K(0, 500, 'Un pie delante y otro detrás, una pesa en cada mano.', lung({ hx: 128, hy: 90, nax: 152, nay: 166, fax: 98, fay: 160, kdnx: 1, kdny: 0.1, kdfx: 1, kdfy: 0.4, ffa: 20, nhr: [2, 52], fhr: [1, 52] }, 1, 1)),
    K(1400, 600, 'Baja recto hasta que la rodilla de atrás casi roce el suelo.', lung({ hx: 128, hy: 118, nax: 152, nay: 166, fax: 98, fay: 160, kdnx: 1, kdny: 0.1, kdfx: 1, kdfy: 0.4, ffa: 20, nhr: [2, 52], fhr: [1, 52] }, 1, 1), ['nl', 'fl']),
    K(1400, 300, 'Sube empujando con el pie de delante.', lung({ hx: 128, hy: 90, nax: 152, nay: 166, fax: 98, fay: 160, kdnx: 1, kdny: 0.1, kdfx: 1, kdfy: 0.4, ffa: 20, nhr: [2, 52], fhr: [1, 52] }, 1, 1))] };

  /* los ejercicios de nivel 12 reusan las animaciones de su versión base */
})(window);
