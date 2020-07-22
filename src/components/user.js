import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/user.css'
import Header from '../components/header.js'
import UserHandle from './userHandle.js'
import UserGames from './userGames.js'
import CreateGame from './createGame.js'
import ProfilePic from './profilePic.js'
import Error from './error.js'

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
      modalOpen: false,
      errorMessage: '',
      userLoaded: false
    }

    this.onClick = this.onClick.bind(this)
    this.userHandlecallbackFunction = this.userHandlecallbackFunction.bind(this)
    this.userGamesCallbackFunction = this.userGamesCallbackFunction.bind(this)
    this.createGameCallbackFunction = this.createGameCallbackFunction.bind(this)
    this.deleteGameCallbackFunction = this.deleteGameCallbackFunction.bind(this)
    this.updateGameNameCallbackFunction = this.updateGameNameCallbackFunction.bind(this)
    this.handleError = this.handleError.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.updateProfilePic = this.updateProfilePic.bind(this)
  }

  componentDidMount() {
    this.getCurrentUser()
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
    this.getCurrentUser()
  }

  deleteGameCallbackFunction(gameId) {
    var userGames = [...this.state.userGames]
    var index = userGames.findIndex(x => x.game_id === gameId);
    if (index !== -1) {
      userGames.splice(index, 1);
      this.setState({userGames: userGames});
    }
  }

  updateGameNameCallbackFunction(game) {
    let userGamesToUpdate = [...this.state.userGames]
    let index = userGamesToUpdate.findIndex(userGame => userGame.game_id === game._id)
    userGamesToUpdate[index].gameName = game.gameName
    this.setState({userGames: userGamesToUpdate})
  }

  handleError(message) {
    this.setState({errorMessage: message})
    this.getCurrentUser()
  }

  getCurrentUser() {
    apiGet('users/current')
    .then((data) => {
      if (data === null) {
        this.handleError('Unable to retrieve user information. Please try logging out and back in.')
      } else {
        localStorage.setItem('CouchSportsHandle', data.userHandle)

        this.setState({userId: data.id})
        this.setState({firstName: data.firstName})
        this.setState({lastName: data.lastName})
        this.setState({userHandle: data.userHandle})
        this.setState({email: data.email})
        this.setState({picture: data.picture})
        this.setState({userGames: data.games})
        this.setState({userLoaded: true})
      }
    })
  }

  updateProfilePic(picture) {
    this.setState({picture: picture + '?' + Date.now()})
  }

  render() {
    if (this.state.errorMessage !== '') {
      return <Error errorMessage={this.state.errorMessage} />;
    }

    if (this.state.userLoaded === false) {
      return null
    }

    return (
      <div id='userPage'>
        <Header
          picture={this.state.picture}/>
        <div id='profilePic'>
          <ProfilePic
            picture={this.state.picture}
            userId={this.state.userId}
            updateProfilePic={this.updateProfilePic} />
          <div id='userHandleWrapper'>
            <ul id='userTitle'>
              <li>
                <UserHandle
                  parentCallback={this.userHandlecallbackFunction}
                  handleError={this.handleError}
                  userHandle={this.state.userHandle}
                />
              </li>
              <li>
                <div>{this.state.email}</div>
              </li>
            </ul>
          </div>
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
          userGames={this.state.userGames}
          updateGameNameCallbackFunction={this.updateGameNameCallbackFunction}
          handleError={this.handleError} />
        <CreateGame
          parentCallback={this.createGameCallbackFunction}
          modalOpen={this.state.modalOpen}
          handleError={this.handleError} />
      </div>
    )
  }
}

export default User;
