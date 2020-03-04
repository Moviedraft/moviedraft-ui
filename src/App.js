import React from 'react';
import { Router } from "@reach/router"
import Header from './components/header.js'
import Home from './components/home.js'
import User from './components/user.js'

function App() {

  return (
    <div>
      <Header />
      <Router>
        <Home path="/" />
        <User path="/user" component={ User }/>
      </Router>
    </div>
  );
}

export default App;
