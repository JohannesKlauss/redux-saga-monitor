import React from 'react'
import {Provider} from "react-redux";
import {SagaMonitor} from "../types";

interface Props {
  monitor: SagaMonitor;
  children?: JSX.Element;
}

export function SagaMonitorView(props: Props) {
  return (
    <Provider store={props.monitor.store}>
      {props.children}
    </Provider>
  )
}
