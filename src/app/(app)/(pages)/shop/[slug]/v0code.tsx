import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@app/components/ui/accordion'
import { Heart, Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'

interface AddOn {
  id: string
  name: string
  price: number
  image: string
}

const addOns: AddOn[] = [
  {
    id: '1',
    name: 'Addition Studio Scrub Sachet',
    price: 15.95,
    image: '/placeholder.svg?height=100&width=100&text=Scrub',
  },
  {
    id: '2',
    name: 'Tinned Candle',
    price: 22.0,
    image: '/placeholder.svg?height=100&width=100&text=Candle',
  },
  {
    id: '3',
    name: 'Fluffe Fairy Floss',
    price: 6.95,
    image: '/placeholder.svg?height=100&width=100&text=Floss',
  },
  {
    id: '4',
    name: 'Extra Item 1',
    price: 10.0,
    image: '/placeholder.svg?height=100&width=100&text=Extra+1',
  },
  {
    id: '5',
    name: 'Extra Item 2',
    price: 12.5,
    image: '/placeholder.svg?height=100&width=100&text=Extra+2',
  },
]

export default function Component() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [addOnIndex, setAddOnIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const images = [
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600&text=Image+2',
    '/placeholder.svg?height=600&width=600&text=Image+3',
    '/placeholder.svg?height=600&width=600&text=Image+4',
  ]

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && addOnIndex > 0) {
      setAddOnIndex((prev) => prev - 1)
    } else if (direction === 'right' && addOnIndex < addOns.length - 3) {
      setAddOnIndex((prev) => prev + 1)
    }
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-20 flex flex-col gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 border rounded-md overflow-hidden ${
                    index === currentSlide ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-grow relative">
              <img
                src={images[currentSlide]}
                alt={`The Happy Chappy product image ${currentSlide + 1}`}
                className="w-full h-auto object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={isFavorite ? 'fill-current text-red-500' : ''} />
                <span className="sr-only">
                  {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                </span>
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">The Happy Chappy</h1>
            <div className="flex items-center mb-2">
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                new
              </span>
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
                <Star className="w-5 h-5 text-gray-300" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-4">$89</p>
            <p className="text-gray-600 mb-4">
              Introducing "The Happy Chappy" – the ultimate snack pack for the bloke who deserves a
              little indulgence! Whether it's for Father's Day, a birthday, or just because, this
              bundle is packed with gourmet delights that'll satisfy even the most discerning of
              taste buds. Give the gift that's guaranteed to make him grin from ear to ear – and
              earn yourself a well-deserved spot in his good books!
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  className="px-2 py-1 rounded-l-md"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  id="quantity"
                  className="w-12 text-center border-none focus:ring-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  aria-label="Quantity"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  className="px-2 py-1 rounded-r-md"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="whats-included">
                <AccordionTrigger>What's included</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Chappy's Kettle-cooked Potato Chips Australian Sea Salt 80g</li>
                    <li>Tony's Chocolonely Dark 70% Chocolate Bar 180g</li>
                    <li>J Crackleton Hand Made Pork Crackle Original 40g</li>
                    <li>Strangelove Hot Ginger Beer 180ml</li>
                    <li>Packaged in Our Signature Premium Thankly Black Box</li>
                    <li>Our Signature Thankly card with a personalised handwritten message</li>
                    <li>FREE Standard Shipping Australia-wide</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">ADD ONS</h2>
              <div className="relative overflow-hidden">
                <div
                  ref={sliderRef}
                  className="flex space-x-4 transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${addOnIndex * (128 + 16)}px)` }}
                >
                  {addOns.map((addon) => (
                    <div key={addon.id} className="w-32 flex-shrink-0">
                      <button
                        className={`w-full border rounded-md p-2 transition-colors ${
                          selectedAddOns.includes(addon.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200'
                        }`}
                        onClick={() => toggleAddOn(addon.id)}
                      >
                        <img
                          src={addon.image}
                          alt={addon.name}
                          className="w-full h-24 object-cover rounded-md mb-2"
                        />
                        <p className="text-sm font-medium truncate">{addon.name}</p>
                        <p className="text-sm text-gray-500">+${addon.price.toFixed(2)}</p>
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full shadow"
                  onClick={() => scroll('left')}
                  disabled={addOnIndex === 0}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full shadow"
                  onClick={() => scroll('right')}
                  disabled={addOnIndex >= addOns.length - 3}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <Button className="w-full">Personalise and send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
