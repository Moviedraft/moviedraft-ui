import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
      <Container fluid>
        <Row>
          <Col xs={6} md={4}>
            <Navbar.Brand href='/user' id='companyName'>Couchsports</Navbar.Brand>
          </Col>
          <Col align='center' xs={{ span: 12, order: 'last' }} md={{ span: 6 }}>
            {this.renderGameInfo()}
          </Col>
          <Col className='accountInfo' align='right' xs={6} md={{ span: 2, order: 'last' }}>
            {this.renderAccountButton()}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Header;
