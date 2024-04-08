import { Random } from "./random";
import {
  AssertTrue,
  ChangeTypeOfKeys,
  Eq,
  LetterNumber,
  NumberLetter,
  RevertList,
} from "./utils";
import { Add, Mod } from "ts-arithmetic";

type Wrap<T> = {
  value: Pad4Start<T>;
  _value: T;
};

type RNG<
  T extends TableInternal,
  Start extends number,
  Count extends any[] = []
> = Count["length"] extends 3
  ? T
  : Start extends keyof NumberLetter
  ? NumberLetter[Start] extends keyof T
    ? T[NumberLetter[Start]] extends "x"
      ? ChangeTypeOfKeys<T, NumberLetter[Start], "2">
      : RNG<T, Mod<Add<Start, 1>, 16>, [0, ...Count]>
    : never
  : never;

type Pad4Start<V> = V extends `${number}${number}${number}${number}`
  ? `${V}`
  : V extends `${number}${number}${number}`
  ? ` ${V}`
  : V extends `${number}${number}`
  ? ` ${V} `
  : V extends `${number}`
  ? `  ${V} `
  : `    `;

// Test pad
type TestPad1 = AssertTrue<Eq<Pad4Start<"1">, "  1 ">>;
type TestPad2 = AssertTrue<Eq<Pad4Start<"12">, " 12 ">>;
type TestPad3 = AssertTrue<Eq<Pad4Start<"123">, " 123">>;
type TestPad4 = AssertTrue<Eq<Pad4Start<"1234">, "1234">>;

type Letters =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P";

type TableInternal = {
  [K in Letters]: "x" | BasicNumbers;
};

type BaseGame = {
  A: "2";
  B: "x";
  C: "x";
  D: "2";
  // --------------------------;
  E: "x";
  F: "x";
  G: "x";
  H: "x";
  // --------------------------;
  I: "x";
  J: "x";
  K: "x";
  L: "x";
  // --------------------------;
  M: "x";
  N: "x";
  O: "x";
  P: "x";
};

type BasicNumbers =
  | "2"
  | "4"
  | "8"
  | "16"
  | "32"
  | "64"
  | "128"
  | "256"
  | "512"
  | "1024"
  | "2048";

type Inc = {
  x: "x";
  "2": "4";
  "4": "8";
  "8": "16";
  "16": "32";
  "32": "64";
  "64": "128";
  "128": "256";
  "256": "512";
  "512": "1024";
  "1024": "2048";
  "2048": "2048";
};

type PP = keyof Inc;

type Merge2<T> = T extends [PP, PP]
  ? T extends ["x", "x"]
    ? ["x", "x"]
    : T extends ["x", infer A]
    ? [A, "x"]
    : T extends [infer A, "x"]
    ? [A, "x"]
    : T extends [infer A extends PP, infer B extends PP]
    ? Eq<A, B> extends true
      ? [Inc[A], "x"]
      : [A, B]
    : never
  : never;

type Merge3<T> = T extends [PP, PP, PP]
  ? T extends [infer A extends PP, infer B extends PP, infer C extends PP]
    ? Eq<A, B> extends true
      ? [...Merge2<[A, B]>, C]
      : Eq<B, C> extends true
      ? [A, ...Merge2<[B, C]>]
      : [A, B, C]
    : never
  : never;

type Merge<T> = T extends [PP, PP, PP, PP]
  ? T extends ["x", "x", "x", "x"]
    ? ["x", "x", "x", "x"]
    : T extends ["x", "x", "x", infer A]
    ? [A, "x", "x", "x"]
    : T extends ["x", "x", infer A, "x"]
    ? [A, "x", "x", "x"]
    : T extends ["x", infer A, "x", "x"]
    ? [A, "x", "x", "x"]
    : T extends [infer A, "x", "x", "x"]
    ? [A, "x", "x", "x"]
    : T extends ["x", "x", infer A, infer B]
    ? [...Merge2<[A, B]>, "x", "x"]
    : T extends ["x", infer A, "x", infer B]
    ? [...Merge2<[A, B]>, "x", "x"]
    : T extends ["x", infer A, infer B, "x"]
    ? [...Merge2<[A, B]>, "x", "x"]
    : T extends [infer A, "x", "x", infer B]
    ? [...Merge2<[A, B]>, "x", "x"]
    : T extends ["x", infer A, infer B, infer C]
    ? [...Merge3<[A, B, C]>, "x"]
    : T extends [infer A, "x", infer B, infer C]
    ? [...Merge3<[A, B, C]>, "x"]
    : T extends [infer A, infer B, "x", infer C]
    ? [...Merge3<[A, B, C]>, "x"]
    : T extends [infer A, infer B, infer C, "x"]
    ? [...Merge3<[A, B, C]>, "x"]
    : T extends [infer A extends PP, infer B extends PP, infer C, infer D]
    ? Eq<A, B> extends true
      ? [Inc[A], ...Merge2<[C, D]>, "x"]
      : Eq<B, C> extends true
      ? [A, Inc[B], D, "x"]
      : Eq<C, D> extends true
      ? [A, B, ...Merge2<[C, D]>]
      : [A, B, C, D]
    : never
  : never;

// Test Merge
type _A0 = AssertTrue<Eq<Merge<["x", "x", "2", "2"]>, ["4", "x", "x", "x"]>>;
type _A1 = AssertTrue<Eq<Merge<["2", "x", "x", "2"]>, ["4", "x", "x", "x"]>>;
type _A2 = AssertTrue<Eq<Merge<["2", "x", "x", "4"]>, ["2", "4", "x", "x"]>>;
type _A3 = AssertTrue<Eq<Merge<["2", "x", "4", "x"]>, ["2", "4", "x", "x"]>>;
type _A4 = AssertTrue<Eq<Merge<["2", "2", "2", "2"]>, ["4", "4", "x", "x"]>>;
type _A5 = AssertTrue<Eq<Merge<["x", "2", "2", "x"]>, ["4", "x", "x", "x"]>>;
type _A6 = AssertTrue<Eq<Merge<["16", "2", "4", "8"]>, ["16", "2", "4", "8"]>>;

type ToInternal<L1, L2, L3, L4> = L1 extends [PP, PP, PP, PP]
  ? L2 extends [PP, PP, PP, PP]
    ? L3 extends [PP, PP, PP, PP]
      ? L4 extends [PP, PP, PP, PP]
        ? {
            readonly A: L1[0] extends PP ? L1[0] : "x";
            readonly B: L1[1] extends PP ? L1[1] : "x";
            readonly C: L1[2] extends PP ? L1[2] : "x";
            readonly D: L1[3] extends PP ? L1[3] : "x";
            // -------------- ------------
            readonly E: L2[0] extends PP ? L2[0] : "x";
            readonly F: L2[1] extends PP ? L2[1] : "x";
            readonly G: L2[2] extends PP ? L2[2] : "x";
            readonly H: L2[3] extends PP ? L2[3] : "x";
            // -------------- ------------
            readonly I: L3[0] extends PP ? L3[0] : "x";
            readonly J: L3[1] extends PP ? L3[1] : "x";
            readonly K: L3[2] extends PP ? L3[2] : "x";
            readonly L: L3[3] extends PP ? L3[3] : "x";
            // -------------- ------------
            readonly M: L4[0] extends PP ? L4[0] : "x";
            readonly N: L4[1] extends PP ? L4[1] : "x";
            readonly O: L4[2] extends PP ? L4[2] : "x";
            readonly P: L4[3] extends PP ? L4[3] : "x";
          }
        : never
      : never
    : never
  : never;

type Transpose<T> = T extends TableInternal
  ? ToInternal<
      [T["A"], T["E"], T["I"], T["M"]],
      [T["B"], T["F"], T["J"], T["N"]],
      [T["C"], T["G"], T["K"], T["O"]],
      [T["D"], T["H"], T["L"], T["P"]]
    >
  : never;

type Left<T> = T extends TableInternal
  ? ToInternal<
      Merge<[T["A"], T["B"], T["C"], T["D"]]>,
      Merge<[T["E"], T["F"], T["G"], T["H"]]>,
      Merge<[T["I"], T["J"], T["K"], T["L"]]>,
      Merge<[T["M"], T["N"], T["O"], T["P"]]>
    >
  : never;

type Right<T> = T extends TableInternal
  ? ToInternal<
      RevertList<Merge<[T["D"], T["C"], T["B"], T["A"]]>>,
      RevertList<Merge<[T["H"], T["G"], T["F"], T["E"]]>>,
      RevertList<Merge<[T["L"], T["K"], T["J"], T["I"]]>>,
      RevertList<Merge<[T["P"], T["O"], T["N"], T["M"]]>>
    >
  : never;

type Up<T> = T extends TableInternal ? Transpose<Left<Transpose<T>>> : never;

type Down<T> = T extends TableInternal ? Transpose<Right<Transpose<T>>> : never;


type Table<
  Base,
  Seed extends number = 0,
  Count extends number = Seed
> = Base extends TableInternal
  ? {
      l1: `---------------------`;
      l2: `|${Wrap<Base["A"]>["value"]}|${Wrap<Base["B"]>["value"]}|${Wrap<
        Base["C"]
      >["value"]}|${Wrap<Base["D"]>["value"]}|`;
      l3: `---------------------`;
      l4: `|${Wrap<Base["E"]>["value"]}|${Wrap<Base["F"]>["value"]}|${Wrap<
        Base["G"]
      >["value"]}|${Wrap<Base["H"]>["value"]}|`;
      l5: `---------------------`;
      l6: `|${Wrap<Base["I"]>["value"]}|${Wrap<Base["J"]>["value"]}|${Wrap<
        Base["K"]
      >["value"]}|${Wrap<Base["L"]>["value"]}|`;
      l7: `---------------------`;
      l8: `|${Wrap<Base["M"]>["value"]}|${Wrap<Base["N"]>["value"]}|${Wrap<
        Base["O"]
      >["value"]}|${Wrap<Base["P"]>["value"]}|`;
      l9: `---------------------`;
      status: "playing";
      _v: Base;
      _count: Count;
      _seed: Seed;
      left: () => Table<
        RNG<Left<Base>, Random<0, 15, Count>>,
        Seed,
        Add<Count, 1>
      >;
      right: () => Table<
        RNG<Right<Base>, Random<0, 15, Count>>,
        Seed,
        Add<Count, 1>
      >;
      up: () => Table<Up<Base>, Seed, Add<Count, 1>>;
      down: () => Table<
        RNG<Down<Base>, Random<0, 15, Count>>,
        Seed,
        Add<Count, 1>
      >;
    }
  : never;

type Start = Table<BaseGame, 1>;

export declare function start(): Start;

// example
const a = start().right().down().up().right().right().right().up().right().up().left().up().right().right().up();
