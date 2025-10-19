import { describe, it, expect } from 'vitest';
import { evaluateCaption } from '@influencerstudio/convex-schema/convex/moderation';

describe('moderation evaluateCaption', () => {
  it('flags toxic captions', () => {
    const result = evaluateCaption('This is terrible and full of hate');
    expect(result.status).toBe('rejected');
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('approves safe captions', () => {
    const result = evaluateCaption('Join our live Q&A session');
    expect(result.status).toBe('approved');
  });
});
