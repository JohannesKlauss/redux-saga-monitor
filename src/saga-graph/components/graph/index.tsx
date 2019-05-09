import * as React from 'react';
import {State} from "../../../types";
import {connect} from "react-redux";

interface Props {
  state: State;
}

function Graph({state}: Props) {
  console.log('>>> dump state', state);

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
