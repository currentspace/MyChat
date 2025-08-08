
export interface Env {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET: string
  FRONTEND_URL: string
}

// This middleware runs before all requests in the /functions directory
export async function onRequest(context: any) {
  const { request, env, next } = context
  
  // Add CORS headers for API routes
  if (request.url.includes('/api/')) {
    const response = await next()
    
    // Add CORS headers
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', env.FRONTEND_URL || 'https://mychat.current.space')
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers })
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }
  
  return next()
}