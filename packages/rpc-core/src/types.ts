// Copyright 2017-2019 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Observable } from 'rxjs';

export interface RpcInterfaceMethod {
  (...params: any[]): Observable<any>;
}
