import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import Image from 'next/image'

import { CMSLink } from '@app/_components/CMSLink'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import SplitAnimate from '@app/_components/SplitAnimate'
import { ArrowRightIcon } from '@app/_icons/ArrowRightIcon'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

export const MobileMediaContentAccordion: React.FC<any> = ({ leader, heading, accordion }) => {
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
    <div className={[classes.mobileAccordionWrapper, 'grid sm:hidden'].filter(Boolean).join(' ')}>
      <div className={['start-1 cols-8 start-m-1 cols-m-8'].filter(Boolean).join(' ')}>
        <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
          <div className={classes.leader}>{`${leader}`}</div>
          <h3 className={classes.heading}>
            <SplitAnimate text={`${heading}`} />
          </h3>
        </div>
        <div className={classes.accordionWrapper}>
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
                  </Collapsible>
                </div>
              ))}
          </CollapsibleGroup>
        </div>
        <div
          className={classes.mediaBackgroundWrapper}
          style={{ height: `calc(${containerHeight}px + 6rem)` }}
        >
          {/* {hasAccordion &&
            accordion.map((item: any, index: any) => (
              <Fragment key={item.id || index}>
                {index === activeAccordion && <div className={classes.transparentBg} />}
              </React.Fragment>
            ))} */}
          <div className={classes.mediaMobileContainer}>
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  ref={mediaRefs.current[index]}
                  key={item.id || index}
                  className={classes.media}
                  style={{ opacity: index === activeAccordion ? 1 : 0 }}
                >
                  {item.mobileComponent}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
