Proyecto Backend ToDo con arquitectura hexagonal.

Instrucciones rápidas:
Proyecto Backend ToDo con arquitectura hexagonal.

Instrucciones rápidas:

1) Configuración
- Copiar/editar el archivo `.env` en la raíz con los valores de conexión (ya hay un ejemplo incluido). Asegúrate que PostgreSQL está accesible en `DB_HOST` y `DB_PORT=5433`.

2) Instalar dependencias

	npm install

3) Crear la BD / migración

	Puedes ejecutar la migración SQL `src/migrations/init.sql` con psql (ajusta usuario/host/puerto):

		psql -h localhost -p 5433 -U postgres -d todo_db -f src/migrations/init.sql

	PowerShell note: para ejecutar el script `migrate` usando las variables del `.env` en PowerShell, puedes exportar variables temporales así:

		$env:DB_HOST='localhost'; $env:DB_PORT='5433'; $env:DB_USER='postgres'; $env:DB_PASSWORD='12345'; $env:DB_DATABASE='todo_db'; npm run migrate

4) Ejecutar en desarrollo

	npm run dev

Endpoints principales:

- POST /auth/register  { name, email, password }
- POST /auth/login     { email, password }
- GET  /health
- CRUD /tasks (autenticado con header Authorization: Bearer <token>)

Filtros para listar tareas: query params `status` y `priority`.

Notas:
- JWT secret en `.env` -> JWT_SECRET
- Este repositorio implementa una arquitectura hexagonal mínima: `repositories`, `services`, `controllers`, `routes`.

Siguientes pasos sugeridos: frontend con formularios, pruebas unitarias para servicios y ampliar validaciones.

Ejemplos para registrar un usuario

1) curl:

	curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Usuario Prueba\",\"email\":\"prueba@example.com\",\"password\":\"secret123\"}"

2) PowerShell (Invoke-RestMethod):

	Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -Body (@{name='Usuario Prueba'; email='prueba@example.com'; password='secret123'} | ConvertTo-Json) -ContentType 'application/json'

3) Script Node.js de ejemplo:

	node scripts/registerUser.js

