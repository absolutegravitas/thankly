import * as React from 'react'
// import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'

// import { useAuth } from '@app/_providers/Auth'

// import { DropdownMenu } from './DropdownMenu'
import classes from './index.module.scss'

export const Avatar: React.FC<{ className?: string }> = ({ className }) => {
  // const { user } = useAuth()

  // const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={[classes.avatar, className].filter(Boolean).join(' ')}>
      {/* <button
        type="button"
        className={classes.button}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className={classes.primaryUser}>
          <div className={classes.userInitial}>{user.email.charAt(0).toUpperCase()}</div>
        </div>
      </button>
      <DropdownMenu isOpen={isOpen} onChange={setIsOpen} /> */}
      <Link href={`/account`} prefetch={false}>
        <div className={classes.primaryUser}>
          {/* <div className={classes.userInitial}>{user?.email?.charAt(0).toUpperCase()}</div> */}
        </div>
      </Link>
    </div>
  )
}
