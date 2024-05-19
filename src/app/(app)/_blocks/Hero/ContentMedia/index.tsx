'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { useGetHeroPadding } from '@app/_blocks/Hero/useGetHeroPadding'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type ContentMediaHeroProps = ExtractBlockProps<'fields'>

export const ContentMediaHero: React.FC<ContentMediaHeroProps> = ({
  richText,
  media,
  links,
  description,
  theme,
  firstContentBlock,
}) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)

  return (
    <BlockWrapper settings={{ theme }} padding={padding}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />

            <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />

              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      buttonProps={{
                        hideHorizontalBorders: true,
                      }}
                      className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                    />
                  )
                })}
            </div>
          </div>
          {typeof media === 'object' && media !== null && (
            <div
              className={[classes.mediaWrapper, `start-7`, `cols-10`, 'cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.media}>
                <Media
                  resource={media}
                  sizes={`100vw, (max-width: 1920px) 75vw, (max-width: 1024px) 100vw`}
                />
              </div>
            </div>
          )}
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}

export default ContentMediaHero
// 'use client'

// import React from 'react'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
// import { BlockWrapper } from '@app/_components/BlockWrapper'
// import { CMSLink } from '@app/_components/CMSLink'
// import { Gutter } from '@app/_components/Gutter'
// import { useGetHeroPadding } from '@app/_blocks/Hero/useGetHeroPadding'
// import { Media } from '@app/_components/Media'
// import { BlocksProp } from '@app/_components/RenderBlocks'
// // import { RichText } from '@app/_components/RichText'
// import { Page } from '@payload-types'
// import { RichText } from '@app/_blocks/RichText'

// import classes from './index.module.scss'

// export const ContentMediaHero: React.FC<
//   Pick<Page['hero'], 'richText' | 'media' | 'links' | 'description' | 'theme'> & {
//     breadcrumbs?: Page['breadcrumbs']
//     firstContentBlock?: BlocksProp
//   }
// > = ({ richText, media, links, description, theme, firstContentBlock }) => {
//   const padding = useGetHeroPadding(theme, firstContentBlock)

//   return (
//     <BlockWrapper settings={{ theme }} padding={padding}>
//       <BackgroundGrid zIndex={0} />
//       <Gutter>
//         <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
//           <div
//             className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
//           >
//             <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />

//             <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
//               <RichText
//                 content={description}
//                 className={[classes.description].filter(Boolean).join(' ')}
//               />

//               {Array.isArray(links) &&
//                 links.map(({ link }, i) => {
//                   return (
//                     <CMSLink
//                       key={i}
//                       {...link}
//                       buttonProps={{
//                         hideHorizontalBorders: true,
//                       }}
//                       className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
//                     />
//                   )
//                 })}
//             </div>
//           </div>
//           {typeof media === 'object' && media !== null && (
//             <div
//               className={[classes.mediaWrapper, `start-7`, `cols-10`, 'cols-m-8 start-m-1']
//                 .filter(Boolean)
//                 .join(' ')}
//             >
//               <div className={classes.media}>
//                 <Media
//                   resource={media}
//                   sizes={`100vw, (max-width: 1920px) 75vw, (max-width: 1024px) 100vw`}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <div className={classes.defaultHero}></div>
//       </Gutter>
//     </BlockWrapper>
//   )
// }
