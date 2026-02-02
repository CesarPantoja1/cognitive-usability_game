import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Brain, 
  Eye, 
  EyeOff, 
  User, 
  Sparkles, 
  CheckCircle,
  Star,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de contraseña en tiempo real
  const passwordRequirements = [
    { met: formData.password.length >= 6, text: 'Al menos 6 caracteres' },
    { met: /[A-Z]/.test(formData.password), text: 'Una letra mayúscula' },
    { met: /[0-9]/.test(formData.password), text: 'Un número' },
  ];

  const allRequirementsMet = formData.password.length >= 6;

  // Beneficios de crear cuenta
  const benefits = [
    { icon: Trophy, text: 'Guarda tu progreso' },
    { icon: Star, text: 'Desbloquea logros' },
    { icon: Target, text: 'Estadísticas personalizadas' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 18}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
                aria-hidden="true"
              >
                <Brain className="w-10 h-10" aria-hidden="true" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-2">¡Únete a nosotros!</h1>
              <p className="text-white/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Comienza tu viaje de entrenamiento cognitivo
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100" role="list" aria-label="Beneficios de crear una cuenta">
            <div className="flex justify-around">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-700"
                    role="listitem"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                      <Icon className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    </div>
                    <span className="font-medium hidden sm:inline">{benefit.text}</span>
                    <span className="sr-only sm:hidden">{benefit.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="register-error"
                  role="alert"
                  aria-live="polite"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-label="Nombre completo"
                    aria-describedby={error ? "register-error" : undefined}
                    autoComplete="name"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Correo electrónico"
                    autoComplete="email"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-label="Contraseña"
                    aria-describedby="password-requirements"
                    autoComplete="new-password"
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>

                {/* Password requirements */}
                {formData.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    id="password-requirements"
                    aria-live="polite"
                    className="mt-3 space-y-1"
                  >
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs ${
                          req.met ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                        aria-label={`${req.text}: ${req.met ? 'cumplido' : 'pendiente'}`}
                      >
                        <CheckCircle className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} aria-hidden="true" />
                        <span>{req.text}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-label="Confirmar contraseña"
                    aria-describedby="confirm-password-status"
                    autoComplete="new-password"
                    className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                      formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
                        ? 'border-red-300'
                        : formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword
                        ? 'border-emerald-300'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña de confirmación" : "Mostrar contraseña de confirmación"}
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                <div id="confirm-password-status" aria-live="polite">
                  {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500" role="alert">Las contraseñas no coinciden</p>
                  )}
                  {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" aria-hidden="true" /> Las contraseñas coinciden
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading || !allRequirementsMet || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Crear Cuenta
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login" aria-label="Iniciar sesión con cuenta existente">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full py-3 text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Iniciar sesión
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-white/80 text-sm"
        >
          © 2024 Entrenamiento Cognitivo. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
