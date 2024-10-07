'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Order } from '@/payload-types'
import { Button } from '@app/_components/ui/button'
import { Input } from '@app/_components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/_components/ui/form'
import { useRouter } from 'next/navigation'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

interface OrderConfirmationClientProps {
  order?: Order
  findOrder: (email: string, orderNumber: string) => Promise<Order | null>
}

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  orderNumber: z.string().min(1, { message: 'Order number is required' }),
})

const OrderConfirmationClient: React.FC<OrderConfirmationClientProps> = ({ order, findOrder }) => {
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      orderNumber: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const foundOrder = await findOrder(values.email, values.orderNumber)
      if (foundOrder) {
        setSearchedOrder(foundOrder)
      } else {
        alert('Order not found')
      }
    } catch (error) {
      console.error('Error searching for order:', error)
      alert('An error occurred while searching for the order')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  if (!order && !searchedOrder) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Find Your Order</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Find Order
            </Button>
          </form>
        </Form>
        <Button variant="outline" className="w-full mt-4" onClick={handleLogin}>
          Login to see all orders
        </Button>
      </div>
    )
  }

  const orderToUse = order || searchedOrder

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      padding: 30,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
  })

  const PDFDocument = ({ order }: { order: Order }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Order Invoice</Text>
          <Text style={styles.text}>Order Number: {order.orderNumber}</Text>
          {/* Add more order details here */}
        </View>
      </Page>
    </Document>
  )

  // return (
  //   <div>
  //     {orderToUse && (
  //       <PDFDownloadLink
  //         document={<PDFDocument order={orderToUse} />}
  //         fileName={`Thankly Tax Invoice Order-${orderToUse.orderNumber}.pdf`}
  //       >
  //         {({ blob, url, loading, error }) =>
  //           loading ? 'Loading document...' : <Button className="mt-4">Download Invoice PDF</Button>
  //         }
  //       </PDFDownloadLink>
  //     )}
  //   </div>
  // )
}

export default OrderConfirmationClient
