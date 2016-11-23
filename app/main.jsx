'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import Tmp from './components/Tmp'
import InputForm from './components/InputForm'


// const ExampleApp = connect(
//   ({ auth }) => ({ user: auth })
// )
// (
//   ({ user, children }) =>
//     <div>
//       <nav>
//         {user ? <WhoAmI/> : <Login/>}
//       </nav>
//       {children}
//     </div>
// )

render (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Tmp}>
        <IndexRedirect to="/tmp" />
        <Route path="/tmp" component ={Tmp} />
        <Route path="/input" component ={InputForm} />
      </Route>

    </Router>
  </Provider>,
  document.getElementById('main')
)