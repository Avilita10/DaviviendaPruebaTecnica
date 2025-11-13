export const validateRegister = (data: any) => {
  const errors: string[] = [];
  // nombre
  if (!data.name || data.name.length < 2) errors.push('name');
  // email: comprobación básica tipo RFC
  const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!data.email || !EMAIL_REGEX.test(data.email)) errors.push('email');
  // contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula, un dígito y un carácter especial
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!data.password || !PASSWORD_REGEX.test(data.password)) errors.push('password');
  return errors;
};

export const validateTask = (data: any, partial = false) => {
  const errors: string[] = [];
  // el título es obligatorio solo en validaciones completas (por ejemplo, creación).
  // Para actualizaciones parciales, el título puede omitirse.
  if (!partial) {
    if (!data.title || data.title.length < 1) errors.push('title');
  } else {
    if (data.title !== undefined && data.title.length < 1) errors.push('title');
  }
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) errors.push('priority');
  // Acepta varias representaciones comunes de estado usadas por frontend/backends
  const allowedStatuses = ['pending', 'in_progress', 'completed', 'in progress', 'in-progress', 'doing', 'done', 'cancelled', 'canceled'];
  if (data.status && !allowedStatuses.includes(data.status)) errors.push('status');
  return errors;
};
