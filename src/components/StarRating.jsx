import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, onRatingChange, size = 28, label }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</p>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star === rating ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={`transition-colors ${
                star <= (hovered || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 self-center">
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
