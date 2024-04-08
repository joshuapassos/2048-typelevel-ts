
export type Eq<A, B> = A extends B ? true : false;
export type Eq2<A, B, C> = And<Eq<A, B>, Eq<B, C>>;

export type Not<X> = X extends true ? false : true;

export type And<A, B> = A extends true ? (B extends true ? true : false) : false;
export type Or<A, B> = A extends true ? true : B;

export type AssertTrue<A extends true> = A;



export type LetterNumber = {
  A: 0;
  B: 1;
  C: 2;
  D: 3;
  E: 4;
  F: 5;
  G: 6;
  H: 7;
  I: 8;
  J: 9;
  K: 10;
  L: 11;
  M: 12;
  N: 13;
  O: 14;
  P: 15;
  Q: 16;
  R: 17;
  S: 18;
  T: 19;
  U: 20;
  V: 21;
  W: 22;
  X: 23;
  Y: 24;
  Z: 25;
};

export type NumberLetter = {
  0: "A";
  1: "B";
  2: "C";
  3: "D";
  4: "E";
  5: "F";
  6: "G";
  7: "H";
  8: "I";
  9: "J";
  10: "K";
  11: "L";
  12: "M";
  13: "N";
  14: "O";
  15: "P";
  16: "Q";
  17: "R";
  18: "S";
  19: "T";
  20: "U";
  21: "V";
  22: "W";
  23: "X";
  24: "Y";
  25: "Z";
};

export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType
> = {
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

export type Fill<A, acc extends Array<number> = []> = A extends acc["length"]
  ? acc
  : Fill<A, [0, ...acc]>;

export type RevertList<A> = A extends [infer H, ...infer Tail]
  ? [...RevertList<Tail>, H]
  : [];