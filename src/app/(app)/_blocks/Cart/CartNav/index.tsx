'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CartNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/cart', label: 'Personalise' },
    { href: '/cart/postage', label: 'Postage' },
    { href: '/cart/payment', label: 'Payment' },
  ]

  return (
    <nav className="flex justify-center items-center gap-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`border-b ${
            pathname === item.href
              ? 'text-primary border-solid border-primary underline-offset-4'
              : 'text-muted-foreground border-dotted border-muted-foreground'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
