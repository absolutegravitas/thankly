// components/GoogleMapsScriptLoader.tsx
import React, { useEffect } from 'react'

interface GoogleMapsScriptLoaderProps {
  onLoad: () => void
}

const GoogleMapsScriptLoader: React.FC<GoogleMapsScriptLoaderProps> = ({ onLoad }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = onLoad
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [onLoad])

  return null
}

export default GoogleMapsScriptLoader
