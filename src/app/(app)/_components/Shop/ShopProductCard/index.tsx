'use client'
import { Media, Product, Tag } from '@/payload-types'
import React, { SVGProps, useState } from 'react'
import StarRating from '@app/_components/StarRating'
import { Button } from '@app/_components/ui/button'
import Link from 'next/link'
import { useCart } from '@/app/(app)/_providers/Cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Props {
  product: Product
  showTags?: boolean
}

const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-200 rounded-md animate-pulse">
    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
  </div>
)

const ShopProductCard = ({ product, showTags = true }: Props) => {
  const router = useRouter()
  const { addCartItem, openSideCart } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addCartItem(product, 1)
    openSideCart()
  }

  return (
    <Link href={`/shop/${product.slug}`} className="block">
      <div className="border rounded-lg flex flex-col">
        <div className="relative w-full pb-[100%] mb-2">
          {product.media && product.media.length > 0 && product.media[0].mediaItem ? (
            <>
              {!imageLoaded && <ImageSkeleton />}
              <Image
                src={(product.media?.[0].mediaItem as Media).url ?? ''}
                alt={(product.media?.[0].mediaItem as Media).alt ?? ''}
                layout="fill"
                objectFit="cover"
                className={`rounded-md transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Image not found</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-wrap">
            {showTags &&
              product.displayTags?.map((item, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
                >
                  {(item as Tag).title}
                </span>
              ))}
          </div>
        </div>
        <div className="px-4 pb-4">
          <h3 className=" mt-2">{product.title}</h3>
          <div className="flex items-center mt-1 min-h-5">
            <StarRating rating={product.starRating} />
          </div>
          <div className="flex justify-between items-center bg-white">
            <span className=" text-black">${product.prices.basePrice}</span>
            <Button size="icon" onClick={addToCart} className="bg-white text-black">
              <FastAddToCartIcon className="h-5 w-5 text-black" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ShopProductCard

interface FastAddToCartIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function FastAddToCartIcon({ size = 24, ...props }: FastAddToCartIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M1 2h3l1 13h15V5H5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="7" cy="21" r="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="17" cy="21" r="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M9 6l4 4-4 4V6zM13 6l4 4-4 4V6z" />
    </svg>
  )
}
