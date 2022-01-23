import { z } from "zod";

import { WeightUnit, Currency } from "db";

const updatePreferencesSchema = z.object({
  weightUnit: z.nativeEnum(WeightUnit),
  currency: z.nativeEnum(Currency),
});

export default updatePreferencesSchema;
