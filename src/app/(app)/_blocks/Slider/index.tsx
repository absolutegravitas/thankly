import * as React from 'react'
import {
  Slide,
  SliderNav,
  SliderProgress,
  SliderProvider,
  SliderTrack,
  useSlider,
} from '@faceless-ui/slider'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { ArrowIcon } from '../../_icons/ArrowIcon'
import { useComputedCSSValues } from '../../_providers/ComputedCSSValues'
import { QuoteCard } from './QuoteCard'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'slider' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'slider'> & { padding: PaddingProps }

export const SliderBlock: React.FC<Props> = (props) => {
  const { sliderFields } = props
  const { settings } = sliderFields
  const { currentSlideIndex } = useSlider()

  const slides = sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex + 1 === slides.length

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('slider'), classes.slider].filter(Boolean).join(' ')}
    >
      {/* <BackgroundGrid zIndex={0} /> */}

      <div className={classes.trackWrap}>
        <BackgroundGrid
          zIndex={5}
          ignoreGutter
          gridLineStyles={{
            1: {
              display: 'none',
            },
            2: {
              display: 'none',
            },
            3: {
              display: 'none',
            },
          }}
        />
        <SliderTrack className={classes.sliderTrack}>
          {slides.map((slide: any, index: any) => {
            const isActive = currentSlideIndex === index
            return (
              <Slide
                key={index}
                index={index}
                className={[classes.slide, classes.quoteSlide].filter(Boolean).join(' ')}
              >
                <BackgroundGrid
                  zIndex={1}
                  ignoreGutter
                  gridLineStyles={{
                    0: { display: 'none' },
                    1: { display: 'none' },
                    2: { display: 'none' },
                    3: { display: 'none' },
                  }}
                />
                <QuoteCard isActive={isActive} {...slide} />
              </Slide>
            )
          })}
          <div className={classes.fakeSlide} />
        </SliderTrack>
        <div className={classes.progressBarBackground} />
      </div>

      <Gutter>
        <SliderNav
          className={classes.sliderNav}
          prevButtonProps={{
            className: [classes.navButton, classes.prevButton, isFirst && classes.disabled]
              .filter(Boolean)
              .join(' '),
            children: <ArrowIcon rotation={225} />,
            disabled: isFirst,
          }}
          nextButtonProps={{
            className: [classes.navButton, isLast && classes.disabled].filter(Boolean).join(' '),
            children: <ArrowIcon rotation={45} />,
            disabled: isLast,
          }}
        />
      </Gutter>
      <SliderProgress />
    </BlockWrapper>
  )
}

export const Slider: React.FC<any> = (props) => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider scrollSnap={true} slideOnSelect={true} slidesToShow={1} scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}

export default Slider
