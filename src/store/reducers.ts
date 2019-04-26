import {
  DispatchedActionsState,
  EffectsByIdState,
  EffectsByParentIdState,
  EffectsState,
  TriggeredEffect
} from "../types";
import {AnyAction, combineReducers} from "redux";
import {
  ACTION_DISPATCHED,
  EFFECT_CANCELLED,
  EFFECT_REJECTED,
  EFFECT_RESOLVED,
  EFFECT_TRIGGERED, SET_SHARED_REF,
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

const cancelEffect = (effect: TriggeredEffect): TriggeredEffect => ({
  ...effect,
  status: STATUS_CANCELLED,
});

const maybeSetRaceWinner = (effect: TriggeredEffect, result: any, state: EffectsByIdState): EffectsByIdState => {
  if (asEffect.race(effect.effect)) {
    const label: string = Object.keys(result)[0];
    const children = effect[CHILDREN];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.label === label) {
        state[child.effectId] = {
          ...state[child.effectId],
          winner: true,
        };

        return state;
      }
    }
  }

  return state;
};

export function rootEffectIds(state: EffectsState = [], action: AnyAction): EffectsState {
  if (action.type === EFFECT_TRIGGERED && action.effect.root) {
    return [...state, action.effect.effectId];
  }

  return state;
}

export function effectIds(state: EffectsState = [], action: AnyAction): EffectsState {
  if (action.type === EFFECT_TRIGGERED) {
    return state.concat(action.effect.effectId);
  }

  return state;
}

export function effectsById(state: EffectsByIdState = {}, action: AnyAction): EffectsByIdState {
  let
    effectId: number = action.effectId,
    effect: TriggeredEffect,
    newState: EffectsByIdState;

  switch (action.type) {
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

      if (parent && asEffect.race(parent.effect)) {
        parent[CHILDREN].push(effect);
      }

      return newState;

    case EFFECT_RESOLVED:
      effect = state[effectId];

      newState = {
        ...state,
        [effectId]: settleEffect(effect, action),
      };

      return maybeSetRaceWinner(effect, action.result, newState);

    case EFFECT_REJECTED:
      return {
        ...state,
        [effectId]: settleEffect(state[effectId], action, true),
      };

    case EFFECT_CANCELLED:
      return {
        ...state,
        [effectId]: cancelEffect(state[effectId]),
      };

    default:
      return state;
  }
}

export function effectsByParentId(state: EffectsByParentIdState = {}, action: AnyAction): EffectsByParentIdState {
  if (action.type === EFFECT_TRIGGERED) {
    const effect = action.effect;
    const parentId = effect.parentEffectId;

    if (parentId) {
      const siblings = state[parentId];

      return {
        ...state,
        [parentId]: !!siblings ? [...siblings, effect.effectId] : [effect.effectId],
      }
    }
  }

  return state;
}

export function dispatchedActions(state: DispatchedActionsState = [], monitorAction: AnyAction): DispatchedActionsState {
  if (monitorAction.type === ACTION_DISPATCHED) {
    const {id, action, time, isSagaAction} = monitorAction;

    return state.concat({id, action, time, isSagaAction});
  }

  return state;
}

export function sharedRef(state = {}, action: AnyAction) {
  if (action.type === SET_SHARED_REF) {
    return {
      ...state,
      [action.key]: action.sharedRef
    }
  }

  return state;
}

export default combineReducers({
  rootEffectIds,
  effectIds,
  effectsById,
  effectsByParentId,
  dispatchedActions,
  sharedRef,
});