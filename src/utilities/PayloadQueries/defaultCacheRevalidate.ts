export const defaultCacheRevalidate = process.env.DEFAULT_NEXT_CACHE_REVALIDATE 
  ? parseInt(process.env.DEFAULT_NEXT_CACHE_REVALIDATE)
  : 60; //if .env varialbe is not found, default to 60 seconds