declare global {
  export type ValueOf<O extends Record<string, any>> = O[keyof O];
  export type UnknownRecord = Record<any, unknown>;
}

export {};
