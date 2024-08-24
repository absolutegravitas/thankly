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
import { Textarea } from '@/app/(app)/_components/ui/textarea'
import { Product } from '@/payload-types'

interface Props {
  cartItem: CartItem
}

const CartItemPersonaliser = ({ cartItem }: Props) => {
  const { cart, addReceiver, updateMessage, linkReceiver, removeCartItem, addCartItem } = useCart()

  const handleAddAddress = (address: Address) => {
    //add a new receiver based on address to cart
    addReceiver(getNewReceiver(address))
  }

  const handleMessageChange = (value: string) => {
    const updatedGiftCard = {
      ...cartItem.giftCard,
      message: value,
    }
    updateMessage(cartItem.itemId, updatedGiftCard)
  }

  const handleWritingStyleChange = (value: string) => {
    console.log('writingStyle:', value)
    const updatedGiftCard = {
      ...cartItem.giftCard,
      writingStyle: value,
    }
    console.log('updatedGiftCard:', updatedGiftCard)
    updateMessage(cartItem.itemId, updatedGiftCard)
  }

  const handleReceiverChange = (addressId: string) => {
    linkReceiver(cartItem.itemId, addressId)
  }

  const handleRemove = () => {
    removeCartItem(cartItem.itemId)
  }

  const handleShipAnother = () => {
    addCartItem(cartItem.product, cartItem.price)
    console.log('CART!:', cart)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <form className="grid gap-4">
          <div className="grid gap-2 w-full">
            <AddressPicker
              selectedAddressId={cartItem.receiverId || null}
              addresses={getReceiverAddresses(cart.receivers)}
              onAddAddress={handleAddAddress}
              onChange={handleReceiverChange}
            />
          </div>
          <div className="grid gap-2 w-full">
            <Label htmlFor="message">Message</Label>
            <DebouncedTextarea
              id="message"
              placeholder="Write your personalised message"
              className="min-h-[145px] w-full"
              value={cartItem.giftCard.message}
              onChange={handleMessageChange}
              debounceTime={500}
            />
          </div>
          <div className="grid gap-4 sm:flex sm:items-center sm:justify-between">
            <div className="grid gap-2 sm:flex sm:items-center sm:gap-2">
              <Label>Writing Style</Label>
              <Select
                defaultValue="regular"
                onValueChange={handleWritingStyleChange}
                value={cartItem.giftCard.writingStyle}
              >
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="cursive">Cursive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <Button
                variant="primary"
                type="button"
                className="w-full sm:w-auto rounded-full"
                onClick={handleShipAnother}
              >
                Ship another
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full"
                onClick={handleRemove}
              >
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
