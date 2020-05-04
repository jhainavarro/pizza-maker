export enum Toppings {
  PEPPERONI = "pepperoni",
  MUSHROOMS = "mushrooms",
  ONIONS = "onions",
  SAUSAGE = "sausage",
  BACON = "bacon",
  EXTRA_CHEESE = "extra cheese",
  BLACK_OLIVES = "black olives",
  GREEN_PEPPERS = "green peppers",
  PINEAPPLE = "pineapple",
  SPINACH = "spinach",
}

export interface Topping {
  name: Toppings;
  src: string;
}

export const PRICE_PER_TOPPING = 0.5;
