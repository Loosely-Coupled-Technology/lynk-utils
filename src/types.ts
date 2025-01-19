export interface ObjectWithHashKey {
    hashKey?: string;
    [key: string]: any;
}

export type PrimitiveType = string | number | boolean;

export interface LynkLogger {
    (message?: any, ...optionalParams: any[]): void;
}