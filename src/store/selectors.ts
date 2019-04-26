import {State, TriggeredEffect} from "../types";
import {
  ActionChannelEffectDescriptor,
  CallEffectDescriptor, CancelEffectDescriptor,
  ForkEffectDescriptor, JoinEffectDescriptor,
  PutEffectDescriptor,
  RootEffect, SelectEffectDescriptor,
  TakeEffectDescriptor
} from "redux-saga/effects";
import {asEffect, is} from "redux-saga/utils";
import {AnyAction} from "redux";
import {STATUS_RESOLVED} from "./constants";

export function getEffectName(state: State, effectId: number) {
  const effect = state.effectsById[effectId].effect;

  if ((effect as RootEffect).root) {
    return (effect as RootEffect).saga.name;
  }

  let data;

  if ((data = asEffect.take(effect))) {
    return `take(${String((data as TakeEffectDescriptor).pattern) || 'channel'})`;
  }
  else if ((data = asEffect.put(effect))) {
    const {channel, action} = data as PutEffectDescriptor<AnyAction>;

    return `put(${(channel) ? action : action.type})`;
  }
  else if ((data = asEffect.call(effect))) {
    return `call(${(data as CallEffectDescriptor).fn.name})`;
  }
  else if ((data = asEffect.cps(effect))) {
    return `cps(${(data as CallEffectDescriptor).fn.name})`;
  }
  else if ((data = asEffect.fork(effect))) {
    const type = (data as ForkEffectDescriptor).detached ? 'spawn' : 'fork';

    return `${type}(${(data as ForkEffectDescriptor).fn.name})`;
  }
  else if ((data = asEffect.join(effect))) {
    console.log('>>> data', data as JoinEffectDescriptor);
    // return `join(${(data as JoinEffectDescriptor).name})`;
  }
  else if ((data = asEffect.cancel(effect))) {
    console.log('>>> data', data as CancelEffectDescriptor);
    // return `cancel(${(data as CancelEffectDescriptor).name})`;
  }
  else if (is.array(effect)) {
    return `parallel`;
  }
  else if (asEffect.race(effect)) {
    return `race`;
  }
  else if ((data = asEffect.select(effect))) {
    return `select(${(data as SelectEffectDescriptor).selector.name})`;
  }
  else if ((data = asEffect.actionChannel(effect))) {
    return `actionChannel(${String((data as ActionChannelEffectDescriptor).pattern)})`;
  }
  else if (asEffect.cancelled(effect)) {
    return `cancelled`;
  }
  else if (asEffect.flush(effect)) {
    return `flush(buffer)`;
  }
  else {
    return String(effect);
  }
}

export function getReactions(state: State, action: AnyAction) {
  const reactions = [];
  const effectsById = state.effectsById;

  Object.values(effectsById).forEach(effect => {
    if (asEffect.take(effect.effect) && effect.status === STATUS_RESOLVED && effect.result === action) {
      reactions.push(getTaskForEffect(state, effect));
    }
  });
}

export function getTaskForEffect(state: State, effect: TriggeredEffect) {
  let parentId = effect.parentEffectId;

  while(parentId) {
    const parent = state.effectsById[parentId];

    if(parent.root || asEffect.fork(parent.effect) || asEffect.call(parent.effect)) {
      return parentId;
    }

    parentId = parent.parentEffectId;
  }
}

export function getPathToEffect(state: State, effectId: number, rootEffectIds: number[]): number[] {
  const path = state.effectsById[effectId].path;
  let k = 0;

  if(path) {
    while(rootEffectIds.indexOf(path[k]) < 0) {
      k++;
    }

    return path.slice(k);
  }

  return [];
}

export function isParentOf(state: State, parentId: number, effectId: number): boolean {
  let parentEffectId = state.effectsById[effectId].parentEffectId;

  while(parentEffectId) {
    if(parentEffectId === parentId) {
      return true;
    }

    parentEffectId = state.effectsById[parentEffectId].parentEffectId;
  }

  return false;
}

export function matchCurrentAction(state: State, effectId: number): boolean | undefined {
  const effect = state.effectsById[effectId];
  const currentAction = state.sharedRef.currentAction;

  return currentAction && asEffect.take(effect.effect) && effect.result === currentAction.action;
}