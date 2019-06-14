import createSagaMonitor from "../createSagaMonitor";
import {rootEffectMock} from "../__mocks__/effects.mock";
import {STATUS_PENDING} from "../constants";
import {SAGA_ACTION} from "redux-saga/utils";

let timeIndex = 1;
const time = () => timeIndex++;
const monitor = createSagaMonitor(time);

const now = Date.now();

Date.now = jest.fn().mockReturnValue(now);

const symbol = Symbol('CHILDREN');

describe('createSagaMonitor', () => {
  describe('effectTriggered', () => {
    test('should trigger the correct action when called', () => {
      monitor.effectTriggered!(rootEffectMock);

      expect(monitor.store.getState().effectsById[rootEffectMock.effectId]).toMatchObject({
        effect: rootEffectMock.effect,
        effectId: 1,
        parentEffectId: -1,
        path: [1],
        root: true,
        start: 1,
        status: STATUS_PENDING,
        [symbol]: [],
      });
    });
  });

  describe('actionDispatched', () => {
    test('should add all actions coming from internal sagas to the store', () => {
      monitor.actionDispatched!({
        type: 'MOCK_ACTION',
        [SAGA_ACTION]: true,
      });

      expect(monitor.store.getState().dispatchedActions).toMatchObject([{
        action: {
          type: 'MOCK_ACTION',
          [SAGA_ACTION]: true,
        },
        id: Date.now(),
        isSagaAction: true,
        time: 2,
        [symbol]: [],
      }]);
    });
  });
});