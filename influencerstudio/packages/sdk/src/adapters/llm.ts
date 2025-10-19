import { z } from 'zod';

export interface CaptionInput {
  persona: string;
  tone: string;
  assetDescription: string;
  callToAction?: string;
}

export interface CaptionResult {
  caption: string;
  hashtags: string[];
  callToAction?: string;
}

export interface ReplySuggestionInput {
  persona: string;
  comment: string;
}

export interface LLMAdapter {
  generateCaption(input: CaptionInput): Promise<CaptionResult>;
  suggestHashtags(input: CaptionInput): Promise<string[]>;
  suggestReply(input: ReplySuggestionInput): Promise<string>;
}

const mockPillars = ['#StudioSuite', '#CreatorAI', '#InfluencerStudio'];

class MockLLMAdapter implements LLMAdapter {
  async generateCaption(input: CaptionInput): Promise<CaptionResult> {
    return {
      caption: `${input.persona} shares ${input.assetDescription} with a ${input.tone} vibe.`,
      hashtags: await this.suggestHashtags(input),
      callToAction: input.callToAction ?? 'Follow for more behind-the-scenes magic!'
    };
  }

  async suggestHashtags(input: CaptionInput): Promise<string[]> {
    const base = input.assetDescription
      .split(' ')
      .slice(0, 3)
      .map((word) => `#${word.replace(/[^a-z0-9]/gi, '').toLowerCase()}`)
      .filter(Boolean);
    return Array.from(new Set([...base, ...mockPillars])).slice(0, 10);
  }

  async suggestReply(input: ReplySuggestionInput): Promise<string> {
    return `Thanks for the love! ${input.persona} appreciates your comment: "${input.comment}".`;
  }
}

let adapter: LLMAdapter | undefined;

export function getLLMAdapter(): LLMAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.LLM_PROVIDER === 'mock') {
    adapter = new MockLLMAdapter();
    return adapter;
  }

  throw new Error('No LLM adapter configured. Set USE_MOCK_ADAPTERS=true for local development.');
}

export const CaptionResultSchema = z.object({
  caption: z.string(),
  hashtags: z.array(z.string()),
  callToAction: z.string().optional()
});
