import http from 'k6/http';
import { check, sleep } from 'k6';

// Script de k6 para probar los endpoints del backend (autenticación + tareas).
// Ejemplo de uso:
// K6_API_URL=http://localhost:3000 K6_USER_EMAIL=demo@example.com K6_USER_PASSWORD=secret k6 run tests/k6/load_test.js

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las peticiones deben estar por debajo de 500ms
    'checks': ['rate>0.95'],
  },
};

// Normaliza la URL de la API: quita espacios en blanco y barras finales.
const API_URL = (__ENV.K6_API_URL || 'http://localhost:3000').toString().trim().replace(/\/+$/g, '');
const EMAIL = __ENV.K6_USER_EMAIL;
const PASSWORD = __ENV.K6_USER_PASSWORD;

function auth(emailArg, passwordArg) {
  const email = emailArg || EMAIL;
  const password = passwordArg || PASSWORD;
  if (!email || !password) {
    console.error('Se requieren las variables de entorno K6_USER_EMAIL y K6_USER_PASSWORD (o permitir el registro automático)');
    return null;
  }
  const loginUrl = `${API_URL}/auth/login`;
  const res = http.post(loginUrl, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
  });
  // Intentamos extraer el token en varias formas comunes.
  try {
    const body = res.json ? res.json() : null;
    const token = body && (body.token || (body.data && body.data.token) || body.accessToken || body.access_token);
    if (res.status === 200 && token) {
      return token;
    }
    console.error('Login falló', { status: res.status, url: loginUrl, body });
  } catch (e) {
    console.error('La respuesta del login no es JSON o no se pudo parsear:', e);
  }
  return null;
}

function tryRegister() {
  // Creamos usuario con email y password aleatorios que cumplen validaciones del backend.
  const regUrl = `${API_URL}/auth/register`;
  const rnd = Math.floor(Math.random() * 1000000);
  // Generar email simple: prueba<numero>@prueba1.local
  const genEmail = `k6prueba${rnd}@prueba1.local`;
  // Generar contraseña que cumpla: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
  const genPassword = `Aa1!k6${Math.floor(Math.random() * 10000)}`;
  const payload = { email: genEmail, password: genPassword, name: 'k6-user' };
  try {
    const res = http.post(regUrl, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
    let bodyText = null;
    try {
      bodyText = res.json ? res.json() : null;
    } catch (e) {
      bodyText = res.body || null;
    }
    console.log('Intento de registro', { status: res.status, url: regUrl, body: bodyText });
    if (res.status === 200 || res.status === 201) {
      // devolvemos credenciales nuevas para hacer login inmediatamente
      return { email: genEmail, password: genPassword };
    }
    return null;
  } catch (e) {
    console.error('Error al intentar registrar el usuario:', e);
    return null;
  }
}

export function setup() {
  let token = auth();
  if (token) {
    return { token };
  }

  // Si el login falló, intentamos registrar el usuario (fallback) y volver a iniciar sesión.
  console.log('Login falló; intentando registrar el usuario automáticamente...');
  const registered = tryRegister();
  if (registered) {
    // Reintentar login con las credenciales generadas
    console.log('Usuario registrado automáticamente:', { email: registered.email, password: registered.password });
    token = auth(registered.email, registered.password);
    if (token) {
      return { token };
    }
  }
  throw new Error('Autenticación fallida en setup; revisa las credenciales o habilita el endpoint de registro');
}

export default function (data) {
  const token = data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  // 1) GET /tasks
  let res = http.get(`${API_URL}/tasks`, authHeaders);
  check(res, { 'obtener tareas status 200': r => r.status === 200 });

  // 2) POST /tasks -> crear una tarea
  const title = `k6 task ${Math.floor(Math.random() * 100000)}`;
  const body = JSON.stringify({ title, description: 'created by k6', priority: 'medium', status: 'pending' });
  res = http.post(`${API_URL}/tasks`, body, authHeaders);
  check(res, { 'crear tarea 201': r => r.status === 201 || r.status === 200 });
  const created = res.json();
  const taskId = created && created.id;

  // 3) PUT /tasks/:id -> update status
  if (taskId) {
    const patch = JSON.stringify({ status: 'in-progress' });
    res = http.put(`${API_URL}/tasks/${taskId}`, patch, authHeaders);
    check(res, { 'actualizar tarea 200': r => r.status === 200 });
  }

  // 4) DELETE /tasks/:id -> remove
  if (taskId) {
    res = http.del(`${API_URL}/tasks/${taskId}`, null, authHeaders);
    check(res, { 'eliminar tarea 200': r => r.status === 200 });
  }

  sleep(Math.random() * 1.5 + 0.5);
}

export function teardown(data) {
  // sin operación (no-op)
}
