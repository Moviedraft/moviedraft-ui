import React, { Component } from 'react';
import moment from 'moment';
import Header from '../components/header.js'
import AuctionHome from './auctionHome.js'
import GameHome from './gameHome.js'

class Game extends Component {
  _gameRetrieved = false
  constructor(props){
    super(props)
    this.state = {
      gameId: this.props.gameId,
      auctionDate: '',
      movies: [],
      commissionerId: '',
      auctionComplete: false,
      loaded: false
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
      this.setState({auctionItemsExpireInSeconds: data.auctionItemsExpireInSeconds})
      this.setState({loaded: true})
      });
  }

  renderAuctionHome() {
    return <AuctionHome
      parentCallback={this.setAuctionComplete}
      movies={this.state.movies}
      gameId={this.state.gameId}
      commissionerId={this.state.commissionerId}
      auctionItemsExpireInSeconds={this.state.auctionItemsExpireInSeconds}
      auctionDate={this.state.auctionDate} />
  }

  renderGameHome() {
    return <GameHome
      gameId={this.state.gameId} />
  }

  render() {
    if (!this._gameRetrieved) {
      this.fetchGame()
      this._gameRetrieved = true
    }

    if (this._gameRetrieved && this.state.loaded) {
      return this.state.auctionComplete ?
      (
        <div>
          <Header />
          <div>
            {this.renderGameHome()}
          </div>
        </div>
      ) :
      (
        <div>
          <Header />
          <div>
            {this.renderAuctionHome()}
          </div>
        </div>
      )
    }

    return null
  }
}

export default Game;
