export const NODE_ENV = process.env.NODE_ENV;

export const HOST = process.env.HOST as string;
export const PROTOCOL = NODE_ENV === "production" ? "https://" : "http://";
export const ORIGIN = HOST + PROTOCOL;

export const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN as string;
