import { ServerClient } from "postmark";

import { POSTMARK_API_TOKEN } from "app/core/constants/private-env";

export const postmark = new ServerClient(POSTMARK_API_TOKEN);
