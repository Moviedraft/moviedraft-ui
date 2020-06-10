import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/gameHome.css'
import GamePlayers from './gamePlayers.js'
import WeekendBoxOffice from './weekendBoxOffice.js'
import FlavorText from './flavorText.js'
import UpcomingMovies from './upcomingMovies.js'
import Poll from './poll.js'
import Chat from './chat.js'

class GameHome extends Component {
  _userLoaded = false
  constructor(props){
    super(props)
    this.state = {
      userId: ''
    }

    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
  }

  fetchCurrentUser() {
    apiGet('users/current')
    .then((data) => {
      if (data === null) {
        this.props.handleError('Unable to load your user information. Please refresh and try again.')
      } else {
        this.setState({userId: data.id})
      }
    })
  }

  render() {
    if (!this._userLoaded) {
      this.fetchCurrentUser()
      this._userLoaded = true
    }

    return this._userLoaded ? (
      <div>
        <div id='gameHomeDiv'>
          <GamePlayers
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <WeekendBoxOffice
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <FlavorText
            flavorType='weekend'
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <UpcomingMovies
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <FlavorText
            flavorType='upcoming'
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <Poll
            gameId={this.props.gameId}
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            handleError={this.props.handleError} />
        </div>
        <Chat
          gameId={this.props.gameId + '-game'} />
      </div>
    ) : (
      null
    )
  }
}

export default GameHome;
