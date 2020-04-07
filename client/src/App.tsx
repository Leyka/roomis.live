import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Room } from './components/Room/Room';
import { Welcome } from './components/Welcome/Welcome';
import { initialStore, RootStoreContext } from './store';

export const App = () => {
  return (
    <RootStoreContext.Provider value={initialStore}>
      <Router>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/:name" component={Room} />
      </Router>
    </RootStoreContext.Provider>
  );
};
