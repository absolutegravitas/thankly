import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@app/_components/ui/card'
import { RadioGroup, RadioGroupItem } from '@app/_components/ui/radio-group'
import { Label } from '@app/_components/ui/label'
import { useCart } from '../../_providers/Cart'
import { ReceiverAddressText } from '../../_providers/Cart/address'
import { postageOptions } from '../../_providers/Cart/postageOptions'
import { IconProps } from '../../_icons/types'
import { useFormContext } from 'react-hook-form'
import { CartPostageForm } from '../../(pages)/cart/postage/page'

interface Props {
  receiverId: string
  index: number
}

const PostagePicker = ({ receiverId, index }: Props) => {
  const { cart, updateShipping } = useCart()

  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext<CartPostageForm>()

  const receiver = cart.receivers?.find((receiver) => receiver.receiverId === receiverId)
  if (!receiver) return <></>

  const handlePostageChange = (optionId: string) => {
    const selectedOption = postageOptions.find((option) => option.id === optionId)
    if (selectedOption) {
      //update cart
      updateShipping(receiverId, selectedOption.id, selectedOption.price)
      //update form data (for validation logic)
      setValue(`shippingMethods.${index}.shippingMethod`, selectedOption.id, {
        shouldValidate: true,
      })
    }
  }

  //handle setvalues for form validation at load
  setValue(`shippingMethods.${index}.shippingMethod`, receiver.delivery?.shippingMethod ?? '')

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-4 pt-4">
          <TruckIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">
            Postage for {receiver.firstName} {receiver.lastName}
          </span>
        </div>
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
            {...register(`shippingMethods.${index}.shippingMethod`)}
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
          {errors.shippingMethods?.[index]?.shippingMethod && (
            <p className="mt-1 text-sm text-red-600">
              {errors.shippingMethods[index].shippingMethod?.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PostagePicker

function TruckIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}
