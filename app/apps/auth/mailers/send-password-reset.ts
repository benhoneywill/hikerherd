import type { User } from "db";

import postmark from "integrations/postmark";

const APP_ORIGIN = process.env.BLITZ_PUBLIC_APP_ORIGIN;

type SendPasswordResetOptions = {
  token: string;
};

const sendPasswordReset = (user: User, { token }: SendPasswordResetOptions) => {
  const resetUrl = `${APP_ORIGIN}/reset-password?token=${token}`;

  return postmark.sendEmailWithTemplate({
    From: "app@hikerherd.com",
    To: user.email,
    TemplateAlias: "password-reset",
    TemplateModel: {
      product_url: APP_ORIGIN,
      product_name: "hikerherd",
      name: user.username,
      action_url: resetUrl,
      company_name: "hikerherd",
      company_address: "Address here",
    },
  });
};

export default sendPasswordReset;
