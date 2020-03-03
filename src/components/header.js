import React, { Component } from 'react';
import { navigate } from "@reach/router"
import '../styles/header.css'
import Login from './login.js'

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    navigate('/')
  }

  render() {
    return (
      <div>
        <span id='companyName' onClick={this.onClick}>CouchSports</span>
        <Login id='googleLogin' />
      </div>
    );
  }
}

export default Header;
