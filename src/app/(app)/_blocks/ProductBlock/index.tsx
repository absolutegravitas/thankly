// This file contains a React component that renders a product block for an e-commerce website.
// The component displays product details such as title, price, description, and images.
// It also includes an "Add to Cart" button and allows users to switch between different product images.
//
// The component is built using Next.js 14 with App Router and server components, which provides a more efficient
// and streamlined approach to server-side rendering and data fetching.
//
// Performance considerations:
// - Lazy loading and optimizing image sizes can improve load times.
// - Memoizing formatPrice function and avoiding unnecessary re-renders can enhance performance.
//
// Accessibility (a11y) considerations:
// - Ensure proper alt text is provided for images.
// - Use appropriate ARIA roles and labels for better screen reader accessibility.
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Product, Media, Tag } from '@payload-types' // Types for product and media data
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { useCart } from '@/app/(app)/_providers/Cart'
import { messages } from '@/utilities/referenceText'
import { CheckIcon, FrownIcon, MessageCircleWarningIcon } from 'lucide-react'
import { AddToCartButton } from '../../_components/ProductActions/AddToCart'
import { ViewInCartButton } from '../../_components/ProductActions/ViewInCart'
import { Card, CardContent } from '../../_components/ui/card'
import { Button } from '../../_components/ui/button'
import { Heart, Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@app/_components/ui/accordion'
import RichText from '../RichText'
import StarRating from '../../_components/StarRating'
import { ProductPlus } from '../Cart/cart-types'
import { useMediaQuery } from 'react-responsive'
// import { RemoveFromCartButton } from '../../_components/ProductActions/RemoveFromCart'
import { useRouter } from 'next/navigation'

interface ProductBlockContentProps {
  product: Product // The product data to be displayed
  selectedImageIndex?: number // Index of the currently selected image (default: 0)
}

// Renders the main content of the product block
const ProductBlockContent: React.FC<ProductBlockContentProps> = ({
  product,
  selectedImageIndex = 0,
}) => {
  const router = useRouter()

  const isMobile = useMediaQuery({ maxWidth: 639 })
  // Hook to access cart-related state and functions
  const { isProductInCart, cart, addCartItem } = useCart()

  // State to track if the product is in the cart
  const [inCart, setInCart] = useState<boolean>(isProductInCart(product.id))

  // Side effect to update the `inCart` state when the cart or product changes
  useEffect(() => {
    setInCart(isProductInCart(product.id))
  }, [cart, product.id, isProductInCart])

  // Destructure product prices
  const {
    //media: images,
    prices: { salePrice, basePrice },
  } = product

  // Calculate if the product is on sale
  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  // Check if the product is out of stock
  const outOfStock =
    product.stock?.stockOnHand === 0 ||
    product.stock?.stockOnHand === null ||
    product.stock?.stockOnHand === undefined

  // Check if the product has low stock
  const lowStock =
    product.stock?.stockOnHand &&
    product.stock?.lowStockThreshold &&
    product.stock?.stockOnHand <= product.stock?.lowStockThreshold

  //new code starts here
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([])
  const [addOnIndex, setAddOnIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

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

  const toggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && addOnIndex > 0) {
      setAddOnIndex((prev) => prev - 1)
    } else if (direction === 'right' && addOnIndex < product.addOns!.length - 3) {
      setAddOnIndex((prev) => prev + 1)
    }
  }

  const currentMediaItem =
    product.media && product.media.length > 0 ? product.media?.[currentSlide].mediaItem : undefined

  const isProduct = (item: unknown): item is Product => {
    return (item as Product).id !== undefined
  }

  const addToCart = () => {
    const selectedAddOnProducts =
      product.addOns?.filter(
        (addOn): addOn is Product =>
          typeof addOn === 'object' && 'id' in addOn && selectedAddOns.includes(addOn.id),
      ) ?? []
    addCartItem(
      product,
      quantity,
      selectedAddOnProducts.length > 0 ? selectedAddOnProducts : undefined,
    )
    router.push('/cart')
  }

  return (
    <Card className="max-w-[80vw] mx-auto">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isMobile ? (
            <div className="flex flex-col gap-4">
              <div className="relative">
                {currentMediaItem && (
                  <>
                    <img
                      src={(currentMediaItem as Media).url ?? undefined}
                      alt={(currentMediaItem as Media).alt ?? undefined}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={isFavorite ? 'fill-current text-thankly-green' : ''} />
                      <span className="sr-only">
                        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      </span>
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {product.media?.map((item, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden ${
                      index === currentSlide ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <img
                      src={(item.mediaItem as Media).url ?? undefined}
                      alt={(item.mediaItem as Media).alt ?? undefined}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="w-20 flex flex-col gap-2">
                {product.media?.map((item, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 border rounded-md overflow-hidden ${
                      index === currentSlide ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <img
                      src={(item.mediaItem as Media).url ?? undefined}
                      alt={(item.mediaItem as Media).alt ?? undefined}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {currentMediaItem && (
                <div className="flex-grow relative">
                  <img
                    src={(currentMediaItem as Media).url ?? undefined}
                    alt={(currentMediaItem as Media).alt ?? undefined}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={isFavorite ? 'fill-current text-thankly-green' : ''} />
                    <span className="sr-only">
                      {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-2">
              {product.displayTags?.map((item, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                >
                  {(item as Tag).title}
                </span>
              ))}
              <StarRating rating={product.starRating} />
            </div>
            {onSale ? (
              <div className="flex flex-row">
                <p className="text-3xl font-bold text-gray-300 mb-4 line-through">
                  ${product.prices.basePrice}
                </p>
                <p className="text-3xl font-bold mb-4 ml-2">${product.prices.salePrice}</p>
              </div>
            ) : (
              <p className="text-3xl font-bold mb-4">${product.prices.basePrice}</p>
            )}
            <RichText className="mb-4" content={product.description} />
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
            <div>
              Ordering over 10 bundles?{' '}
              <Button asChild variant="link">
                <a
                  href={`mailto:${process.env.NEXT_THANKLY_BUSINESS_EMAIL}?subject=Bulk Order Inquiry`}
                >
                  Contact Us
                </a>
              </Button>
            </div>
            {product.extraDetails && product.extraDetails.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full mb-6"
                defaultValue={product.extraDetails[0].title}
              >
                {product.extraDetails.map((item, index) => (
                  <AccordionItem key={index} value={item.title}>
                    <AccordionTrigger>What's included</AccordionTrigger>
                    <AccordionContent>
                      <RichText content={item.details} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {product.addOns && product.addOns.length > 0 && (
              <div className="mb-6">
                <h2 className="justify-between py-4 font-medium mb-3">Extra love to give?</h2>
                <div className="relative overflow-hidden">
                  <div
                    ref={sliderRef}
                    className="flex space-x-4 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${addOnIndex * (128 + 16)}px)` }}
                  >
                    {product.addOns.filter(isProduct).map((addon) => (
                      <div key={addon.id} className="w-32 flex-shrink-0">
                        <button
                          className={`w-full border rounded-md p-2 transition-colors ${
                            selectedAddOns.includes(addon.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200'
                          }`}
                          onClick={() => toggleAddOn(addon.id)}
                        >
                          {addon.media && addon.media[0] && addon.media[0].mediaItem && (
                            <img
                              src={(addon.media[0].mediaItem as Media).url ?? undefined}
                              alt={(addon.media[0].mediaItem as Media).alt ?? undefined}
                              className="w-full h-24 object-cover rounded-md mb-2"
                            />
                          )}
                          <p className="text-sm font-medium truncate">{addon.title}</p>
                          <p className="text-sm text-gray-500">+${addon.prices.basePrice}</p>
                        </button>
                      </div>
                    ))}
                  </div>
                  {addOnIndex !== 0 && (
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
                  )}
                  {addOnIndex < product.addOns.length - 3 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full shadow"
                      onClick={() => scroll('right')}
                      disabled={addOnIndex >= product.addOns.length - 3}
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            <Button className="w-full max-w-2xl rounded-2xl" onClick={addToCart}>
              Personalise and send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Old Product block code
  // <Gutter>
  //   <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:py-16 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
  //     {/* Product details */}
  //     <div className="lg:max-w-lg lg:self-start align-top">
  //       <div className="mt-3 sm:flex items-start justify-between align-top">
  //         <h1
  //           className={cn(
  //             contentFormats.global,
  //             `text-3xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
  //           )}
  //         >
  //           {product.title}
  //         </h1>

  //         <div
  //           className={cn(
  //             'flex flex-col items-end ml-2',
  //             contentFormats.global,
  //             contentFormats.h4,
  //           )}
  //         >
  //           <span
  //             className={`text-black font-semibold ${onSale === true && 'text-sm !line-through text-gray-700'}`}
  //           >
  //             {basePrice?.toLocaleString('en-AU', {
  //               style: 'currency',
  //               currency: 'AUD',
  //               minimumFractionDigits: 0,
  //               maximumFractionDigits: 2,
  //             })}
  //           </span>
  //           {onSale && (
  //             <span className={''}>
  //               {`${salePrice.toLocaleString('en-AU', {
  //                 style: 'currency',
  //                 currency: 'AUD',
  //                 minimumFractionDigits: 0,
  //                 maximumFractionDigits: 2,
  //               })}`}
  //             </span>
  //           )}
  //         </div>
  //       </div>

  //       <section aria-labelledby="information-heading" className="mt-4">
  //         <div className="mt-4 space-y-6">
  //           <p className="text-base text-gray-500">
  //             {product.meta &&
  //               product.meta.description &&
  //               product.meta.description.replace(/\s/g, ' ')}
  //           </p>
  //         </div>
  //       </section>
  //     </div>

  //     {/* Product images */}
  //     <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
  //       {images && images.length > 0 && (
  //         <>
  //           {/* Main image */}
  //           <div className="aspect-square relative overflow-hidden rounded-md mb-4">
  //             {lowStock && !outOfStock && (
  //               <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
  //                 <span className="text-base">{messages.lowStock}</span>
  //               </div>
  //             )}
  //             <Image
  //               src={getImageUrl(images[selectedImageIndex]?.mediaItem)}
  //               alt={getImageAlt(images[selectedImageIndex]?.mediaItem)}
  //               priority
  //               width={1200}
  //               height={1200}
  //               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  //               className="object-cover object-center w-full h-full"
  //             />
  //             {outOfStock ?? (
  //               <div className="absolute inset-0 flex items-center justify-center">
  //                 <span className="flex w-full font-body text-white bg-black bg-opacity-50 px-4 py-2 items-center justify-between">
  //                   <FrownIcon
  //                     className="h-7 w-7 flex-shrink-0 text-white"
  //                     strokeWidth={1.25}
  //                     aria-hidden="true"
  //                   />
  //                   {`Out of Stock`}
  //                 </span>
  //               </div>
  //             )}
  //           </div>

  //           {/* Thumbnail images */}
  //           <div className="grid grid-cols-4 gap-4">
  //             {images.map((image, index) => (
  //               <Link
  //                 key={image.id || index}
  //                 href={`/shop/${product.slug}?image=${index}`}
  //                 className={`aspect-square overflow-hidden rounded-md ${index === selectedImageIndex ? 'ring-2 ring-green' : ''}`}
  //               >
  //                 <Image
  //                   src={getImageUrl(image.mediaItem)}
  //                   alt={getImageAlt(image.mediaItem)}
  //                   width={200}
  //                   height={200}
  //                   className="object-cover object-center w-full h-full"
  //                 />
  //               </Link>
  //             ))}
  //           </div>
  //         </>
  //       )}
  //     </div>

  //     <div className="py-6 flex flex-row items-center justify-between px-6">
  //       {!outOfStock && !inCart && (
  //         <div className="w-full flex pb-2">
  //           <AddToCartButton product={product} />
  //         </div>
  //       )}

  //       {inCart && (
  //         <div className="flex flex-col">
  //           <div className="w-full flex pb-2 gap-2">
  //             <div className="flex-auto w-3/4">
  //               <ViewInCartButton />
  //             </div>
  //             <div className="flex-initial w-1/4">
  //               {/* <RemoveFromCartButton cartItemId={product.id} /> */}
  //               <div className="sm:flex pt-2 items-center justify-center space-x-2"></div>
  //             </div>
  //           </div>
  //           <div className="sm:flex pt-2 items-center justify-center space-x-2">
  //             <div className="py-4 sm:py-4 flex items-center">
  //               {/* If the product is in the cart and hideRemove is not set, a warning message is displayed regarding removing the product from the cart. */}
  //               <CheckIcon
  //                 className="h-8 w-8 flex-shrink-0 text-green"
  //                 strokeWidth={1.25}
  //                 aria-hidden="true"
  //               />
  //               <div className="ml-2 text-sm text-gray-500">
  //                 {messages.removeProductBase}
  //                 {messages.removeProductExtra}
  //               </div>
  //             </div>
  //           </div>

  //           <div className="sm:flex pt-2 items-center justify-center space-x-2">
  //             <div className="py-1 sm:py-2 flex items-center">
  //               <MessageCircleWarningIcon
  //                 className="h-8 w-8 flex-shrink-0 text-green"
  //                 strokeWidth={1.25}
  //                 aria-hidden="true"
  //               />
  //               <div className="ml-2 text-sm text-gray-500">{messages.removeProductWarning}</div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>

  //     {/* <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
  //       <section aria-labelledby="options-heading">
  //         <ProductActions product={product} hidePerks={false} hideRemove={false} />
  //       </section>
  //     </div> */}
  //   </div>
  // </Gutter>
}

interface ProductBlockProps {
  product: ProductPlus // The product data to be displayed
  selectedImageIndex?: number // Index of the currently selected image (default: 0)
}

// Renders the overall product block component
export const ProductBlock: React.FC<ProductBlockProps> = ({ product, selectedImageIndex = 0 }) => {
  return (
    <BlockWrapper className={getPaddingClasses('content')}>
      <ProductBlockContent product={product} selectedImageIndex={selectedImageIndex} />
    </BlockWrapper>
  )
}

export default ProductBlock
