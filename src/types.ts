import {Effect, Monitor} from "redux-saga";
import {AnyAction} from "redux";
import {SAGA_ACTION} from "redux-saga/utils";

export type Status = 'STATUS_PENDING'
  | 'STATUS_RESOLVED'
  | 'STATUS_REJECTED'
  | 'STATUS_CANCELLED';

export type TimeFunc = () => number;

export type EffectIndexSignature = number
  | null
  | Effect
  | string
  | boolean
  | undefined
  | Status
  | number[]
  | AnyAction
  | Error
  | TriggeredEffect[]
  ;

export interface EffectDescription {
  effectId: number;
  parentEffectId: number;
  effect: Effect;
  label?: string;
  root?: boolean;
  start?: number;

  [key: string]: EffectIndexSignature;
}

export interface TriggeredEffect extends EffectDescription{
  end?: number;
  time?: number;
  status?: Status;
  path?: number[];
  result?: AnyAction;
  error?: Error;
  winner?: boolean;

  [key: string]: EffectIndexSignature;
}

export interface SagaMonitor extends Monitor {
  store: any; // TODO: TYPE THIS PROPERLY
}

export interface DispatchedAction {
  id: number;
  action: AnyAction;
  time: number;
  isSagaAction: boolean;
}

export interface SagaAction extends AnyAction {
  [key: string]: any;
}

export interface BaseAction extends AnyAction {
  time: number;
  effectId?: number;
}

export interface EffectTriggeredAction extends BaseAction {
  effect: EffectDescription;
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
