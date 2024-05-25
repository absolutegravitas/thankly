import SignUpForm from '@app/_components/SignUpForm'
import { auth } from '@/utilities/auth'
import { redirect } from 'next/navigation'

const SignInPage = async () => {
  const session = await auth()
  if (session) return redirect('/profile')
  return (
    <div className="my-auto flex h-full justify-center pb-10 pt-[100px]">
      <SignUpForm />
    </div>
  )
}

export default SignInPage
