
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { db } from './db';
import { tasks as tasksTable } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { validator } from 'hono/validator';
import { TaskStatus } from '@zero-task/shared';

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

// Auth Routes (External to RPC types for stability)
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
    return auth.handler(c.req.raw);
});

// Health Check
app.get('/health', (c) => {
    return c.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

/**
 * Domain Routes - Inlined for better type stability
 * This flattening resolves the 'unknown' apiClient issue in the frontend.
 */
const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional().nullable()
});

const routes = app
    .get('/api/tasks', async (c) => {
        const allTasks = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt));
        return c.json(allTasks);
    })
    .post('/api/tasks', validator('json', (value, c) => {
        const result = taskSchema.safeParse(value);
        if (!result.success) return c.json({ error: result.error }, 400);
        return result.data;
    }), async (c) => {
        const payload = c.req.valid('json');
        // Type assertion used to bypass mysterious Drizzle inference failure
        const [newTask] = await db.insert(tasksTable).values({
            title: payload.title,
            description: payload.description || null,
            status: TaskStatus.PENDING
        } as any).returning();
        return c.json(newTask, 201);
    })
    .patch('/api/tasks/:id/toggle', async (c) => {
        const id = c.req.param('id');
        const existing = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
        if (!existing.length) return c.json({ error: 'Task not found' }, 404);

        const newStatus = existing[0].status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
        const [updated] = await db.update(tasksTable).set({ status: newStatus } as any).where(eq(tasksTable.id, id)).returning();
        return c.json(updated);
    })
    .delete('/api/tasks/:id', async (c) => {
        const id = c.req.param('id');
        await db.delete(tasksTable).where(eq(tasksTable.id, id));
        return c.json({ success: true });
    });

export type AppType = typeof routes;

// Start Server
const port = 5001;
console.log(`ZERO-TASK Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0'
});
