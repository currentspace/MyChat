// Chat API endpoints for Cloudflare Worker
// Supports OpenAI and Anthropic Claude

export async function handleChatMessage(request, env, corsHeaders) {
  try {
    const { message, sessionId, location, provider = 'openai' } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Get conversation history from KV (if available)
    const history = await getConversationHistory(env, sessionId);
    
    // Build the prompt with context
    const systemPrompt = buildSystemPrompt(location);
    const messages = buildMessageHistory(history, message, systemPrompt);
    
    // Call the appropriate AI provider
    let response;
    if (provider === 'anthropic') {
      response = await callAnthropic(messages, env);
    } else {
      response = await callOpenAI(messages, env);
    }
    
    // Store the conversation in KV (if available)
    if (env.CHAT_HISTORY) {
      await storeConversation(env, sessionId, message, response);
    }
    
    return new Response(JSON.stringify({ 
      response,
      sessionId,
      provider 
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function handleChatStream(request, env, corsHeaders) {
  try {
    const { message, sessionId, location, provider = 'openai' } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Set up streaming response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Stream the response
    streamChatResponse(message, sessionId, location, provider, env, writer, encoder);

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Stream error:', error);
    return new Response(JSON.stringify({ error: 'Failed to stream response' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Helper functions

function buildSystemPrompt(location) {
  let prompt = `You are a helpful AI assistant called MyChat. You provide informative, friendly, and contextual responses.`;
  
  if (location) {
    prompt += ` The user is currently at ${location.name || `${location.lat}, ${location.lng}`}. 
    You can provide location-specific information, recommendations, and insights when relevant.`;
  }
  
  return prompt;
}

function buildMessageHistory(history, newMessage, systemPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt }
  ];
  
  // Add recent history (last 5 exchanges)
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10); // Last 5 exchanges (user + assistant)
    messages.push(...recentHistory);
  }
  
  // Add the new message
  messages.push({ role: 'user', content: newMessage });
  
  return messages;
}

async function callOpenAI(messages, env) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(messages, env) {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  // Convert messages to Anthropic format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function streamChatResponse(message, sessionId, location, provider, env, writer, encoder) {
  try {
    const systemPrompt = buildSystemPrompt(location);
    const history = await getConversationHistory(env, sessionId);
    const messages = buildMessageHistory(history, message, systemPrompt);
    
    if (provider === 'anthropic') {
      await streamAnthropic(messages, env, writer, encoder);
    } else {
      await streamOpenAI(messages, env, writer, encoder);
    }
    
    await writer.close();
  } catch (error) {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
    await writer.close();
  }
}

async function streamOpenAI(messages, env, writer, encoder) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }
}

async function streamAnthropic(messages, env, writer, encoder) {
  // Anthropic streaming implementation
  // Similar to OpenAI but with Anthropic's format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      max_tokens: 1000,
      stream: true
    })
  });

  // Process Anthropic streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta') {
            const content = parsed.delta?.text;
            if (content) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }
}

// KV Storage functions
async function getConversationHistory(env, sessionId) {
  if (!env.CHAT_HISTORY || !sessionId) return [];
  
  try {
    const data = await env.CHAT_HISTORY.get(`session:${sessionId}`, 'json');
    return data?.messages || [];
  } catch {
    return [];
  }
}

async function storeConversation(env, sessionId, userMessage, assistantResponse) {
  if (!env.CHAT_HISTORY || !sessionId) return;
  
  try {
    const existing = await getConversationHistory(env, sessionId);
    const updated = [
      ...existing,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantResponse, timestamp: new Date().toISOString() }
    ];
    
    // Keep only last 20 messages
    const trimmed = updated.slice(-20);
    
    await env.CHAT_HISTORY.put(
      `session:${sessionId}`,
      JSON.stringify({ messages: trimmed, lastUpdated: new Date().toISOString() }),
      { expirationTtl: 86400 * 7 } // Expire after 7 days
    );
  } catch (error) {
    console.error('Failed to store conversation:', error);
  }
}