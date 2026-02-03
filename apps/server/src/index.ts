import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.get('/', (c) => {
    return c.text('ZERO-TASK API Engine: ONLINE');
});

app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: Date.now() });
});

// Start Server
const port = 3000;
console.log(`ZERO-TASK Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});
