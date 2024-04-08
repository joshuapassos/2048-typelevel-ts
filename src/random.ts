
import {
  Add,
  Subtract,
  Multiply,
  Divide,
  Mod,
  IsInt,
  Negate,
  IsNegative,
  Gt,
  Abs,
  GtOrEq,
} from "ts-arithmetic";

// from https://github.com/arielhs/ts-arithmetic/issues/3#issuecomment-1379826480
type TakeIntegerComponent<N extends number> =
  `${N}` extends `${infer I extends number}.${string}` ? I : N;
export type Floor<N extends number> = IsInt<N> extends 1
  ? N
  : Negate<Subtract<IsNegative<N>, TakeIntegerComponent<N>>>;

export type Round<N extends number> = IsInt<N> extends 1
  ? N
  : IsNegative<N> extends 1
  ? Negate<
      Subtract<Gt<Multiply<Mod<Abs<N>, 1>, 10>, 5>, TakeIntegerComponent<N>>
    >
  : Add<GtOrEq<Multiply<Mod<N, 1>, 10>, 5>, TakeIntegerComponent<N>>;

// https://en.wikipedia.org/wiki/Linear_congruential_generator
type LCG<
  S extends number,
  A extends number,
  C extends number,
  M extends number
> = {
  seed: S;
  multplier: A;
  increment: C;
  modulus: M;
};

type Next<A> = A extends LCG<infer S, infer A, infer C, infer M>
  ? LCG<Mod<Add<Multiply<A, S>, C>, M>, A, C, M>
  : never;

type Jump<
  J extends number,
  CC,
  Acc extends Array<any> = []
> = Acc["length"] extends J
  ? CC extends { seed: number }
    ? CC["seed"]
    : never
  : Jump<J, Next<CC>, [...Acc, CC]>;

export type Random<Min extends number, Max extends number, Seed extends number> = Jump<
  Seed,
  LCG<Seed, 50, 30, 21>
> extends infer S
  ? S extends number
    ? Add<Floor<Divide<S, Divide<21, Add<1, Subtract<Max, Min>>>>>, Min>
    : never
  : never;