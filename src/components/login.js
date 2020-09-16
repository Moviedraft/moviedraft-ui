import React, { Component } from 'react'
import { navigate } from '@reach/router'
import '../styles/login.css'
import moment from 'moment'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }

    this.signIn = this.signIn.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('CouchSportsToken') === null ||
        localStorage.getItem('CouchSportsToken') === undefined ||
        moment() > moment(localStorage.getItem('CouchSportsTokenExpiry'))) {
          window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
              cookie_policy: process.env.REACT_APP_COOKIE_POLICY
            })
          })
        }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return
    }
  }

  signIn() {
    window.gapi.auth2.getAuthInstance()
    .signIn()
    .then((response) => {
      let tokenId = response.getAuthResponse().id_token

      fetch('https://api-dev.couchsports.ca/login/validate?id_token=' + tokenId)
        .then(res => res.json())
        .then((data) => {
          localStorage.setItem('CouchSportsToken', data.access_token);
          localStorage.setItem('CouchSportsTokenExpiry', data.expiresAt)
          this.setState({loggedIn: true})
          this.props.parentCallback(this.state.loggedIn)
        })
        .catch(console.log)
    })
  }

  render() {
    if (this.state.loggedIn) {
      navigate('/user')
    }

    return (
      <div id='signIn' onClick={this.signIn}></div>
    )
  }
}

export default Login;
