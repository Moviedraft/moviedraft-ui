import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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

  renderNotice() {
    return (
      <div>
        <h3>NOTICE: </h3>
        Box office information is updated daily at approximately 12pm PST/PDT.
        Weekend box office information is updated on Mondays at approximately 12pm PST/PDT.
      </div>
    )
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
        <Container fluid>
          <Row>
            <Col>
              {this.renderNotice()}
            </Col>
          </Row>
          <Row>
            <Col>
              <GamePlayers
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='gamePlayersLoaded'
                gameId={this.props.gameId}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <WeekendBoxOffice
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='weekendBoxOfficeLoaded'
                gameId={this.props.gameId}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <FlavorText
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='weekendFlavorTextLoaded'
                flavorType='weekend'
                commissionerId={this.props.commissionerId}
                userId={this.state.userId}
                gameId={this.props.gameId}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <UpcomingMovies
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='upcomingMoviesLoaded'
                gameId={this.props.gameId}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <FlavorText
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='upcomingFlavorTextLoaded'
                flavorType='upcoming'
                commissionerId={this.props.commissionerId}
                userId={this.state.userId}
                gameId={this.props.gameId}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Poll
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='pollLoaded'
                gameId={this.props.gameId}
                commissionerId={this.props.commissionerId}
                userId={this.state.userId}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <SideBet
                updateComponentLoadedFlag={this.updateComponentLoadedFlag}
                componentName='pollLoaded'
                gameId={this.props.gameId}
                commissionerId={this.props.commissionerId}
                userId={this.state.userId}
                userHandle={this.state.userHandle}
                handleError={this.props.handleError} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Chat
                gameId={this.props.gameId + '-game'} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default GameHome;
