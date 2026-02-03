
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { taskRoutes } from './routes/tasks';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.onError((err, c) => {
    console.error('CRITICAL SERVER ERROR:', err);
    return c.json({ error: err.message }, 500);
});

// Auth Routes (Better Auth handles /api/auth/*)
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
    return auth.handler(c.req.raw);
});

// API Routes
const routes = app.route('/api/tasks', taskRoutes);

export type AppType = typeof routes;

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
    hostname: '127.0.0.1'
});
