import { ConvexReactClient } from 'convex/react';

const address = process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://127.0.0.1:8187';

export const convex = new ConvexReactClient(address);
