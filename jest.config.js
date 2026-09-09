/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	cacheDirectory: '<rootDir>/.cache/jest',
	modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
};
