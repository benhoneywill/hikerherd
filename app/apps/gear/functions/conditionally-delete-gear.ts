import type { TransactionFunction } from "app/types/transaction-function";

type Params = { ids: string[] };

const conditionallyDeleteGear: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { ids }
) => {
  const idsToDelete: string[] = [];

  await Promise.all(
    ids.map(async (id) => {
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
        idsToDelete.push(id);
      }
    })
  );

  if (idsToDelete.length) {
    await transaction.gear.deleteMany({ where: { id: { in: idsToDelete } } });
  }
};

export default conditionallyDeleteGear;
