import { contentFormats } from '@app/_css/tailwindClasses'
import {
  addReceiver,
  removeReceiver,
  removeProduct,
  copyReceiver,
} from '@app/_providers/Cart/actions'
import { MapPinIcon, MessageSquareTextIcon, SendIcon } from 'lucide-react'
import React from 'react'
import {
  AddReceiverButton,
  CopyReceiverIcon,
  RemoveProductButton,
  RemoveReceiverIcon,
} from './ReceiverActions'

export const ReceiversGrid: React.FC<any> = async (item: any) => {
  // console.log('cart item receivers --', JSON.stringify(item?.receivers || null))

  return (
    <React.Fragment>
      <div className="basis-1/4 flex #items-center #justify-end pb-3 gap-4">
        <AddReceiverButton productId={item.product.id} addReceiver={addReceiver} />
        <RemoveProductButton cartItemId={item.id} removeProduct={removeProduct} />
      </div>

      {/* Receiver Grid */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {item?.receivers?.map((receiver: any, index: any) => {
          return (
            <div
              key={index}
              className="relative flex flex-col justify-between border border-solid hover:scale-105 hover:bg-neutral-300/50 hover:delay-75 duration-150 #shadow-md p-6 aspect-square"
            >
              <div>
                <div className="flex flex-row justify-between items-center">
                  <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                    {`#` + (index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex basis-3/4 justify-end items-center gap-x-3">
                    <CopyReceiverIcon
                      cartItemId={item.id}
                      receiverId={receiver.id}
                      copyReceiver={copyReceiver}
                    />
                    <RemoveReceiverIcon
                      cartItemId={item.id} // This should be the ID of the cart item, not the product
                      receiverId={receiver.id}
                      removeReceiver={removeReceiver}
                    />
                  </div>
                </div>
                <h5
                  className={[contentFormats.global, contentFormats.p, 'font-semibold '].join(' ')}
                >
                  {`${receiver.firstName} ${receiver.lastName}`}
                </h5>
                {receiver.addressLine1 && (
                  <React.Fragment>
                    <div
                      className={[
                        contentFormats.global,
                        contentFormats.p,
                        'text-sm pb-5 flex flex-row leading-0',
                      ]
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
                        {[receiver.city, receiver.state, receiver.postcode]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>

                    <div
                      className={[
                        contentFormats.global,
                        contentFormats.p,
                        'text-sm pb-5 flex flex-row',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <SendIcon className="mr-2" strokeWidth={1.25} />
                      <span>{receiver.shippingOption}</span>
                    </div>
                  </React.Fragment>
                )}
                {receiver.message && (
                  <div
                    className={[
                      contentFormats.global,
                      contentFormats.p,
                      'text-sm py-4 flex flex-row leading-tight',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <MessageSquareTextIcon
                      className="flex-shrink-0 w-5 h-5 mr-2"
                      strokeWidth={1.25}
                    />
                    <span>{receiver.message}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto text-right">
                <div>
                  <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                    Cost:{' '}
                    {(receiver.total || 0).toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                    {`+ Shipping: ${receiver.shippingOption != 'free' ? '(' + receiver.shippingOption + ')' : ''}`}
                    {(receiver.shipping || 0).toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                  {/* {'Subtotal: '} */}
                  {((receiver.total || 0) + (receiver.shipping || 0) || 0).toLocaleString('en-AU', {
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
    </React.Fragment>
  )
}
