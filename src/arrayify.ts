export function arrayify<T>(o: T | T[]): T[] {
  return Array.isArray(o) ? o : [o];
}
