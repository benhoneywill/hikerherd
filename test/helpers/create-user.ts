import type { UserValues } from "test/data/get-user-data";

import { SecurePassword } from "blitz";

import getUserData from "test/data/get-user-data";

import db from "db";

const createUser = async (values: UserValues = {}) => {
  const { password, ...data } = getUserData(values);
  const hashedPassword = await SecurePassword.hash(password);

  return db.user.create({
    data: {
      ...data,
      hashedPassword,
    },
  });
};

export default createUser;
