// This file tells Cloudflare Pages to use our Worker for all routes
import worker from '../src/index.js';

export const onRequest = worker.fetch;