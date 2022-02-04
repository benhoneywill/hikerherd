import { SecurePassword, AuthenticationError } from "blitz";

import db from "db";

const authenticateOrError = async (rawEmail: string, rawPassword: string) => {
  const sanitizedEmail = rawEmail.toLowerCase().trim();
  const trimmedPassword = rawPassword.trim();

  const user = await db.user.findFirst({
    where: { email: sanitizedEmail },
    select: {
      id: true,
      role: true,
      username: true,
      email: true,
      hashedPassword: true,
    },
  });

  if (!user) throw new AuthenticationError();

  const { hashedPassword, ...userWithoutPassword } = user;

  const result = await SecurePassword.verify(hashedPassword, trimmedPassword);

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    const improvedHash = await SecurePassword.hash(trimmedPassword);
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword: improvedHash },
    });
  }

  return userWithoutPassword;
};

export default authenticateOrError;
