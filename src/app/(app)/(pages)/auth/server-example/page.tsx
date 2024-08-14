import CustomLink from '@app/_components/Auth/custom-link'
import SessionData from '@app/_components/Auth/session-data'
import { auth } from '@/utilities/auth/auth'
import Header from '../../../_components/Auth/header'
import Footer from '../../../_components/Auth/footer'
import { getPaddingClasses } from '../../../_css/tailwindClasses'

export default async function Page() {
  const session = await auth()
  return (
    <div className={` space-y-2 ${getPaddingClasses('hero')}`}>
      <Header />
      <h1 className="text-3xl font-bold">React Server Component Usage</h1>
      <p>
        This page is server-rendered as a{' '}
        <CustomLink href="https://nextjs.org/docs/app/building-your-application/rendering/server-components">
          React Server Component
        </CustomLink>
        . It gets the session data on the server using{' '}
        <CustomLink href="https://nextjs.authjs.dev#auth">
          <code>auth()</code>
        </CustomLink>{' '}
        method.
      </p>
      <SessionData session={session} />
    </div>
  )
}
