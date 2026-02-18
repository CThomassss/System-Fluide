export const FOOD_ITEMS = [
  "oats",
  "whole_eggs",
  "banana",
  "chicken_breast",
  "rice",
  "vegetables",
  "cream_of_rice",
  "whey_shake",
  "milk",
  "raspberries",
  "red_meat",
  "sweet_potato",
  "green_salad",
] as const;

export type FoodKey = (typeof FOOD_ITEMS)[number];
