import type { DatabaseFunction } from "app/modules/common/types/database-function";
import type { CategoryItem, Currency } from "db";

type Params = {
  categoryId: string;
  index: number;
  values: {
    name: string;
    weight: number;
    imageUrl: string | null;
    link: string | null;
    notes?: string | null;
    consumable: boolean;
    price: number | null;
    currency: Currency;
    worn: boolean;
    quantity?: number;
  };
};

const createPackGear: DatabaseFunction<Params, CategoryItem> = async (
  transaction,
  ctx,
  { categoryId, index, values }
) => {
  return transaction.packCategoryItem.create({
    data: {
      index,
      worn: values.worn,
      quantity: values.quantity,
      notes: values.notes,

      category: {
        connect: {
          id: categoryId,
        },
      },

      gear: {
        create: {
          name: values.name,
          weight: values.weight,
          imageUrl: values.imageUrl,
          link: values.link,
          notes: values.notes,
          consumable: values.consumable,
          price: values.price,
          currency: values.currency,
          userId: ctx.session.userId,
        },
      },
    },
  });
};

export default createPackGear;
