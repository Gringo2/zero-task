
import { Hono } from 'hono';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { TaskStatus } from '@zero-task/shared';

const taskRoutes = new Hono();

// GET /tasks - List all tasks
taskRoutes.get('/', async (c) => {
    const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    return c.json(allTasks);
});

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional()
});

// POST /tasks - Create a new task
taskRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const result = taskSchema.safeParse(body);

        if (!result.success) {
            return c.json({ error: result.error }, 400);
        }

        const { title, description } = result.data;

        const newTask = await db.insert(tasks).values({
            title,
            description,
            status: TaskStatus.PENDING
        }).returning();

        return c.json(newTask[0], 201);
    } catch (e) {
        return c.json({ error: 'Invalid JSON body' }, 400);
    }
});

// PATCH /tasks/:id/toggle - Toggle task status
taskRoutes.patch('/:id/toggle', async (c) => {
    const id = c.req.param('id');
    const existing = await db.select().from(tasks).where(eq(tasks.id, id));

    if (!existing.length) {
        return c.json({ error: 'Task not found' }, 404);
    }

    const currentStatus = existing[0].status;
    const newStatus = currentStatus === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;

    const updated = await db.update(tasks)
        .set({ status: newStatus })
        .where(eq(tasks.id, id))
        .returning();

    return c.json(updated[0]);
});

// DELETE /tasks/:id
taskRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');
    await db.delete(tasks).where(eq(tasks.id, id));
    return c.json({ success: true });
});

export { taskRoutes };
