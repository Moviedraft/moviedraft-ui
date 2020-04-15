import React, { Component } from 'react';
import { navigate } from "@reach/router"
import GoogleLogin from 'react-google-login';
import '../styles/login.css'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  render() {
    if (this.state.loggedIn) {
      navigate('/user')
    }

    const responseGoogle = (response) => {
      fetch('https://api-dev.couchsports.ca/login/validate?id_token=' + response.tokenId)
        .then(res => res.json())
        .then((data) => {
          localStorage.setItem('CouchSportsToken', data.access_token);
          this.setState({loggedIn: true})
          this.props.parentCallback(this.state.loggedIn)
        })
        .catch(console.log)

    }

    return (
        <GoogleLogin
          id='googleLogin'
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText='LOGIN WITH GOOGLE'
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
    );
  }
}

export default Login;
