import {effectMock1, effectMock2, rootEffectMock} from "../__mocks__/effects.mock";
import {dispatchedActions, effectIds, effectsById, effectsByParentId, rootEffectIds} from "../reducers";
import {
  ACTION_DISPATCHED,
  EFFECT_CANCELLED,
  EFFECT_REJECTED,
  EFFECT_RESOLVED,
  EFFECT_TRIGGERED, STATUS_CANCELLED,
  STATUS_PENDING,
  STATUS_REJECTED,
  STATUS_RESOLVED
} from "../constants";

describe('reducers', () => {
  let timeIndex = 1;

  beforeEach(() => {
    timeIndex = 1;
  });

  describe('rootEffectIds', () => {
    test('should add to stack when effect is root', () => {
      const state = rootEffectIds([], {
        type: EFFECT_TRIGGERED,
        effect: rootEffectMock,
      });

      expect(state).toEqual([rootEffectMock.effectId]);
    });

    test('should not add to stack when effect is not a root', () => {
      const state = rootEffectIds([], {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
      });

      expect(state).toEqual([]);
    });
  });

  describe('effectIds', () => {
    test('should add to stack when effect is triggered', () => {
      const state = effectIds([], {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
      });

      expect(state).toEqual([effectMock1.effectId]);
    });

    test('should not add to stack when effect is not triggered', () => {
      const state = effectIds([], {
        type: EFFECT_REJECTED,
        effect: effectMock1,
      });

      expect(state).toEqual([]);
    });
  });

  describe('effectsById', () => {
    test('should add to stack when effect is triggered', () => {
      const state = effectsById({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex++,
      });

      expect(state).toEqual({
        [effectMock1.effectId]: {
          ...effectMock1,
          path: [1, 2],
          start: 1,
          status: STATUS_PENDING,
        }
      });
    });

    test('should not get into infinite loop', () => {
      let state = effectsById({}, {
        type: EFFECT_TRIGGERED,
        effect: rootEffectMock,
        time: timeIndex++,
      });

      state = effectsById(state, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex++,
      });

      expect(state[effectMock1.effectId]).toEqual({
        ...effectMock1,
        path: [1, 2],
        start: 2,
        status: STATUS_PENDING,
      });
    });

    test('should settle resolved effect', () => {
      let state = effectsById({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex++,
      });

      state = effectsById(state, {
        type: EFFECT_RESOLVED,
        effectId: effectMock1.effectId,
        time: timeIndex++,
      });

      expect(state).toEqual({
        [effectMock1.effectId]: {
          ...effectMock1,
          path: [1, 2],
          start: 1,
          end: 2,
          time: 1,
          status: STATUS_RESOLVED,
          result: undefined,
          error: undefined,
        }
      });
    });

    test('should settle rejected effect', () => {
      let state = effectsById({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex++,
      });

      state = effectsById(state, {
        type: EFFECT_REJECTED,
        effectId: effectMock1.effectId,
        time: timeIndex++,
      });

      expect(state).toEqual({
        [effectMock1.effectId]: {
          ...effectMock1,
          path: [1, 2],
          start: 1,
          end: 2,
          time: 1,
          status: STATUS_REJECTED,
          result: undefined,
          error: undefined,
        }
      });
    });

    test('should cancel canceled effect', () => {
      let state = effectsById({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex++,
      });

      state = effectsById(state, {
        type: EFFECT_CANCELLED,
        effectId: effectMock1.effectId,
        time: timeIndex++,
      });

      expect(state).toEqual({
        [effectMock1.effectId]: {
          ...effectMock1,
          path: [1, 2],
          start: 1,
          end: 2,
          time: 1,
          status: STATUS_CANCELLED,
        }
      });
    });
  });

  describe('effectsByParentId', () => {
    test('should add parent to parents effects store', () => {
      const parentEffectsState = effectsByParentId({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex,
      });

      expect(parentEffectsState).toEqual({[rootEffectMock.effectId]: [effectMock1.effectId]});
    });

    test('should correctly add siblings', () => {
      let parentEffectsState = effectsByParentId({}, {
        type: EFFECT_TRIGGERED,
        effect: effectMock1,
        time: timeIndex,
      });

      parentEffectsState = effectsByParentId(parentEffectsState, {
        type: EFFECT_TRIGGERED,
        effect: effectMock2,
        time: timeIndex,
      });

      expect(parentEffectsState).toEqual({
        [rootEffectMock.effectId]: [
          effectMock1.effectId,
          effectMock2.effectId,
        ]
      });
    });
  });

  describe('dispatchedActions', () => {
    test('should add actions to dispatched actions store', () => {
      const store = dispatchedActions([], {
        type: ACTION_DISPATCHED,
        id: 1,
        isSagaAction: true,
        time: timeIndex++,
        action: {
          type: 'MOCK_ACTION',
        }
      });

      expect(store).toEqual([{
        id: 1,
        action: {
          type: 'MOCK_ACTION',
        },
        time: timeIndex - 1,
        isSagaAction: true,
      }]);
    });
  });
});