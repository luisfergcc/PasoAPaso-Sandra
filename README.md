# Paso a Paso — app de ejercicios para Sandra

App web (PWA) pensada para el móvil de Sandra. Funciona sin internet una vez abierta y **guarda todo solo en su teléfono**.

## Qué hace
- **Hoy**: check de 1 minuto (semáforo verde/amarillo/rojo) y sesión de unos 10 min.
- **Entrenar**: 5 niveles, 40 ejercicios con explicación, voz y animación paso a paso. Se desbloquean al dominar los anteriores.
- **Caminar**: **calentamiento de ~5 min antes de salir** (3 etapas: sentada → de pie con apoyo → apertura suave de cadera con visto bueno de la fisio; activa flexores de cadera, glúteos, tobillos), cronómetro + distancia por GPS (la pantalla debe quedarse encendida), ruta, pasos estimados y objetivo semanal. Al volver, 2 min de enfriamiento sentada.
- **Historial de Sandra**: resumen, evolución, pruebas (silla 30 s, etc.), informes, preguntas para médicos/fisio y lo que falta por adjuntar.
- **Evidencia**: estudios realmente leídos y sus límites.
- **Modo cuidador** (PIN de 4 dígitos): aprobar niveles, pausar rodilla, subir vídeos propios, copia de seguridad.

## Publicar (igual que MeryCon)
1. Crea un repositorio nuevo en GitHub (ej. `paso-a-paso`).
2. Sube **todos los archivos de esta carpeta tal cual, sin subcarpetas**. NO subas `sandra_datos_iniciales.json` (tiene datos médicos; está bloqueado por `.gitignore`).
3. Settings → Pages → rama `main`, carpeta `/ (root)`.
4. Abre la dirección en el móvil de Sandra → "Añadir a pantalla de inicio" (iPhone: Safari → Compartir; Android: Chrome → ⋮ → Instalar).
5. En la pantalla de bienvenida pulsa **Importar datos iniciales** y elige `sandra_datos_iniciales.json` (pásalo por AirDrop/WhatsApp/cable, no por GitHub).

## Actualizar
Cambia los archivos en GitHub y sube el número en `sw.js` (`CACHE='pasoapaso-v2'` → `v3`). Para que el móvil lo recoja, ábrela con internet.

## Copia de seguridad
Modo cuidador → Copia de seguridad (genera un JSON con todo lo guardado). Hazla de vez en cuando: si se borran los datos del navegador, se pierde el historial.

## Niveles 6-12 (pesas y gimnasio)
Cerrados por defecto. Modo cuidador → abrir nivel a nivel, marcar el material que tiene (mancuernas, gimnasio) y la mancuerna más pesada. Cada ejercicio con peso tiene una escalera de kilos que sube sola tras 2 sesiones seguidas "bien" y baja si hay dolor. Las sesiones de fuerza son 2 por semana como máximo. Son diseño propio, no validado para su espalda: ver "Evidencia → Lo que NO sabemos".

## Avisos
- No sustituye a médico ni fisio. Los niveles 3–12 y los ejercicios marcados "fisio" requieren tu aprobación por defecto.
- No toca ni sugiere cambios de medicación.
- El GPS de una web se detiene si se bloquea la pantalla.
