# Guarda

Guarda is a typed storage solution that can be used with `localStorage`, `sessionsStorage` or with a custom storage compliant with `globalThis.Storage` — but we provide `customStorageMaker` for facilitating this task.

## Usage:

**Example using `globalThis.localStorage` (may as well use `globalThis.sessionStorage`).**

```ts
import { storageOf } from '@aweti/guarda';

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

console.log(ownerStorage.get()); // automatically JSON parses storage
// { name: 'The user', token: 'The-user-token' }

const resourceStorage = localStorage('resource');

console.log(resourceStorage.has());
// false

resourceStorage.set('resource-name');

console.log(resourceStorage.has());
// true

console.log(globalThis.localStorage.length);
// 2

// removing resource storage
resourceStorage.remove();

console.log(globalThis.localStorage.length);
// 1

// removing owner storage
ownerStorage.remove();

console.log(globalThis.localStorage.length);
// 0
```

**Example using a custom in memory storage `customStorageMaker`, this storage is compliant with the `globalThis.Storage` interface.**

```ts
import { storageOf, customStorageMaker, SuperStorage } from '@aweti/guarda';

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

console.log(ownerStorage.get());
// { name: 'The user', token: 'The-user-token' }

const resourceStorage = appStorage('resource');

console.log(resourceStorage.has());
// false

resourceStorage.set('resource-name');

console.log(resourceStorage.has());
// true

console.log(customStorage.length);
// 2
console.log(globalThis.localStorage.length);
// 0

// removing resource storage
resourceStorage.remove();

console.log(customStorage.length);
// 1

// removing owner storage
ownerStorage.remove();

console.log(customStorage.length);
// 0
```

### Debug

**VSCode example**
`F1` > `Debug: Toggle Auto Attach` > `Always` > inside vscode own terminal > `node --inspect ./node_modules/.bin/jest src/index.spec.ts`
