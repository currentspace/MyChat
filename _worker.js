// _worker.js - Cloudflare Worker for handling API routes and static assets
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Add CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': env.FRONTEND_URL || 'https://mychat.current.space',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      };
      
      // Handle OPTIONS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { 
          status: 200, 
          headers: corsHeaders 
        });
      }
      
      // Route API requests
      try {
        let response;
        
        if (url.pathname === '/api/auth/google' && request.method === 'POST') {
          const { onRequestPost } = await import('./functions/api/auth/google.ts');
          response = await onRequestPost({ request, env });
        } else if (url.pathname === '/api/auth/me' && request.method === 'GET') {
          const { onRequestGet } = await import('./functions/api/auth/me.ts');
          response = await onRequestGet({ request, env });
        } else if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
          const { onRequestPost } = await import('./functions/api/auth/logout.ts');
          response = await onRequestPost({ request, env });
        } else {
          response = new Response('Not Found', { status: 404 });
        }
        
        // Add CORS headers to response
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // Serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};