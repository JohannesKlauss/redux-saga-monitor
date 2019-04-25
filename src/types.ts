import {Effect} from "redux-saga";

export type Status = 'STATUS_PENDING'
  | 'STATUS_RESOLVED'
  | 'STATUS_REJECTED'
  | 'STATUS_CANCELLED';

export interface TriggeredEffect {
  effectId: number;
  parentEffectId: number;
  label?: string;
  root?: boolean;
  effect: Effect;
  status?: Status;
  path?: number[];
  result?: any;
  error?: any;
}

export type EffectsState = number[];
export type EffectsByIdState = { [name: number]: TriggeredEffect };