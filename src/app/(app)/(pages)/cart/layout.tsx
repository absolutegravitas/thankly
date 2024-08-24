import { ReactNode } from 'react'
import CartNav from '../../_blocks/Cart/CartNav'

interface CartLayoutProps {
  children: ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div className="container mx-auto">
      <CartNav />
      <div className="mt-4">{children}</div>
    </div>
  )
}
