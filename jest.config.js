module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns:[
        'src/example.ts'
    ]
  };
