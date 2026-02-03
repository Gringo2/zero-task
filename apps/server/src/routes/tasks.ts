
import { Hono } from 'hono';

const taskRoutes = new Hono();

taskRoutes.get('/', (c) => {
    return c.json([{ id: '1', title: 'test' }]);
});

taskRoutes.post('/', (c) => {
    return c.json({ id: '2', title: 'created' }, 201);
});

export { taskRoutes };
