import React, { Component } from 'react';
import '../styles/user.css'
import UserHandle from './userHandle.js'
import UserGames from './userGames.js'

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      picture: '',
      userHandle: '',
      email: '',
      userGames: []
    }

    this.userHandlecallbackFunction = this.userHandlecallbackFunction.bind(this)
    this.userGamesCallbackFunction = this.userGamesCallbackFunction.bind(this)
  }

  userHandlecallbackFunction(userHandle) {
      this.setState({userHandle: userHandle})
  }

  userGamesCallbackFunction(gameId) {
    const index = this.state.userGames.findIndex(userGame => userGame.game_id === gameId),
    userGames = [...this.state.userGames]
    userGames[index].joined = true
    this.setState({userGames: userGames})
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

      data.games.map((game) => {
        this.state.userGames.push(game)
      });
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
                parentCallback={this.userHandlecallbackFunction}
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
        <UserGames
          parentCallback={this.userGamesCallbackFunction}
          userGames={this.state.userGames}
        />
      </div>
    )
  }
}

export default User;
