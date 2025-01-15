import { PrimitiveType } from './types';

export function unescapeHTML(escapedHTML: string): string {
    try {
        return escapedHTML
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    } catch (e) {
        return escapedHTML;
    }
}

export function normalizeTo100(
    comp: string,
    masterList: Array<Record<string, any>>,
    nameKey?: string,
    skip?: string,
    adjust: string = 'ALL'
): void {
    let sum = 0;
    let sumSkipped = 0;
    let skipVal = 0;

    for (const item of masterList) {
        sum += item[comp];
        if (nameKey !== undefined) {
            if (item[nameKey] !== skip) {
                sumSkipped += item[comp];
            } else {
                skipVal = item[comp];
            }
        }
    }

    if (nameKey === undefined) {
        sumSkipped = sum;
    }

    if (sum === 0) return;

    const diff = nameKey === undefined
        ? lynkRound(100 - sum, 3)
        : lynkRound(100 - sumSkipped - skipVal, 3);

    if (adjust !== 'ALL') {
        for (const item of masterList) {
            if (nameKey !== undefined && item[nameKey] === adjust) {
                item[comp] += diff;
                item[comp] = lynkRound(item[comp], 3);
            }
        }
    } else {
        for (const item of masterList) {
            if (nameKey === undefined) {
                item[comp] += diff * ((isNaN(item[comp]) ? 0 : item[comp]) / sum);
                item[comp] = lynkRound(item[comp], 3);
            } else {
                if (item[nameKey] !== skip) {
                    item[comp] += diff * ((isNaN(item[comp]) ? 0 : item[comp]) / sumSkipped);
                    item[comp] = lynkRound(item[comp], 3);
                }
            }
        }
    }
}

export function resetToValue<T>(comp: string, masterList: Array<Record<string, T>>, val: T): void {
    for (const item of masterList) {
        item[comp] = val;
    }
}

export function lynkRound(inp: number, p: number): number {
    return Math.round(inp * Math.pow(10, p)) / Math.pow(10, p);
}

export function getValueFromObjectArray<T>(
    obj: Array<Record<string, any>>,
    findField: string,
    findValue: string,
    returnField?: string,
    removeChar?: string
): T | number {
    for (let i = 0; i < obj.length; i++) {
        const objValue = removeChar 
            ? obj[i][findField].replaceAll(removeChar, '')
            : obj[i][findField];
        const searchValue = removeChar
            ? findValue.replaceAll(removeChar, '')
            : findValue;

        if (objValue === searchValue) {
            if (returnField !== undefined) {
                return obj[i][returnField];
            }
            return i;
        }
    }
    return -1;
}

export function getAvg(inp: number[]): number {
    const validNumbers = inp.filter(num => num > 0);
    return validNumbers.length > 0
        ? validNumbers.reduce((a, b) => a + b) / validNumbers.length
        : 0;
}

export function getStdDev(inp: number[]): number {
    const validNumbers = inp.filter(num => num > 0);
    const n = validNumbers.length;
    
    if (n === 0) return 0;
    
    const mean = validNumbers.reduce((a, b) => a + b) / n;
    return Math.sqrt(
        validNumbers.map(x => Math.pow(x - mean, 2))
            .reduce((a, b) => a + b) / n
    );
}

export function assignValueByType(d: PrimitiveType, s: any): PrimitiveType {
    try {
        switch (typeof d) {
            case "number":
                return Number(s);
            case "boolean":
                const string = String(s).toLowerCase().trim();
                switch (string) {
                    case "true": case "yes": case "1": return true;
                    case "false": case "no": case "0": case null: return false;
                    default: return Boolean(string);
                }
            default:
                return String(s);
        }
    } catch (e) {
        return s;
    }
}

export function transpose<T>(matrix: T[][]): T[][] {
    if (matrix.length === 0) return [];
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const grid: T[][] = Array(cols).fill(null).map(() => Array(rows));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[j][i] = matrix[i][j];
        }
    }
    
    return grid;
}

export function uuidv4(isNode = false): string {
    if (isNode) {
        const cryptoNode = require('crypto').webcrypto;
        return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
            (c ^ cryptoNode.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function makeArray<T>(ds: Array<Record<string, T>>, fieldName: string): T[] {
    const tmp: T[] = [];
    for (const item of ds) {
        tmp.push(item[fieldName]);
    }
    return JSON.parse(JSON.stringify(tmp));
}

export function strToHex(str: string): string {
    const arr1: string[] = [];
    for (let n = 0; n < str.length; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}