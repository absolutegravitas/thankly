import { isAdmin } from '@/utilities/access'
import { useAuth } from '@payloadcms/ui'
import React from 'react'

const SeedPage = () => {
  const req = useAuth()
  console.log('USER ==', req.user)

  console.log('IS ADMIN ==', isAdmin({ req }))

  return <div>SeedPage</div>
}

export default SeedPage
