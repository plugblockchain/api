// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, ApprovalFlag, SetIndex } from '@plugnet/types/interfaces';

import { ApiInterfaceRx } from '@plugnet/api/types';
import { Observable } from 'rxjs';
import { Vec } from '@plugnet/types';
import { switchMap, map } from 'rxjs/operators';
import { approvalFlagsToBools } from '../util/approvalFlagsToBools';
import { drr } from '../util/drr';

/**
 * @name approvalsOf
 * @returns A nested array of boolean approvals for the given account in each voter set index, converted from its ApprovalFlag(s).
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.elections.approvalsOf(ALICE, (approvals) => {
 *   // approvals === [[false], [true, false], ...]
 * });
 * ```
 */
export function approvalsOf (api: ApiInterfaceRx): (who: AccountId) => Observable<boolean[][]> {
  return (who: AccountId): Observable<boolean[][]> =>
    (api.query.elections.nextVoterSet<SetIndex>())
      .pipe(
        switchMap((nextVoterSet: SetIndex): Observable<Vec<ApprovalFlag>[]> =>
          api.query.elections.approvalsOf.multi(
            [...Array(nextVoterSet.toNumber() + 1).keys()].map((i): [string, number] => [
              who.toString(), i]
            )
          ) as any as Observable<Vec<ApprovalFlag>[]>
        ),
        map((votes: Vec<ApprovalFlag>[]): boolean[][] =>
          votes.map((flags: Vec<ApprovalFlag>): boolean[] =>
            approvalFlagsToBools(flags)
          )
        ),
        drr()
      );
}
