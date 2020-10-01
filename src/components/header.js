import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../styles/header.css'
import '../styles/global.css'
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
    this.renderAccountButton = this.renderAccountButton.bind(this)
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

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='no-padding' xs={6}>
            <Navbar.Brand href='/user' id='companyName'>Couchsports</Navbar.Brand>
          </Col>
          <Col className='accountInfo no-padding' align='right' xs={6}>
            {this.renderAccountButton()}
          </Col>
        </Row>
        <Row>
          <hr id='headerHorizontalRule' />
        </Row>
      </Container>
    )
  }
}

export default Header;
