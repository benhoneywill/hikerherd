import { ServerClient } from "postmark";

const postmark = new ServerClient(process.env.POSTMARK_API_TOKEN || "POSTMARK_API_TEST");

export default postmark;
