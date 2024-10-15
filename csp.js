const policies = {
  'default-src': ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://va.vercel-scripts.com', // for vercel
    'https://checkout.stripe.com', // for stripe
    'https://js.stripe.com', // for stripe
    'https://maps.googleapis.com', // for google maps
    'https://*.maps.googleapis.com', // for google maps
    'https://fonts.googleapis.com', // for google fonts
    'https://fonts.gstatic.com', // for google fonts
    'http://cdn.jsdelivr.net', // for jsdelivr
    'https://js.radar.com', // for radar
    'https://unpkg.com', // for unpkg
    'https://sibforms.com', // for sendinblue
    'https://www.google.com', // for reCAPTCHA
    'https://www.gstatic.com',
  ],
  'child-src': ["'self'", 'http://cdn.jsdelivr.net'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com', // for google fonts
    'https://fonts.gstatic.com', // for google fonts
    'http://cdn.jsdelivr.net', // for jsdelivr
    'https://js.radar.com', // for radar
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.stripe.com', // for stripe
    'https://thankly.vercel.app', // for thankly
    'https://thankly.co', // for thankly
    'https://tailwindui.com', // for tailwindui
    'https://images.unsplash.com', // for unsplash
    'http://cdn.jsdelivr.net',
    'https://maps.gstatic.com',
    'https://*.maps.gstatic.com', // for google maps
    'https://google.com.au',
    'https://www.google.com.au',
    'https://www.gravatar.com', // for gravatar
    'https://placehold.co', // for placehold
    'https://authjs.dev', // for authjs
    'https://lh3.googleusercontent.com', // for google login
    'https://media.licdn.com', // for linkedin login
    'https://platform-lookaside.fbsbx.com', // for facebook login
  ],
  'font-src': [
    "'self'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
  ],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com', // for stripe
    'https://js.stripe.com', // for stripe
    'https://hooks.stripe.com', // for stripe
    'https://maps.googleapis.com', // for google maps
    'https://www.google.com', // for reCAPTCHA
    'https://www.gstatic.com', // for reCAPTCHA
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com', // for stripe
    'https://api.stripe.com', // for stripe
    'https://maps.googleapis.com', // for google maps
    'https://*.maps.googleapis.com', // for google maps
    'https://js.radar.com', // for radar
    'https://api.radar.io', // for radar
    'https://api.brevo.com', // for brevo
  ],
}

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`
    }
    return ''
  })
  .join('; ')
