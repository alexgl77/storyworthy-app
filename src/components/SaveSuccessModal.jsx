import { useEffect, useState } from 'react'
import { Check, X, Flame } from 'lucide-react'
import { getRandomBenefit } from '../utils/benefits'

export default function SaveSuccessModal({ isOpen, onClose, streak, weeksLived }) {
  const [benefit, setBenefit] = useState('')

  useEffect(() => {
    if (isOpen) {
      setBenefit(getRandomBenefit())
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-zen-lg max-w-sm w-full p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sage-100 dark:bg-sage-glow/10 flex items-center justify-center">
            <Check size={28} className="text-sage-500 dark:text-sage-glow" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center font-serif text-2xl font-medium text-charcoal dark:text-gray-100 mb-2">
          Momento guardado
        </h2>

        {/* Stats row */}
        <div className="flex justify-center items-center gap-6 text-sm text-gray-400 dark:text-gray-500 mb-6">
          {streak > 0 && (
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-coral-500" />
              <span>{streak} {streak === 1 ? 'día' : 'días'}</span>
            </div>
          )}
          {weeksLived && (
            <div>
              <span>Semana {weeksLived.toLocaleString('es-ES')}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-200 dark:bg-dark-border mx-auto mb-6" />

        {/* Benefit */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic font-serif">
          "{benefit}"
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-8 w-full py-3 px-6 rounded-2xl font-medium transition-all duration-200 bg-canvas dark:bg-dark-raised text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
