import React from 'react'
import {Provider} from "react-redux";
import {SagaMonitor} from "../types";
import Graph from "./components/graph";

interface Props {
  monitor: SagaMonitor;
}

export function SagaGraphView({monitor}: Props) {
  return (
    <Provider store={monitor.store}>
      <Graph/>
    </Provider>
  )
}
