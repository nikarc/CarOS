import {render} from 'react-dom';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Home from './components/Home';
import Music from './components/Music';
import Podcasts from './components/Podcasts';
import Videos from './components/Videos';
import Settings from './components/Settings';

require('./styles/main.scss');

render((
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={Music}></IndexRoute>
      <Route path="music" component={Music}></Route>
      <Route path="podcasts" component={Podcasts}></Route>
      <Route path="videos" component={Videos}></Route>
      <Route path="settings" component={Settings}></Route>
    </Route>
  </Router>
), document.getElementById('app'));
