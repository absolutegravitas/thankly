import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function getPayload() {
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })
  return payload
} 