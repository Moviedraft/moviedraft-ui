import React, { Component } from 'react';
import { navigate } from "@reach/router"
import '../styles/header.css'
import Login from './login.js'
import Account from './account.js'
import moment from 'moment'

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }

    this.onClick = this.onClick.bind(this)
    this.loggedIn = this.loggedIn.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('CouchSportsToken') && moment() < moment(localStorage.getItem('CouchSportsTokenExpiry'))) {
      this.setState({loggedIn: true})
    }
  }

  onClick() {
    navigate('/user')
  }

  loggedIn(loggedIn) {
    this.setState({loggedIn: loggedIn})
  }

  renderAccountButton() {
    return this.state.loggedIn ?
      (
        <Account
          parentCallback={this.loggedIn}/>
      ) : (
        <Login
          id='googleLogin'
          parentCallback={this.loggedIn} />
      )
  }

  render() {
    return (
      <div>
        <span id='companyName' onClick={this.onClick}>CouchSports</span>
        {this.renderAccountButton()}
      </div>
    );
  }
}

export default Header;
