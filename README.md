# Paso a Paso — app de ejercicios para Sandra

App web (PWA) pensada para el móvil de Sandra. Funciona sin internet una vez abierta y **guarda todo solo en su teléfono**.

## Qué hace
- **Hoy**: check de 1 minuto (semáforo verde/amarillo/rojo) y sesión de unos 10 min.
- **Entrenar**: 5 niveles, 40 ejercicios con explicación, voz y animación paso a paso. Se desbloquean al dominar los anteriores.
- **Caminar**: cronómetro + distancia por GPS (la pantalla debe quedarse encendida), ruta, pasos estimados y objetivo semanal.
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
Cambia los archivos en GitHub y sube el número en `sw.js` (`CACHE='pasoapaso-v1'` → `v2`). Para que el móvil lo recoja, ábrela con internet.

## Copia de seguridad
Modo cuidador → Copia de seguridad (genera un JSON con todo lo guardado). Hazla de vez en cuando: si se borran los datos del navegador, se pierde el historial.

## Avisos
- No sustituye a médico ni fisio. Los niveles 3–5 y los ejercicios marcados "fisio" requieren tu aprobación por defecto.
- No toca ni sugiere cambios de medicación.
- El GPS de una web se detiene si se bloquea la pantalla.
