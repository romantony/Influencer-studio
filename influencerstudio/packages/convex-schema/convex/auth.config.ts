import { AuthConfig } from 'convex/server';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'story-factory-4bbdf';

if (!projectId) {
  throw new Error('Missing Firebase project id for Convex auth configuration.');
}

const config: AuthConfig = {
  providers: [
    {
      domain: `https://securetoken.google.com/${projectId}`,
      applicationID: projectId
    }
  ]
};

export default config;
