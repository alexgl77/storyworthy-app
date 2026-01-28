import { useMemo } from 'react'
import { getDailyPrompt, parsePromptWithKeyword } from '../utils/stoicPrompts'

export default function HeroPrompt() {
  const prompt = useMemo(() => getDailyPrompt(), [])
  const parts = useMemo(() => parsePromptWithKeyword(prompt), [prompt])

  return (
    <section className="mb-12 md:mb-16">
      <p className="label-stoic mb-6">
        REFLEXIÓN ESTOICA DIARIA
      </p>

      <h1 className="text-hero-prompt text-charcoal dark:text-gray-100">
        {parts.before}
        <span className="text-gold dark:text-gold-glow">{parts.keyword}</span>
        {parts.after}
      </h1>

      {prompt.attribution && (
        <p className="mt-4 text-sm font-sans text-gray-400 dark:text-gray-500 tracking-wide">
          — {prompt.attribution}
        </p>
      )}
    </section>
  )
}
