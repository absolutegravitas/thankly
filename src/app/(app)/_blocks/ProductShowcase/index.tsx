'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@app/_components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@app/_components/ui/carousel'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Product } from '@/payload-types'
import { fetchProductsByCategory } from '@/utilities/PayloadQueries/fetchProductsByCategory'
import { useRouter } from 'next/navigation'
import ShopProductCard from '../../_components/Shop/ShopProductCard'

export type ProductShowcaseProps = ExtractBlockProps<'productShowcase'>

interface ProductCollection {
  id: number
  name: string
  categoryId: number
}

interface CollectionItem {
  collectionName: string
  category: {
    id: number
  }
}

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 w-full mb-4 rounded"></div>
    <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
  </div>
)

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
  const [allProducts, setAllProducts] = useState<Record<number, Product[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      try {
        const productPromises = productCollections.map((collection) =>
          fetchProductsByCategory(collection.categoryId),
        )
        const results = await Promise.all(productPromises)
        const productsMap: Record<number, Product[]> = {}
        productCollections.forEach((collection, index) => {
          productsMap[collection.categoryId] = results[index]
        })
        setAllProducts(productsMap)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllProducts()
  }, [])

  const currentProducts = allProducts[activeTab.categoryId] || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-gray-200 p-1 relative">
          {productCollections.map((item: ProductCollection) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-full relative z-10 transition-colors duration-300 ${
                activeTab.id === item.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div className="px-12 relative w-full">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full mx-auto"
        >
          <CarouselContent>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={`skeleton-${index}`} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <SkeletonLoader />
                    </div>
                  </CarouselItem>
                ))
              : currentProducts.map((product, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <ShopProductCard product={product} showTags={false} />
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
