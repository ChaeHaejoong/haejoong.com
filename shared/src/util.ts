export type Expand<T> = T extends Date
  ? T
  : T extends (infer U)[]
    ? Expand<U>[]
    : T extends object
      ? { [K in keyof T]: Expand<T[K]> }
      : T;
