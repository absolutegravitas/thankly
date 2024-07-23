import React from 'react'
import { LoaderCircleIcon } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green-500"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">Loading checkout...please wait</div>
        </div>
      </div>
    </div>
  )
}

export default Loading
