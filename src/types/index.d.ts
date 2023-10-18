declare type Recordable<T = any> = Record<string, any>


declare type EmitType = (event: string, ...args: any[]) => void;
