import React, { Component } from 'react';
import moment from 'moment';
import AuctionHome from './auctionHome.js'

class Game extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameId: this.props.gameId,
      auctionDate: '',
      movies: [],
      commissionerId: '',
      auctionComplete: false
    }

    this.completeAuction = this.completeAuction.bind(this)
    this.fetchGame = this.fetchGame.bind(this)
    this.renderGamePage = this.renderGamePage.bind(this)
  }

  componentDidMount() {
    this.fetchGame()
  }

  completeAuction(auctionComplete) {
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
      this.setState({commissionerId: data.commissionerId})
      this.setState({auctionComplete: data.auctionComplete})
      });
  }

  renderGamePage() {
    return this.state.auctionComplete ?
      (
        <div>
          THIS IS THE GAME PAGE!!!!!
        </div>
      ) : (
        <AuctionHome
          parentCallback={this.completeAuction}
          movies={this.state.movies}
          gameId={this.state.gameId}
          commissionerId={this.state.commissionerId} />
      )
  }

  render() {
    return (
      <div>
        {this.renderGamePage()}
      </div>
    )
  }
}

export default Game;
