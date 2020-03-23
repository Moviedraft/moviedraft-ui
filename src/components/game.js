import React, { Component } from 'react';
import moment from 'moment';
import AuctionHome from './auctionHome.js'
import GameHome from './gameHome.js'

class Game extends Component {
  _gameRetrieved = false
  _loaded = false
  constructor(props){
    super(props)
    this.state = {
      gameId: this.props.gameId,
      auctionDate: '',
      movies: [],
      auctionComplete: false
    }

    this.fetchGame = this.fetchGame.bind(this)
    this.renderAuctionHome = this.renderAuctionHome.bind(this)
  }

  fetchGame() {
    fetch('https://api-dev.couchsports.ca/games/' + this.state.gameId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({auctionDate: moment(data.auctionDate)})
      this.setState({movies: data.movies})
      this.setState({auctionComplete: data.auctionComplete})
      this._gameRetrieved = true
      this._loaded = true
      });
  }

  renderAuctionHome() {
    return <AuctionHome
      movies={this.state.movies}
      gameId={this.state.gameId} />
  }

  renderGameHome() {
    return <GameHome
      movies={this.state.movies}
      gameId={this.state.gameId} />
  }

  render() {
    if (!this._gameRetrieved) {
      this.fetchGame()
    }

    if (this._loaded) {
      return this.state.auctionComplete ?
      (
        <div>
          {this.renderGameHome()}
        </div>
      ) :
      (
        <div>
          {this.renderAuctionHome()}
        </div>
      )
    }

    return null
  }
}

export default Game;
