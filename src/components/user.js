import React, { Component } from 'react';
import '../styles/user.css'
import UserHandle from './userHandle.js'

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      picture: '',
      userHandle: '',
      email: ''
    }

    this.callbackFunction = this.callbackFunction.bind(this)
  }

  callbackFunction(user) {
      this.setState({userHandle: user.userHandle})
  }

  componentDidMount() {
    fetch('https://api-dev.couchsports.ca/users/current', {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({firstName: data.firstName})
      this.setState({lastName: data.lastName})
      this.setState({userHandle: data.userHandle})
      this.setState({email: data.email})
      this.setState({picture: data.picture})
    })
  }

  render() {
    return (
      <div id='userPage'>
        <div id='profilePic'>
          <img
            style={this.state.imageLoaded ? {} : {display: 'none'}}
            onLoad={() => this.setState({imageLoaded: true})}
            src={this.state.picture}
            alt='Profile' />
          <ul id='userTitle'>
            <li>
              <UserHandle
                parentCallback={this.callbackFunction}
                userHandle={this.state.userHandle}
              />
            </li>
            <li>
              <div>{this.state.email}</div>
            </li>
          </ul>
        </div>
        <div id='userInfo'>
          <ul>
            <li>
              <span>First Name: {this.state.firstName}</span>
            </li>
            <li>
              <span>Last Name: {this.state.lastName}</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default User;
