import { useState } from 'react'
import { ScrollArea } from '@app/_components/ui/scroll-area'
import { Card, CardContent } from '@app/_components/ui/card'
import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'

interface InstagramPost {
  id: string
  imageUrl: string
  link: string
}

interface InstagramFeedProps {
  totalImages: number
  visibleImages: number
}

export type Props = ExtractBlockProps<'mediaGrid'>

//export const InstagramFeed = ({ mediaGridFields }: Props) => {
export function InstagramFeed({ totalImages = 10, visibleImages = 5 }: InstagramFeedProps) {
  // In a real application, you would fetch this data from the Instagram API
  const [posts] = useState<InstagramPost[]>(() =>
    Array.from({ length: totalImages }, (_, i) => ({
      id: `post-${i + 1}`,
      imageUrl: `/placeholder.svg?height=300&width=300&text=Post ${i + 1}`,
      link: `https://www.instagram.com/p/placeholder-${i + 1}/`,
    })),
  )

  const openInstagramPost = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="w-full ">
      <CardContent className="p-4">
        <ScrollArea className="w-full h-[220px]">
          <div className="flex space-x-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="shrink-0 cursor-pointer"
                onClick={() => openInstagramPost(post.link)}
              >
                <Image
                  src={post.imageUrl}
                  alt={`Instagram post ${post.id}`}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
export default InstagramFeed
