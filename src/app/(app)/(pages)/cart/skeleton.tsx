import React from 'react'
import { Skeleton } from '@app/_components/ui/skeleton'
import { Card, CardContent } from '@app/_components/ui/card'

const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Product cards */}
      {[1, 2].map((item) => (
        <Card key={item} className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Total and checkout */}
      <div className="flex justify-between items-center mt-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export default SkeletonLoader
