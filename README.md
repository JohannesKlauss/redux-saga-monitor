# redux-saga-monitor
A live redux saga control flow system.

## NOTE: WIP!
This is still work in progress! I'll update the main tools as well as the sister repos as I go along.
So take this with a grain of salt. There is no guarantee that this tool works as you expect it to work.
If you want to help or found a bug, please open up an issue or a pull request.

## What this is
It's a toolset that let's you track the control flow of sagas in real time. The tracking
happens in a dedicated redux store you can access to build your own graphical dev tools with it.
It should be treated as a read only store, because there is no option to change the control flow.

## What this is not
This repo does not provide any UI whatsoever. It's purpose is to be a base for tooling that builds
on top of it.

## Prior Art
This tool is mainly based on [redux-saga-devtools](https://github.com/redux-saga/redux-saga-devtools).
Sadly there is no active development, so I decided to port it over to TypeScript and develop it further.

## Motivation
Sagas can get big, complicated and very confusing. Even though they are pure effect descriptors and there
is nothing magic about it, the nature of middleware is that it sometimes feels like a black box.
Based on the idea Dan Abramov posted [here](https://github.com/redux-saga/redux-saga/issues/5) over three
years ago and my recent pain with a badly designed project that uses sagas all over the place I came up
with the idea of a traceable graphical UI, that shows exactly how, when and why your sagas act. The
devtools already mentioned above are a step in the right direction but should be taken way further.

## How it works
This tool itself is a middleware, but only reads the sagas data and stores it into it's own redux store.
You then can access that store and do with the data whatever you like.

There is **no** React needed. Even though there is a React component exported (called `SagaMonitorView`),
you don't have to use that. It just provides a minor abstraction, that connects your custom UI with
the monitor store. But you can build your UI the way you want, since the only other thing exported is
the `createSagaMonitor` middleware that returns a redux store.
If you want to use React though, you have to add the `react` and `react-dom` packages yourself, because
this package doesn't declare those as a peer dependency.

### Install

```shell
npm install redux-saga-graph
```

or

```shell
yarn add redux-saga-graph
```

### Usage

```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './store/reducers';
import rootSaga from './store/sagas';
import {createSagaMonitor, SagaMonitorView} from "redux-saga-graph";

const monitor = createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({sagaMonitor: monitor});

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <div>
    <Provider store={store}>
      <div style={{margin: 10}}>
        {/* Your App */}
      </div>
    </Provider>
    <SagaMonitorView monitor={monitor}>
      {/* Your Devtool */}
    </SagaMonitorView>
  </div>,
  document.getElementById('root')
);

```

That's it.

### Data Documentation

This is still a todo.

Check out this repo and run the `example:cancellable-counter` script. This dumps the monitor state to
the console every time something changes.