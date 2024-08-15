// resend.ts
import { Resend } from 'resend';
import { SendVerificationRequestParams } from 'next-auth/providers/email';

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  let { identifier: email, url, provider: { from } } = params;
  try {
    const resend = new Resend( process.env.RESEND_KEY! );
    await resend.emails.send({
      from: from,
      to: email,
      subject: 'Login Link to Thankly',
      html: '<p>Click the magic link below to sign in to your Thankly account:</p>\
             <p><a href="' + url + '"><b>Sign in</b></a></p>',
    });
  } catch (error) {
    console.log({ error });
  }
};