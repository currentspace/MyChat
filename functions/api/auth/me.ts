export interface Env {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET: string
  FRONTEND_URL: string
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context
  
  try {
    // Parse cookies from request
    const cookieHeader = request.headers.get('Cookie')
    const token = parseCookie(cookieHeader, 'auth_token')
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const user = await verifySessionToken(token, env.JWT_SECRET)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const cookie = cookies.find(c => c.startsWith(`${name}=`))
  
  return cookie ? cookie.split('=')[1] : null
}

async function verifySessionToken(token: string, secret: string): Promise<unknown> {
  try {
    const [data, signature] = token.split('.')
    const encoder = new TextEncoder()
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    
    const dataBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
    
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, dataBytes)
    
    if (!valid) {
      return null
    }
    
    const payload = JSON.parse(new TextDecoder().decode(dataBytes))
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload
  } catch {
    return null
  }
}