import createCategory from "./factories/create-category";
import createCategoryItem from "./factories/create-category-item";
import createGear from "./factories/create-gear";
import createPack from "./factories/create-pack";
import createPackCategory from "./factories/create-pack-category";
import createPackCategoryItem from "./factories/create-pack-category-item";
import createUser from "./factories/create-user";

export const factories = {
  createCategoryItem,
  createCategory,
  createGear,
  createPackCategoryItem,
  createPackCategory,
  createPack,
  createUser,
};

export type FactoryKey = keyof typeof factories;

export type FactoryValues<T extends FactoryKey> = Parameters<
  typeof factories[T]
>[0];

export type FactoryReturn<T extends FactoryKey> = ReturnType<
  typeof factories[T]
>;

function factory<T extends FactoryKey>({
  name,
  values,
}: {
  name: T;
  values: FactoryValues<T>;
}) {
  return factories[name](values as any);
}

export default factory;
