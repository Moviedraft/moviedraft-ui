import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
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

    this.loggedIn = this.loggedIn.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('CouchSportsToken') && moment() < moment(localStorage.getItem('CouchSportsTokenExpiry'))) {
      this.setState({loggedIn: true})
    }
  }

  loggedIn(loggedIn) {
    this.setState({loggedIn: loggedIn})
  }

  renderAccountButton() {
    return this.state.loggedIn ?
      (
        <Account
          parentCallback={this.loggedIn}
          picture={this.props.picture}/>
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
        <div id='headerGameName'>{this.props.gameName}</div>
        <div id='headerGameDates'>{moment(this.props.startDate).format('LL') + ' - ' + moment(this.props.endDate).format('LL')}</div>
      </div>
    ) : (
      <div id='gameInfo'>&nbsp;</div>
    )
  }

  render() {
    return (
      <Navbar>
        <Nav.Item>
          <Navbar.Brand href='/user' id='companyName'>Couchsports</Navbar.Brand>
        </Nav.Item>
        <Nav.Item className='mx-auto' align="center">
          {this.renderGameInfo()}
        </Nav.Item>
        <Nav.Item className='ml-auto accountInfo'>
          {this.renderAccountButton()}
        </Nav.Item>
      </Navbar>
    )
  }
}

export default Header;
