const config = require('@plugnet/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@plugnet/api-contract(.*)$': '<rootDir>/packages/api-contract/src/$1',
    '@plugnet/api-derive(.*)$': '<rootDir>/packages/api-derive/src/$1',
    '@plugnet/api-metadata(.*)$': '<rootDir>/packages/api-metadata/src/$1',
    '@plugnet/api(.*)$': '<rootDir>/packages/api/src/$1',
    '@plugnet/rpc-(core|provider)(.*)$': '<rootDir>/packages/rpc-$1/src/$2',
    '@plugnet/jsonrpc(.*)$': '<rootDir>/packages/type-jsonrpc/src/$1',
    '@plugnet/types(.*)$': '<rootDir>/packages/types/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/api/build',
    '<rootDir>/packages/api-derive/build',
    '<rootDir>/packages/api-contract/build',
    '<rootDir>/packages/api-metadata/build',
    '<rootDir>/packages/rpc-core/build',
    '<rootDir>/packages/rpc-provider/build',
    '<rootDir>/packages/type-jsonrpc/build',
    '<rootDir>/packages/types/build'
  ]
});
