import type { TransactionFunction } from "app/types/transaction-function";

type Params = { id: string };

const conditionallyDeleteGear: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { id }
) => {
  const [item, packItem, clone] = await Promise.all([
    transaction.categoryItem.findFirst({
      where: { gearId: id },
      select: { id: true },
    }),

    transaction.packCategoryItem.findFirst({
      where: { gearId: id },
      select: { id: true },
    }),

    transaction.gear.findFirst({
      where: { clonedFromId: id },
      select: { id: true },
    }),
  ]);

  if (!item && !packItem && !clone) {
    await transaction.gear.delete({ where: { id } });
  }
};

export default conditionallyDeleteGear;
