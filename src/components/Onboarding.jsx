import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Target, Sparkles, Heart, BarChart3, Zap } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    title: '¡Bienvenido a Clarity!',
    subtitle: '21 días para salir del piloto automático',
    description: 'En solo 7 minutos al día, capturarás momentos significativos, practicarás gratitud y ganarás claridad sobre tu vida.',
    highlight: 'El 95% de tus días se vuelven indistinguibles sin registro. Cambiemos eso.',
    color: 'gold'
  },
  {
    icon: Target,
    title: 'Intención del día',
    subtitle: 'Empieza con propósito',
    description: 'Cada mañana, establece una intención simple. Por la noche, reflexiona si la cumpliste. Este hábito aumenta tu efectividad en un 42%.',
    highlight: 'Ejemplo: "Hoy respondo con calma" o "Hoy estoy presente"',
    color: 'indigo'
  },
  {
    icon: Sparkles,
    title: 'Momento del día',
    subtitle: 'El corazón de Clarity',
    description: 'Cada noche, escribe el momento más significativo de tu día. No tiene que ser extraordinario — los momentos pequeños son los más valiosos.',
    highlight: '"Homework for Life" — el método de Matthew Dicks para nunca olvidar tu vida.',
    color: 'sage'
  },
  {
    icon: Heart,
    title: 'Gratitud',
    subtitle: '3 cosas por las que agradecer',
    description: 'La gratitud rewirea tu cerebro para notar lo positivo. Solo 3 gratitudes diarias pueden aumentar tu felicidad en un 25%.',
    highlight: 'Sé específico: "La llamada de mamá" > "Mi familia"',
    color: 'coral'
  },
  {
    icon: BarChart3,
    title: 'Evalúa tu día',
    subtitle: 'Detecta patrones',
    description: 'Califica cómo te sentiste. Con el tiempo, verás qué días son mejores y qué los hace diferentes.',
    highlight: 'Al día 7 y 14 recibirás un reporte con tus patrones.',
    color: 'indigo'
  },
  {
    icon: Zap,
    title: '¿Día caótico?',
    subtitle: 'Usa el modo rápido',
    description: 'Si solo tienes 1 minuto, activa el modo rápido (⚡) y escribe solo tu momento del día. Es mejor 1 minuto que nada.',
    highlight: 'La constancia importa más que la perfección.',
    color: 'gold'
  }
]

const colorClasses = {
  gold: {
    bg: 'bg-gold/10',
    icon: 'text-gold',
    border: 'border-gold/30'
  },
  sage: {
    bg: 'bg-sage-100 dark:bg-sage-500/10',
    icon: 'text-sage-500 dark:text-sage-glow',
    border: 'border-sage-300 dark:border-sage-500/30'
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    icon: 'text-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-500/30'
  },
  coral: {
    bg: 'bg-coral-50 dark:bg-coral-500/10',
    icon: 'text-coral-500',
    border: 'border-coral-200 dark:border-coral-500/30'
  }
}

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const step = ONBOARDING_STEPS[currentStep]
  const colors = colorClasses[step.color]
  const Icon = step.icon
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-zen-lg max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-6">
          {ONBOARDING_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-6 bg-sage-400 dark:bg-sage-glow'
                  : idx < currentStep
                  ? 'bg-sage-300 dark:bg-sage-500/50'
                  : 'bg-gray-200 dark:bg-dark-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-6`}>
            <Icon size={32} className={colors.icon} />
          </div>

          {/* Title */}
          <h2 className="text-center font-serif text-2xl font-medium text-charcoal dark:text-gray-100 mb-2">
            {step.title}
          </h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            {step.subtitle}
          </p>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Highlight box */}
          <div className={`rounded-xl p-4 ${colors.bg} border ${colors.border} mb-6`}>
            <p className="text-sm text-center text-charcoal dark:text-gray-200 italic">
              {step.highlight}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-all bg-gray-100 dark:bg-dark-muted text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-hover flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isLastStep
                  ? 'bg-sage-500 dark:bg-sage-glow text-white dark:text-dark-base hover:bg-sage-600 dark:hover:bg-sage-400'
                  : 'bg-indigo-600 dark:bg-sage-glow text-white dark:text-dark-base hover:bg-indigo-700 dark:hover:bg-sage-400'
              }`}
            >
              {isLastStep ? '¡Empezar!' : 'Siguiente'}
              {!isLastStep && <ChevronRight size={18} />}
            </button>
          </div>

          {/* Step counter */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            {currentStep + 1} de {ONBOARDING_STEPS.length}
          </p>
        </div>
      </div>
    </div>
  )
}
