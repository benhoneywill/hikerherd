export const NODE_ENV = process.env.NODE_ENV;

const PRODUCTION_HOST = process.env.PRODUCTION_HOST as string;
const DEVELOPMENT_HOST = process.env.DEVELOPMENT_HOST as string;
const PREVIEW_HOST = process.env.RENDER_EXTERNAL_HOSTNAME; // set in preview deploys by render.com
export const HOST = PREVIEW_HOST || NODE_ENV === "production" ? PRODUCTION_HOST : DEVELOPMENT_HOST;

export const PROTOCOL = NODE_ENV === "production" ? "https://" : "http://";
export const ORIGIN = HOST + PROTOCOL;

export const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN as string;
