// @ts-nocheck

export function isObject(item: unknown): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export default function deepMerge<T>(target: T, ...sources: any[]): T {
  const output = { ...target }

  sources.forEach((source) => {
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            output[key] = deepMerge(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
  })

  return output
}
