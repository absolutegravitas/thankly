'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/app/(app)/_components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/(app)/_components/ui/form'
import { Input } from '@/app/(app)/_components/ui/input'
import { User } from '@/payload-types'
import { signOut } from 'next-auth/react'
import { fetchUserDetails, updateUserDetails } from './userActions'
import { useToast } from '@/app/(app)/_hooks/use-toast'

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional(),
  orgId: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export default function GeneralSettings({ user }: { user: Partial<User> }) {
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      orgName: '',
      orgId: '',
      website: '',
    },
  })

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails(user.id as unknown as string)
        form.reset({
          firstName: userDetails.firstName || '',
          lastName: userDetails.lastName || '',
          orgName: userDetails.orgName || '',
          orgId: userDetails.orgId || '',
          website: userDetails.website || '',
        })
        setEmail(userDetails.email || '')
      } catch (error) {
        console.error('Error fetching user details:', error)
        toast({
          title: 'Error',
          description: 'Failed to load user details',
          variant: 'destructive',
        })
      }
    }

    loadUserDetails()
  }, [user.id, form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await updateUserDetails(user.id as unknown as string, values)
      toast({
        title: 'Success',
        description: 'Your details have been successfully updated.',
        variant: 'default',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error updating user details:', error)
      toast({
        title: 'Error',
        description: 'Failed to update your details. Please try again.',
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={email} disabled />
          </FormControl>
          <FormDescription>Your email address cannot be changed</FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orgName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Optional: Enter your organization name if applicable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orgId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABN / ACN</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Optional: Enter your ABN or ACN if applicable</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Optional: Enter your website URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Settings'}
          </Button>
          <Button type="button" variant="destructive" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </form>
    </Form>
  )
}
