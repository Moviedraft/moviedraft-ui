import React, { Component } from 'react'
import moment from 'moment'
import { apiGet } from '../utilities/apiUtility.js'
import Header from '../components/header.js'
import AuctionHome from './auctionHome.js'
import GameHome from './gameHome.js'
import Error from './error.js'

class Game extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameName: '',
      gameId: this.props.gameId,
      auctionDate: '',
      auctionItemsExpireInSeconds: 0,
      dollarSpendingCap: 0,
      startDate: '',
      endDate: '',
      movies: [],
      commissionerId: '',
      currentUser: null,
      auctionComplete: false,
      userLoaded: false,
      gameLoaded: false,
      errorMessage: ''
    }

    this.handleError = this.handleError.bind(this)
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
    this.fetchGame = this.fetchGame.bind(this)
    this.renderAuctionHome = this.renderAuctionHome.bind(this)
  }

  handleError(message) {
    this.setState({errorMessage: message})
  }

  componentDidMount() {
    this.fetchCurrentUser()
    this.fetchGame()
  }

  fetchCurrentUser() {
    apiGet('users/current')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to load your user information. Please refresh and try again.')
      } else {
        let userStates = {
          currentUser: data,
          userLoaded: true
        }
        this.setState(userStates)
      }
    })
  }

  fetchGame() {
    apiGet('games/' + this.state.gameId)
    .then(data => {
      if (data === null) {
        this.handleError('Unable to load game. Please refresh and try again.')
      } else {
        let gameStates = {
          gameName: data.gameName,
          auctionDate: moment(data.auctionDate),
          movies: data.movies.sort((movie1, movie2) => {
            if (moment(movie1.releaseDate) > moment(movie2.releaseDate)) return 1
            if (moment(movie1.releaseDate) < moment(movie2.releaseDate)) return -1
            if (movie1.title > movie2.title) return 1
            if (movie1.title < movie2.title) return -1
            return 1
          }),
          auctionComplete: data.auctionComplete,
          commissionerId: data.commissionerId,
          auctionItemsExpireInSeconds: data.auctionItemsExpireInSeconds,
          dollarSpendingCap: data.dollarSpendingCap,
          startDate: data.startDate,
          endDate: data.endDate,
          gameLoaded: true
        }
        this.setState(gameStates)
      }
    })
  }

  renderAuctionHome() {
    return <AuctionHome
      movies={this.state.movies}
      gameId={this.state.gameId}
      currentUser={this.state.currentUser}
      commissionerId={this.state.commissionerId}
      auctionItemsExpireInSeconds={this.state.auctionItemsExpireInSeconds}
      auctionDate={this.state.auctionDate}
      dollarSpendingCap={this.state.dollarSpendingCap}
      handleError={this.handleError} />
  }

  renderGameHome() {
    return <GameHome
      gameId={this.state.gameId}
      commissionerId={this.state.commissionerId}
      startDate={this.state.startDate}
      endDate={this.state.endDate}
      handleError={this.handleError} />
  }

  render() {
    if (this.state.errorMessage !== '') {
      return <Error errorMessage={this.state.errorMessage} />;
    }

    if (this.state.userLoaded && this.state.gameLoaded) {
      return this.state.auctionComplete ?
      (
        <div>
          <Header
            gameName={this.state.gameName}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            picture={this.state.currentUser.picture} />
          <div>
            {this.renderGameHome()}
          </div>
        </div>
      ) :
      (
        <div>
          <Header
            gameName={this.state.gameName}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            picture={this.state.currentUser.picture} />
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
