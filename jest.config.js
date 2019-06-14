const config = require('@plugnet/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@okyfbwr/api-contract(.*)$': '<rootDir>/packages/api-contract/src/$1',
    '@okyfbwr/api-derive(.*)$': '<rootDir>/packages/api-derive/src/$1',
    '@okyfbwr/api(.*)$': '<rootDir>/packages/api/src/$1',
    '@okyfbwr/rpc-(core|provider|rx)(.*)$': '<rootDir>/packages/rpc-$1/src/$2',
    '@okyfbwr/extrinsics(.*)$': '<rootDir>/packages/type-extrinsics/src/$1',
    '@okyfbwr/jsonrpc(.*)$': '<rootDir>/packages/type-jsonrpc/src/$1',
    '@okyfbwr/storage(.*)$': '<rootDir>/packages/type-storage/src/$1',
    '@okyfbwr/types(.*)$': '<rootDir>/packages/types/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/api/build',
    '<rootDir>/packages/api-derive/build',
    '<rootDir>/packages/api-contract/build',
    '<rootDir>/packages/rpc-core/build',
    '<rootDir>/packages/rpc-provider/build',
    '<rootDir>/packages/rpc-rx/build',
    '<rootDir>/packages/type-extrinsics/build',
    '<rootDir>/packages/type-jsonrpc/build',
    '<rootDir>/packages/type-storage/build/',
    '<rootDir>/packages/types/build'
  ]
});
