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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-dark-bg dark:via-dark-bg dark:to-dark-surface">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-primary-600 dark:text-primary-400 mb-3">
            Clarity
          </h1>
          <p className="text-warm-500 dark:text-warm-400 text-lg">
            Sal del piloto automático. Vive conscientemente.
          </p>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-surface-100 dark:bg-dark-elevated text-warm-500 dark:text-warm-400 hover:bg-surface-200 dark:hover:bg-dark-border'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-surface-100 dark:bg-dark-elevated text-warm-500 dark:text-warm-400 hover:bg-surface-200 dark:hover:bg-dark-border'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
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
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
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
                <p className="text-sm text-warm-400 mt-1">Mínimo 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="bg-coral-500/10 border border-coral-500/20 text-coral-600 dark:text-coral-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-sage-500/10 border border-sage-500/20 text-sage-600 dark:text-sage-400 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-500 dark:text-warm-400">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                {isLogin ? 'Crear una' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-warm-400">
          <p>
            Inspirado en el concepto <strong className="text-warm-500">Homework for Life</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
