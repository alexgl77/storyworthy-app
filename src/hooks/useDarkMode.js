import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // Leer preferencia guardada o usar preferencia del sistema
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    // Dark por defecto; solo claro si el usuario lo prefiere explícitamente
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return false
    }
    return true
  })

  useEffect(() => {
    // Actualizar clase en el HTML
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Guardar preferencia
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return { darkMode, toggleDarkMode }
}
