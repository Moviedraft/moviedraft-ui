import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/gameHome.css'
import GamePlayers from './gamePlayers.js'
import WeekendBoxOffice from './weekendBoxOffice.js'
import FlavorText from './flavorText.js'
import UpcomingMovies from './upcomingMovies.js'
import Poll from './poll.js'
import SideBet from './sideBet.js'
import Chat from './chat.js'

class GameHome extends Component {
  constructor(props){
    super(props)
    this.state = {
      userId: '',
      userHandle: '',
      userLoaded: false,
      gamePlayersLoaded: false,
      weekendBoxOfficeLoaded: false,
      weekendFlavorTextLoaded: false,
      upcomingFlavorTextLoaded: false,
      upcomingMoviesLoaded: false,
      pollLoaded: false
    }

    this.updateComponentLoadedFlag = this.updateComponentLoadedFlag.bind(this)
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
  }

  componentDidMount() {
    this.fetchCurrentUser()
  }

  updateComponentLoadedFlag(componentName) {
    this.setState({[componentName]:true})
  }

  fetchCurrentUser() {
    apiGet('users/current')
    .then((data) => {
      if (data === null) {
        this.props.handleError('Unable to load your user information. Please refresh and try again.')
      } else {
        this.setState({userId: data.id})
        this.setState({userHandle: data.userHandle})
        this.setState({userLoaded: true})
      }
    })
  }

  render() {
    if (this.userLoaded === false ||
        this.gamePlayersLoaded === false ||
        this.weekendBoxOfficeLoaded === false ||
        this.weekendFlavorTextLoaded === false ||
        this.upcomingFlavorTextLoaded === false ||
        this.upcomingMoviesLoaded === false ||
        this.pollLoaded === false) {
      return null
    }

    return (
      <div>
        <div id='gameHomeDiv'>
          <GamePlayers
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='gamePlayersLoaded'
            gameId={this.props.gameId}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            handleError={this.props.handleError} />
          <WeekendBoxOffice
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='weekendBoxOfficeLoaded'
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <FlavorText
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='weekendFlavorTextLoaded'
            flavorType='weekend'
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <UpcomingMovies
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='upcomingMoviesLoaded'
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <FlavorText
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='upcomingFlavorTextLoaded'
            flavorType='upcoming'
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            gameId={this.props.gameId}
            handleError={this.props.handleError} />
          <Poll
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='pollLoaded'
            gameId={this.props.gameId}
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            handleError={this.props.handleError} />
          <SideBet
            updateComponentLoadedFlag={this.updateComponentLoadedFlag}
            componentName='pollLoaded'
            gameId={this.props.gameId}
            commissionerId={this.props.commissionerId}
            userId={this.state.userId}
            userHandle={this.state.userHandle}
            handleError={this.props.handleError} />
        </div>
        <Chat
          gameId={this.props.gameId + '-game'} />
      </div>
    )
  }
}

export default GameHome;
