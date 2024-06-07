import React from 'react'

// import BackgroundGradient from '@app/_components/BackgroundGradient'
import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import BigThree from '@app/_components/BigThree'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { BlocksProp } from '@app/_components/RenderBlocks'
// import { RichText } from '@app/_components/RichText'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type HeroFields = ExtractBlockProps<'fields'>

export const ThreeHero: React.FC<{ fields: HeroFields }> = ({ fields }) => {
  const { description, primaryButtons, buttons } = fields

  return (
    <React.Fragment>
      <BlockWrapper
        settings={{ theme: fields.theme }}
        className={[classes.blockWrapper, ''].join(' ')}
      >
        {/* <BackgroundGrid zIndex={1} /> */}
        <Gutter>
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
              <RichText
                content={description.root.children.map((child: any) => child.text).join(' ')}
                className={[classes.richText].filter(Boolean).join(' ')}
              />

              <div className={classes.linksWrapper}>
                {primaryButtons.map((button: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      {...button}
                      className={classes.link}
                      appearance="default"
                      buttonProps={{
                        hideBorders: true,
                      }}
                    />
                  )
                })}
                {buttons.map((button: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      {...button}
                      className={classes.link}
                      appearance="default"
                      buttonProps={{
                        hideBorders: true,
                      }}
                    />
                  )
                })}
              </div>
            </div>
            <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
              <BigThree />
            </div>
          </div>
        </Gutter>
      </BlockWrapper>
      {/* <BackgroundGradient className={classes.backgroundGradient} /> */}
    </React.Fragment>
  )
}

// // import BackgroundGradient from '@app/_components/BackgroundGradient'
// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
// import BigThree from '@app/_components/BigThree'
// import { BlockWrapper } from '@app/_components/BlockWrapper'
// import { CMSLink } from '@app/_components/CMSLink'
// import { Gutter } from '@app/_components/Gutter'
// import { BlocksProp } from '@app/_components/RenderBlocks'
// // import { RichText } from '@app/_components/RichText'
// import { Page } from '@payload-types'
// import { RichText } from '@app/_blocks/RichText'

// import classes from './index.module.scss'

// export const ThreeHero: React.FC<
//   Pick<Page['hero'], 'richText' | 'media' | 'buttons' | 'description' | 'theme'> & {
//     breadcrumbs?: Page['breadcrumbs']
//     firstContentBlock?: BlocksProp
//   }
// > = ({ richText, buttons, theme, breadcrumbs }) => {
//   const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0
//   return (
//     <React.Fragment>
//       <BlockWrapper
//         settings={{ theme }}
//         className={[classes.blockWrapper, hasBreadcrumbs ? classes.hasBreadcrumbs : ''].join(' ')}
//       >
//         <BackgroundGrid zIndex={1} />
//         <Gutter>
//           <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
//             <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
//               <RichText
//                 content={richText}
//                 className={[classes.richText].filter(Boolean).join(' ')}
//               />

//               <div className={classes.linksWrapper}>
//                 {Array.isArray(buttons) &&
//                   buttons.map((button, i) => {
//                     // if (button.blockType === 'command') {
//                     //   return (
//                     //     <CreatePayloadApp
//                     //       key={i + button.command}
//                     //       label={button.command}
//                     //       background={false}
//                     //       className={classes.createPayloadApp}
//                     //     />
//                     //   )
//                     // }
//                     if (button.blockType === 'link' && button.link) {
//                       return (
//                         <CMSLink
//                           key={i + button.link.label}
//                           {...button.link}
//                           className={classes.link}
//                           appearance="default"
//                           buttonProps={{
//                             hideBorders: true,
//                           }}
//                         />
//                       )
//                     }
//                   })}
//               </div>
//             </div>
//             <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
//               <BigThree />
//             </div>
//           </div>
//         </Gutter>
//       </BlockWrapper>
//       {/* <BackgroundGradient className={classes.backgroundGradient} /> */}
//     </React.Fragment>
//   )
// }
