export const NODE_ENV = process.env.NODE_ENV;
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";

const PROTOCOL = IS_PRODUCTION ? "https://" : "http://";
const PREVIEW_SUBDOMAIN = process.env.BLITZ_PUBLIC_PREVIEW_SUBDOMAIN;
const PREVIEW_HOST = PREVIEW_SUBDOMAIN && `${PREVIEW_SUBDOMAIN}.onrender.com`;
const HOST = PREVIEW_HOST || (process.env.BLITZ_PUBLIC_HOST as string);
export const ORIGIN = PROTOCOL + HOST;
