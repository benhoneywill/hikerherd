import { WeightUnit } from "db";

export const gToOz = (grams: number) => {
  return grams * 0.03527396195;
};

export const ozToLb = (ounces: number) => {
  return ounces / 16;
};

export const gToKg = (grams: number) => {
  return grams / 1000;
};

export const ozTog = (ounces: number) => {
  return ounces / 0.03527396195;
};

export const withDecimalPlaces = (weight: number, length: number = 2) => {
  if (weight.toString().indexOf(".") !== -1) {
    return Number(weight.toFixed(length));
  } else {
    return weight;
  }
};

export const displayWeight = (
  weight: number,
  unit: WeightUnit,
  large?: boolean
) => {
  if (unit === WeightUnit.METRIC) {
    return large
      ? `${withDecimalPlaces(gToKg(weight))}kg`
      : `${withDecimalPlaces(weight, 0)}g`;
  } else {
    return large
      ? `${withDecimalPlaces(ozToLb(gToOz(weight)))}lb`
      : `${withDecimalPlaces(gToOz(weight))}oz`;
  }
};

export default displayWeight;
