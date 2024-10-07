'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@app/_components/ui/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media, Product } from '@/payload-types'
import { fetchProductsByCategory } from '@/utilities/PayloadQueries/fetchProductsByCategory'
import { useRouter } from 'next/navigation'
import ShopProductCard from '../../_components/Shop/ShopProductCard.tsx'

export type ProductShowcaseProps = ExtractBlockProps<'productShowcase'>

//interface for clean storage of required payload information
interface ProductCollection {
  id: number
  name: string
  categoryId: number
}

//interface for reading the payload information
interface CollectionItem {
  collectionName: string
  category: {
    id: number
  }
}

const CARD_WIDTH = 350 // Fixed width for each product card in pixels

export default function ProductShowcase({ collections }: ProductShowcaseProps) {
  const router = useRouter()
  const productCollections: ProductCollection[] = collections.map(
    (item: CollectionItem, index: number) => ({
      id: index,
      name: item.collectionName,
      categoryId: item.category.id,
    }),
  )
  const [activeTab, setActiveTab] = useState<ProductCollection>(productCollections[0])
  const [visibleProducts, setVisibleProducts] = useState(4)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>([])

  //useEffect for fetching products from payload based on activeTab
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategory(activeTab.categoryId)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [activeTab])

  useEffect(() => {
    const updateVisibleProducts = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const newVisibleProducts = Math.max(Math.floor(containerWidth / CARD_WIDTH), 1)
        setVisibleProducts(newVisibleProducts)
        setCurrentIndex((prevIndex) =>
          Math.min(prevIndex, Math.max(products.length - newVisibleProducts, 0)),
        )
      }
    }

    updateVisibleProducts()
    window.addEventListener('resize', updateVisibleProducts)
    return () => window.removeEventListener('resize', updateVisibleProducts)
  }, [])

  useEffect(() => {
    if (toggleRef.current) {
      const activeElement = toggleRef.current.querySelector(`[data-state="${activeTab.name}"]`)
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement as HTMLElement
        toggleRef.current.style.setProperty('--highlight-left', `${offsetLeft}px`)
        toggleRef.current.style.setProperty('--highlight-width', `${offsetWidth}px`)
      }
    }
  }, [activeTab])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, products.length - visibleProducts))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div ref={toggleRef} className="inline-flex rounded-full bg-gray-200 p-1 relative">
          <div
            className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out"
            style={{
              left: 'var(--highlight-left, 0)',
              width: 'var(--highlight-width, 0)',
            }}
          />
          {productCollections.map((item: ProductCollection) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-full relative z-10 transition-colors duration-300 ${
                activeTab.id === item.id ? 'text-gray-800' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(item)}
              data-state={activeTab.id === item.id ? item.name : ''}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden" ref={containerRef}>
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 rounded-full shadow-md z-10 transition-opacity duration-300 ${
            currentIndex === 0 ? 'invisible' : ''
          }`}
          onClick={handlePrev}
          aria-label="Previous product"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * CARD_WIDTH}px)`,
            width: `${products.length * CARD_WIDTH}px`,
          }}
        >
          {products.map((product, index) => (
            <div key={index} className="flex-shrink-0" style={{ width: `${CARD_WIDTH}px` }}>
              <div className="block p-4">
                <ShopProductCard key={product.id} product={product} showTags={false} />
              </div>
            </div>
          ))}
        </div>
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 rounded-full shadow-md z-10 transition-opacity duration-300 ${
            currentIndex >= products.length - visibleProducts ? 'invisible' : ''
          }`}
          onClick={handleNext}
          aria-label="Next product"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="default"
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => router.push('/shop')}
        >
          SHOP ALL
        </Button>
      </div>
    </div>
  )
}
