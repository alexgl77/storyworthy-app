import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setMessage('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-canvas dark:bg-dark-base">
      <div className="max-w-sm w-full">
        {/* Brand */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-medium text-charcoal dark:text-gray-100 mb-3">
            Clarity
          </h1>
          <p className="text-gray-400 dark:text-gray-500">
            Sal del piloto automático. Vive conscientemente.
          </p>
        </div>

        {/* Card */}
        <div className="card-floating">
          {/* Toggle */}
          <div className="flex gap-1 mb-6 p-1 bg-canvas dark:bg-dark-raised rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-white dark:bg-dark-surface text-charcoal dark:text-gray-100 shadow-zen'
                  : 'text-gray-400 dark:text-gray-500 hover:text-charcoal dark:hover:text-gray-300'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-white dark:bg-dark-surface text-charcoal dark:text-gray-100 shadow-zen'
                  : 'text-gray-400 dark:text-gray-500 hover:text-charcoal dark:hover:text-gray-300'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
              {!isLogin && (
                <p className="text-xs text-gray-300 mt-2">Mínimo 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="bg-coral-500/8 border border-coral-500/15 text-coral-500 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-sage-400/8 border border-sage-400/15 text-sage-500 px-4 py-3 rounded-2xl text-sm">
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-500 dark:text-sage-400 font-medium hover:underline"
              >
                {isLogin ? 'Crear una' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-gray-300 dark:text-gray-600">
          Inspirado en el concepto Homework for Life
        </p>
      </div>
    </div>
  )
}
