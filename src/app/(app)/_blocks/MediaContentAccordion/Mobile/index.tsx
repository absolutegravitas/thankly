import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import Image from 'next/image'

import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { CMSLink } from '@app/_components/CMSLink'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import SplitAnimate from '@app/_components/SplitAnimate'
import { ArrowRightIcon } from '@app/_icons/ArrowRightIcon'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentAccordionProps = Extract<
//   Page['layout'][0],
//   { blockType: 'mediaContentAccordion' }
// > & {
//   className?: string
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
export type MediaContentAccordionProps = ExtractBlockProps<'form'> & { className?: string }

export const MobileMediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  mediaContentAccordionFields,
  className,
}) => {
  const { leader, heading, accordion } = mediaContentAccordionFields || {}

  const mediaRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const hasAccordion = Array.isArray(accordion) && accordion.length > 0
  const [activeAccordion, setActiveAccordion] = useState<number>(0)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(index)
  }

  if (accordion && accordion.length > 0 && mediaRefs.current.length !== accordion.length) {
    mediaRefs.current = accordion.map((_: any, i: any) => mediaRefs.current[i] || createRef())
  }

  useEffect(() => {
    const updateContainerHeight = () => {
      const activeMediaRef = mediaRefs.current[activeAccordion]
      if (activeMediaRef && activeMediaRef.current) {
        const activeMediaHeight = activeMediaRef.current.offsetHeight
        setContainerHeight(activeMediaHeight)
      }
    }

    updateContainerHeight()

    const resizeObserver = new ResizeObserver((entries) => {
      updateContainerHeight()
    })

    const activeMediaRef = mediaRefs.current[activeAccordion]
    if (activeMediaRef && activeMediaRef.current) {
      resizeObserver.observe(activeMediaRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeAccordion])

  return (
    <div
      className={[classes.mobileAccordionWrapper, 'grid', className && className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['start-1 cols-8 start-m-1 cols-m-8'].filter(Boolean).join(' ')}>
        <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
          {leader && <div className={classes.leader}>{leader}</div>}
          {heading && (
            <h3 className={classes.heading}>
              <SplitAnimate text={heading} />
            </h3>
          )}
        </div>
        <div
          className={classes.mediaBackgroundWrapper}
          style={{ height: `calc(${containerHeight}px + 6rem)` }}
        >
          {hasAccordion &&
            accordion.map((item: any, index: any) => (
              <React.Fragment key={item.id || index}>
                {index === activeAccordion && (
                  <React.Fragment>
                    {item.background === 'gradient' && (
                      <React.Fragment>
                        <Image
                          alt=""
                          className={classes.gradientBg}
                          width={1920}
                          height={946}
                          src={`/images/gradients/1.jpg`}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </React.Fragment>
                    )}
                    {item.background === 'scanlines' && (
                      <React.Fragment>
                        {/* <BackgroundScanline
                          className={[classes.scanlineMobile].filter(Boolean).join(' ')}
                        /> */}
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </React.Fragment>
                    )}
                    {item.background === 'none' && <div className={classes.transparentBg} />}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          <div className={classes.mediaMobileContainer}>
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  ref={mediaRefs.current[index]}
                  key={item.id || index}
                  className={classes.media}
                  style={{ opacity: index === activeAccordion ? 1 : 0 }}
                >
                  {typeof item.media === 'object' && item.media !== null && (
                    <Media resource={item.media} />
                  )}
                </div>
              ))}
          </div>
        </div>
        <div>
          <CollapsibleGroup allowMultiple={false} transTime={500} transCurve="ease-in-out">
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  key={item.id || index}
                  className={[
                    classes.collapsibleWrapper,
                    activeAccordion === index ? classes.activeLeftBorder : '',
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
                        activeAccordion === index ? classes.activeItem : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                      <ChevronDownIcon
                        className={[
                          classes.chevronDownIcon,
                          activeAccordion === index ? classes.rotateChevron : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    </CollapsibleToggler>
                    <CollapsibleContent className={classes.collapsibleContent}>
                      <div className={classes.contentWrapper}>
                        <RichText
                          className={classes.mediaDescription}
                          content={item.mediaDescription}
                        />
                        {item.enableLink && item.link && (
                          <CMSLink
                            data={{ ...item.link }}
                            look={{
                              theme: 'light',
                              type: 'button',
                              size: 'medium',
                              width: 'normal',
                              variant: 'blocks',
                              icon: {
                                content: <ChevronRightIcon strokeWidth={1.25} />,
                                iconPosition: 'right',
                              },
                            }}
                          />

                          // <CMSLink className={classes.link} {...item.link}>
                          //   <ArrowRightIcon className={classes.arrowIcon} />
                          // </CMSLink>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
          </CollapsibleGroup>
        </div>
      </div>
    </div>
  )
}
