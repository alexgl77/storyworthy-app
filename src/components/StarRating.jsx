import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, onRatingChange, size = 28, label }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-2">{label}</p>
      )}
      <div className="flex gap-1">
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
              className={`transition-colors duration-200 ${
                star <= (hovered || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-warm-300 dark:text-warm-600'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-warm-500 dark:text-warm-400 self-center">
            {rating === 1 && 'Difícil'}
            {rating === 2 && 'Regular'}
            {rating === 3 && 'Normal'}
            {rating === 4 && 'Buen día'}
            {rating === 5 && 'Excelente'}
          </span>
        )}
      </div>
    </div>
  )
}
