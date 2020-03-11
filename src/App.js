import React from 'react';
import { Router } from '@reach/router'
import Modal from 'react-modal';
import Header from './components/header.js'
import Home from './components/home.js'
import User from './components/user.js'
import Game from './components/game.js'

Modal.setAppElement('body')

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Home path='/' />
        <User path='/user' component={ User }/>
        <Game path='/games/:gameId' component={Game} />
      </Router>
    </div>
  );
}

export default App;
