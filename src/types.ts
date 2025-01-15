export interface ObjectWithHashKey {
    hashKey?: string;
    [key: string]: any;
}

export type PrimitiveType = string | number | boolean;