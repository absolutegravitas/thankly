import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@app/_components/ui/card'
import { Label } from '@app/_components/ui/label'
import { Input } from '@app/_components/ui/input'
import { Textarea } from '@app/_components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@app/_components/ui/select'
import { Button } from '@app/_components/ui/button'
import AddressPicker from '@app/_blocks/AddressPicker'

const ProductPersonaliser = () => {
  return (
    <Card>
      <CardContent>
        <form className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <AddressPicker />
          </div>
          <div className="grid gap-2 sm:max-w-md">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your personalized message"
              className="min-h-[145px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="writing-style">Writing Style</Label>
              <Select id="writing-style" defaultValue="regular">
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="cursive">Cursive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" className="rounded-full">
                Ship another
              </Button>
              <Button variant="outline" className="rounded-full">
                Remove
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductPersonaliser
