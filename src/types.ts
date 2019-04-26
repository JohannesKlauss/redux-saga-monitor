import {Effect} from "redux-saga";
import {AnyAction} from "redux";

export type Status = 'STATUS_PENDING'
  | 'STATUS_RESOLVED'
  | 'STATUS_REJECTED'
  | 'STATUS_CANCELLED';

export type TimeFunc = () => number;

export interface TriggeredEffect {
  effectId: number;
  parentEffectId: number;
  effect: Effect;
  start: number;
  end?: number;
  time?: number;
  label?: string;
  root?: boolean;
  status?: Status;
  path?: number[];
  result?: AnyAction;
  error?: Error;
  winner?: boolean;
}

export interface DispatchedAction {
  id: number;
  action: AnyAction;
  time: number;
  isSagaAction: boolean;
}

export interface BaseAction extends AnyAction {
  time: number;
}

export interface EffectTriggeredAction extends BaseAction {
  effect: TriggeredEffect;
}

export interface EffectCancelledAction extends BaseAction {
  effectId: number;
}

export interface SharedRefState {
  currentAction: BaseAction;
}

export type EffectsState = number[];
export type EffectsByIdState = { [name: number]: TriggeredEffect };
export type EffectsByParentIdState = { [name: number]: number[] };
export type DispatchedActionsState = DispatchedAction[];

export interface State {
  rootEffectIds: EffectsState;
  effectIds: EffectsState;
  effectsById: EffectsByIdState;
  effectsByParentId: EffectsByParentIdState;
  dispatchedActions: DispatchedActionsState;
  sharedRef: any;
}