import React, { Component } from 'react';
import '../styles/user.css'
import Header from '../components/header.js'
import UserHandle from './userHandle.js'
import UserGames from './userGames.js'
import CreateGame from './createGame.js'

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      userId: '',
      firstName: '',
      lastName: '',
      picture: '',
      userHandle: '',
      email: '',
      userGames: [],
      modalOpen: false
    }

    this.onClick = this.onClick.bind(this)
    this.userHandlecallbackFunction = this.userHandlecallbackFunction.bind(this)
    this.userGamesCallbackFunction = this.userGamesCallbackFunction.bind(this)
    this.createGameCallbackFunction = this.createGameCallbackFunction.bind(this)
    this.deleteGameCallbackFunction = this.deleteGameCallbackFunction.bind(this)
  }

  onClick() {
    this.setState({modalOpen: true})
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

  createGameCallbackFunction(modalOpen) {
    this.setState({modalOpen: modalOpen})
  }

  deleteGameCallbackFunction(gameId) {
    var userGames = [...this.state.userGames]
    var index = userGames.findIndex(x => x.game_id === gameId);
    if (index !== -1) {
      userGames.splice(index, 1);
      this.setState({userGames: userGames});
    }
  }

  componentDidMount() {
    fetch('https://api-dev.couchsports.ca/users/current', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      localStorage.setItem('CouchSportsHandle', data.userHandle)

      this.setState({userId: data.id})
      this.setState({firstName: data.firstName})
      this.setState({lastName: data.lastName})
      this.setState({userHandle: data.userHandle})
      this.setState({email: data.email})
      this.setState({picture: data.picture})

      data.games.forEach((game) => {
        this.state.userGames.push(game)
      });
    })
  }

  render() {
    return (
      <div id='userPage'>
        <Header />
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
            <li>
              <button
                id='createGameButton'
                onClick={() => this.onClick()}>
                <b>CREATE GAME</b>
              </button>
            </li>
          </ul>
        </div>
        <UserGames
          parentCallback={this.userGamesCallbackFunction}
          deleteGameCallbackFunction={this.deleteGameCallbackFunction}
          userId={this.state.userId}
          userGames={this.state.userGames} />
        <CreateGame
          parentCallback={this.createGameCallbackFunction}
          modalOpen={this.state.modalOpen} />
      </div>
    )
  }
}

export default User;
