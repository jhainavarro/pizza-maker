export enum Sizes {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface Size {
  name: Sizes;
  inches: number;
  maxToppings: number;
  price: number;
}
