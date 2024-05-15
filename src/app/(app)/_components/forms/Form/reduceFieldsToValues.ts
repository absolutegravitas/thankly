// // no declaration file for flatley, and no @types either, so require instead of import
// import flatley from 'flatley'

// import type { Fields, Property } from '../types'

// export const reduceFieldsToValues = (fields: Fields, unflatten: boolean): Property => {
//   const data: Property = {}

//   Object.keys(fields).forEach((key) => {
//     if (fields[key].value !== undefined) {
//       data[key] = typeof fields[key] === 'object' ? fields[key]?.value : fields[key]
//     }
//   })

//   if (unflatten) {
//     return flatley.unflatten(data, { safe: true })
//   }

//   return data
// }

import type { Fields, Property } from '../types'

export const reduceFieldsToValues = (fields: Fields, unflatten: boolean): Property => {
  const data: Property = {}

  Object.keys(fields).forEach((key) => {
    if (fields[key].value !== undefined) {
      if (typeof fields[key] === 'object') {
        data[key] = fields[key]?.value
      } else {
        data[key] = fields[key]
      }
    }
  })

  // If unflatten is true, return data as is; otherwise, return flattened data
  return unflatten ? data : flattenObject(data)
}

// Function to flatten an object
const flattenObject = (obj: Property): Property => {
  const flattened: Property = {}

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const flatObject = flattenObject(obj[key])
      Object.keys(flatObject).forEach((subKey) => {
        flattened[`${key}.${subKey}`] = flatObject[subKey]
      })
    } else {
      flattened[key] = obj[key]
    }
  })

  return flattened
}
