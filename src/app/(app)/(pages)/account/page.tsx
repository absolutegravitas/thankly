import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/(app)/_components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import GeneralSettings from './GeneralSettings'
import OrderHistory from './OrderHistory'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Order } from '@/payload-types'

// Server action to fetch user orders
async function fetchUserOrders(userId: string): Promise<Order[]> {
  'use server'

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        'billing.orderedBy': {
          equals: userId,
        },
      },
      sort: '-createdAt',
      depth: 2,
    })

    return docs as Order[]
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw new Error('An error occurred while fetching user orders')
  }
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderHistory fetchUserOrders={fetchUserOrders} userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
