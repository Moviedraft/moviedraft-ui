import React, { Component } from 'react'
import { navigate } from '@reach/router'
import '../styles/login.css'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }

    this.onSuccess = this.onSuccess.bind(this)
    this.onFailure = this.onFailure.bind(this)
  }

  componentDidMount() {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        cookiepolicy: process.env.REACT_APP_COOKIE_POLICY
      }).then(() => {
        window.gapi.signin2.render('signIn', {
          'scope': 'profile email',
          'width': 250,
          'height': 50,
          'longtitle': true,
          'theme': 'light',
          'onsuccess': this.onSuccess,
          'onfailure': this.onFailure,
          'prompt': 'consent'
        })
      })
    })
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return
    }
  }

  onSuccess(response) {
    let tokenId = response.getAuthResponse().id_token
    window.gapi.auth2.getAuthInstance().disconnect()

    fetch('https://api-dev.couchsports.ca/login/validate?id_token=' + tokenId)
      .then(res => res.json())
      .then((data) => {
        localStorage.setItem('CouchSportsToken', data.access_token);
        localStorage.setItem('CouchSportsTokenExpiry', data.expiresAt)
        this.setState({loggedIn: true})
        this.props.parentCallback(this.state.loggedIn)
      })
      .catch(console.log)
  }

  onFailure(response) {
    console.log(response)
  }

  render() {
    if (this.state.loggedIn) {
      navigate('/user')
    }

    return (
        <div id='signIn' />
    )
  }
}

export default Login;
