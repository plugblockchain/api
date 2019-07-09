// @ts-check
// Import the API, Keyring and some utility functions
const { ApiPromise } = require('@plugnet/api');
const { Keyring } = require('@plugnet/keyring');
const { ExtrinsicEra } = require('@plugnet/types/type');

const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

async function main () {
  // Instantiate the API
  const api = await ApiPromise.create(); //remove provider

  // Constuct the keying after the API (crypto has an async init)
  const keyring = new Keyring({ type: 'sr25519' });

  // Add alice to our keyring with a hard-derived path (empty phrase, so uses dev)
  const alice = keyring.addFromUri('//Alice');

  // Get nonce for account
  const nonce = await api.query.system.accountNonce(alice.address);

  // get current block
  const signedBlock = await api.rpc.chain.getBlock();

  // get current block height and hash
  const currentHeight = signedBlock.block.header.number;
  const blockHash = signedBlock.block.header.hash;

  // construct a mortal era
  const era = new ExtrinsicEra({ current: currentHeight, period: 10 });

  // Create an extrinsic, transferring 12345 units to Bob
  const transfer = api.tx.balances.transfer(BOB, 12345);

  // Sign and send the transaction using our account with a nonce and the length of blocks the transaction is valid for
  const hash = await transfer.signAndSend(alice, { blockHash, era, nonce });

  console.log('Transfer sent with hash', hash.toHex());
}

main().catch(console.error).finally(() => process.exit());
