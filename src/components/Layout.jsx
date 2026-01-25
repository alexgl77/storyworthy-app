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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              StoryWorthy
            </Link>

            <div className="flex items-center gap-4">
              {/* Navegación */}
              <nav className="hidden md:flex gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Cambiar tema"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Botón cerrar sesión */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Salir</span>
                </button>
              )}
            </div>
          </div>

          {/* Navegación móvil */}
          <nav className="md:hidden flex border-t border-gray-200 dark:border-gray-700 -mx-4 px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Basado en <strong>Homework for Life</strong> de{' '}
            <a
              href="https://matthewdicks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Matthew Dicks
            </a>
          </p>
          <p className="mt-2">Construido con React + Supabase</p>
        </div>
      </footer>
    </div>
  )
}
