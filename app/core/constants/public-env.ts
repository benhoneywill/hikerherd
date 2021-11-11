export const NODE_ENV = process.env.NODE_ENV;

export const PROTOCOL = NODE_ENV === "production" ? "https://" : "http://";

const PREVIEW_SUBDOMAIN = process.env.BLITZ_PUBLIC_PREVIEW_SUBDOMAIN;
const HOST = process.env.BLITZ_PUBLIC_HOST as string;

export const ORIGIN = PROTOCOL + (PREVIEW_SUBDOMAIN ? `${PREVIEW_SUBDOMAIN}.onrender.com` : HOST);
