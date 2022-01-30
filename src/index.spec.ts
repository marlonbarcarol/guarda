import { storageOf, customStorageMaker, SuperStorage } from './index';

export interface Product {
	id: number;
	title: string;
	created: string;
	updated: string;
}

export interface Category {
	id: number;
	name: string;
}

const StorageResource = {
	PRODUCT: 'product',
	CATEGORY: 'category',
	ARTICLE: 'article',
} as const;

// enum StorageResource {
// 	PRODUCT = "product",
// 	CATEGORY = "application:category",
// }

// const t: Lowercase<StorageResource.PRODUCT> = StorageResource.PRODUCT;

// interface AppStorage {
// 	// product: Product;
// 	category: Category;
// 	article: string;
// 	[t]: Product;
// }

interface AppStorage {
	[StorageResource.PRODUCT]: Product;
	[StorageResource.CATEGORY]: Category;
	article: string;
}

describe('index.ts', () => {
	describe('customStorageMaker', () => {
		test('can be made', () => {
			const appStorage: SuperStorage<AppStorage> = customStorageMaker<AppStorage>();

			expect(appStorage).toHaveProperty('length', 0);
			expect(appStorage).toHaveProperty('storage');
		});

		test('can set value', () => {
			const appStorage: SuperStorage<AppStorage> = customStorageMaker<AppStorage>();

			expect(appStorage).toHaveLength(0);
			expect(appStorage.hasItem('category')).toBeFalsy();
			appStorage.setItem('category', { id: 1, name: 'testing' });

			expect(appStorage).toHaveLength(1);
			expect(appStorage.getItem('category')).toEqual({ id: 1, name: 'testing' });
			expect(appStorage.hasItem('category')).toBeTruthy();
		});

		test('can set many values', () => {
			const appStorage = customStorageMaker<AppStorage>();

			const product: Product = {
				id: 1,
				title: 'Product title',
				created: '01/01/2022',
				updated: '01/01/2022',
			};
			expect(appStorage).toHaveLength(0);
			expect(appStorage.getItem(StorageResource.PRODUCT)).toBeNull();
			expect(appStorage.hasItem(StorageResource.PRODUCT)).toBeFalsy();
			appStorage.setItem(StorageResource.PRODUCT, product);
			expect(appStorage.getItem(StorageResource.PRODUCT)).toEqual(product);
			expect(appStorage.hasItem(StorageResource.PRODUCT)).toBeTruthy();
			expect(appStorage).toHaveLength(1);

			const category = { id: 1, name: 'testing' };
			expect(appStorage).toHaveLength(1);
			expect(appStorage.getItem('category')).toBeNull();
			expect(appStorage.hasItem('category')).toBeFalsy();
			appStorage.setItem('category', category);
			expect(appStorage.getItem('category')).toEqual(category);
			expect(appStorage.hasItem('category')).toBeTruthy();
			expect(appStorage).toHaveLength(2);

			const article = 'Lorem ipsum';
			expect(appStorage).toHaveLength(2);
			expect(appStorage.getItem('article')).toBeNull();
			expect(appStorage.hasItem('article')).toBeFalsy();
			appStorage.setItem('article', article);
			expect(appStorage.getItem('article')).toEqual(article);
			expect(appStorage.hasItem('article')).toBeTruthy();
			expect(appStorage).toHaveLength(3);
		});

		test('can get by key index', () => {
			const appStorage = customStorageMaker<AppStorage>();

			expect(appStorage.key(0)).toBeNull();

			const product = {
				id: 1,
				title: 'Product title',
				created: '01/01/2022',
				updated: '01/01/2022',
			};
			appStorage.setItem('product', product);

			const category = { id: 1, name: 'testing' };
			appStorage.setItem('category', category);

			const article = 'Lorem ipsum';
			appStorage.setItem('article', article);

			expect(appStorage).toHaveLength(3);

			expect(appStorage.key(0)).toEqual(product);
			expect(appStorage.key(1)).toEqual(category);
			expect(appStorage.key(2)).toEqual(article);
			expect(appStorage.key(3)).toBeNull();
		});

		test('can remove many values', () => {
			const appStorage = customStorageMaker<AppStorage>();

			appStorage.setItem('product', {
				id: 1,
				title: 'Product title',
				created: '01/01/2022',
				updated: '01/01/2022',
			});
			appStorage.setItem('category', { id: 1, name: 'testing' });
			appStorage.setItem('article', 'Lorem ipsum');
			expect(appStorage).toHaveLength(3);

			appStorage.removeItem('product');
			expect(appStorage).toHaveLength(2);
			expect(appStorage.hasItem('product')).toBeFalsy();

			appStorage.removeItem('category');
			expect(appStorage).toHaveLength(1);
			expect(appStorage.hasItem('category')).toBeFalsy();

			appStorage.removeItem('article');
			expect(appStorage).toHaveLength(0);
			expect(appStorage.hasItem('article')).toBeFalsy();
		});

		test('can clear many values', () => {
			const appStorage = customStorageMaker<AppStorage>();

			appStorage.setItem('product', {
				id: 1,
				title: 'Product title',
				created: '01/01/2022',
				updated: '01/01/2022',
			});
			appStorage.setItem('category', { id: 1, name: 'testing' });
			appStorage.setItem('article', 'Lorem ipsum');
			expect(appStorage).toHaveLength(3);

			appStorage.clear();
			expect(appStorage).toHaveLength(0);
			expect(appStorage.hasItem('product')).toBeFalsy();
			expect(appStorage.hasItem('category')).toBeFalsy();
			expect(appStorage.hasItem('article')).toBeFalsy();
		});
	});

	describe('storageOf', () => {
		interface LocalStorage {
			username: string;
			user: {
				name: string;
				token: string;
			};
		}

		afterEach(() => {
			globalThis.localStorage.clear();
		});

		test('can use global localStorage', () => {
			const localStorage = storageOf<LocalStorage>(globalThis.localStorage);
			const userStorage = localStorage('username');
			expect(userStorage.get()).toBeNull();
			expect(userStorage.has()).toBeFalsy();
		});

		test('can set storage and parse objects', () => {
			const localStorage = storageOf<LocalStorage>(globalThis.localStorage);
			const usernameStorage = localStorage('username');
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();

			usernameStorage.set('the-username-here');
			expect(usernameStorage.has()).toBeTruthy();
			expect(usernameStorage.get()).toEqual('the-username-here');
			expect(globalThis.localStorage).toHaveLength(1);

			const userStorage = localStorage('user');
			userStorage.set({ name: 'test', token: 'some-token-here' });
			expect(userStorage.has()).toBeTruthy();
			expect(userStorage.get()).toEqual({ name: 'test', token: 'some-token-here' });
			expect(globalThis.localStorage).toHaveLength(2);
		});

		test('setting null removes item', () => {
			const localStorage = storageOf<LocalStorage>(globalThis.localStorage);
			const usernameStorage = localStorage('username');
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();
			expect(globalThis.localStorage).toHaveLength(0);

			usernameStorage.set('the-username-here');
			expect(usernameStorage.has()).toBeTruthy();
			expect(usernameStorage.get()).toEqual('the-username-here');
			expect(globalThis.localStorage).toHaveLength(1);

			usernameStorage.set(null);
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();
			expect(globalThis.localStorage).toHaveLength(0);
		});

		test('can remove from storage', () => {
			const localStorage = storageOf<LocalStorage>(globalThis.localStorage);

			const usernameStorage = localStorage('username');
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();

			usernameStorage.set('the-username-here');

			expect(usernameStorage.has()).toBeTruthy();
			expect(usernameStorage.get()).toEqual('the-username-here');
			expect(globalThis.localStorage).toHaveLength(1);

			usernameStorage.remove();
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();
			expect(globalThis.localStorage).toHaveLength(0);
		});

		test('can detroy all storages from another storage', () => {
			const localStorage = storageOf<LocalStorage>(globalThis.localStorage);

			const usernameStorage = localStorage('username');
			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();

			usernameStorage.set('the-username-here');
			expect(globalThis.localStorage).toHaveLength(1);

			const userStorage = localStorage('user');
			userStorage.set({ name: 'test', token: 'some-token-here' });
			expect(globalThis.localStorage).toHaveLength(2);

			usernameStorage.destroy();

			expect(globalThis.localStorage).toHaveLength(0);

			expect(usernameStorage.has()).toBeFalsy();
			expect(usernameStorage.get()).toBeNull();

			expect(userStorage.has()).toBeFalsy();
			expect(userStorage.get()).toBeNull();
		});
	});
});

describe('documentation', () => {
	test('example with localStorage', () => {
		interface LocalStorage {
			resource: string;
			owner: {
				name: string;
				token: string;
			};
		}

		// Setting the storage
		const localStorage = storageOf<LocalStorage>(globalThis.localStorage);

		// creating a owner storage
		const ownerStorage = localStorage('owner');

		ownerStorage.set({
			// automatically JSON parses storage
			name: 'The user',
			token: 'The-user-token',
		});

		expect(ownerStorage.get()).toEqual({ name: 'The user', token: 'The-user-token' });

		const resourceStorage = localStorage('resource');

		expect(resourceStorage.has()).toBeFalsy();

		resourceStorage.set('resource-name');

		expect(resourceStorage.has()).toBeTruthy();
		expect(globalThis.localStorage).toHaveLength(2);

		// removing resource storage
		resourceStorage.remove();

		expect(globalThis.localStorage).toHaveLength(1);

		// removing owner storage
		ownerStorage.remove();

		expect(globalThis.localStorage).toHaveLength(0);
	});

	test('example with customStorageMaker', () => {
		interface CustomStorage {
			resource: string;
			owner: {
				name: string;
				token: string;
			};
		}

		// Defining a custom in memory storage
		const customStorage: SuperStorage<CustomStorage> = customStorageMaker<CustomStorage>();

		// Setting the storage
		const appStorage = storageOf<CustomStorage>(customStorage);

		// creating a owner storage
		const ownerStorage = appStorage('owner');

		ownerStorage.set({
			name: 'The user',
			token: 'The-user-token',
		});

		expect(ownerStorage.get()).toEqual({ name: 'The user', token: 'The-user-token' });

		const resourceStorage = appStorage('resource');

		expect(resourceStorage.has()).toBeFalsy();

		resourceStorage.set('resource-name');

		expect(resourceStorage.has()).toBeTruthy();

		expect(customStorage).toHaveLength(2);
		expect(globalThis.localStorage).toHaveLength(0);

		// removing resource storage
		resourceStorage.remove();

		expect(customStorage).toHaveLength(1);

		// removing owner storage
		ownerStorage.remove();

		expect(customStorage).toHaveLength(0);
	});
});
