import { hc } from 'hono/client';
import type { AppType } from '../../../server/src/index';

const client = hc<AppType>('http://localhost:5001');

export const apiClient = client;
export type ApiClient = typeof client;
