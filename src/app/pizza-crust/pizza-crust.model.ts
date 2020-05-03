export enum Crusts {
  THIN = "thin",
  THICK = "thick",
}

export interface Crust {
  name: Crusts;
  price: number;
}
