const policies = {
  'default-src': ["'self'", 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'http://cdn.jsdelivr.net',
  ],
  'child-src': ["'self'", 'http://cdn.jsdelivr.net'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'http://cdn.jsdelivr.net',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.stripe.com',
    'https://thankly.payloadcms.app',
    'https://thankly.co',
    'https://tailwindui.com',
    'https://images.unsplash.com',
    'http://cdn.jsdelivr.net',
  ],
  'font-src': ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
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