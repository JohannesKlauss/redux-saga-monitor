import {EffectsByIdState, EffectsState, TriggeredEffect} from "../types";
import {AnyAction} from "redux";
import {
  EFFECT_RESOLVED,
  EFFECT_TRIGGERED,
  STATUS_CANCELLED,
  STATUS_PENDING,
  STATUS_REJECTED,
  STATUS_RESOLVED
} from "./constants";
import {asEffect} from "redux-saga/utils";

const CHILDREN = Symbol('CHILDREN');

const getPathToEffect = (effect: TriggeredEffect, effectsByIdState: EffectsByIdState): number[] => {
  let effectId = effect.effectId;
  const path = [effectId];

  while (effectId) {
    effectId = effect.parentEffectId;

    if (effectId) {
      path.push(effectId);

      effect = effectsByIdState[effectId];
    }
  }

  return path.reverse();
};

const settleEffect = (effect: TriggeredEffect, action: AnyAction, isError?: boolean): TriggeredEffect => ({
  ...effect,
  result: action.result,
  error: action.error,
  status: isError ? STATUS_REJECTED : STATUS_RESOLVED,
});

const cancelEffect = (effect: TriggeredEffect, action: AnyAction): TriggeredEffect => ({
  ...effect,
  status: STATUS_CANCELLED,
});

export function rootEffectIds(state: EffectsState = [], action: AnyAction): EffectsState {
  if(action.type === EFFECT_TRIGGERED && action.effect.root) {
    return [...state, action.effect.effectId];
  }

  return state;
}

export function effectIds(state: EffectsState = [], action: AnyAction): EffectsState {
  if(action.type === EFFECT_TRIGGERED) {
    return state.concat(action.effect.effectId);
  }

  return state;
}

export function effectsById(state: EffectsByIdState = {}, action: AnyAction): EffectsByIdState {
  let effectId: number, effect: TriggeredEffect, newState: EffectsByIdState;

  switch(action.type) {
    case EFFECT_TRIGGERED:
      effect = action.effect;
      effectId = effect.effectId;

      newState = {
        ...state,
        [effectId]: {
          status: STATUS_PENDING,
          ...effect,
          path: effect.parentEffectId ? getPathToEffect(effect, state) : [effectId],
        }
      };

      const parent = state[effect.parentEffectId];

      if(parent && asEffect.race(parent.effect)) {
        parent[CHILDREN].push(effect);
      }

      return newState;

    case EFFECT_RESOLVED:
      effectId = action.effectId;
      effect = state[effectId];

      newState = {
        ...state,
        [effectId]: settleEffect(effect, action),
      };

      return maybeSetRaceWinner(effect, action.result, newState);
  }
}