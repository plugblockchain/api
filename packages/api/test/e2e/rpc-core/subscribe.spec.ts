// Copyright 2017-2019 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import testingPairs from '@plugnet/keyring/testingPairs';
import WsProvider from '@plugnet/rpc-provider/ws';
import storage from '@plugnet/api-metadata/storage/static';
import Rpc from '@plugnet/rpc-core';
import { StorageChangeSet } from '@plugnet/types/interfaces';
import { ClassOf } from '@plugnet/types';

import { describeE2E } from '../../util';

describeE2E({
  except: [
    'remote-polkadot-alexander',
    'remote-substrate-1.0'
  ]
})('RPC-core e2e subscriptions', (wsUrl: string): void => {
  let rpc: Rpc;
  const keyring = testingPairs({ type: 'ed25519' });

  beforeEach((): void => {
    jest.setTimeout(30000);
    rpc = new Rpc(new WsProvider(wsUrl));
  });

  it('subscribes to storage', (done): void => {
    rpc.state
      .subscribeStorage([
        [storage.system.accountNonce, keyring.eve.address],
        [storage.session.currentIndex]
      ])
      .subscribe((data: StorageChangeSet): void => {
        expect(data).toHaveLength(2);
        expect(data).toEqual(
          expect.arrayContaining([
            expect.any(ClassOf('Index')),
            expect.any(ClassOf('Index'))
          ])
        );

        done();
      });
  });

  it('retrieves current timestamp', (done): void => {
    let count = 0;

    rpc.state
      .subscribeStorage([[storage.timestamp.now]])
      .subscribe((data: StorageChangeSet): void => {
        expect(data).toBeDefined();

        if (++count === 3) {
          done();
        }
      });
  });
});
