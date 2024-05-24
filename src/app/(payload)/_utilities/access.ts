import type { FieldHook } from 'payload/types'
import type { User } from '@payload-types'
import { Access } from 'payload/config'

// ensure the first user created is an admin
// 1. lookup a single user on create as succinctly as possible
// 2. if there are no users found, append `admin` to the roles array
// access control is already handled by this fields `access` property
// it ensures that only admins can create and update the `roles` field
export const makeFirstUserAdmin: FieldHook<User> = async ({ req, operation, value }) => {
  if (operation === 'create') {
    const users = await req.payload.find({ collection: 'users', limit: 0, depth: 0 })
    if (users.totalDocs === 0) {
      // if `admin` not in array of values, add it
      if (!(value || []).includes('admin')) {
        return [...(value || []), 'admin']
      }
    }
  }

  return value
}

// published collection only
export const publishedOnly: Access = ({ req: { user } }) => {
  if (!user || !user.roles) {
    return false
  }

  // allow users with a role of 'admin'
  if (user.roles.includes('admin')) {
    return true
  }
  // using a query constraint, guest users can access when a field named 'isPublished' is set to true
  return { _status: { equals: 'published' } }
}

// admins only
export const adminsOnly: Access = ({ req: { user } }) => {
  if (!user || !user.roles) {
    return false
  }

  // allow users with a role of 'admin'
  return Boolean(user?.roles?.includes('admin'))
}

// export const isAdminOrCurrentUser: Access = ({ req }) => {
//   if (req?.user?.role === 'admin') return true
//   return { user: { equals: req.user?.id } }
// }

// admins and user only
export const adminsAndUserOnly: Access = ({ req: { user }, id }) => {
  if (!user || !user.roles) {
    return false
  }

  // allow users with a role of 'admin'
  if (user?.roles && user.roles.some((role) => role === 'admin')) {
    return true
  }
  // allow any other users to update only oneself
  return user?.id === id
}

export const checkRole = (allRoles: User['roles'] = [], user?: User | null): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}
