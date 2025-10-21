export type InfluencerCategory = {
  id: string;
  emoji: string;
  name: string;
  blurb: string;
  samplePrompt: string;
  coverUrl: string;
};

// Placeholder cover images; replace with branded assets later.
export const INFLUENCER_CATEGORIES: InfluencerCategory[] = [
  {
    id: 'fashion',
    emoji: '🧥',
    name: 'Fashion & Lifestyle',
    blurb: 'Outfit modeling and trend showcasing',
    samplePrompt:
      'Full‑body fashion model, street style, natural light, editorial vibe, showcasing seasonal outfit, trending colors, confident pose, high detail skin, 85mm look, shallow depth of field',
    coverUrl:
      'https://images.unsplash.com/photo-1520975747729-22ebd9b1da28?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'beauty',
    emoji: '💄',
    name: 'Beauty & Skincare',
    blurb: 'Cosmetic tutorials and product demos',
    samplePrompt:
      'Portrait beauty influencer, soft studio lighting, clean background, glossy makeup, radiant skin, product in hand, friendly expression, macro beauty detail',
    coverUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'fitness',
    emoji: '💪',
    name: 'Fitness & Wellness',
    blurb: 'Workout coaching and motivational content',
    samplePrompt:
      'Athletic portrait in gym, dynamic action pose, defined muscles, motivating energy, cinematic lighting, shallow depth of field, sharp details',
    coverUrl:
      'https://images.unsplash.com/photo-1518602164579-3c9e1d50bf49?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'travel',
    emoji: '🌍',
    name: 'Travel & Adventure',
    blurb: 'Virtual exploration and travel storytelling',
    samplePrompt:
      'Travel influencer at scenic vista, golden hour, sweeping landscape, candid moment, documentary style, warm film tones, storytelling composition',
    coverUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'tech',
    emoji: '🚗',
    name: 'Tech, Gadgets & Automotive',
    blurb: 'Futuristic lifestyle and innovation branding',
    samplePrompt:
      'Futuristic tech reviewer, clean studio, neon accents, holding gadget, product‑first framing, high contrast, glossy reflections, minimal background',
    coverUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'gaming',
    emoji: '🎮',
    name: 'Gaming & Esports',
    blurb: 'Character-based AI streamers',
    samplePrompt:
      'Neon cyberpunk gamer, RGB lighting, headset on, streamer aesthetic, moody atmosphere, crisp details, dynamic pose, background bokeh',
    coverUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'finance',
    emoji: '💰',
    name: 'Finance & Business',
    blurb: 'Financial literacy and fintech branding',
    samplePrompt:
      'Confident business persona in modern office, clean lighting, smart casual attire, sleek minimal style, approachable professional look',
    coverUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'sustainability',
    emoji: '🌿',
    name: 'Sustainability & Eco',
    blurb: 'Green lifestyle advocates',
    samplePrompt:
      'Eco‑conscious influencer outdoors, natural materials, earthy palette, soft daylight, serene tone, storytelling about sustainability',
    coverUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'music',
    emoji: '🎵',
    name: 'Music & Entertainment',
    blurb: 'Virtual singers, DJs, or dancers',
    samplePrompt:
      'Stage performance, dramatic colored lights, energetic expression, dynamic motion, concert atmosphere, lens flares, creative framing',
    coverUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'food',
    emoji: '🍔',
    name: 'Food & Nutrition',
    blurb: 'Recipe creators and virtual chefs',
    samplePrompt:
      'Chef persona in bright kitchen, plating dish, appetizing color grading, shallow DOF on food, clean editorial look',
    coverUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'art',
    emoji: '🎨',
    name: 'Art, Culture & Design',
    blurb: 'Digital art promotion and collaborations',
    samplePrompt:
      'Artistic portrait, gallery setting, creative composition, bold color blocking, editorial styling, design‑forward mood',
    coverUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'education',
    emoji: '📚',
    name: 'Education & EdTech',
    blurb: 'Virtual tutors and explainer avatars',
    samplePrompt:
      'Educational presenter, clean background, clear expressions, friendly tone, bright lighting, approachable style, chalkboard or tablet prop',
    coverUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'ai-advocacy',
    emoji: '🧠',
    name: 'Tech Thought Leadership / AI',
    blurb: 'Automation and innovation content',
    samplePrompt:
      'Futurist persona, minimal studio, cool tone, clean tech props, crisp lighting, thoughtful expression, editorial portrait',
    coverUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'ecommerce',
    emoji: '🛍️',
    name: 'E‑Commerce & Retail',
    blurb: 'Virtual brand ambassadors',
    samplePrompt:
      'Lifestyle product showcase, e‑commerce set, clean composition, natural light, modern styling, subtle brand focus, conversion‑ready',
    coverUrl:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'celebrity',
    emoji: '💅',
    name: 'Celebrity / Personality',
    blurb: 'Character-driven social entertainment',
    samplePrompt:
      'Charismatic personality, talk‑show vibe, expressive gestures, glam lighting, stylish outfit, high‑end editorial finish',
    coverUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
  }
];

