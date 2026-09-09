# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
