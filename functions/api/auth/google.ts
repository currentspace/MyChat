export interface Env {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET: string
  FRONTEND_URL: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context
  
  try {
    const { credential } = await request.json() as { credential: string }
    
    if (!credential) {
      return new Response(JSON.stringify({ error: 'No credential provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Decode the Google JWT token (id_token)
    const [_header, payload, _signature] = credential.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    
    // Verify the token audience matches our client ID
    if (decodedPayload.aud !== env.GOOGLE_CLIENT_ID) {
      return new Response(JSON.stringify({ error: 'Invalid token audience' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Extract user information
    const user = {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      name: decodedPayload.name,
      picture: decodedPayload.picture,
      email_verified: decodedPayload.email_verified
    }

    // Create a session token
    const sessionToken = await createSessionToken(user, env.JWT_SECRET)
    
    // Create response with cookie
    const response = new Response(JSON.stringify({ user, token: sessionToken }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`
      }
    })

    return response
  } catch (_error) {
    console.error('Auth error:', _error)
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function createSessionToken(user: unknown, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify({
    ...(user as Record<string, unknown>),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
  }))
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, data)
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(data)))
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
  
  return `${base64Data}.${base64Signature}`
}