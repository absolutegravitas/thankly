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
import AddressPicker from '@/app/(app)/_components/AddressPicker'
import { CartItem } from '@app/_blocks/Cart/cart-types'
import { Address, getNewReceiver, getReceiverAddresses } from '@/app/(app)/_providers/Cart/address'
import { useCart } from '@/app/(app)/_providers/Cart'
import DebouncedTextarea from '@app/_components/ui/debounced-textarea'
import { useFormContext } from 'react-hook-form'
import { CartPersonalisationForm } from '@/app/(app)/(pages)/cart/page'
import { isEntityHidden } from 'payload'

interface Props {
  cartItem: CartItem
  index: number
}

const CartItemPersonaliser = ({ cartItem, index }: Props) => {
  const { cart, addReceiver, updateMessage, linkReceiver, removeCartItem, addCartItem } = useCart()

  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext<CartPersonalisationForm>()

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
    //update cart
    linkReceiver(cartItem.itemId, addressId)
    //update form data (for validation logic)
    setValue(`cartItems.${index}.receiverId`, addressId)
  }

  const handleRemove = () => {
    removeCartItem(cartItem.itemId)
  }

  const handleShipAnother = () => {
    addCartItem(cartItem.product, cartItem.price)
  }

  //handle setvalues for form validation at load
  if (cartItem.receiverId !== undefined && cartItem.receiverId && cartItem.receiverId !== '') {
    //initial set value for delivery address, if already specified in the cart
    setValue(`cartItems.${index}.receiverId`, cartItem.receiverId)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-4">
          <div className="grid gap-2 w-full">
            <AddressPicker
              selectedAddressId={cartItem.receiverId || null}
              addresses={getReceiverAddresses(cart.receivers)}
              onAddAddress={handleAddAddress}
              onChange={handleReceiverChange}
            />
            <input type="hidden" {...register(`cartItems.${index}.receiverId`)} />
            {errors?.cartItems?.[index]?.receiverId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cartItems[index].receiverId.message}
              </p>
            )}
          </div>
          <div className="grid gap-2 w-full">
            <Label htmlFor="message">Message</Label>
            <DebouncedTextarea
              id="message"
              placeholder="Write your personalised message"
              className="min-h-[145px] w-full"
              value={cartItem.giftCard.message}
              onValueChange={handleMessageChange} //debounced
              debounceTime={500}
              {...register(`cartItems.${index}.giftMessage`)}
            />
            {errors?.cartItems?.[index]?.giftMessage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cartItems[index].giftMessage.message}
              </p>
            )}
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
        </div>
      </CardContent>
    </Card>
  )
}

export default CartItemPersonaliser
