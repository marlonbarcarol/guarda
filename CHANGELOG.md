# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.2.0 (2026-09-14)

- Verified every devDependency against its latest published version; all were
  already current except `@types/node`, which was previously only pulled in
  transitively (matching `tsconfig.json`'s `"types": ["node", "jest"]`) and is
  now an explicit devDependency at `^26.5.1`.
- Regenerated `package-lock.json`.
- Deliberately kept `typescript` pinned at `^6.0.3` (the newest 6.x release):
  TypeScript 7.0.2 is out, but `@typescript-eslint` 8.70.0 only supports
  `typescript >=4.8.4 <6.1.0` and `ts-jest` 29.4.12 only supports
  `typescript >=4.3 <7`, so upgrading would break type-aware linting and
  ts-jest. No newer major of either package exists yet to support TS 7.

## 0.1.0 (2026-09-09)

- Updated every devDependency to its current latest: ESLint 10 (migrated to
  flat config), `@typescript-eslint` 8, TypeScript 6, Jest 30, ts-jest 29,
  Prettier 3, commitlint 21 and husky 9.
- Internal typing fixes surfaced by the stricter compiler: concrete key/value
  types for the in-memory `Map` in `customStorageMaker`, an explicit `rootDir`
  for the build, and `bundler` module resolution. No public API change.

### Initial release 0.0.1 (2022-01-30)
- Added storage creation from `localStorage/sessionStorage` with `storageOf`.
- Added storage custom in memory storage `customStorageMaker`.
