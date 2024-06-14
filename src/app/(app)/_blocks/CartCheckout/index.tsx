import React from 'react'

import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { DesktopCheckout } from './Desktop'
import { MobileMediaContentAccordion } from './Mobile'

import { DesktopPersonalise } from './Desktop/desktopPersonalise'
import { MobilePersonalise } from './Desktop/mobilePersonalise'
import { DesktopSend } from './Desktop/desktopSend'

export const CartCheckout: React.FC<any> = ({ cart }) => {
  const props = {
    leader: 'Checkout',
    heading: 'Your Cart',
    accordion: [
      {
        id: '0',
        desktopComponent: <DesktopPersonalise {...cart} />,
        mobileComponent: <MobilePersonalise />,
        mediaLabel: 'Personalise',
      },
      {
        id: '1',
        desktopComponent: <DesktopPersonalise {...cart} />,
        mobileComponent: <MobilePersonalise />,
        mediaLabel: 'Pay',
      },
      {
        id: '2',
        desktopComponent: <DesktopSend />,
        mobileComponent: <DesktopSend />,
        mediaLabel: 'Send',
      },
    ],
  }
  return (
    <BlockWrapper
      settings={{ settings: { theme: 'light' } }}
      padding={{ top: 'large', bottom: 'small' }}
    >
      <Gutter>
        <DesktopCheckout {...props} />
        <MobileMediaContentAccordion {...props} {...cart} />
      </Gutter>
    </BlockWrapper>
  )
}
export default CartCheckout
