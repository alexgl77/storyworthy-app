import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, onRatingChange, size = 28, label }) {
  const [hovered, setHovered] = useState(0)

  const labels = ['', 'Difícil', 'Regular', 'Normal', 'Buen día', 'Excelente']

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-charcoal dark:text-gray-300 mb-2">{label}</p>
      )}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star === rating ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-200 hover:scale-110"
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                star <= (hovered || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-200 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs text-gray-400 self-center">
            {labels[rating]}
          </span>
        )}
      </div>
    </div>
  )
}
