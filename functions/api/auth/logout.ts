export interface Env {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET: string
  FRONTEND_URL: string
}

export function onRequestPost(_context: { request: Request; env: Env }) {
  // Clear the auth cookie
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
    }
  })
}