import { Object as TsObject } from 'ts-toolbelt';

export function arrayify<T>(o: T | T[]): T[] {
  return Array.isArray(o) ? o : [o];
}

type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

export type DeepPartial<T extends Object> = ExpandRecursively<TsObject.Partial<T, 'deep'>>;

export function undefIfEmpty<T extends string>(str: T): Exclude<T, ''> | undefined {
  return str === '' ? undefined : (str as Exclude<T, ''>);
}
