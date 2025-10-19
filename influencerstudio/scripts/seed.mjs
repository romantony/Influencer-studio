#!/usr/bin/env node
import { getImageAdapter, getLLMAdapter } from '@influencerstudio/sdk';

async function main() {
  console.log('Seeding demo data for InfluencerStudio...');
  const image = getImageAdapter();
  const llm = getLLMAdapter();

  const avatar = await image.renderAvatar({
    prompt: 'Futuristic creator portrait',
    style: 'cinematic'
  });
  const caption = await llm.generateCaption({
    persona: 'Ava Flux',
    tone: 'Vibrant',
    assetDescription: 'Launch day teaser visual'
  });

  console.log('Avatar asset stored at', avatar.s3Key);
  console.log('Sample caption:', caption.caption);
  console.log('Seed complete. Connect Convex to persist.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
