// copied from Media Content Block
import * as React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Button } from '@app/_components/Button'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'
import cn from '@/utilities/cn'
import classes from './index.module.scss'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { getCart, isProductInCart } from '@app/_components/Cart/actions'
import { CheckIcon, ChevronDownIcon, SendHorizonalIcon, StarIcon } from 'lucide-react'
import { buttonFormats, contentFormats } from '../../_css/tailwindClasses'
import { CMSLink } from '../../_components/CMSLink'
import Image from 'next/image'
import { AddProduct } from '@app/_components/Cart/AddProduct'
import { ProductActions } from '../../_components/Cart'

export const ProductBlockContent: React.FC<any> = (props) => {
  const {
    id,
    title,
    productType,
    price,
    promoPrice,
    stockOnHand,
    lowStockThreshold,
    media,
    meta,
    image,
  } = props

  return (
    <Gutter>
      <div className="mx-auto max-w-2xl px-4 pt-8  sm:px-6 sm:py-16 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-3 sm:flex items-center justify-between">
            <h1
              className={cn(
                contentFormats.global,
                `text-3xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              {title}
            </h1>

            <div
              className={cn(
                `flex`,
                contentFormats.global,
                `text-xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              <span
                className={` ${+promoPrice != 0 && +promoPrice < +price && 'line-through text-gray-500'}`}
              >
                {price.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {+promoPrice != 0 && (
                <span className="text-black ml-2 ">
                  {promoPrice.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            {/* <div className="ml-4 border-l border-gray-300 pl-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={cn(
                            reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0',
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                  </div>
                  <p className="ml-2 text-sm text-gray-500">{reviews.totalCount} reviews</p>
                </div>
              </div> 
            </div>
*/}
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{meta.description}</p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-xs">
            {/* Image gallery */}
            <TabGroup className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 #hidden w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6 sm:gap-3">
                  {media?.map((image: any, index: any) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-xs bg-white  hover:bg-gray-50  focus:border-solid focus:border focus:border-green border-0"
                    >
                      {({ selected }) => (
                        <>
                          <span className="fill absolute inset-0 overflow-hidden rounded-xs">
                            <Image
                              src={image.mediaItem.url}
                              alt={image.mediaItem.alt || ''}
                              priority={index === 0 ? true : false}
                              fill
                              // layout="fill"
                              // objectFit="cover"
                              className="object-cover object-center"
                            />
                          </span>
                          <span
                            className={cn(
                              selected ? 'ring-green' : 'ring-transparent',
                              'pointer-events-none absolute inset-0 rounded-xs #ring-2 #ring-offset-2',
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="aspect-h-1 aspect-w-1 #w-1/2">
                {media?.map((image: any, index: any) => (
                  <TabPanel className={`fill`} key={image.id}>
                    <Image
                      src={image.mediaItem.url}
                      priority={index === 0 ? true : false}
                      alt={image.mediaItem.alt}
                      height={800}
                      width={800}
                      className="fill object-cover object-center"
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
        </div>

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            {/* <AddProduct product={props} /> */}
            <ProductActions product={props} hidePerks={false} />
          </section>
        </div>
      </div>
      {/* <div className="sm:hidden pt-5 flex items-center justify-center">
        <div className="flex items-center">
          <ChevronDownIcon
            className="h-8 w-8 text-gray-700"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>
      </div> */}
    </Gutter>
  )
}

export const ProductBlock: React.FC<any> = (props) => {
  return (
    <BlockWrapper settings={{ theme: 'light' }} padding={{ top: 'small', bottom: 'small' }}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <div className={classes.wrapper}>
        <ProductBlockContent {...props} />
      </div>
      {/* <div className={classes.background} /> */}
    </BlockWrapper>
  )
}
export default ProductBlock
