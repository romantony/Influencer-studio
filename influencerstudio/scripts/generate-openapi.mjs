#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const spec = await import('../packages/config/openapi/influencerstudio.json', { assert: { type: 'json' } });
writeFileSync(resolve('./openapi.generated.json'), JSON.stringify(spec.default ?? spec, null, 2));
console.log('OpenAPI spec written to openapi.generated.json');
