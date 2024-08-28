import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@app/_components/ui/card'
import { RadioGroup, RadioGroupItem } from '@app/_components/ui/radio-group'
import { Label } from '@app/_components/ui/label'

const PostagePicker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Postage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-muted-foreground">123 Main St, Anytown USA 12345</p>
            </div>
          </div>
          <RadioGroup defaultValue="standard" className="grid gap-2">
            <div className="flex items-center justify-between rounded-md border bg-popover p-4 [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <div className="flex items-center gap-4">
                <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
                <Label htmlFor="standard" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-semibold">Standard</span>
                    <span className="text-muted-foreground text-sm">
                      Delivery in 5-7 business days
                    </span>
                  </div>
                </Label>
              </div>
              <span className="font-semibold">$5.99</span>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-popover p-4 [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <div className="flex items-center gap-4">
                <RadioGroupItem value="express" id="express" className="peer sr-only" />
                <Label htmlFor="express" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-semibold">Express</span>
                    <span className="text-muted-foreground text-sm">
                      Delivery in 2-3 business days
                    </span>
                  </div>
                </Label>
              </div>
              <span className="font-semibold">$12.99</span>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-popover p-4 [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <div className="flex items-center gap-4">
                <RadioGroupItem value="priority" id="priority" className="peer sr-only" />
                <Label htmlFor="priority" className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-semibold">Priority</span>
                    <span className="text-muted-foreground text-sm">
                      Delivery in 1-2 business days
                    </span>
                  </div>
                </Label>
              </div>
              <span className="font-semibold">$19.99</span>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostagePicker
