import {TriggeredEffect} from "../types";
import createSagaMonitor from "./createSagaMonitor";

const getEffectId = (effect: TriggeredEffect): number => effect.effectId;

describe('reducers', () => {
  const monitor = createSagaMonitor();

  test('test jest', () => {
    expect(2 + 2).toEqual(4);
  })
});