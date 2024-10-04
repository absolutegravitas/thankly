'use client'

import React, { useEffect, useState } from 'react'
import { Order } from '@/payload-types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/(app)/_components/ui/table'
import { format } from 'date-fns'

interface OrderHistoryProps {
  fetchUserOrders: (userId: string) => Promise<Order[]>
  userId: string
}

export default function OrderHistory({ fetchUserOrders, userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await fetchUserOrders(userId)
        setOrders(userOrders)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [fetchUserOrders, userId])

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell className="text-right">${order.totals.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
