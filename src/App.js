import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Conference from './components/Conference';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Conference} />
      </Switch>
    </Router>
  );
}

export default App;
