export const validateRegister = (req, res, next) => {
  const { username, email, password, fullName } = req.body;

  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!fullName || fullName.trim().length < 2) {
    errors.push('El nombre completo debe tener al menos 2 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (!password) {
    errors.push('La contraseña es requerida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
