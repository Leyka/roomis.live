import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Room } from './components/Room/Room';
import { Welcome } from './components/Welcome/Welcome';

export const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/:name" component={Room} />
    </Router>
  );
};
