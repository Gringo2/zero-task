import { hc } from 'hono/client';
import type { AppType } from '../../../server/src/index';

const client = hc<AppType>(import.meta.env.VITE_API_URL);

export const apiClient = client;
export type ApiClient = typeof client;
