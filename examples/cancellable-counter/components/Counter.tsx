import React from 'react';
import {connect} from "react-redux";
import {State} from "../store/reducers";
import {CANCEL_INCREMENT_ASYNC, DECREMENT, INCREMENT, INCREMENT_ASYNC, INCREMENT_IF_ODD} from "../store/actions";

// tslint:disable-next-line:ban-types
type Connected<S, D = undefined> = S extends Function
  ? D extends undefined
    ? // tslint:disable-next-line:ban-types
    (ReturnType<S> extends Function
      ? ReturnType<ReturnType<S>>
      : ReturnType<S>) // tslint:disable-next-line:ban-types
    : (ReturnType<S> extends Function
    ? ReturnType<ReturnType<S>>
    : ReturnType<S>) &
    // tslint:disable-next-line:ban-types
    (D extends Function ? ReturnType<D> : D)
  : S;


type Props = {dispatch: () => void} extends Connected<typeof mapState>;

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
