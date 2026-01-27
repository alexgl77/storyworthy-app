import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../hooks/useDarkMode'
import { Home, BarChart3, LogOut, Moon, Sun } from 'lucide-react'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const location = useLocation()

  const handleSignOut = async () => {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
      await signOut()
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/report', icon: BarChart3, label: 'Reporte' },
  ]

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-surface-200/60 dark:border-dark-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
              Clarity
            </Link>

            <div className="flex items-center gap-3">
              {/* Navegación */}
              <nav className="hidden md:flex gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-soft-sm'
                          : 'text-warm-500 dark:text-warm-400 hover:bg-surface-100 dark:hover:bg-dark-elevated'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Toggle modo oscuro */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-surface-100 dark:bg-dark-elevated hover:bg-surface-200 dark:hover:bg-dark-border transition-all duration-200"
                aria-label="Cambiar tema"
              >
                {darkMode ? <Sun size={20} className="text-warm-400" /> : <Moon size={20} className="text-warm-500" />}
              </button>

              {/* Botón cerrar sesión */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-warm-500 dark:text-warm-400 hover:bg-surface-100 dark:hover:bg-dark-elevated rounded-xl transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Salir</span>
                </button>
              )}
            </div>
          </div>

          {/* Navegación móvil */}
          <nav className="md:hidden flex border-t border-surface-200/60 dark:border-dark-border -mx-4 px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-warm-400 dark:text-warm-500'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="pb-20 md:pb-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm border-t border-surface-200/40 dark:border-dark-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-warm-400">
          <p>
            Inspirado en <strong className="text-warm-500">Homework for Life</strong> de{' '}
            <a
              href="https://matthewdicks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Matthew Dicks
            </a>
          </p>
          <p className="mt-2 text-warm-300 dark:text-warm-600">Clarity &middot; Reflexión Diaria Consciente</p>
        </div>
      </footer>
    </div>
  )
}
