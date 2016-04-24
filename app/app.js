import {render} from 'react-dom';
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

import Home from './components/Home';

render((
  <Router history={hashHistory}>
    <Route path="/" component={Home}></Route>
  </Router>
), document.getElementById('app'));
