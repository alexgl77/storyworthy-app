import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Flame, ChevronRight } from 'lucide-react'
import { getBenefitForEntry } from '../utils/benefits'

export default function SaveSuccessModal({
  isOpen,
  onClose,
  streak,
  weeksLived,
  entryData = {}
}) {
  const navigate = useNavigate()
  const [benefit, setBenefit] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const newBenefit = getBenefitForEntry({
        hasGratitude: entryData.hasGratitude,
        hasContent: entryData.hasContent,
        hasIntention: entryData.hasIntention,
        hasMood: entryData.hasMood
      })
      setBenefit(newBenefit)
    }
  }, [isOpen, entryData])

  const handleLearnMore = () => {
    onClose()
    navigate('/benefits', { state: { scrollTo: benefit?.type } })
  }

  if (!isOpen || !benefit) return null

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

        {/* Benefit section */}
        <div className="bg-canvas-warm dark:bg-dark-hover rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{benefit.icon}</span>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                {benefit.title}
              </p>
              <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed">
                {benefit.text}
              </p>
            </div>
          </div>
        </div>

        {/* Learn more button */}
        <button
          onClick={handleLearnMore}
          className="w-full flex items-center justify-center gap-1 text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors mb-4"
        >
          Leer más sobre {benefit.title.toLowerCase()}
          <ChevronRight size={16} />
        </button>

        {/* Continue button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-2xl font-medium transition-all duration-200 bg-sage-500 dark:bg-sage-glow text-white dark:text-dark-base hover:bg-sage-600 dark:hover:bg-sage-400"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
