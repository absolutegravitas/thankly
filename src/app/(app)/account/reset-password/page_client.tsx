'use client'

import React, { useCallback } from 'react'
import { Text } from '@app/_components/forms/fields/Text'
import Form from '@app/_components/forms/Form'
import FormProcessing from '@app/_components/forms/FormProcessing'
import FormSubmissionError from '@app/_components/forms/FormSubmissionError'
import Submit from '@app/_components/forms/Submit'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@app/_components/Gutter'
import { Heading } from '@app/_components/Heading'
import { useAuth } from '@app/_providers/Auth'

import classes from './page.module.scss'

export const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams()

  const token = searchParams?.get('token')

  const { user, resetPassword } = useAuth()

  const handleSubmit = useCallback(
    async ({ data }: any) => {
      try {
        await resetPassword({
          password: data.password as string,
          passwordConfirm: data.passwordConfirm as string,
          token: token as string,
        })
      } catch (e: any) {
        throw new Error(e.message)
      }
    },
    [resetPassword, token],
  )

  if (user === undefined) return null

  if (user) {
    redirect(
      `/account/settings?error=${encodeURIComponent(
        'Cannot reset password while logged in. To change your password, you may use your account settings below or log out and try again.',
      )}`,
    )
  }

  if (!token) {
    redirect(`/forgot-password?error=${encodeURIComponent('Missing token')}`)
  }

  return (
    <Gutter>
      <h2>Reset password</h2>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
          <Form
            onSubmit={handleSubmit}
            className={classes.form}
            initialState={{
              password: {
                value: '',
              },
              passwordConfirm: {
                value: '',
              },
              token: {
                value: '',
              },
            }}
          >
            <FormSubmissionError />
            <FormProcessing message="Resetting password, one moment..." />
            <Text path="password" type="password" label="New Password" required />
            <Text path="passwordConfirm" type="password" label="Confirm Password" required />
            <div>
              <Submit label="Reset Password" className={classes.submit} />
            </div>
          </Form>
        </div>
      </div>
    </Gutter>
  )
}
