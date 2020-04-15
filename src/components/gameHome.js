import React, { Component } from 'react';
import '../styles/gameHome.css'
import GamePlayers from './gamePlayers.js'
import WeekendBoxOffice from './weekendBoxOffice.js'
import UpcomingMovies from './upcomingMovies.js'
import Poll from './poll.js'
import Chat from './chat.js'

class GameHome extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <div id='gameHomeDiv'>
          <GamePlayers
            gameId={this.props.gameId} />
          <WeekendBoxOffice
            gameId={this.props.gameId} />
          <UpcomingMovies
            gameId={this.props.gameId} />
          <Poll
            gameId={this.props.gameId}/>
        </div>
        <Chat
          gameId={this.props.gameId + '-game'}/>
      </div>
    )
  }
}

export default GameHome;
