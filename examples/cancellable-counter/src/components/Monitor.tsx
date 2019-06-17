import * as React from 'react';
import {connect} from "react-redux";
import {State} from "../../../../src/types";

interface Props {
  state: State;
}

function Monitor({state}: Props) {
  console.log('>>> dump state', state);

  return (
    <div>
      {(window as any).__REDUX_SAGA_MONITOR_GLOBAL_HOOK ? `Monitor active`: `Monitor hook not found!`}
    </div>
  );
}

const mapState = (state: State) => ({
  state: state,
});

export default connect(
  mapState
)(Monitor);
