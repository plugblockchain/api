// Copyright 2017-2019 @polkadot/api-metadata authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@plugnet/types/types';
import { ModuleConstantMetadataV7 } from '@plugnet/types/interfaces';

export interface ConstantCodec extends Codec {
  meta: ModuleConstantMetadataV7;
}

export type ModuleConstants = Record<string, Codec>;

export type Constants = Record<string, ModuleConstants>;
