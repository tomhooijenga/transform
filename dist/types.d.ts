import Pipe from "./index";
export interface Entries {
    entries(): IterableIterator<[any, Hook]>;
}
export declare type Hook = (...args: any) => any;
export declare type ForEachCallback = (key: any, hook: Hook, pipe: Pipe) => void;
