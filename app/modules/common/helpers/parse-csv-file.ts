import type { ParsedCsvItem } from "./item-to-csv-format";

import { z } from "zod";
import papaparse from "papaparse";

import { ozTog } from "./display-weight";
import { signToCurrency } from "./currency-to-sign";

const csvItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  weight: z.number().min(0),
  unit: z.enum(["gram", "ounce"]),
  notes: z.string().min(1).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  currency: z.enum(["$", "£", "€"]).nullable().optional(),
  link: z.string().url().nullable().optional(),
  image: z.string().url().nullable().optional(),
  consumable: z.union([z.string(), z.boolean()]).nullable().optional(),
  worn: z.union([z.string(), z.boolean()]).nullable().optional(),
  quantity: z.number().int().min(0).nullable().optional(),
});

const parseCsvFile = (
  file: string
): (ParsedCsvItem & { category: string })[] => {
  const { data } = papaparse.parse(file, {
    header: true,
    transformHeader: (header) => header.toLowerCase(),
    dynamicTyping: {
      weight: true,
      price: true,
      currency: true,
      consumable: true,
      worn: true,
      quantity: true,
      notes: true,
      link: true,
      image: true,
    },
  });

  return data.map((item) => {
    const valid = csvItemSchema.parse(item);

    return {
      category: valid.category,
      worn: !!valid.worn || null,
      quantity: valid.quantity || 1,
      notes: valid.notes || null,
      gear: {
        name: valid.name,
        weight: valid.unit === "gram" ? valid.weight : ozTog(valid.weight),
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

export default parseCsvFile;
