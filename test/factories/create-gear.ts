import type { GearValues } from "test/data/get-gear-data";

import getGearData from "test/data/get-gear-data";

import db from "db";

type CreateGearValues = GearValues & { userId: string; clonedFromId?: string };

const createGear = async (values: CreateGearValues) => {
  const data = getGearData(values);
  return db.gear.create({ data: { ...data, userId: values.userId } });
};

export default createGear;
