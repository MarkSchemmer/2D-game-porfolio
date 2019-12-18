const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
    preset: "jest-preset-angular",
    roots: [
        "<rootDir>/src/"
    ],
    testMatch: [ "**/+(*.)+(spec).+(ts)" ],
    collectCoverage: false,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
        prefix: "<rootDir>/"
    })
};