import {EffectDescription, TriggeredEffect} from "../../types";

const mockIterator = (array: any[]): Iterator<any> => {
  let nextIndex = 0;

  return {
    next: () => {
      if (nextIndex < array.length) {
        return {
          value: array[nextIndex++],
          done: false
        };
      }
      return {
        value: undefined,
        done: true
      };
    }
  };
};

export const rootEffectMock: EffectDescription = {
  effectId: 1,
  parentEffectId: -1,
  root: true,
  effect: {
    root: true,
    saga: mockIterator,
    args: []
  },
};

export const effectMock1: EffectDescription = {
  effectId: 2,
  parentEffectId: 1,
  root: false,
  effect: {
    TAKE: {
      pattern: 'MOCK_ACTION'
    }
  },
};

export const effectMock2: EffectDescription = {
  effectId: 3,
  parentEffectId: 1,
  root: false,
  effect: {
    TAKE: {
      pattern: 'MOCK_ACTION'
    }
  },
};