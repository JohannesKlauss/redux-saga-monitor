import createSagaMonitor from "../createSagaMonitor";
import {effectMock1, rootEffectMock} from "../__mocks__/effects.mock";
import {STATUS_PENDING} from "../constants";
import {SAGA_ACTION} from "redux-saga/utils";

let timeIndex = 1;
const time = () => timeIndex++;
const monitor = createSagaMonitor(time);

const now = Date.now();

Date.now = jest.fn().mockReturnValue(now);

describe('createSagaMonitor', () => {
  describe('effectTriggered', () => {
    test('should trigger the correct action when called', () => {
      monitor.effectTriggered!(rootEffectMock);

      expect(monitor.state.effectsById[rootEffectMock.effectId]).toEqual({
        effect: rootEffectMock.effect,
        effectId: 1,
        parentEffectId: -1,
        path: [1],
        root: true,
        start: 1,
        status: STATUS_PENDING,
      });
    });
  });

  describe('actionDispatched', () => {
    test('should add all actions coming from internal sagas to the store', () => {
      monitor.actionDispatched!({
        type: 'MOCK_ACTION',
        [SAGA_ACTION]: true,
      });

      expect(monitor.state.dispatchedActions).toEqual([{
        action: {
          type: 'MOCK_ACTION',
          [SAGA_ACTION]: true,
        },
        id: Date.now(),
        isSagaAction: true,
        time: 2,
      }]);
    });
  });
});