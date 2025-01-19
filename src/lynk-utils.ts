import { LynkLogger, PrimitiveType } from './types';

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

export const lynkLog = function(ctx: any): LynkLogger {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(console);
    if (ctx !== undefined) {
        return Function.prototype.bind.apply(console.log, args as [any, ...any[]]);
    }
    return () => {};
};

export function getPosFromObjectArray(
    obj: Array<Record<string, any>>,
    findField: string,
    findValue: string,
    removeChar?: string
): number {
    for (let i = 0; i < obj.length; i++) {
        const objValue = removeChar 
            ? obj[i][findField].replaceAll(removeChar, '')
            : obj[i][findField];
        const searchValue = removeChar
            ? findValue.replaceAll(removeChar, '')
            : findValue;

        if (objValue === searchValue) {
            return i;
        }
    }
    return -1;
}

export function stringToTArray(
    stringData: string,
    rSep: string = '\n',
    cSep: string = '\t'
): string[][] {
    const objects: string[][] = [];
    const rows = stringData.split(rSep);

    if (rows.length === 0) return objects;

    // Make columns
    const columns = rows[0].split(cSep);

    for (let rowNr = 0; rowNr < rows.length - 1; rowNr++) {
        const data = rows[rowNr].split(cSep);
        objects.push([...data]);
    }

    return objects;
}

// Note: This function requires DOM manipulation, so we'll add JSDoc to indicate browser-only usage
/**
 * Generates an HTML table from tab-separated data
 * @param data Tab-separated string data
 * @returns JQuery<HTMLElement> Table element
 * @browser This function is only available in browser environments with jQuery
 */
export function generateTable(data: string): any {
    lynkLog("info")(data);
    lynkLog("info")(stringToTArray(data));
    
    const rows = data.split("\n");
    const table = $('<table />');

    for (const row of rows) {
        const cells = row.split("\t");
        const tableRow = $('<tr />');
        
        for (const cell of cells) {
            tableRow.append('<td>' + cell + '</td>');
        }
        table.append(tableRow);
    }

    $('#excel_table').html(table.prop('outerHTML'));
    return table;
}

export function getNewObject<T extends Record<string, any>>(obj: T): T {
    return JSON.parse(
        JSON.stringify(obj).replace(/hashKey/g, '_hashKey')
    ) as T;
}

export function isObject(obj: unknown): obj is Record<string, any> {
    return typeof obj === "object" && obj !== null;
}

export function resetObjectValues(dest: Record<string, any>): void {
    for (const k in dest) {
        if (isObject(dest[k])) {
            resetObjectValues(dest[k]);
        } else {
            if (k !== "hashKey") {
                switch (typeof dest[k]) {
                    case 'number':
                        dest[k] = 0;
                        break;
                    case 'boolean':
                        dest[k] = false;
                        break;
                    default:
                        dest[k] = '';
                }
            }
        }
    }
}

export function addItem<T extends Record<string, any>>(
    obj: T[],
    item: T,
    pos?: number,
    reset?: number
): void {
    lynkLog("info")(obj);
    lynkLog("info")(item);
    const newObj = getNewObject(item);
    
    if (reset !== 0) {
        resetObjectValues(newObj);
    }
    
    if (pos === undefined) {
        obj.push(getNewObject(newObj));
    } else {
        obj.splice(pos, 0, getNewObject(newObj));
    }
}

export function addMultipleItems<T extends Record<string, any>>(obj: T[], n: number): void {
    if (obj.length === 0) return;
    const template = obj[0];
    
    for (let i = 0; i < n; i++) {
        obj.push(getNewObject(template));
    }
}

export function removeItem<T>(obj: T[], index: number): void {
    obj.splice(index, 1);
}

export function orderArrayItems<T extends Record<string, any>>(
    src: T[],
    dest: T[],
    key: keyof T
): void {
    for (let i = 0; i < src.length; i++) {
        let j: number;
        for (j = i; j < dest.length; j++) {
            if (src[i][key] === dest[j][key]) {
                break;
            }
        }
        if (j === dest.length) {
            dest.splice(i, 0, getNewObject(src[i]));
        } else if (j > i) {
            const tmp = dest[j];
            dest.splice(j, 1);
            dest.splice(i, 0, tmp);
        }
    }
}

export function removeArrayItems<T extends Record<string, any>>(
    src: T[],
    dest: T[],
    key: keyof T
): void {
    for (let i = 0; i < dest.length; i++) {
        let j: number;
        for (j = 0; j < src.length; j++) {
            if (src[j][key] === dest[i][key]) {
                break;
            }
        }
        if (j === src.length) {
            dest.splice(i, 1);
            i--;
        }
    }
}

export function copyObjectValues<T extends Record<string, any>>(
    src: T,
    dest: T
): void {
    for (const k in dest) {
        if (src[k] !== undefined) {
            if (isObject(dest[k])) {
                copyObjectValues(src[k], dest[k]);
            } else {
                if (k !== "hashKey") {
                    dest[k] = src[k];
                }
            }
        }
    }
}

export function copyByFilter<T extends Record<string, any>>(
    src: T,
    dest: Partial<T>,
    excList: string[] = []
): void {
    for (const k in src) {
        if (isObject(src[k]) && !excList.includes(k)) {
            if (Array.isArray(src[k])) {
                dest[k] = [] as any;
            } else {
                dest[k] = {} as any;
            }
            copyByFilter(src[k], dest[k] as any, excList);
        } else {
            if (k !== "hashKey" && !excList.includes(k)) {
                dest[k] = src[k];
            }
        }
    }
}

export function mergeObjectValues<T extends Record<string, any>>(
    src: T,
    dest: T,
    excList: string[] = []
): void {
    for (const k in src) {
        if (dest[k] !== undefined) {
            if (isObject(src[k]) && !excList.includes(k)) {
                mergeObjectValues(src[k], dest[k], excList);
            } else {
                if (k !== "hashKey" && !excList.includes(k)) {
                    dest[k] = isNaN(src[k]) ? unescapeHTML(src[k]) as T[Extract<keyof T, string>] : src[k];
                }
            }
        } else {
            if (isObject(src[k]) && !excList.includes(k)) {
                dest[k] = getNewObject(src[k]);
            } else {
                if (k !== "hashKey" && !excList.includes(k)) {
                    dest[k] = isNaN(src[k]) ? unescapeHTML(src[k]) as T[Extract<keyof T, string>] : src[k];
                }
            }
        }
    }
}

export function changePos<T extends Record<string, any>>(oldPos: number, newPos: number, obj: T[]): void {
    if (!Array.isArray(obj)) return;
    if (
        newPos === oldPos ||
        newPos < 0 ||
        oldPos < 0 ||
        newPos >= obj.length ||
        oldPos >= obj.length
    ) {
        return;
    }
    
    const elem = getNewObject(obj[oldPos]);
    obj.splice(oldPos, 1);
    obj.splice(newPos, 0, elem);
}

export function lynkSum<T extends Record<string, number>>(
    obj: T[],
    fld: keyof T,
    n: number = 0,
    n1: number = -1
): number {
    let sum = 0;
    const lim = (n1 >= 0 && n1 < obj.length) ? n1 : obj.length;
    
    for (let i = n; i < lim; i++) {
        sum += obj[i][fld];
    }
    
    return sum;
}

export function sumComponents<T extends Record<string, number>>(
    data: T[],
    comp: keyof T
): number {
    const sum = data.reduce((acc, item) => acc + (item[comp] || 0), 0);
    return !isNaN(sum) && sum !== null ? sum : 0;
}

export function normalize<T extends Record<string, number>>(
    comp: keyof T,
    data: T[]
): void {
    const sum = sumComponents(data, comp);
    
    if (sum !== 0) {
        for (const item of data) {
            item[comp] = ((item[comp] / sum) * 100.000) as T[keyof T];
        }
    }
}

export function getKeyName(obj: Record<string, any>, n: number): string {
    let i = 0;
    for (const k in obj) {
        if (i === n) {
            return k;
        }
        i++;
    }
    return "";
}