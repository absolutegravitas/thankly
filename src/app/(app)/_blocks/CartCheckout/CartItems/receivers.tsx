import React from 'react'
import cn from '@/utilities/cn'
import { cartStaticText } from '@/utilities/staticText'
import { contentFormats } from '@app/_css/tailwindClasses'
import Link from 'next/link'
import { CopyIcon, MapPinIcon, MessageSquareTextIcon, TrashIcon } from 'lucide-react'

export const Receivers: React.FC<any> = ({ productType, receivers }: any) => {
  console.log('productType', productType)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className={cn(contentFormats.global, contentFormats.text)}>
        {productType === 'card' && (
          <React.Fragment>
            <span className="font-semibold">{`Thankly Cards: `}</span>
            <span className={[contentFormats.text].join(' ')}>
              {cartStaticText.shippingMessage}
              <Link
                className={[contentFormats.global, contentFormats.a].join(' ')}
                href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </React.Fragment>
        )}
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {receivers?.map((receiver: any, index: any) => {
          return (
            <div
              key={index}
              className="hover:scale-105  border border-solid hover:bg-gray-200/50 hover:delay-75 duration-150 hover:shadow-md rounded-md px-5 py-6 aspect-square"
            >
              <div
                className={[
                  `flex flex-row justify-between items-center`, // Added items-center to vertically center the content
                  contentFormats.global,
                  contentFormats.h5,
                ].join(' ')}
              >
                <h5 className="flex basis-1/4">{(index + 1).toString().padStart(2, '0')}</h5>
                <div className="flex basis-3/4 justify-end items-center gap-x-3">
                  <CopyIcon
                    className="h-5 w-5 hover:text-green cursor-pointer hover:animate-pulse"
                    aria-hidden="true"
                    strokeWidth={1.1}
                    // onClick={() => handleCopy(index)}
                  />
                  <TrashIcon
                    className="h-5 w-5 cursor-pointer hover:text-green hover:animate-pulse"
                    aria-hidden="true"
                    strokeWidth={1.1}
                    // onClick={() => handleDelete(index)}
                  />
                </div>
              </div>
              <h5
                className={[contentFormats.global, contentFormats.text, `font-semibold`]
                  .filter(Boolean)
                  .join(' ')}
              >
                {`${receiver.firstName} ${receiver.lastName}`}
              </h5>
              {receiver.addressLine1 && (
                <div
                  className={[contentFormats.global, contentFormats.p, `text-sm pb-5 flex flex-row`]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <MapPinIcon className="mr-2" strokeWidth={1.25} />
                  <span>
                    {receiver.addressLine1}
                    {receiver.addressLine2 && (
                      <>
                        <br />
                        {receiver.addressLine2}
                      </>
                    )}
                    <br />
                    {[receiver.city, receiver.state, receiver.postcode].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {receiver.message && (
                <div
                  className={[contentFormats.global, contentFormats.p, `text-sm py-4 flex flex-row`]
                    .filter(Boolean)
                    .join(' ')}
                  // onClick={() => handleEditClick(index, receiver.message)}
                >
                  <MessageSquareTextIcon
                    className="flex-shrink-0 w-5 h-5 mr-2"
                    strokeWidth={1.25}
                  />
                  <span>{receiver.message}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className={[contentFormats.global, contentFormats.h6].join(' ')}>
                    Cost:{' '}
                    {receiver.total?.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                    + Shipping:{' '}
                    {receiver.shipping?.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                  Subtotal:{' '}
                  {(receiver.total + receiver.shipping)?.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
