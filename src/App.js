import React from 'react';
import { Router } from "@reach/router"
import Header from './components/header.js'
import User from './components/user.js'

function App() {
  let Home = () => (
    <div>
      <Header />
    </div>
  )

  let UserHome = () => (
    <div>
      <Header />
      <User />
    </div>
  )

  return (
    <Router>
      <Home path="/" />
      <UserHome path="/user" />
    </Router>
  );
}

export default App;
