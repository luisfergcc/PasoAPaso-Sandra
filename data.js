/* Paso a Paso — contenido de referencia (genérico). Los datos de la paciente NO van aquí: se importan aparte. */
const NIVELES = {
  1: { nombre: 'Primeros pasos', emoji: '🌱', desc: 'Sentada o tumbada, con todo el apoyo. Para coger el hábito.' },
  2: { nombre: 'Cogiendo ritmo', emoji: '🌿', desc: 'Más control y más fuerza suave, todavía con mucho apoyo.' },
  3: { nombre: 'Fuerza útil', emoji: '💪', desc: 'De pie con apoyo y menos ayuda de los brazos.' },
  4: { nombre: 'Equilibrio y control', emoji: '⚖️', desc: 'Equilibrio con apoyo cercano y un escalón bajo.' },
  5: { nombre: 'Autonomía', emoji: '🏅', desc: 'Movimientos parecidos a los de tu día a día.' },
  6: { nombre: 'Primeros pesos', emoji: '🍶', desc: 'Pesas de 1 kg, banda elástica y ejercitador de agarre.', aviso: 'Pide: haber superado casi todo el nivel 5 (o al menos levantarse de la silla sin manos), sin síntomas neurológicos nuevos y con el dolor estable.' },
  7: { nombre: 'Cargas ligeras', emoji: '🏋️‍♀️', desc: 'Mancuernas de 2 a 10 kg. Sentadilla a la silla, remo y press sentada.', aviso: 'Pide: nivel 6 casi completo y mancuernas ajustables o varias parejas. Conviene que la fisioterapeuta o el médico lo hayan visto.' },
  8: { nombre: 'Patrones con peso', emoji: '🔩', desc: 'Peso muerto rumano con mancuernas, paseo del granjero, escalón con pesas.', aviso: 'Pide: nivel 7 casi completo y visto bueno profesional: la bisagra de cadera con carga mueve la zona lumbar.' },
  9: { nombre: 'Gimnasio I', emoji: '🏟️', desc: 'Máquinas y mancuernas en banco: prensa, jalón, press de pecho, empuje de cadera.', aviso: 'Pide: acceso a un gimnasio, a ser posible con un monitor que enseñe la técnica, y visto bueno profesional.' },
  10: { nombre: 'Gimnasio II', emoji: '🪝', desc: 'Primeras barras: sentadilla a caja, peso muerto desde bloques, press de pie.', aviso: 'Pide: visto bueno médico/fisio por escrito (hernia L5-S1, estenosis y espondilolistesis) y supervisión en persona.' },
  11: { nombre: 'Gimnasio III', emoji: '⛓️', desc: 'Básicos libres: press de banca, press militar, peso muerto y sentadilla con barra.', aviso: 'Pide: nivel 10 completo, visto bueno médico/fisio y alguien que te asegure en cada serie.' },
  12: { nombre: 'Sin techo', emoji: '🏆', desc: 'Más kilos, con mucha paciencia y la técnica siempre por delante.', aviso: 'Pide: llevar meses en el nivel 11 sin dolor y con revisión profesional periódica.' }
};
/* Material: lo que Sandra tiene. El cuidador lo marca en Ajustes. */
const MATERIALES = {
  pesas: ['Pesas de 1 kg', true], banda: ['Banda elástica', true], agarre: ['Ejercitador de agarre', true],
  mancuernas: ['Mancuernas más pesadas (2 kg o más)', false], gym: ['Gimnasio (máquinas, barra, rack)', false]
};
const BLOQUES = {
  resp: ['Respiración', '🫁'], tobillo: ['Tobillos y pantorrillas', '🦶'], rodilla: ['Rodillas', '🦵'], cadera: ['Caderas', '🔄'],
  core: ['Tripa y espalda baja', '🧘'], movilidad: ['Movilidad de la espalda', '↕️'], postura: ['Espalda alta', '🪑'],
  levantarse: ['Levantarse de la silla', '⬆️'], equilibrio: ['Equilibrio', '⚖️'], escalon: ['Escalones', '🪜'], calent: ['Calentamiento', '🔥'],
  agarre: ['Agarre', '✊'], brazos: ['Brazos', '💪'], tiron: ['Tirar (espalda)', '🧲'], empuje: ['Empujar (hombros y pecho)', '🙌'],
  bisagra: ['Bisagra de cadera / peso muerto', '🏗️'], sentadilla: ['Sentadilla y piernas', '🦵'], carga: ['Cargar peso caminando', '🧳']
};
const ORDEN_SESION = ['resp', 'tobillo', 'rodilla', 'cadera', 'core', 'movilidad', 'postura', 'levantarse', 'equilibrio', 'escalon'];
const ORDEN_FUERZA = ['sentadilla', 'empuje', 'bisagra', 'tiron', 'carga', 'agarre', 'brazos'];
const NIVEL_FISIO = { 3: true, 4: true, 5: true }; // niveles que piden visto bueno (modo cuidador) mientras “pedir visto bueno” esté activo

/* Señales de alarma (misma lista que MeryCon, con palabras sencillas) */
const ALARMAS = [
  { id: 'silla', nivel: 'urgente', texto: 'Se me ha dormido de forma nueva la zona íntima o entre las piernas' },
  { id: 'esfinter', nivel: 'urgente', texto: 'No controlo el pis o la caca de forma nueva, o no puedo hacer pis' },
  { id: 'episodio', nivel: 'urgente', texto: 'Se me han dormido las dos piernas de golpe o no puedo caminar' },
  { id: 'fuerza', nivel: 'urgente', texto: 'Tengo menos fuerza en una pierna que antes, o va a peor' },
  { id: 'sensib', nivel: 'hoy', texto: 'Tengo una zona grande del cuerpo dormida, nueva' },
  { id: 'miccion', nivel: 'hoy', texto: 'Me cuesta mucho empezar a hacer pis, más que antes' },
  { id: 'dolor', nivel: 'hoy', texto: 'Tengo un dolor repentino o muy distinto al de siempre' },
  { id: 'fiebre', nivel: 'hoy', texto: 'Tengo fiebre y dolor de espalda' },
  { id: 'caida', nivel: 'hoy', texto: 'Me he caído o me he dado un golpe fuerte' },
  { id: 'rodillahin', nivel: 'hoy', texto: 'Tengo la rodilla muy hinchada, caliente o no puedo apoyarla' }
];

/* Pruebas de seguimiento (cada ~2 semanas) */
const PRUEBAS = [
  { id: 'sts30', nombre: 'Levantarse de la silla (30 s)', unidad: 'veces', mejor: 'mas', como: 'Silla firme sin ruedas, pegada a la pared. Cuenta cuántas veces se levanta del todo y se sienta en 30 segundos, con los brazos cruzados sobre el pecho. Alguien al lado. Si necesita las manos, se anota “con manos” y se cuentan las veces igualmente.', extra: { key: 'brazos', label: '¿Usó las manos?', opts: ['No', 'Una mano', 'Las dos'] } },
  { id: 'sts5', nombre: '5 levantadas seguidas (tiempo)', unidad: 's', mejor: 'menos', step: 0.1, como: 'Cronometra cuánto tarda en levantarse y sentarse 5 veces seguidas, lo más rápido que pueda con seguridad.', extra: { key: 'brazos', label: '¿Usó las manos?', opts: ['No', 'Una mano', 'Las dos'] } },
  { id: 'caminata', nombre: 'Caminata continua', unidad: 'min', mejor: 'mas', como: 'Minutos que camina a su ritmo hasta tener que parar por dolor o cansancio (sin forzar). Anota si el dolor mejora al sentarse.' },
  { id: 'pie', nombre: 'Tiempo de pie', unidad: 'min', mejor: 'mas', como: 'Minutos de pie (por ejemplo cocinando) hasta necesitar sentarse o apoyarse.' },
  { id: 'piesjuntos', nombre: 'Pies juntos con apoyo ligero', unidad: 's', mejor: 'mas', max: 30, como: 'Junto a la encimera con una mano rozando. Segundos con los pies juntos (máx. 30). Parar si hay mareo.' },
  { id: 'agarre', nombre: 'Fuerza de agarre (una vez al mes)', unidad: 'cierres', mejor: 'mas', como: 'Sentada, con el codo apoyado y el ejercitador en la mano. Cuenta cuántas veces lo cierra del todo en 30 segundos con cada mano (apunta la mano más floja). Si tenéis un dinamómetro, anota mejor los kg. Compara solo con ella misma.' },
  { id: 'pesoup', nombre: 'Prueba de carga (cada mes, si hay mancuernas)', unidad: 'kg', mejor: 'mas', step: 0.5, como: 'Anota los kilos de la mancuerna más pesada con la que hace 10 repeticiones del press de hombros sentada, bien hechas y sin dolor. Solo se hace si el nivel 7 está abierto.' },
  { id: 'peso', nombre: 'Peso (una vez al mes)', unidad: 'kg', mejor: null, step: 0.1, como: 'Misma báscula, por la mañana. Solo una vez al mes: el peso cambia despacio y no es lo único que mide tu progreso.' }
];

/* ===== Base de evidencia ===== */
/* estado: 'verificado' = se leyó el resumen/ficha oficial y los datos de abajo salen de ahí.
           'localizado' = se ha comprobado que existe, pero NO se ha leído su contenido: no se usa para decidir nada. */
const EVIDENCIA = [
  { id: 'who2020', tema: 'Actividad general', estado: 'verificado', cita: 'OMS (2020). Directrices sobre actividad física y comportamiento sedentario. Bull et al., Br J Sports Med 2020.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906',
    dice: 'Adultos de 18-64 años (incluidos los que tienen enfermedades crónicas “en la medida de lo posible”): 150-300 min/semana de actividad moderada y fuerza de los grandes grupos musculares ≥2 días/semana. Limitar el tiempo sentado: cualquier movimiento, aunque sea suave, suma.',
    limites: 'Son metas poblacionales; el punto de partida de Sandra está muy lejos, por eso se avanza por pasos pequeños. El apartado de equilibrio multicomponente ≥3 días es para ≥65 años.', usa: 'Fuerza 2-3 días/semana, pausas para no estar sentada mucho rato, meta de minutos a largo plazo.' },
  { id: 'paluch2022', tema: 'Pasos', estado: 'verificado', cita: 'Paluch AE et al. Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts. Lancet Public Health 2022.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9289978',
    dice: '47.471 adultos, 15 cohortes. Frente al cuartil de menos pasos (~3.500/día), ~5.800 pasos/día se asoció a un 40 % menos de mortalidad y ~7.800 a un 45 % menos. En <60 años la ganancia se estabiliza hacia 8.000-10.000 pasos/día.',
    limites: 'Estudio observacional (no prueba causa-efecto); muchos participantes sanos; medición de una semana. No sirve para fijar una meta rígida en una persona con dolor y limitaciones.', usa: 'Idea de que “cada paso más cuenta”: se sube la meta poco a poco desde ~2.500 pasos.' },
  { id: 'hayden2021', tema: 'Dolor lumbar', estado: 'verificado', cita: 'Hayden JA et al. Exercise therapy for chronic low back pain. Cochrane Database Syst Rev 2021 (CD009790).', url: 'https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD009790.pub2/information',
    dice: 'Frente a no hacer nada o cuidados habituales, el ejercicio mejoró el dolor ~15 puntos (de 100) y la función ~7 puntos a ~3 meses. Frente a otros tratamientos conservadores la ventaja fue menor (~9 y ~4 puntos). Beneficio menor a más largo plazo. Certeza moderada/baja.',
    limites: 'Resultados medios con mucha variación entre estudios; no analiza qué tipo de ejercicio es mejor; no distingue casos con compresión nerviosa/estenosis como el de Sandra.', usa: 'Respaldo general al ejercicio terapéutico para el dolor lumbar crónico; por eso el programa es constante y no solo “reposo”.' },
  { id: 'fransen2015', tema: 'Rodilla', estado: 'verificado', cita: 'Fransen M et al. Exercise for osteoarthritis of the knee. Cochrane Database Syst Rev 2015 (CD004376).', url: 'https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004376.pub3/information',
    dice: '44 ensayos. El ejercicio redujo el dolor (~12 puntos de 100; certeza alta) y mejoró la función (~10 puntos; certeza moderada) frente a no hacer ejercicio. En análisis por subgrupos, los programas con fortalecimiento del cuádriceps/pierna mostraron los mayores efectos sobre el dolor.',
    limites: 'Son análisis de subgrupos, no recomendaciones. No se refiere a una rodilla recién infiltrada ni a una lesión de menisco concreta.', usa: 'Fortalecer muslos (extensión de rodilla, levantarse de la silla) y no evitar el movimiento por el dolor de rodilla.' },
  { id: 'fransen2014', tema: 'Cadera', estado: 'verificado', cita: 'Fransen M et al. Exercise for osteoarthritis of the hip. Cochrane Database Syst Rev 2014 (CD007912).', url: 'https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007912.pub2/information',
    dice: 'El ejercicio en tierra redujo el dolor (~8 puntos de 100) y mejoró la función (~7 puntos) al terminar, con efectos que se mantuvieron a los 3-6 meses. Certeza alta.',
    limites: 'Mejora pequeña-moderada; pocos ensayos (9).', usa: 'Ejercicios de cadera (abducción, extensión, puente) dentro de lo que no duele.' },
  { id: 'noetel2024', tema: 'Ánimo', estado: 'verificado', cita: 'Noetel M et al. Effect of exercise for depression: systematic review and network meta-analysis of randomised controlled trials. BMJ 2024;384:e075847.', url: 'https://www.bmj.com/content/384/bmj-2023-075847',
    dice: '218 estudios, 14.170 personas. Caminar/trotar, yoga, fuerza, ejercicio aeróbico mixto y tai chi/qigong redujeron los síntomas depresivos frente a controles activos. Mayor efecto con más intensidad, pero los autores señalan que la certeza es baja o muy baja; la fuerza y el yoga se abandonaron menos.',
    limites: 'Certeza baja o muy baja. El ejercicio no sustituye al tratamiento que le haya indicado su médico.', usa: 'Mensajes de ánimo y registro de cómo se siente después de pasear; no se promete “curar” nada.' },
  { id: 'walkback2024', tema: 'Caminar y espalda', estado: 'verificado', cita: 'Pocovi NC et al. Walking, education and low back pain recurrence (ensayo WalkBack). Lancet 2024;404:134-144. DOI 10.1016/S0140-6736(24)00755-4.', url: 'https://australian.physio/research/prf/translation/walkback-trial',
    dice: 'Un programa individualizado y progresivo de caminata más educación redujo un 28 % el riesgo de recaída de dolor lumbar (dato leído en la ficha de resumen).',
    limites: 'No se pudo leer el artículo completo: no tenemos verificados el tamaño de muestra ni la población exacta. Hasta donde sé, incluía personas recuperadas de un episodio de dolor lumbar, no casos con compresión nerviosa: aplicabilidad limitada y por confirmar.', usa: 'Apoyo a la idea de caminar de forma progresiva, no a una promesa de resultado.' },
  { id: 'cdc30s', tema: 'Prueba de fuerza', estado: 'verificado', cita: 'CDC STEADI. Prueba de levantarse de la silla en 30 segundos.', url: 'https://www.cdc.gov/steadi/media/pdfs/STEADI-Assessment-30Sec-508.pdf',
    dice: 'Se cuentan las levantadas completas en 30 s con los brazos cruzados; si necesita las manos, la prueba se puntúa 0. Los valores “por debajo de la media” publicados empiezan a los 60 años (mujeres 60-64: <12).',
    limites: 'Sandra tiene 54 años: no hay tabla de referencia para su edad. Se usa como comparación consigo misma en el tiempo, no contra una norma.', usa: 'Pruebas de seguimiento cada ~2 semanas (levantarse con/sin manos).' },
  { id: 'liu2022', tema: 'Fuerza progresiva', estado: 'verificado', cita: 'Liu CJ, Latham NK. Progressive resistance strength training for improving physical function in older adults. Cochrane Database Syst Rev (CD002759), versión de 2022 según la página.', url: 'https://www.cochrane.org/evidence/CD002759_progressive-resistance-strength-training-improving-physical-function-older-adults',
    dice: '121 ensayos con unos 6.700 participantes. El entrenamiento de fuerza progresivo mejoró mucho la fuerza (73 ensayos), mejoró un poco la función física (33 ensayos) y bastante el levantarse de la silla. En personas con artrosis, redujo el dolor. Los efectos adversos graves fueron raros y ninguno se atribuyó al programa; los leves (agujetas, dolor articular) aparecieron en bastantes estudios.',
    limites: 'Personas mayores (la media de edad es superior a la de Sandra); la página dice que no hay evidencia suficiente sobre riesgos a largo plazo y que los efectos adversos se registraron mal.', usa: 'Respaldo a subir la carga de forma progresiva; la app lo hace por escalones pequeños.' },
  { id: 'acsm2009p', tema: 'Cómo subir la carga', estado: 'verificado', cita: 'ACSM Position Stand: Progression models in resistance training for healthy adults. Med Sci Sports Exerc 2009 (Ratamess et al.). Leído en una copia del PDF.', url: 'https://sfu.ca/~ryand/kin343/ACSMresistance.pdf',
    dice: 'Principiantes: 2-3 días/semana con todo el cuerpo, 1-3 series de 8-12 repeticiones con cargas moderadas (empezar con 50-60 % o menos para aprender la técnica), descanso de 2-3 min en los ejercicios básicos pesados y 1-2 min en los complementarios. Regla de subida: cuando se pueden hacer 1-2 repeticiones más que el objetivo en dos sesiones seguidas, se sube la carga un 2-10 %.',
    limites: 'Para adultos sanos, no para personas con hernia discal, estenosis o dolor crónico. Se leyó el 93 % del texto (se quedó sin leer el final). La evidencia de la regla de subida es de grado B según el propio documento.', usa: 'La app sube la carga solo tras dos sesiones seguidas “bien” en la parte alta de las repeticiones, y respeta descansos de 1-2 min (más en los básicos pesados). La app no la usa para decidir qué ejercicios son seguros para Sandra.' },
  { id: 'comer2024', tema: 'Estenosis lumbar', estado: 'verificado', cita: 'Comer C et al. Exercise treatments for lumbar spinal stenosis: component analysis of RCTs. Clin Rehabil 2024 (búsquedas hasta abril de 2023). Leído en la ficha del repositorio de la universidad.', url: 'https://eprints.whiterose.ac.uk/208852/',
    dice: '13 ensayos, 1.440 participantes con claudicación neurógena. Las intervenciones con éxito solían incluir estiramientos, fuerza o musculatura del tronco, ejercicio de condición física (sobre todo bicicleta) y enfoques psicológicos; la mayoría se basaba en ejercicios de flexión lumbar. No se pudo concluir nada sobre la dosis.',
    limites: 'Pocos estudios y muy distintos entre sí; sin valoración formal de certeza. Los ejercicios de equilibrio casi no aparecían. No dice nada sobre peso muerto ni press por encima de la cabeza en estenosis.', usa: 'Apoya trabajar la fuerza del tronco y la condición física en una persona con estenosis; NO justifica cargas altas. Por eso los niveles altos exigen visto bueno profesional.' },
  { id: 'bellicha2021', tema: 'Ejercicio y peso', estado: 'verificado', cita: 'Bellicha A et al. Effect of exercise training on weight loss, body composition changes, and weight maintenance in adults with overweight or obesity: an overview of 12 systematic reviews and 149 studies. Obes Rev 2021;22(S4):e13256.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8365736',
    dice: 'El ejercicio por sí solo produce pérdidas de peso pequeñas (entre -1,5 y -3,5 kg frente a no hacer ejercicio) y reduce la grasa, también la visceral. El aeróbico quita algo más peso que la fuerza, pero la fuerza ayuda a conservar masa muscular cuando se come menos. No se halló efecto claro del ejercicio para mantener el peso.',
    limites: 'Calidad de las revisiones mayormente aceptable o baja; no se estudió obesidad severa; el promedio oculta mucha variación entre personas. Se leyó el resumen de la página.', usa: 'No se promete adelgazar con la app; el objetivo es la función. La alimentación la ve su médico o un dietista.' },
  { id: 'leong2015', tema: 'Fuerza de agarre', estado: 'verificado', cita: 'Leong DP et al. Prognostic value of grip strength: findings from the PURE study. Lancet 2015;386:266-273.', url: 'https://doi.org/10.1016/S0140-6736(14)62000-6',
    dice: 'Unas 140.000 personas de 35-70 años en 17 países, seguidas una mediana de 4 años. Por cada 5 kg menos de fuerza de agarre, el riesgo de morir por cualquier causa subió un 16 % y el de morir por causa cardiovascular un 17 %; fue mejor predictor que la presión arterial sistólica.',
    limites: 'Es una asociación, no prueba que mejorar el agarre reduzca la mortalidad (los propios autores piden más estudios). Se leyó una traducción del resumen. El texto que leí describe la asociación con cáncer en países ricos de forma contradictoria: no la usamos.', usa: 'Razón para medir el agarre una vez al mes. Se interpreta solo contra ella misma, no como pronóstico.' },
  { id: 'deadlift', tema: 'Peso muerto y espalda', estado: 'localizado', cita: 'Dos ensayos localizados en PubMed: “Effect of an Exercise Program That Includes Deadlifts on Low Back Pain” (PMID 33626500) y “Which Patients With Low Back Pain Benefit From Deadlift Training?” (PMID 25559899).', url: 'https://pubmed.ncbi.nlm.nih.gov/33626500/', dice: 'Existen ensayos sobre peso muerto en dolor lumbar (solo se vieron los títulos). No se pudo abrir ninguno: contenido NO verificado, no se afirma nada de ellos.', limites: '—', usa: 'Pendiente. Mientras tanto, las cargas altas quedan bajo supervisión profesional.' },
  { id: 'geneen2017', tema: 'Dolor crónico', estado: 'localizado', cita: 'Geneen LJ et al. Physical activity and exercise for chronic pain in adults: an overview of Cochrane Reviews. Cochrane 2017 (CD011279).', url: 'https://pubmed.ncbi.nlm.nih.gov/28087891/', dice: 'Existe (localizado). Contenido NO leído todavía.', limites: '—', usa: 'Pendiente de revisar.' },
  { id: 'nice59', tema: 'Dolor lumbar y ciática', estado: 'localizado', cita: 'NICE NG59. Low back pain and sciatica in over 16s: assessment and management.', url: 'https://www.nice.org.uk/guidance/ng59', dice: 'Existe (localizado). No se pudo abrir el texto de recomendaciones: contenido NO verificado.', limites: '—', usa: 'Pendiente de revisar.' },
];
const PRINCIPIOS = [
  ['Constancia antes que intensidad', 'who2020', 'Cualquier minuto de movimiento suma; la meta es poder hacerlo semana tras semana.'],
  ['Fuerza de piernas y glúteos 2-3 días por semana', 'who2020', 'Sentarse/levantarse, puente, cadera y pantorrillas son los bloques del programa.'],
  ['Ejercicio terapéutico para la espalda y para rodilla/cadera con artrosis', 'hayden2021', 'Se mueve dentro de lo tolerable; el reposo largo no es la estrategia.'],
  ['Caminar un poco más cada vez', 'walkback2024', 'La caminata sube poco a poco (+1 min tras 3 paseos buenos).'],
  ['El ánimo también cuenta', 'noetel2024', 'Celebrar la constancia, no los días malos.'],
  ['Subir la fuerza por escalones pequeños', 'acsm2009p', 'Dos sesiones seguidas bien en la parte alta de repeticiones antes de subir la carga; descansos de 1-2 min (más en los pesados).'],
  ['Fuerza, también con la espalda delicada', 'comer2024', 'Fuerza del tronco y condición física forman parte de lo que suele funcionar en estenosis; las cargas altas necesitan supervisión.'],
  ['Medir con pruebas sencillas', 'cdc30s', 'Se compara contigo misma, sin tablas de otras edades.']
];
const NO_SABEMOS = [
  'No existe un estudio que diga cuál es el orden exacto de ejercicios para una mujer de 54 años con su combinación de espalda, nervio, cadera, rodilla y medicación. Los niveles son lógica clínica conservadora: la fisioterapeuta debe revisarlos.',
  'Las referencias de arriba son resúmenes de la evidencia general. No sustituyen la exploración de un profesional.',
  'El peso no se trata aquí con dietas: la evidencia sobre ejercicio y peso (Bellicha 2021) dice que el ejercicio solo quita pocos kilos; la alimentación debe verla su médico o un dietista.',
  'Los niveles 6-12 (pesas, mancuernas, gimnasio, barra) son una escalera de diseño propio: el ACSM y la revisión Cochrane respaldan subir la fuerza poco a poco en general, pero ningún estudio que haya podido leer valida peso muerto o press por encima de la cabeza para una persona con hernia L5-S1, estenosis, espondilolistesis y antecedentes neurológicos como Sandra. Por eso esos niveles piden visto bueno profesional y se abren uno a uno.',
  'No se sabe qué carga máxima es razonable para ella. Los kilos de la escalera son un techo teórico, no una promesa: se sube solo mientras no haya dolor ni síntomas neurológicos.'
];

const MENSAJES = [
  'Hoy cuenta cada minuto que te muevas.', 'Un día malo no borra lo que ya has hecho.', 'Despacio también es avanzar.',
  'Lo importante es la constancia, no la prisa.', 'Cuidarte es una forma de quererte.', 'Cada semana tu cuerpo aprende un poco más.',
  'Hoy basta con hacer lo que puedas.', 'Poco a poco vas ganando fuerza.'
];
const PENDIENTE_ADJUNTAR = [
  ['rm2025', 'Resonancia lumbar de 2025', 'Resonancia / imagen'],
  ['trauma', 'Informe de traumatología', 'Traumatología'],
  ['neuro', 'Informe de neurocirugía', 'Neurocirugía'],
  ['infiltracion', 'Informe de la infiltración de rodilla (fecha, rodilla, producto y recomendaciones de reposo)', 'Traumatología'],
  ['fisio', 'Valoración de la fisioterapeuta', 'Fisioterapia'],
  ['pauta', 'Confirmación de la pauta de medicación por su médico', 'Receta / medicación'],
  ['adiro', 'Aclarar con su médico para qué es el Adiro', 'Atención primaria']
];
