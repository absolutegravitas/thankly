import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating?: number | null
  maxRating?: number
  size?: number
  activeColor?: string
  inactiveColor?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 5,
  activeColor = 'text-thankly-green',
  inactiveColor = 'text-gray-300',
}) => {
  if (!rating || rating === 0) {
    return null
  }

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < rating ? `fill-current ${activeColor}` : inactiveColor
          }`}
        />
      ))}
    </div>
  )
}

export default StarRating
