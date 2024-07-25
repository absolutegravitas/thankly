const policies = {
  'default-src': ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://va.vercel-scripts.com',
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'http://cdn.jsdelivr.net',
    'https://js.radar.com',
    'https://www.googletagmanager.com',
  ],
  'child-src': ["'self'", 'http://cdn.jsdelivr.net'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'http://cdn.jsdelivr.net',
    'https://js.radar.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.stripe.com',
    'https://thankly.vercel.app',
    'https://thankly.co',
    'https://tailwindui.com',
    'https://images.unsplash.com',
    'http://cdn.jsdelivr.net',
    'https://maps.gstatic.com',
    'https://google.com.au',
    'https://*gravatar.com',
    'https://www.gravatar.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdeliver.net',
  ],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    'https://analytics.google.com',
    'https://js.radar.com',
    'https://api.radar.io',
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
