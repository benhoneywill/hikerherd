import type { ParsedCsvItem } from "./item-to-csv-format";

import { z } from "zod";

import { ozTog } from "./display-weight";
import { signToCurrency } from "./currency-to-sign";

const csvItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  weight: z.number().min(0),
  unit: z.enum(["g", "oz"]),
  notes: z.string().min(1).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  currency: z.enum(["$", "£", "€"]).nullable().optional(),
  link: z.string().url().nullable().optional(),
  image: z.string().url().nullable().optional(),
  consumable: z.boolean().nullable().optional(),
  worn: z.boolean().nullable().optional(),
  quantity: z.number().min(0).nullable().optional(),
});

const parseCsvItems = (
  data: unknown[]
): (ParsedCsvItem & { category: string })[] => {
  return data.map((item) => {
    const valid = csvItemSchema.parse(item);

    return {
      category: valid.category,
      worn: valid.worn || null,
      quantity: valid.quantity || 1,
      notes: valid.notes || null,
      gear: {
        name: valid.name,
        weight: valid.unit === "g" ? valid.weight : ozTog(valid.weight),
        price: valid.price ? valid.price * 100 : null,
        currency: signToCurrency(valid.currency),
        consumable: !!valid.consumable,
        link: valid.link || null,
        notes: valid.notes || null,
        imageUrl: valid.image || null,
      },
    };
  });
};

export default parseCsvItems;
