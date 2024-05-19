'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSForm } from '@app/_components/CMSForm'
import { Gutter } from '@app/_components/Gutter'
import { useGetHeroPadding } from '../useGetHeroPadding'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type FormHeroProps = ExtractBlockProps<'fields'>

export const FormHero: React.FC<FormHeroProps> = ({
  richText,
  description,
  form,
  theme,
  firstContentBlock,
}) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)

  const formRef = useRef<HTMLDivElement | null>(null)
  const [backgroundHeight, setBackgroundHeight] = useState(0)

  useEffect(() => {
    const updateBackgroundHeight = () => {
      const newBackgroundHeight = formRef.current ? formRef.current.offsetHeight : 0
      setBackgroundHeight(newBackgroundHeight)
    }
    updateBackgroundHeight()
    window.addEventListener('resize', updateBackgroundHeight)

    return () => window.removeEventListener('resize', updateBackgroundHeight)
  }, [])

  if (typeof form === 'string') return null

  return (
    <BlockWrapper settings={{ theme }} padding={padding}>
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.formHero, 'grid'].filter(Boolean).join(' ')}>
          <div className={[classes.sidebar, 'cols-6 cols-m-8 start-1'].filter(Boolean).join(' ')}>
            <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />
            <div className={classes.contentWrapper}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />
            </div>
          </div>
          <div
            className={[classes.formWrapper, 'cols-8 start-9 cols-m-8 start-m-1 grid']
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[classes.scanlineDesktopWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 10rem)` }}
            >
              <BackgroundScanline
                className={[classes.scanline].filter(Boolean).join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />
            </div>
            <div
              className={[classes.scanlineMobileWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 4px)` }}
            >
              <BackgroundScanline
                className={[classes.scanline].filter(Boolean).join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />
            </div>
            <div
              ref={formRef}
              className={[classes.cmsForm, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
            >
              <CMSForm form={form} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

export default FormHero

// 'use client'

// import React, { useEffect, useRef, useState } from 'react'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
// import { BackgroundScanline } from '@app/_components/BackgroundScanline'
// import { BlockWrapper } from '@app/_components/BlockWrapper'
// import { CMSForm } from '@app/_components/CMSForm'
// import { Gutter } from '@app/_components/Gutter'
// import { BlocksProp } from '@app/_components/RenderBlocks'
// // import { RichText } from '@app/_components/RichText'
// import { Page } from '@payload-types'
// import { useGetHeroPadding } from '../useGetHeroPadding'
// import { RichText } from '@app/_blocks/RichText'

// import classes from './index.module.scss'

// export type FormHeroProps = Page['hero']

// export const FormHero: React.FC<
//   FormHeroProps & {
//     breadcrumbs?: Page['breadcrumbs']
//     firstContentBlock?: BlocksProp
//   }
// > = (props) => {
//   const { richText, description, form, theme, firstContentBlock } = props
//   const padding = useGetHeroPadding(theme, firstContentBlock)

//   const formRef = useRef<HTMLDivElement | null>(null)
//   const [backgroundHeight, setBackgroundHeight] = useState(0)

//   useEffect(() => {
//     const updateBackgroundHeight = () => {
//       const newBackgroundHeight = formRef.current ? formRef.current.offsetHeight : 0
//       setBackgroundHeight(newBackgroundHeight)
//     }
//     updateBackgroundHeight()
//     window.addEventListener('resize', updateBackgroundHeight)

//     return () => window.removeEventListener('resize', updateBackgroundHeight)
//   }, [])

//   if (typeof form === 'string') return null

//   return (
//     <BlockWrapper settings={{ theme }} padding={padding}>
//       <BackgroundGrid zIndex={0} />
//       <Gutter>
//         <div className={[classes.formHero, 'grid'].filter(Boolean).join(' ')}>
//           <div className={[classes.sidebar, 'cols-6 cols-m-8 start-1'].filter(Boolean).join(' ')}>
//             <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />
//             <div className={classes.contentWrapper}>
//               <RichText
//                 content={description}
//                 className={[classes.description].filter(Boolean).join(' ')}
//               />
//             </div>
//           </div>
//           <div
//             className={[classes.formWrapper, 'cols-8 start-9 cols-m-8 start-m-1 grid']
//               .filter(Boolean)
//               .join(' ')}
//           >
//             <div
//               className={[classes.scanlineDesktopWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
//                 .filter(Boolean)
//                 .join(' ')}
//               style={{ height: `calc(${backgroundHeight}px + 10rem)` }}
//             >
//               <BackgroundScanline
//                 className={[classes.scanline].filter(Boolean).join(' ')}
//                 crosshairs={['top-left', 'bottom-left']}
//               />
//             </div>
//             <div
//               className={[classes.scanlineMobileWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
//                 .filter(Boolean)
//                 .join(' ')}
//               style={{ height: `calc(${backgroundHeight}px + 4px)` }}
//             >
//               <BackgroundScanline
//                 className={[classes.scanline].filter(Boolean).join(' ')}
//                 crosshairs={['top-left', 'bottom-left']}
//               />
//             </div>
//             <div
//               ref={formRef}
//               className={[classes.cmsForm, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
//             >
//               <CMSForm form={form} />
//             </div>
//           </div>
//         </div>
//       </Gutter>
//     </BlockWrapper>
//   )
// }
