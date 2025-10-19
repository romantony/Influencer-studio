import { internalMutation } from './_compat';
import { v } from 'convex/values';

export const deleteObject = internalMutation({
  args: { key: v.string() },
  handler: async (_ctx, args) => {
    void args;
    // TODO: Add delete logic when cleanup tasks are required.
  }
});

