import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './store/reducers';
import rootSaga from './store/sagas';
import Counter from './components/Counter';
import createSagaMonitor from "../../src/store/createSagaMonitor";

const monitor = createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({sagaMonitor: monitor});

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
/*sagaMiddleware.run(function* anotherSaga() {
  yield taake('SOMETHING') // THIS IS INTENTIONAL. Simulate an error on the devtools
});*/

ReactDOM.render(
  <div>
    <Provider store={store}>
      <div style={{margin: 10}}>
        <Counter/>
      </div>
    </Provider>
  </div>,
  document.getElementById('root')
);
