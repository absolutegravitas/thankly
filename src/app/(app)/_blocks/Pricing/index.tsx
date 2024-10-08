import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { PricingCard } from '@app/_components/PricingCard'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { ChevronIcon } from '@app/_icons/ChevronIcon'
import { CheckIcon } from '@app/_icons/CheckIcon'
import { CloseIcon } from '@app/_icons/CloseIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type Props = Extract<Page['layout'][0], { blockType: 'pricing' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'pricing'> & { padding: PaddingProps }

export const Pricing: React.FC<Props> = (props) => {
  const { pricingFields } = props
  const { plans, disclaimer, settings } = pricingFields || {}

  const [toggledPlan, setToggledPlan] = React.useState('')
  const hasPlans = Array.isArray(plans) && plans.length > 0

  const featureList = (features: any) => {
    return (
      <ul className={classes.features}>
        {features.map((item: any, index: any) => {
          const { feature, icon } = item
          return (
            <li className={classes.feature} key={index}>
              <div className={icon && classes[icon]}>
                {icon === 'check' && <CheckIcon size="large" />}
                {icon === 'x' && <CloseIcon />}
              </div>
              {feature}
            </li>
          )
        })}
      </ul>
    )
  }

  const colsStart: any = {
    0: 'start-1 start-m-1',
    1: 'start-5 start-m-1',
    2: 'start-9 start-m-1',
    3: 'start-13 start-m-1',
  }

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('content'), classes.pricingBlock].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      <Gutter className={classes.gutter}>
        {/* <BackgroundScanline className={classes.scanline} enableBorders /> */}
        {hasPlans && (
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            {plans.map((plan, i) => {
              const {
                name,
                title,
                price,
                hasPrice,
                description,
                link,
                enableLink,
                features,
                enableCreatePayload,
              } = plan
              const isToggled = toggledPlan === name
              const isLast = i + 1 === plans.length

              return (
                <div
                  key={i}
                  className={[classes.plan, 'cols-4 cols-m-8', colsStart[i]]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* <CrosshairIcon className={classes.crosshairTopLeft} /> */}

                  {/* {isLast && <CrosshairIcon className={classes.crosshairTopRight} />} */}

                  <PricingCard
                    leader={name}
                    className={classes.card}
                    price={price}
                    hasPrice={hasPrice}
                    title={title}
                    description={description}
                    link={link}
                  />

                  <div className={classes.collapsibleList}>
                    <Collapsible
                      initialHeight={0}
                      transTime={250}
                      transCurve="ease-in"
                      onToggle={() => {
                        setToggledPlan(toggledPlan === name ? '' : name)
                      }}
                      open={isToggled}
                    >
                      <CollapsibleToggler className={classes.toggler}>
                        {`What's included`}
                        <ChevronIcon
                          className={[classes.chevron, isToggled && classes.open]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      </CollapsibleToggler>
                      <CollapsibleContent>{featureList(features)}</CollapsibleContent>
                    </Collapsible>
                  </div>

                  {(enableLink || enableCreatePayload) && (
                    <div className={classes.ctaWrapper}>
                      {enableLink && (
                        <CMSLink
                          data={{ ...link }}
                          look={{
                            theme: 'light',
                            type: 'button',
                            size: 'medium',
                            width: 'wide',
                            variant: 'blocks',
                          }}
                        />

                        // <CMSLink
                        //   appearance={'default'}
                        //   className={classes.link}
                        //   {...link}
                        //   buttonProps={{
                        //     hideBorders: true,
                        //   }}
                        // />
                      )}

                      {/* {enableCreatePayload && (
                        <CreatePayloadApp background={false} className={classes.createPayloadApp} />
                      )} */}
                    </div>
                  )}

                  <div className={classes.list}>{featureList(features)}</div>
                </div>
              )
            })}
            {disclaimer && (
              <div className={[].filter(Boolean).join(' ')}>
                <div className={classes.disclaimer}>
                  <i>{disclaimer}</i>
                </div>
              </div>
            )}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default Pricing
