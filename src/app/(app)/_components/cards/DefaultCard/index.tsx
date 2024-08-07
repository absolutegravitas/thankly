import * as React from 'react'
import Link from 'next/link'

import { Heading } from '@app/_components/Heading'
import { Media } from '@app/_components/Media'
import { PlusIcon } from '@app/_icons/PlusIcon'
import { DefaultCardProps } from '../types'

import classes from './index.module.scss'

export const DefaultCard: React.FC<DefaultCardProps> = (props) => {
  const { description, href, media, title, className, leader } = props

  return (
    <Link
      href={href || ''}
      prefetch={false}
      className={[classes.defaultCard, className && className].filter(Boolean).join(' ')}
    >
      <div className={classes.content}>
        <div className={classes.leaderWrapper}>
          {leader && <div className={classes.leader}>{leader}</div>}
        </div>
        <Heading element="h2" as="h4" marginTop={false}>
          {title}
        </Heading>
        <div className={classes.plusIcon}>
          <PlusIcon size="full" />
        </div>
        <p className={classes.description}>{description}</p>
      </div>
      {media && typeof media !== 'string' && (
        <Media
          className={classes.media}
          sizes="(max-width: 768px) 100vw, 20vw"
          src={media.url}
          width={media.width}
          height={media.height}
          alt={media.alt}
        />
      )}
    </Link>
  )
}
