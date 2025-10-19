/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _compat from "../_compat.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as avatars from "../avatars.js";
import type * as content from "../content.js";
import type * as influencers from "../influencers.js";
import type * as instagram from "../instagram.js";
import type * as moderation from "../moderation.js";
import type * as notifications from "../notifications.js";
import type * as posts from "../posts.js";
import type * as s3 from "../s3.js";
import type * as s3_internal from "../s3_internal.js";
import type * as schedulers from "../schedulers.js";
import type * as settings from "../settings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  _compat: typeof _compat;
  analytics: typeof analytics;
  auth: typeof auth;
  avatars: typeof avatars;
  content: typeof content;
  influencers: typeof influencers;
  instagram: typeof instagram;
  moderation: typeof moderation;
  notifications: typeof notifications;
  posts: typeof posts;
  s3: typeof s3;
  s3_internal: typeof s3_internal;
  schedulers: typeof schedulers;
  settings: typeof settings;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
