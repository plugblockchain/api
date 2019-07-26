// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Vote } from '@plugnet/types/interfaces';

import BN from 'bn.js';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiInterfaceRx } from '@plugnet/api/types';
import { Vec, createType } from '@plugnet/types';

import { DerivedBalances, DerivedReferendumVote } from '../types';
import { drr } from '../util/drr';
import { votes } from './votes';
import { votingBalances } from '../balances/votingBalances';

export function referendumVotesFor (api: ApiInterfaceRx): (referendumId: BN | number) => Observable<DerivedReferendumVote[]> {
  return (referendumId: BN | number): Observable<DerivedReferendumVote[]> =>
    (api.query.democracy.votersFor<Vec<AccountId>>(referendumId)).pipe(
      switchMap((votersFor): Observable<[Vec<AccountId>, Vote[], DerivedBalances[]]> =>
        combineLatest([
          of(votersFor),
          votes(api)(referendumId as BN, votersFor),
          votingBalances(api)(votersFor)
        ])
      ),
      map(([votersFor, votes, balances]): DerivedReferendumVote[] =>
        votersFor.map((accountId, index): DerivedReferendumVote => ({
          accountId,
          balance: balances[index].votingBalance || createType('Balance'),
          vote: votes[index] || createType('Vote')
        } as unknown as DerivedReferendumVote))
      ),
      drr()
    );
}
