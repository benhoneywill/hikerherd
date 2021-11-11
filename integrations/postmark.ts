import { ServerClient } from "postmark";

export const postmark = new ServerClient(process.env.POSTMARK_API_TOKEN || "POSTMARK_API_TEST");
