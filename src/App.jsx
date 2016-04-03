'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, hashHistory} from 'react-router';

import BugList from './BugList.jsx';
import BugEdit from './BugEdit.jsx';

const NoMatch = () => <h2>No match to the route</h2>;

ReactDOM.render (
  (
    <Router history={hashHistory} >
      <Route path="/bugs" component={BugList} />
      <Route path="/bugs/:id" component={BugEdit} />
      <Redirect from="/" to="/bugs" />
      <Route path="*" component={NoMatch} />
    </Router>
  ),
  document.getElementById('main')
);
