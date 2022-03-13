import { generateToken, hash256 } from "blitz";

const EXPIRATION_IN_HOURS = 1;

const generatePasswordResetToken = () => {
  const token = generateToken();
  const hashedToken = hash256(token);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + EXPIRATION_IN_HOURS);

  return { token, hashedToken, expiresAt };
};

export default generatePasswordResetToken;
