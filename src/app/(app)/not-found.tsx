import { CMSLink } from '@app/_components/CMSLink'
import { HomeIcon, SendIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="grid h-1/2 place-content-center bg-white px-4 sm:h-3/4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>
        <p className="mt-4 text-gray-500">We can't find that page.</p>
        <div
          className={`grid grid-cols-1 items-center justify-center space-y-4   sm:grid-cols-2 sm:space-x-4 sm:space-y-0`}
        >
          <CMSLink
            appearance={'default'}
            // style={'light'}
            // width={'full'}
            // size={'medium'}
            // icon={true}
            url="/"
            label="Go Back Home"
          >
            <HomeIcon className="h-5.5 w-5.5 md:block" strokeWidth={1.25} aria-hidden="true" />
          </CMSLink>

          <CMSLink
            url="/shop"
            label="Send a Thankly"
            appearance={'default'}
            // style={'dark'}
            // width={'full'}
            // size={'medium'}
            // icon={true}
          >
            <SendIcon className=" h-5.5 w-5.5 md:block" strokeWidth={1.25} aria-hidden="true" />
          </CMSLink>
        </div>
      </div>
    </div>
  )
}
