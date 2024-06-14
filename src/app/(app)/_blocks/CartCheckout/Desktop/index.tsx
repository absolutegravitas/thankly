import React, { Fragment, useState, useTransition } from 'react'
import { Collapsible, CollapsibleGroup, CollapsibleToggler } from '@faceless-ui/collapsibles'

import SplitAnimate from '@app/_components/SplitAnimate'

import classes from './index.module.scss'
import { contentFormats } from '@/app/(app)/_css/tailwindClasses'
import {
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MessageCircleWarningIcon,
  StickyNoteIcon,
} from 'lucide-react'
import { Button } from '@app/_components/Button'
import { useRouter } from 'next/navigation'
import { clearCart } from '@app/_components/Cart/actions'
import Link from 'next/link'

export const DesktopCheckout: React.FC<any> = ({ leader, heading, accordion }) => {
  const hasAccordion = Array.isArray(accordion) && accordion.length > 0
  const [activeAccordion, setActiveAccordion] = useState<number>(0)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRouting, startRouting] = useTransition()

  const toggleAccordion = (index: number) => {
    setActiveAccordion(index)
  }

  return (
    <Fragment>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          {leader && <div className={classes.leader}>{leader}</div>}
          {heading && (
            <React.Fragment>
              <h3 className={[classes.heading, 'flex justify-between space-x-5 pb-6'].join(' ')}>
                <span>
                  <SplitAnimate text={heading} />
                </span>
              </h3>
              <span
                className={['text-right text-xl', contentFormats.global, contentFormats.p].join(
                  ' ',
                )}
              >
                {`Total: $123.45`}
              </span>
            </React.Fragment>
          )}
        </div>
        <div className="col-start-2 col-span-full">
          <div className="flex justify-between space-x-6">
            <Button
              url="/shop"
              label={'Clear Cart'}
              appearance={'default'}
              fullWidth
              data-theme={'light'}
              icon="trash"
              onClick={() => {
                startRouting(async () => {
                  clearCart()
                  router.push('/shop')
                })
              }}
            />
            <Button
              url="/shop"
              label={'Back to Shop'}
              appearance={'default'}
              fullWidth
              data-theme={'light'}
              icon="chevron"
              onClick={() => {
                startRouting(async () => {
                  router.push('/shop')
                })
              }}
            />
          </div>
          {/* <div className={[contentFormats.global, contentFormats.text, `pt-5 pb-3`].join(' ')}>
            <StickyNoteIcon className="mr-2 h-5 w-5" strokeWidth={1.25} />
            <span className="">
              {`Thankly Cards: Allow VIC (5 business days), Interstate (6-8 business days) due to AusPost letter delivery frequency changes. `}
              <Link
                className={[contentFormats.global, contentFormats.a].join(' ')}
                href="https://dub.sh/auspost"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </div> */}
        </div>
      </div>

      <div className="pt-6 grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <CollapsibleGroup allowMultiple={false} transTime={500} transCurve="ease-in-out">
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  key={item.id || index}
                  className={[
                    classes.collapsibleWrapper,
                    activeAccordion === index ? [classes.activeLeftBorder] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Collapsible
                    onToggle={() => toggleAccordion(index)}
                    open={activeAccordion === index}
                  >
                    <CollapsibleToggler
                      className={[
                        classes.collapsibleToggler,
                        activeAccordion === index ? [classes.activeItem].join(' ') : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div
                        className={[
                          classes.togglerTitle,
                          `${contentFormats.global} ${contentFormats.h3}`,
                        ].join(' ')}
                      >
                        {item.mediaLabel}
                      </div>

                      {activeAccordion === index ? (
                        <ChevronRightIcon
                          strokeWidth={1.25}
                          className={['animate-fade-in'].filter(Boolean).join(' ')}
                        />
                      ) : (
                        <ChevronDownIcon
                          strokeWidth={1.25}
                          className={['animate-fade-in'].filter(Boolean).join(' ')}
                        />
                      )}
                    </CollapsibleToggler>
                  </Collapsible>
                </div>
              ))}
          </CollapsibleGroup>
        </div>
        <div className="col-start-2 col-span-full">
          {hasAccordion && accordion[activeAccordion] && (
            <React.Fragment key={accordion[activeAccordion].id}>
              {accordion[activeAccordion].desktopComponent}
            </React.Fragment>
          )}
        </div>
      </div>
    </Fragment>
  )
}
