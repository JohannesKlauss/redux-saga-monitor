import React from 'react';
import {connect} from "react-redux";
import {State} from "../store/reducers";
import {CANCEL_INCREMENT_ASYNC, DECREMENT, INCREMENT, INCREMENT_ASYNC, INCREMENT_IF_ODD} from "../store/actions";

interface Props {
  counter: number;
  countdown: number;
  dispatch: ({type, value}: {type: string, value?: any}) => void;
}

const Counter = ({counter, countdown, dispatch}: Props) => {
  const action = (type: string, value?: number) => () => dispatch({type, value});

  return (
    <div>
      Clicked: {counter} times
      {' '}
      <button onClick={action(INCREMENT)}>+</button>
      {' '}
      <button onClick={action(DECREMENT)}>-</button>
      {' '}
      <button onClick={action(INCREMENT_IF_ODD)}>Increment if odd</button>
      {' '}
      <button
        onClick={countdown ? action(CANCEL_INCREMENT_ASYNC) : action(INCREMENT_ASYNC, 5)}
        style={{color: countdown ? 'red' : 'black'}}>

        {countdown ? `Cancel increment (${countdown})` : 'increment after 5s'}
      </button>
    </div>
  )
};

const mapState = (state: State) => ({
  counter: state.counter,
  countdown: state.countdown,
});

export default connect(
  mapState
)(Counter);
