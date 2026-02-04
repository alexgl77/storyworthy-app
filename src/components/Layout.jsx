import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../hooks/useDarkMode'
import { Sun, BarChart3, LogOut, Moon, Home, Lightbulb } from 'lucide-react'

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
    { path: '/insights', icon: Lightbulb, label: 'Insights' },
    { path: '/report', icon: BarChart3, label: 'Reporte' },
  ]

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-base flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[72px] py-8 border-r border-gray-100/60 dark:border-dark-border bg-white/50 dark:bg-dark-surface backdrop-blur-sm fixed h-full z-20">
        <div className="flex flex-col items-center gap-1">
          {/* Logo */}
          <Link to="/" className="mb-8">
            <span className="text-xl font-serif font-bold text-indigo-600 dark:text-sage-glow">C</span>
          </Link>

          {/* Nav items */}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-sage-glow/10 text-indigo-600 dark:text-sage-glow dark:drop-shadow-[0_0_6px_rgba(209,220,192,0.5)]'
                    : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-hover hover:text-charcoal dark:hover:text-gray-300'
                }`}
                title={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-hover hover:text-charcoal dark:hover:text-gray-300 transition-all duration-200"
            title="Cambiar tema"
          >
            {darkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>

          {/* Sign out */}
          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center w-11 h-11 rounded-2xl text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-hover hover:text-coral-500 transition-all duration-200"
              title="Cerrar sesión"
            >
              <LogOut size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:ml-[72px]">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-gray-100/60 dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg sticky top-0 z-10">
          <Link to="/" className="font-serif font-bold text-lg text-indigo-600 dark:text-sage-glow">
            Clarity
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-400 hover:text-charcoal dark:hover:text-gray-300 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl text-gray-400 hover:text-coral-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="pb-20 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-lg border-t border-gray-100/60 dark:border-dark-border">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-sage-glow'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
