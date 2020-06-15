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

  renderGameInfo() {
    return this.props.gameName && this.props.startDate && this.props.endDate ?
    (
      <div id='gameInfo'>
        <div id='gameName'>{this.props.gameName}</div>
        <div id='gameDates'>{moment(this.props.startDate).format('LL') + ' - ' + moment(this.props.endDate).format('LL')}</div>
      </div>
    ) : (
      <div id='gameInfo'>&nbsp;</div>
    )
  }

  render() {
    return (
      <div id='headerContainer'>
        <span id='companyName' onClick={this.onClick}>CouchSports</span>
        {this.renderGameInfo()}
        <div id='accountContainer'>
          {this.renderAccountButton()}
        </div>
      </div>
    );
  }
}

export default Header;
