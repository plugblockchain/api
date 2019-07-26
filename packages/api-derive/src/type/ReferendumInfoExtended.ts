// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ReferendumIndex, ReferendumInfo } from '@plugnet/types/interfaces/democracy';

import BN from 'bn.js';
import { ClassOf, createType } from '@plugnet/types';
import { AnyJsonObject } from '@plugnet/types/types';

/**
 * @name ReferendumInfoExtended
 * @description
 * A [[ReferendumInfo]] with an additional `index` field
 */
export default class ReferendumInfoExtended extends ClassOf('ReferendumInfo') {
  private _index: ReferendumIndex;

  public constructor (value: ReferendumInfo | ReferendumInfoExtended, index?: BN | number) {
    super(value);

    this._index = value instanceof ReferendumInfoExtended
      ? value.index
      : createType('ReferendumIndex', index);
  }

  /**
   * @description Convenience getter, returns the referendumIndex
   */
  public get index (): ReferendumIndex {
    return this._index;
  }

  /**
   * @description Creates the JSON representation
   */
  public toJSON (): AnyJsonObject {
    return {
      ...super.toJSON() as AnyJsonObject,
      index: this.index.toJSON()
    };
  }
}
