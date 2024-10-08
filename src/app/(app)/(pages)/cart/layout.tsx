import { ReactNode } from 'react'
import CartNav from '../../_blocks/Cart/CartNav'

interface CartLayoutProps {
  children: ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div className="lg:px-8 max-w-7xl mx-auto w-full">
      <div className="py-0 sm:py-6">
        <CartNav />
      </div>
      <div className="mt-4 sm:mt-6">{children}</div>
    </div>
  )
}
