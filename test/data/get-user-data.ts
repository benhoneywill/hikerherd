import { faker } from "@faker-js/faker";

export type UserValues = {
  email?: string;
  password?: string;
  username?: string;
};

const getUserData = (values: UserValues = {}) => ({
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(12),
  username: faker.internet.userName().toLowerCase(),
  ...values,
});

export default getUserData;
