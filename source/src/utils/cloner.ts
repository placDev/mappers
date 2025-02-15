export class Cloner {
    private static cache = new WeakMap();
    static deep<T>(value: T) {
        if (value === null || typeof value !== 'object') {
            return value;
        }

        // Если значение уже клонировано, возвращаем копию для избежания рекурсии.
        if (this.cache.has(value)) {
            return this.cache.get(value);
        }

        // Обработка Date
        if (value instanceof Date) {
            const result = new Date(value.getTime());
            this.cache.set(value, result);
            return result as any;
        }

        // Обработка RegExp
        if (value instanceof RegExp) {
            const result = new RegExp(value.source, value.flags);
            this.cache.set(value, result);
            return result as any;
        }

        // Обработка массивов с предварительным выделением памяти.
        if (Array.isArray(value)) {
            const arr = new Array(value.length);
            this.cache.set(value, arr);
            for (let i = 0; i < value.length; ++i) {
                arr[i] = this.deep(value[i]);
            }
            return arr as any;
        }

        // Обработка Map
        if (value instanceof Map) {
            const clonedMap = new Map();
            this.cache.set(value, clonedMap);
            value.forEach((v, k) => {
                clonedMap.set(this.deep(k), this.deep(v));
            });
            return clonedMap as any;
        }

        // Обработка Set
        if (value instanceof Set) {
            const clonedSet = new Set();
            this.cache.set(value, clonedSet);
            value.forEach((v) => {
                clonedSet.add(this.deep(v));
            });
            return clonedSet as any;
        }

        // Создаём новый объект, сохраняя его прототип.
        const prototype = Object.getPrototypeOf(value);
        const clonedObj = Object.create(prototype);
        this.cache.set(value, clonedObj);

        // Копирование собственных строковых ключей вместе с их дескрипторами.
        for (const key of Object.getOwnPropertyNames(value)) {
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            if (descriptor) {
                if ("value" in descriptor) {
                    descriptor.value = this.deep((value as any)[key]);
                }
                Object.defineProperty(clonedObj, key, descriptor);
            }
        }

        // Копирование символов как ключей.
        for (const symbol of Object.getOwnPropertySymbols(value)) {
            const descriptor = Object.getOwnPropertyDescriptor(value, symbol);
            if (descriptor) {
                if ("value" in descriptor) {
                    descriptor.value = this.deep((value as any)[symbol]);
                }
                Object.defineProperty(clonedObj, symbol, descriptor);
            }
        }

        return clonedObj;
    }
}