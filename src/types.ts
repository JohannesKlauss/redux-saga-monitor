import {Effect} from "redux-saga";
import {AnyAction} from "redux";

export type Status = 'STATUS_PENDING'
  | 'STATUS_RESOLVED'
  | 'STATUS_REJECTED'
  | 'STATUS_CANCELLED';

export interface TriggeredEffect {
  effectId: number;
  parentEffectId: number;
  effect: Effect;
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

export interface EffectTriggeredAction extends AnyAction {
  effect: TriggeredEffect;
}

export interface EffectCancelledAction extends AnyAction {
  effectId: number;
}

export interface SharedRefState {
  currentAction: AnyAction;
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