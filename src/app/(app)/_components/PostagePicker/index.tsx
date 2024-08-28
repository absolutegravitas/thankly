import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@app/_components/ui/card'
import { RadioGroup, RadioGroupItem } from '@app/_components/ui/radio-group'
import { Label } from '@app/_components/ui/label'
import { useCart } from '../../_providers/Cart'
import { ReceiverAddressText } from '../../_providers/Cart/address'
import { ShippingMethod } from '../../_blocks/Cart/cart-types'

interface Props {
  receiverId: string
}

interface PostageOption {
  id: ShippingMethod
  name: string
  description: string
  price: number
}
//temporary for form building (TODO: work out actual calcs and payloadcms storage)
const postageOptions: PostageOption[] = [
  // {
  //   id: 'standardMail',
  //   name: 'Standard Shipping',
  //   description: 'Estimated delivery in 5-7 business days',
  //   price: 4.99,
  // },
  // {
  //   id: 'expressMail',
  //   name: 'Express Shipping',
  //   description: 'Estimated delivery in 2-3 business days',
  //   price: 9.99,
  // },
  {
    id: 'standardParcel',
    name: 'Standard Shipping',
    description: 'Estimated delivery in 5-7 business days',
    price: 9.9,
  },
  {
    id: 'expressParcel',
    name: 'Express Shipping',
    description: 'Estimated delivery in 2-3 business days',
    price: 14.9,
  },
]

const PostagePicker = ({ receiverId }: Props) => {
  const { cart, updateShipping } = useCart()

  const receiver = cart.receivers?.find((receiver) => receiver.receiverId === receiverId)
  if (!receiver) return <></>

  const handlePostageChange = (optionId: string) => {
    const selectedOption = postageOptions.find((option) => option.id === optionId)
    if (selectedOption) {
      updateShipping(receiverId, selectedOption.id, selectedOption.price)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Postage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {receiver.firstName} {receiver.lastName}
              </h3>
              <p className="text-muted-foreground">{ReceiverAddressText(receiver)}</p>
            </div>
          </div>
          <RadioGroup
            defaultValue={receiver.delivery?.shippingMethod as string}
            onValueChange={handlePostageChange}
          >
            <div className="grid gap-2">
              {postageOptions.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`${receiverId}-${option.id}`}
                  className="flex items-center justify-between border rounded-md p-4 cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-muted"
                >
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`${receiverId}-${option.id}`} value={option.id} />
                      <span className="font-medium">{option.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <span className="font-medium">${option.price.toFixed(2)}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostagePicker
