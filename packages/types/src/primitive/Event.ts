// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventId } from '../interfaces/system';
import { Constructor, Codec } from '../types';

import { assert, isUndefined, stringCamelCase, u8aToHex } from '@plugnet/util';

import { ClassOf, TypeDef, getTypeClass, getTypeDef } from '../codec/createType';
import Struct from '../codec/Struct';
import Tuple from '../codec/Tuple';
import Metadata from '../Metadata';
import { EventMetadata as EventMetadataV7 } from '../Metadata/v7/Events';
import Null from './Null';
import Unconstructable from './Unconstructable';

const EventTypes: Record<string, Constructor<EventData>> = {};

/**
 * @name EventData
 * @description
 * Wrapper for the actual data that forms part of an [[Event]]
 */
export class EventData extends Tuple {
  private _meta: EventMetadataV7;

  private _method: string;

  private _section: string;

  private _typeDef: TypeDef[];

  public constructor (Types: Constructor[], value: Uint8Array, typeDef: TypeDef[], meta: EventMetadataV7, section: string, method: string) {
    super(Types, value);

    this._meta = meta;
    this._method = method;
    this._section = section;
    this._typeDef = typeDef;
  }

  /**
   * @description The wrapped [[EventMetadata]]
   */
  public get meta (): EventMetadataV7 {
    return this._meta;
  }

  /**
   * @description The method as a string
   */
  public get method (): string {
    return this._method;
  }

  /**
   * @description The section as a string
   */
  public get section (): string {
    return this._section;
  }

  /**
   * @description The [[TypeDef]] for this event
   */
  public get typeDef (): TypeDef[] {
    return this._typeDef;
  }
}

/**
 * @name Event
 * @description
 * A representation of a system event. These are generated via the [[Metadata]] interfaces and
 * specific to a specific Substrate runtime
 */
export default class Event extends Struct {
  // Currently we _only_ decode from Uint8Array, since we expect it to
  // be used via EventRecord
  public constructor (_value?: Uint8Array) {
    const { DataType, value } = Event.decodeEvent(_value);

    super({
      index: ClassOf('EventId'),
      data: DataType
    }, value);
  }

  public static decodeEvent (value: Uint8Array = new Uint8Array()): { DataType: Constructor<Null> | Constructor<EventData>; value?: { index: Uint8Array; data: Uint8Array } } {
    if (!value.length) {
      return {
        DataType: Null
      };
    }

    const index = value.subarray(0, 2);
    const DataType = EventTypes[index.toString()];

    assert(!isUndefined(DataType), `Unable to decode ${u8aToHex(index)}`);

    return {
      DataType,
      value: {
        index,
        data: value.subarray(2)
      }
    };
  }

  // This is called/injected by the API on init, allowing a snapshot of
  // the available system events to be used in lookups
  public static injectMetadata (metadata: Metadata): void {
    metadata.asV7.modules
      .filter((section): boolean => section.events.isSome)
      .forEach((section, sectionIndex): void => {
        const sectionName = stringCamelCase(section.name.toString());

        section.events.unwrap().forEach((meta, methodIndex): void => {
          const methodName = meta.name.toString();
          const eventIndex = new Uint8Array([sectionIndex, methodIndex]);
          const typeDef = meta.args.map((arg): TypeDef => getTypeDef(arg.toString()));
          const Types = typeDef.map((typeDef): Constructor<Codec> => getTypeClass(typeDef, Unconstructable.with(typeDef)));

          EventTypes[eventIndex.toString()] = class extends EventData {
            public constructor (value: Uint8Array) {
              super(Types, value, typeDef, meta, sectionName, methodName);
            }
          };
        });
      });
  }

  /**
   * @description The wrapped [[EventData]]
   */
  public get data (): EventData {
    return this.get('data') as EventData;
  }

  /**
   * @description The [[EventId]], identifying the raw event
   */
  public get index (): EventId {
    return this.get('index') as EventId;
  }

  /**
   * @description The [[EventMetadata]] with the documentation
   */
  public get meta (): EventMetadataV7 {
    return this.data.meta;
  }

  /**
   * @description The method string identifying the event
   */
  public get method (): string {
    return this.data.method;
  }

  /**
   * @description The section string identifying the event
   */
  public get section (): string {
    return this.data.section;
  }

  /**
   * @description The [[TypeDef]] for the event
   */
  public get typeDef (): TypeDef[] {
    return this.data.typeDef;
  }
}
