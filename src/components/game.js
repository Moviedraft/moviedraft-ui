import React, { Component } from 'react';
import moment from 'moment';
import AuctionHome from './auctionHome.js'

class Game extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameId: this.props.gameId,
      auctionDate: '',
      movies: []
    }

    this.renderGamePage = this.renderGamePage.bind(this)
  }

  componentDidMount() {
    fetch('https://api-dev.couchsports.ca/games/' + this.state.gameId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({auctionDate: moment(data.auctionDate)})
      this.setState({movies: data.movies})
      });
  }

  renderGamePage() {
    if(moment() < this.state.auctionDate){
      return <AuctionHome
        movies={this.state.movies}
        gameId={this.state.gameId} />
    }
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
