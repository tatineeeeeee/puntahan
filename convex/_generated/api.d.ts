/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as bookmarks from "../bookmarks.js";
import type * as checklists from "../checklists.js";
import type * as destinations from "../destinations.js";
import type * as festivals from "../festivals.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as itineraries from "../itineraries.js";
import type * as journals from "../journals.js";
import type * as leaderboard from "../leaderboard.js";
import type * as notifications from "../notifications.js";
import type * as photos from "../photos.js";
import type * as seed from "../seed.js";
import type * as tips from "../tips.js";
import type * as tripSuggestions from "../tripSuggestions.js";
import type * as users from "../users.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  bookmarks: typeof bookmarks;
  checklists: typeof checklists;
  destinations: typeof destinations;
  festivals: typeof festivals;
  helpers: typeof helpers;
  http: typeof http;
  itineraries: typeof itineraries;
  journals: typeof journals;
  leaderboard: typeof leaderboard;
  notifications: typeof notifications;
  photos: typeof photos;
  seed: typeof seed;
  tips: typeof tips;
  tripSuggestions: typeof tripSuggestions;
  users: typeof users;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
