'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
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

  const generatePDF = async () => {
    const orderToUse = order || searchedOrder
    if (!orderToUse) return

    const input = document.getElementById('order-details')
    if (!input) return

    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    pdf.addImage(imgData, 'PNG', 0, 0)
    pdf.save(`order-${orderToUse.orderNumber}.pdf`)
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

  return (
    <div>
      <Button onClick={generatePDF} className="mt-4">
        Download Invoice PDF
      </Button>
    </div>
  )
}

export default OrderConfirmationClient
