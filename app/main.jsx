'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './components/App'
import VisualizerContainer from './containers/VisualizerContainer'
import { loadWords } from './reducers/visualizer'


// dispatch thunk to get words data
const onVisEnter = () => {
  const thunk = loadWords();
  store.dispatch(thunk);
}

render (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRedirect to="/tmp" />
        <Route path="/tmp" component ={ VisualizerContainer } onEnter={ onVisEnter } />
      </Route>

    </Router>
  </Provider>,
  document.getElementById('main')
)