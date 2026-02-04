import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { getAllPractices } from '../utils/benefits'

export default function Benefits() {
  const location = useLocation()
  const [expandedSection, setExpandedSection] = useState(null)
  const sectionRefs = useRef({})
  const practices = getAllPractices()

  // Scroll to section if coming from modal
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      setExpandedSection(sectionId)

      // Wait for render then scroll
      setTimeout(() => {
        const element = sectionRefs.current[sectionId]
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location.state])

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  const colorClasses = {
    gold: {
      bg: 'bg-gold/10 dark:bg-gold/20',
      border: 'border-gold/30 dark:border-gold/40',
      text: 'text-gold dark:text-gold',
      accent: 'bg-gold/20 dark:bg-gold/30'
    },
    sage: {
      bg: 'bg-sage-50 dark:bg-sage-500/10',
      border: 'border-sage-200 dark:border-sage-500/30',
      text: 'text-sage-600 dark:text-sage-400',
      accent: 'bg-sage-100 dark:bg-sage-500/20'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      border: 'border-indigo-200 dark:border-indigo-500/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      accent: 'bg-indigo-100 dark:bg-indigo-500/20'
    },
    coral: {
      bg: 'bg-coral-50 dark:bg-coral-500/10',
      border: 'border-coral-200 dark:border-coral-500/30',
      text: 'text-coral-600 dark:text-coral-400',
      accent: 'bg-coral-100 dark:bg-coral-500/20'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-gold" />
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium">
            La ciencia detrás
          </p>
        </div>
        <h1 className="font-serif text-3xl text-charcoal dark:text-gray-100 mb-3">
          Por qué funciona
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Cada práctica en Clarity está respaldada por investigación en psicología positiva,
          neurociencia y bienestar. Aquí está la ciencia que lo respalda.
        </p>
      </div>

      {/* Practice sections */}
      <div className="space-y-4">
        {practices.map((practice) => {
          const colors = colorClasses[practice.color] || colorClasses.sage
          const isExpanded = expandedSection === practice.id

          return (
            <div
              key={practice.id}
              ref={(el) => (sectionRefs.current[practice.id] = el)}
              className={`rounded-2xl border transition-all duration-300 ${colors.border} ${
                isExpanded ? colors.bg : 'bg-white dark:bg-dark-surface'
              }`}
            >
              {/* Header - always visible */}
              <button
                onClick={() => toggleSection(practice.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{practice.icon}</span>
                  <div>
                    <h2 className="font-serif text-xl text-charcoal dark:text-gray-100">
                      {practice.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {practice.shortBenefits.length} beneficios comprobados
                    </p>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${colors.accent}`}>
                  {isExpanded ? (
                    <ChevronUp size={20} className={colors.text} />
                  ) : (
                    <ChevronDown size={20} className={colors.text} />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                  {/* Quick benefits */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      Beneficios clave
                    </h3>
                    <ul className="space-y-2">
                      {practice.shortBenefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-charcoal dark:text-gray-300"
                        >
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.text} bg-current flex-shrink-0`} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full description */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      La ciencia
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {practice.fullDescription.trim().split('\n\n').map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className={`rounded-xl p-4 ${colors.accent}`}>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Tips para practicar
                    </h3>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-charcoal dark:text-gray-300"
                        >
                          <span className="text-gray-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          "El cambio no ocurre de golpe. Ocurre momento a momento, día a día."
        </p>
      </div>
    </div>
  )
}
