# Frontend (Davivienda Tasks)

Minimal React frontend for the provided backend. Uses Vite, React and Bootstrap.

Quick start (Windows PowerShell):

```powershell
cd Frontend
npm install
npm run dev
```

By default the app expects the backend at `http://localhost:3000`. You can change it in `.env` (VITE_API_URL).

Pages:
- /login: iniciar sesión
- /register: crear cuenta
- /tasks: ver/crear/eliminar tareas (requiere token)
