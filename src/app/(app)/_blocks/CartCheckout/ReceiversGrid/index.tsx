'use client'

import React, { CSSProperties, useEffect, useTransition, useState } from 'react'

import classes from './index.module.scss'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { contentFormats } from '@app/_css/tailwindClasses'
import { CopyIcon, TrashIcon } from 'lucide-react' // Assuming these are the Lucide React icons for copy and delete
import cn from '@/utilities/cn'
export const ReceiversGrid: React.FC<any> = () => {
  const [index, setIndex] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedMessage, setEditedMessage] = useState<string>('')

  // useEffect to watch for changes in the receivers array
  useEffect(() => {
    // Do something when receivers array changes
  }, [receivers])

  const handleEditClick = (index: number, currentMessage: string) => {
    setEditingIndex(index)
    setEditedMessage(currentMessage)
  }

  const handleSaveClick = () => {
    // Save the new message
    if (editingIndex !== null) {
      receivers[editingIndex].message = editedMessage
      setEditingIndex(null)
      setEditedMessage('')
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {receivers.length > 0 && (
        <div className={classes.cards}>
          {/* <div className={classes.margins}>
              <BackgroundScanline enableBorders={true} className={classes.marginLeft} />
              <BackgroundScanline enableBorders={true} className={classes.marginRight} />
            </div> */}
          <div
            className={['grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6']
              .filter(Boolean)
              .join(' ')}
          >
            {receivers.map((receiver: any, index: any) => {
              return (
                <div
                  key={index}
                  className={'border-solid border #hover:bg-gray-100'}
                  onMouseEnter={() => setIndex(index + 1)}
                  onMouseLeave={() => setIndex(0)}
                >
                  <div className={[classes.card, , 'hover:bg-gray-100'].filter(Boolean).join(' ')}>
                    <div className={[classes.leader, ''].join(' ')}>
                      <h6 className={[classes.leaderText, ''].join(' ')}>
                        {(index + 1).toString().padStart(2, '0')}
                      </h6>
                      <div className="flex flex-none items-end gap-x-3 align-top">
                        <CopyIcon
                          className={`h-5 w-5 flex-none hover:text-green cursor-pointer hover:animate-pulse`}
                          aria-hidden="true"
                          strokeWidth={1.1}
                        />

                        <TrashIcon
                          className={cn(
                            `h-5 w-5 flex-none cursor-pointer hover:text-green hover:animate-pulse`,
                          )}
                          aria-hidden="true"
                          strokeWidth={1.1}
                        />
                      </div>
                    </div>

                    <div className={''}>
                      <h5
                        className={[
                          contentFormats.global,
                          contentFormats.text,
                          `font-semibold text-base`,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {`${receiver.firstName} ${receiver.lastName}`}
                      </h5>{' '}
                      {receiver.addressLine1 && (
                        <div
                          className={[
                            classes.descriptionWrapper,
                            contentFormats.global,
                            contentFormats.p,
                            `text-sm `,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <p className={classes.description}>
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
                          </p>
                        </div>
                      )}
                    </div>
                    {editingIndex === index ? (
                      <div className={classes.descriptionWrapper}>
                        <div className="relative mt-2 flex items-center">
                          <textarea
                            // type="text"
                            value={editedMessage}
                            name="search"
                            onChange={(e) => setEditedMessage(e.target.value)}
                            id="search"
                            className={cn(
                              contentFormats.global,
                              // contentFormats.text,
                              `font-body text-sm leading-tighter tracking-tight`,
                              'block w-full rounded-xs border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6',
                            )}
                          />
                          <div
                            onClick={handleSaveClick}
                            className="cursor-pointer absolute inset-y-0 right-0 flex py-1.5 pr-1.5"
                          >
                            <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                              {`Save >`}
                            </kbd>
                          </div>
                        </div>
                      </div>
                    ) : (
                      receiver.message && (
                        <div
                          className={[
                            classes.descriptionWrapper,
                            contentFormats.global,
                            contentFormats.p,
                            `text-sm`,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleEditClick(index, receiver.message)}
                        >
                          <p className={classes.description}>{receiver.message}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
export default ReceiversGrid

const receivers = [
  {
    id: '665fd322f855774296f7a9f1',
    firstName: 'John',
    lastName: 'Smith',
    message:
      'It was the best of times, it was the blurst of times. Wherefore are thou blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id eleifend leo. Nullam aliquet, nisi at congue consectetur, massa ligula lacinia lorem.',
    addressLine1: '123 Fake St',
    addressLine2: null,
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3124',
    shippingOption: 'free',
    receiverPrice: null,
    receiverShipping: null,
    receiverTotal: null,
  },
  {
    id: '665fd322f855774296f7a9f1',
    firstName: 'John',
    lastName: 'Smith',
    message: 'It was the blurst of times...',
    addressLine1: '123 Fake St',
    addressLine2: null,
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3124',
    shippingOption: 'free',
    receiverPrice: null,
    receiverShipping: null,
    receiverTotal: null,
  },
  {
    id: '665fd322f855774296f7a9f1',
    firstName: 'John',
    lastName: 'Smith',
    message: 'It was the blurst of times...',
    addressLine1: '123 Fake St',
    addressLine2: null,
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3124',
    shippingOption: 'free',
    receiverPrice: null,
    receiverShipping: null,
    receiverTotal: null,
  },
  {
    id: '665fd322f855774296f7a9f1',
    firstName: 'John',
    lastName: 'Smith',
    message: 'It was the blurst of times...',
    addressLine1: '123 Fake St',
    addressLine2: null,
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3124',
    shippingOption: 'free',
    receiverPrice: null,
    receiverShipping: null,
    receiverTotal: null,
  },
]
