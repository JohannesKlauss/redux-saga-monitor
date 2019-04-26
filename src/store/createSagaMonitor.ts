import {createStore} from "redux";
import rootReducer from "./reducers";
import {EffectDescription, SagaAction, SagaMonitor, State, TimeFunc} from "../types";
import {ACTION_DISPATCHED, EFFECT_CANCELLED, EFFECT_REJECTED, EFFECT_RESOLVED, EFFECT_TRIGGERED} from "./constants";
import {is, SAGA_ACTION} from "redux-saga/utils";

function getTime() {
  if(typeof performance !== 'undefined' && performance.now)
    return performance.now();
  else
    return Date.now();
}

export default function createSagaMonitor(time: TimeFunc = getTime): SagaMonitor {
  const store = createStore(rootReducer);
  const dispatch = store.dispatch;

  function effectTriggered(effect: EffectDescription) {
    const now = time();

    dispatch({
      type: EFFECT_TRIGGERED,
      effect,
      start: now,
      time: now,
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

  function actionDispatched(action: SagaAction) {
    const isSagaAction: boolean = action[SAGA_ACTION.toString()];

    dispatch({
      type: ACTION_DISPATCHED,
      id: Date.now(),
      action,
      isSagaAction,
      time: time(),
    });
  }

  return {
    get state(): State { return store.getState() as State },
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled,
    actionDispatched,
  }
}