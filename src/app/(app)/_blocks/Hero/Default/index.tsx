'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type DefaultHeroProps = ExtractBlockProps<'fields'>

export const DefaultHero: React.FC<DefaultHeroProps> = ({ description, theme }) => {
  return (
    <BlockWrapper settings={{ theme: theme }} padding={{ top: 'small', bottom: 'small' }}>
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        <div className={classes.defaultHero}>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={description} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

// 'use client'

// import React from 'react'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
// import { BlockWrapper } from '@app/_components/BlockWrapper'
// import { Breadcrumbs } from '@app/_components/Breadcrumbs'
// import { Gutter } from '@app/_components/Gutter'
// import { useGetHeroPadding } from '@app/_blocks/Hero/useGetHeroPadding'
// import { BlocksProp } from '@app/_components/RenderBlocks'
// // import { RichText } from '@app/_components/RichText'
// import { Page } from '@payload-types'
// import { RichText } from '@app/_blocks/RichText'

// import classes from './index.module.scss'

// export const DefaultHero: React.FC<
//   Pick<Page['hero'], 'richText' | 'description' | 'theme'> & {
//     firstContentBlock?: BlocksProp
//   }
// > = ({ richText, description, theme, firstContentBlock }) => {
//   const withoutDescription =
//     !description ||
//     (description.length === 1 &&
//       Array.isArray(description[0].children) &&
//       description[0].children?.length === 1 &&
//       !description[0].children[0].text)

//   return (
//     <BlockWrapper settings={{ theme }} padding={{ top: 'small', bottom: 'small' }}>
//       <Gutter>
//         <BackgroundGrid zIndex={0} />
//         <div className={classes.defaultHero}>
//           <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
//             <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
//               <RichText className={classes.richText} content={richText} />
//             </div>

//             {!withoutDescription && (
//               <div className={['cols-4 start-13 cols-m-8 start-m-1'].filter(Boolean).join(' ')}>
//                 <RichText content={description} />
//               </div>
//             )}
//           </div>
//         </div>
//       </Gutter>
//     </BlockWrapper>
//   )
// }
