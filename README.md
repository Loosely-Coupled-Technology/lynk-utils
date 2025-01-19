# Lynk Utils

A comprehensive TypeScript utility library for data manipulation, array operations, and object handling.

## Installation

```bash
npm install lynk-utils
```

## Features

- Array manipulation and sorting
- Object deep copying and merging
- Data normalization and calculations
- Type-safe utility functions
- Full TypeScript support
- Browser and Node.js compatibility

## Usage

```typescript
import { 
  normalizeTo100,
  addItem,
  mergeObjectValues,
  uuidv4
} from 'lynk-utils';

// Array normalization
const data = [
  { value: 30, name: 'A' },
  { value: 70, name: 'B' }
];
normalizeTo100('value', data);

// Adding items to array
const items = [];
addItem(items, { id: 1, name: 'Test' });

// Merging objects
const source = { a: 1, b: 2 };
const dest = { b: 3, c: 4 };
mergeObjectValues(source, dest);

// Generate UUID
const id = uuidv4();
```

## API Documentation

### Array Operations

#### `addItem<T>(obj: T[], item: T, pos?: number, reset?: number): void`
Adds an item to an array at a specified position.

```typescript
const items = [];
addItem(items, { id: 1, name: 'Test' }, 0);
```

#### `addMultipleItems<T>(obj: T[], n: number): void`
Adds multiple copies of the first item in the array.

```typescript
const items = [{ id: 1, name: 'Template' }];
addMultipleItems(items, 3);
```

### Object Operations

#### `getNewObject<T>(obj: T): T`
Creates a deep copy of an object.

```typescript
const original = { a: 1, b: { c: 2 } };
const copy = getNewObject(original);
```

#### `mergeObjectValues<T>(src: T, dest: T, excList: string[] = []): void`
Merges two objects, excluding specified properties.

```typescript
const src = { a: 1, b: 2 };
const dest = { b: 3, c: 4 };
mergeObjectValues(src, dest, ['b']);
```

### Data Manipulation

#### `normalizeTo100(comp: string, masterList: any[], nameKey?: string, skip?: string, adjust: string = 'ALL'): void`
Normalizes values in an array to sum to 100.

```typescript
const data = [
  { value: 30, name: 'A' },
  { value: 70, name: 'B' }
];
normalizeTo100('value', data);
```

#### `lynkRound(inp: number, p: number): number`
Rounds a number to specified decimal places.

```typescript
const rounded = lynkRound(3.14159, 2); // 3.14
```

### Utility Functions

#### `uuidv4(isNode: boolean = false): string`
Generates a UUID v4 string.

```typescript
const id = uuidv4();
```

#### `strToHex(str: string): string`
Converts a string to its hexadecimal representation.

```typescript
const hex = strToHex('Hello'); // "48656c6c6f"
```

## Browser Support

Most functions work in both Node.js and browser environments. Some functions like `generateTable` require jQuery and are browser-specific.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## GitHub Repository

[https://github.com/Loosely-Coupled-Technology/lynk-utils](https://github.com/Loosely-Coupled-Technology/lynk-utils)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or support, please create an issue in the GitHub repository.
