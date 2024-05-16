'use client'
import React from 'react'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { Page } from '@/payload-types'
import Blocks from '@app/_blocks'

export const PageTemplate: React.FC<{ page: Page | null }> = ({ page }) => {
  // const { data } = useLivePreview({
  //   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  //   depth: 2,
  //   initialData: page,
  // })

  //   // use pagedata to render basic content or blocks client side
  //   // console.log('pagedata //', JSON.stringify(page?.content?.root?.children))

  return (
    <React.Fragment>
      <Blocks
        blocks={page?.layout?.root?.children}
        //         locale="en"
        // disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'titleOnly'}
      />
    </React.Fragment>
  )
}

// 'use client'
// import React from 'react'
// // import { useLivePreview } from '@payloadcms/live-preview-react'
// import { Page } from '@payload-types'
// import Blocks from '@app/_blocks'

// export const PageTemplate: React.FC<{ page: Page | null }> = ({ page }) => {
//   // const { data } = useLivePreview({
//   //   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
//   //   depth: 2,
//   //   initialData: page,
//   // })

//   // use pagedata to render basic content or blocks client side
//   // console.log('pagedata //', JSON.stringify(page?.content?.root?.children))

//   return (
//     <React.Fragment>
//       <Blocks
//         blocks={page?.layout?.root?.children}
//         locale="en"
//         // disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'titleOnly'}
//       />
//     </React.Fragment>
//   )
// }
