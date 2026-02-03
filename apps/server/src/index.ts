
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { taskRoutes } from './routes/tasks';

// Base app with no types
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.onError((err, c) => {
    console.error('CRITICAL SERVER ERROR:', err);
    return c.json({ error: err.message }, 500);
});

// Auth Routes - Handled on the main app to avoid poisoning RPC types
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
    return auth.handler(c.req.raw);
});

// RPC Routes - Defined on a typed instance
const rpcApp = new Hono().basePath('/api');
const routes = rpcApp.route('/tasks', taskRoutes);

// Export types from the RPC-only instance
export type AppType = typeof routes;

// Mount RPC routes to main app
app.route('/', rpcApp);

// Health Check
app.get('/health', (c) => {
    return c.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Start Server
const port = 5001;
console.log(`ZERO-TASK Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0'
});
