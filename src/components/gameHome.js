import React, { Component } from 'react';
import '../styles/gameHome.css'
import GamePlayers from './gamePlayers.js'
import WeekendBoxOffice from './weekendBoxOffice.js'
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
    fetch('https://api-dev.couchsports.ca/users/current', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({userId: data.id})
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
            gameId={this.props.gameId} />
          <WeekendBoxOffice
            gameId={this.props.gameId} />
          <UpcomingMovies
            gameId={this.props.gameId} />
          <Poll
            gameId={this.props.gameId}
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}/>
        </div>
        <Chat
          gameId={this.props.gameId + '-game'}/>
      </div>
    ) : (
      null
    )
  }
}

export default GameHome;
