/**
 * v0 by Vercel.
 * @see https://v0.dev/t/M58uTjXmPWG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from 'next/link'

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-10 items-center justify-center">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="#"
            className="text-muted-foreground border-b border-dotted border-muted-foreground"
            prefetch={false}
          >
            Personalise
          </Link>
          <Link
            href="#"
            className="text-muted-foreground border-b border-dotted border-muted-foreground"
            prefetch={false}
          >
            Postage
          </Link>
          <Link
            href="#"
            className="text-primary border-b border-solid border-primary underline-offset-4"
            prefetch={false}
          >
            Payment
          </Link>
        </nav>
        <div className="flex items-center gap-4" />
      </main>
    </div>
  )
}
