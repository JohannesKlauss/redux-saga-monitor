import {Monitor} from "redux-saga";
import {AnyAction, createStore} from "redux";
import rootReducer from "./reducers";
import {TimeFunc, TriggeredEffect} from "../types";
import {ACTION_DISPATCHED, EFFECT_CANCELLED, EFFECT_REJECTED, EFFECT_RESOLVED, EFFECT_TRIGGERED} from "./constants";
import {is, SAGA_ACTION} from "redux-saga/utils";

function getTime() {
  if(typeof performance !== 'undefined' && performance.now)
    return performance.now();
  else
    return Date.now();
}

export default function createSagaMonitor(time: TimeFunc = getTime): Monitor {
  const store = createStore(rootReducer);
  const dispatch = store.dispatch;

  function effectTriggered(effect: TriggeredEffect) {
    dispatch({
      type: EFFECT_TRIGGERED,
      effect,
      time: time(),
    });
  }

  function effectResolved(effectId: number, result: Promise<any>) {
    if (is.task(result)) {
      result.done.then(
        result => {
          if (result.isCancelled()) {
            effectCancelled(effectId);
          } else {
            effectResolved(effectId, result);
          }
        },
        error => {
          effectRejected(effectId, error);
        }
      )
    }
    else {
      dispatch({
        type: EFFECT_RESOLVED,
        effectId,
        result,
        time: time(),
      });
    }
  }

  function effectRejected(effectId: number, error: Error) {
    dispatch({
      type: EFFECT_REJECTED,
      effectId,
      error,
      time: time(),
    });
  }

  function effectCancelled(effectId: number) {
    dispatch({
      type: EFFECT_CANCELLED,
      effectId,
      time: time(),
    });
  }

  function actionDispatched(action: AnyAction) {
    const isSagaAction: boolean = action[SAGA_ACTION];

    dispatch({
      type: ACTION_DISPATCHED,
      id: Date.now(),
      action,
      isSagaAction,
      time: time(),
    });
  }

  return {
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled,
    actionDispatched,
  }
}