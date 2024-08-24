import React, { ChangeEvent } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@app/_components/ui/card'
import { Label } from '@app/_components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@app/_components/ui/select'
import { Button } from '@app/_components/ui/button'
import AddressPicker from '@app/_blocks/AddressPicker'
import { CartItem } from '@app/_blocks/Cart/cart-types'
import { Address, getNewReceiver, getReceiverAddresses } from '@/app/(app)/_providers/Cart/address'
import { useCart } from '@/app/(app)/_providers/Cart'
import DebouncedTextarea from '@app/_components/ui/debounced-textarea'

interface props {
  cartItem: CartItem
}

const CartItemPersonaliser = ({ cartItem }: props) => {
  const { cart, addReceiver, updateMessage } = useCart()

  const handleAddAddress = (address: Address) => {
    //add a new receiver based on address to cart
    addReceiver(getNewReceiver(address))
  }

  const handleDebounce = (value: string) => {
    const updatedGiftCard = {
      ...cartItem.giftCard,
      message: value,
    }
    updateMessage(cartItem.itemId, updatedGiftCard)
  }

  return (
    <Card>
      <CardContent>
        <form className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <AddressPicker
              addresses={getReceiverAddresses(cart.receivers)}
              onAddAddress={handleAddAddress}
            />
          </div>
          <div className="grid gap-2 sm:max-w-md">
            <Label htmlFor="message">Message</Label>
            <DebouncedTextarea
              id="message"
              placeholder="Write your personalised message"
              className="min-h-[145px]"
              // onChange={handleMessageChange}
              onDebounce={handleDebounce}
              debounceTime={500}
            />
          </div>
          <div className="grid gap-4 sm:flex sm:items-center sm:justify-between">
            <div className="grid gap-2 sm:flex sm:items-center sm:gap-2">
              <Label>Writing Style</Label>
              <Select defaultValue="regular">
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="cursive">Cursive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button variant="primary" className="rounded-full sm:w-auto">
                Ship another
              </Button>
              <Button variant="outline" className="rounded-full sm:w-auto">
                Remove
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CartItemPersonaliser
