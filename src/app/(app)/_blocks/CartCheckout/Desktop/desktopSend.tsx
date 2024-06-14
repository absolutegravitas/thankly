import { contentFormats } from '@app/_css/tailwindClasses'
import React from 'react'

export const DesktopSend = () => {
  return (
    <React.Fragment>
      <section className={`col-span-2 rounded-sm bg-lighterkhaki px-6 pb-8 shadow-sm`}>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <h2
              id="summary-heading"
              className={[`${contentFormats.global} ${contentFormats.h3}`].join(' ')}
            >
              Order Summary
            </h2>
          </div>
          <div className="flex items-center sm:mt-4 sm:pr-3">
            {/* <CMSLink
                    url={'/checkout'}
                    label={'Confirm & Pay'}
                    appearance={'contentDark'}
                    width={'narrow'}
                    size={'medium'}
                    icon={true}
                  /> */}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
              Cart Total
            </dt>
            <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
              $96.00
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>Thanklys</dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>$96.00</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              Total Shipping
            </dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>$96.00</dd>
          </div>

          {/* <p
                  className={[contentFormats.global, contentFormats.text, `tracking-tight`].join(
                    ' ',
                  )}
                >
                  <MessageSquareWarningIcon
                    className="mr-2 h-6 w-6"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  All amounts are inclusive of applicable Taxes and Fees.
                </p> */}
        </div>
      </section>
    </React.Fragment>
  )
}
