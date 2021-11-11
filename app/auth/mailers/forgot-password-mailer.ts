import type { User } from "db";

import { postmark } from "integrations/postmark";
import { ORIGIN } from "app/core/constants/public-env";

type ResetPasswordOptions = {
  token: string;
};

export const sendForgotPasswordEmail = (user: User, { token }: ResetPasswordOptions) => {
  const resetUrl = `${ORIGIN}/reset-password?token=${token}`;

  return postmark.sendEmailWithTemplate({
    From: "app@hikerherd.com",
    To: user.email,
    TemplateAlias: "password-reset",
    TemplateModel: {
      product_url: ORIGIN,
      product_name: "hikerherd",
      name: user.username,
      action_url: resetUrl,
      company_name: "hikerherd",
      company_address: "Address here",
    },
  });
};
