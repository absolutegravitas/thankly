// 'use client'

// import React, { forwardRef } from 'react'

// import { Button, ButtonProps } from '@app/_components/Button'
// import { useFormProcessing } from '../Form/context'

// type SubmitProps = ButtonProps & {
//   label?: string | null
//   processing?: boolean
// }

// const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
//   const {
//     label,
//     processing: processingFromProps,
//     className,
//     appearance = 'primary',
//     size = 'default',
//     icon = 'arrow',
//     disabled,
//   } = props

//   const processing = useFormProcessing()
//   const isProcessing = processing || processingFromProps

//   return (
//     <Button
//       ref={ref}
//       htmlButtonType="submit"
//       appearance={appearance}
//       size={size}
//       icon={icon && !isProcessing ? icon : undefined}
//       label={isProcessing ? 'Processing...' : label || 'Submit'}
//       className={className}
//       disabled={isProcessing || disabled}
//     />
//   )
// })

// export default Submit

'use client'

import React, { forwardRef } from 'react'
import { useFormProcessing } from '@app/_components/forms/Form/context'
import { CMSLink, CMSLinkType } from '@app/_components/CMSLink'
import { ArrowRightIcon } from 'lucide-react'

type SubmitProps = Omit<CMSLinkType, 'data'> & {
  label?: string | null
  processing?: boolean
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    label,
    processing: processingFromProps,
    className,
    look = {
      type: 'submit',
      size: 'medium',
      width: 'full',
      variant: 'blocks',
      icon: {
        content: <ArrowRightIcon />,
        iconPosition: 'right',
      },
    },
    actions,
    children,
  } = props

  const formProcessing = useFormProcessing()
  const isProcessing = formProcessing || processingFromProps

  return (
    <CMSLink
      data={{
        label: isProcessing ? 'Processing...' : label || 'Submit',
        type: 'custom',
        url: '#',
      }}
      className={className}
      look={{
        ...look,
        type: 'submit',
      }}
      actions={{
        ...actions,
        onClick: (e) => {
          if (e) e.preventDefault()
          if (actions?.onClick) actions.onClick(e)
        },
      }}
      pending={isProcessing}
    >
      {children}
    </CMSLink>
  )
})

export default Submit
