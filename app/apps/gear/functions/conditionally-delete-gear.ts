import type { TransactionFunction } from "app/types/transaction-function";

type Params = { ids: string[] };

const conditionallyDeleteGear: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { ids }
) => {
  const [items, packItems, clones] = await Promise.all([
    transaction.categoryItem.findMany({
      where: { gearId: { in: ids } },
      select: { gearId: true },
    }),

    transaction.packCategoryItem.findMany({
      where: { gearId: { in: ids } },
      select: { gearId: true },
    }),

    transaction.gear.findMany({
      where: { clonedFromId: { in: ids } },
      select: { clonedFromId: true },
    }),
  ]);

  const foundGearIds = [
    ...items.map(({ gearId }) => gearId),
    ...packItems.map(({ gearId }) => gearId),
    ...clones.map(({ clonedFromId }) => clonedFromId),
  ];

  const idsToDelete = ids.filter((id) => !foundGearIds.includes(id));

  if (idsToDelete.length) {
    await transaction.gear.deleteMany({ where: { id: { in: idsToDelete } } });
  }
};

export default conditionallyDeleteGear;
