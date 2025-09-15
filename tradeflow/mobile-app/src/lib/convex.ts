import { ConvexClient } from 'convex/browser'

const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is missing in .env')
}

export const convex = new ConvexClient(convexUrl)
