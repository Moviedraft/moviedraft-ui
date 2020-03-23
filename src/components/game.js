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
      commissionerId: '',
      auctionComplete: false
    }

    this.setAuctionComplete = this.setAuctionComplete.bind(this)
    this.fetchGame = this.fetchGame.bind(this)
    this.renderAuctionHome = this.renderAuctionHome.bind(this)
  }

  setAuctionComplete(auctionComplete) {
    this.setState({auctionComplete: auctionComplete})
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
      this.setState({commissionerId: data.commissionerId})
      this._gameRetrieved = true
      this._loaded = true
      });
  }

  renderAuctionHome() {
    return <AuctionHome
      parentCallback={this.setAuctionComplete}
      movies={this.state.movies}
      gameId={this.state.gameId}
      commissionerId={this.state.commissionerId} />
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
