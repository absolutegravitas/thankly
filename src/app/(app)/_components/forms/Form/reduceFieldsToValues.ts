// no declaration file for flatley, and no @types either, so require instead of import
// import flatley from 'flatley'

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

export const reduceFieldsToValues = (fields: Fields, unflattenFlag: boolean): Property => {
  const data: Property = {}

  Object.keys(fields).forEach((key) => {
    if (fields[key].value !== undefined) {
      data[key] = typeof fields[key] === 'object' ? fields[key]?.value : fields[key]
    }
  })

  if (unflattenFlag) {
    return unflatten(data)
  }

  return data
}

// Flatten function
const flatten = (
  obj: Record<string, any>,
  parentKey: string = '',
  result: Record<string, any> = {},
): Record<string, any> => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flatten(obj[key], newKey, result)
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

// Unflatten function
const unflatten = (data: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const keys = key.split('.')
      keys.reduce((acc, cur, idx) => {
        return (
          acc[cur] ||
          (acc[cur] = isNaN(Number(keys[idx + 1]))
            ? keys.length - 1 === idx
              ? data[key]
              : {}
            : [])
        )
      }, result)
    }
  }
  return result
}
