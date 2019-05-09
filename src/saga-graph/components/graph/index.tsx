import * as React from 'react';
import {EffectDescription, State, TriggeredEffect} from "../../../types";
import {connect} from "react-redux";
import {RootEffect} from "redux-saga/effects";

interface Props {
  state: State;
}

function Graph({state}: Props) {
  console.log('>>> dump state', state);

  const effect = state.effectsById[1];

  if(effect) {
    const c: RootEffect = effect.effect as RootEffect;

    // @ts-ignore
    console.log('>>> rootSaga', c);
  }

  return (
    <div>Hi</div>
  );
}

const mapState = (state: State) => ({
  state: state,
});

export default connect(
  mapState
)(Graph);
