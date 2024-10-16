'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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

export function ProductShowcase({ collections }: ProductShowcaseProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)

  const productCollections = useMemo(
    () =>
      collections.map((item: CollectionItem, index: number) => ({
        id: index,
        name: item.collectionName,
        categoryId: item.category.id,
      })),
    [collections],
  )

  const [activeTab, setActiveTab] = useState<ProductCollection>(() => productCollections[0])
  const [allProducts, setAllProducts] = useState<Record<number, Product[]>>({})
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)

  const fetchAllProducts = useCallback(async () => {
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
  }, [productCollections])

  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])

  const updateTogglePosition = useCallback((tabId: number) => {
    if (toggleRef.current) {
      const activeButton = document.querySelector(`button[data-id="${tabId}"]`) as HTMLElement
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton
        toggleRef.current.style.left = `${offsetLeft}px`
        toggleRef.current.style.width = `${offsetWidth}px`
      }
    }
  }, [])

  useEffect(() => {
    // Set initial toggle position
    if (productCollections.length > 0) {
      updateTogglePosition(productCollections[0].id)
    }
  }, [productCollections, updateTogglePosition])

  const handleTabChange = useCallback(
    (newTab: ProductCollection) => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight
        containerRef.current.style.height = `${height}px`
      }
      setTransitioning(true)
      setTimeout(() => {
        setActiveTab(newTab)
        setTransitioning(false)
        if (containerRef.current) {
          containerRef.current.style.height = 'auto'
        }
      }, 300)

      // Update toggle position
      updateTogglePosition(newTab.id)
    },
    [updateTogglePosition],
  )

  const currentProducts = allProducts[activeTab.categoryId] || []

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-gray-200 p-1 relative">
          <div
            ref={toggleRef}
            className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out"
          />
          {productCollections.map((item: ProductCollection) => (
            <button
              key={item.id}
              data-id={item.id}
              className={`px-4 py-2 rounded-full relative z-10 transition-colors duration-300 ${
                activeTab.id === item.id ? 'text-gray-800' : 'text-gray-600'
              }`}
              onClick={() => handleTabChange(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        className="px-12 relative w-full overflow-hidden transition-height duration-300 ease-in-out"
      >
        <div
          className={`transition-opacity duration-300 ease-in-out ${
            transitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Carousel
            key={activeTab.id}
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full mx-auto"
          >
            <CarouselContent>
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={`skeleton-${index}`}
                      className="basis-full md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                    >
                      <div className="p-1">
                        <SkeletonLoader />
                      </div>
                    </CarouselItem>
                  ))
                : currentProducts.map((product, index) => (
                    <CarouselItem
                      key={`${activeTab.id}-${index}`}
                      className="basis-full md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                    >
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
      </div>
      <div className="flex justify-center mt-8">
        <Button
          variant="default"
          className="bg-black text-white hover:bg-gray-800 px-8"
          onClick={() => router.push('/shop')}
        >
          SHOP ALL
        </Button>
      </div>
    </div>
  )
}

export default ProductShowcase
