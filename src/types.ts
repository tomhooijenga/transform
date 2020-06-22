import Pipe from "./index";

export interface Entries {
    entries(): IterableIterator<[any, Hook]>;
}

export type Hook = (...args: any) => any

export type ForEachCallback = (key: any, hook: Hook, pipe: Pipe) => void;