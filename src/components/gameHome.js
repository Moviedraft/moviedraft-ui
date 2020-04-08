import React, { Component } from 'react';
import '../styles/gameHome.css'
import GamePlayers from './gamePlayers.js'
import WeekendBoxOffice from './weekendBoxOffice.js'

class GameHome extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div id='gameHomeDiv'>
        <GamePlayers
          gameId={this.props.gameId} />
        <WeekendBoxOffice
          gameId={this.props.gameId} />
      </div>
    )
  }
}

export default GameHome;
