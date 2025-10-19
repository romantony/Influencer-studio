import { AuthConfig } from 'convex/server';

// NOTE: If you want to drive this from Convex env vars,
// re-introduce process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID and
// ensure it is set in the deployment.
const projectId = 'story-factory-4bbdf';

const config: AuthConfig = {
  providers: [
    {
      domain: `https://securetoken.google.com/${projectId}`,
      applicationID: projectId
    }
  ]
};

export default config;
