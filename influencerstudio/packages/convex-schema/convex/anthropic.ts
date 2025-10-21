"use node";
import { action } from './_compat';
import { v } from 'convex/values';

export const refineImagePrompt = action({
  args: {
    category: v.string(),
    basePrompt: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY in Convex env');

    const model = process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-20240620';
    const aspect = args.aspectRatio ?? '9:16';
    const base = (args.basePrompt ?? '').trim();
    const userContent =
      base.length > 0
        ? `Refine this AI influencer image prompt for the category "${args.category}", keeping the user's intent but making it concise, descriptive, and photography-aware. Keep it one paragraph, no lists.

User prompt:
${base}

Add or preserve the aspect ratio ${aspect}. Return only the refined prompt text.`
        : `Create a strong AI influencer image prompt for the category "${args.category}" suitable for a photorealistic model. Include lighting, composition, lens, mood, styling, and environment cues. Keep it one paragraph.

Use aspect ratio ${aspect}. Return only the prompt text.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        messages: [{ role: 'user', content: userContent }],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Anthropic request failed: ${res.status} ${txt}`);
    }
    const json = await res.json();
    const content = json?.content?.[0]?.text ?? json?.content ?? '';
    if (!content || typeof content !== 'string') throw new Error('Anthropic returned empty content');
    return { prompt: content.trim() };
  },
});

