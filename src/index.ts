type Key<T> = string & keyof T;

export interface Storage<T> extends globalThis.Storage {
	readonly length: number;

	getItem<K extends Key<T> = Key<T>>(key: K): T[K] | null;
	getItem(key: string): string | null;

	key<K extends Key<T> = Key<T>>(index: number): T[K] | null;
	key(index: number): string | null;

	removeItem<K extends Key<T> = Key<T>>(key: K): void;
	removeItem(key: string): void;

	setItem<K extends Key<T> = Key<T>>(key: K, value: T[K] | null): void;
	setItem(key: string, value: string): void;

	clear(): void;
}

export interface StorageItem<T, K extends Key<T>> {
	has(): boolean;
	get(): T[K] | null;
	set(value: T[K] | null): void;
	remove(): void;
	destroy(): void;
}

export const storageOf =
	<T>(storage: Storage<T>) =>
	<K extends Key<T> = Key<T>>(key: K): StorageItem<T, K> => ({
		has: (): boolean => !!storage.getItem(key),
		get: (): T[K] | null => {
			const result = storage.getItem(key);

			if (result === undefined) {
				return null;
			}

			if (storage === globalThis.localStorage) {
				return JSON.parse(result as unknown as string) as T[K];
			}

			if (storage === globalThis.sessionStorage) {
				return JSON.parse(result as unknown as string) as T[K];
			}

			return result;
		},
		set: (value: T[K] | null): void => {
			if (value === null) {
				return storage.removeItem(key);
			}

			let item = value ?? '';

			if (storage === globalThis.localStorage) {
				item = JSON.stringify(value);
			}

			if (storage === globalThis.sessionStorage) {
				item = JSON.stringify(value);
			}

			storage.setItem(key, item as unknown as T[K]);
		},
		remove: (): void => storage.removeItem(key),
		destroy: (): void => storage.clear(),
	});

export interface SuperStorage<T, U extends Key<T> = Key<T>> extends Storage<T> {
	hasItem<K extends Key<T> = Key<T>>(key: K): boolean;
	storage: Map<U, T[U]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const pipeVoid = (...args: unknown[]): void => {};

export const customStorageMaker = <T>(): SuperStorage<T> => {
	const storage = new Map();

	return {
		get length(): number {
			return storage.size;
		},
		clear: (): void => storage.clear(),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		getItem: <K extends Key<T> = Key<T>>(key: K) => storage.get(key) ?? null,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		key: (index: number) => Array.from(storage.values())[index] ?? null,
		removeItem: <K extends Key<T> = Key<T>>(key: K): void => pipeVoid(storage.delete(key)),
		setItem: <K extends Key<T> = Key<T>>(key: K, value: T[K] | string | null): void =>
			pipeVoid(storage.set(key, value)),
		hasItem: (key): boolean => storage.has(key),
		storage,
	};
};
