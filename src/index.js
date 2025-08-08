// Main Worker entry point for handling API routes and static assets
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // CORS headers for API routes
      const corsHeaders = {
        'Access-Control-Allow-Origin': env.FRONTEND_URL || 'https://mychat.current.space',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      };
      
      // Handle OPTIONS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { 
          status: 200, 
          headers: corsHeaders 
        });
      }
      
      try {
        // Route to appropriate handler
        if (url.pathname === '/api/auth/google' && request.method === 'POST') {
          return handleGoogleAuth(request, env, corsHeaders);
        } else if (url.pathname === '/api/auth/me' && request.method === 'GET') {
          return handleGetUser(request, env, corsHeaders);
        } else if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
          return handleLogout(request, env, corsHeaders);
        }
        
        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: corsHeaders
        });
      } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    
    // Serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};

// Google OAuth handler
async function handleGoogleAuth(request, env, headers) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return new Response(JSON.stringify({ error: 'No credential provided' }), {
        status: 400,
        headers
      });
    }
    
    // Decode the Google JWT token
    const [_header, payload, _signature] = credential.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Verify the token audience
    if (decodedPayload.aud !== env.GOOGLE_CLIENT_ID) {
      return new Response(JSON.stringify({ error: 'Invalid token audience' }), {
        status: 401,
        headers
      });
    }
    
    // Extract user information
    const user = {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      name: decodedPayload.name,
      picture: decodedPayload.picture,
      email_verified: decodedPayload.email_verified
    };
    
    // Create session token
    const sessionToken = await createSessionToken(user, env.JWT_SECRET);
    
    // Set cookie and return response
    const response = new Response(JSON.stringify({ user, token: sessionToken }), {
      status: 200,
      headers
    });
    
    response.headers.append('Set-Cookie', 
      `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`
    );
    
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers
    });
  }
}

// Get current user handler
async function handleGetUser(request, env, headers) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    const token = parseCookie(cookieHeader, 'auth_token');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers
      });
    }
    
    const user = await verifySessionToken(token, env.JWT_SECRET);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers
      });
    }
    
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 401,
      headers
    });
  }
}

// Logout handler
function handleLogout(request, env, headers) {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers
  });
  
  response.headers.append('Set-Cookie', 
    'auth_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
  );
  
  return response;
}

// Helper functions
function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

async function createSessionToken(user, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify({
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
  }));
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(data)));
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${base64Data}.${base64Signature}`;
}

async function verifySessionToken(token, secret) {
  try {
    const [data, signature] = token.split('.');
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const dataBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, dataBytes);
    
    if (!valid) return null;
    
    const payload = JSON.parse(new TextDecoder().decode(dataBytes));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}