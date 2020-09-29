import React, { Component } from 'react'
import { Link } from '@reach/router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import moment from 'moment'
import { apiGet, apiPost, apiDelete } from '../utilities/apiUtility.js'
import EditGame from './editGame.js'
import '../styles/userGames.css'
import '../styles/global.css'

class UserGames extends Component {
  constructor(props){
    super(props)
    this.state = {
      editModalOpen: false,
      gameToEdit: null
    }

    this.sendData = this.sendData.bind(this)
    this.onClick = this.onClick.bind(this)
    this.getGame = this.getGame.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
    this.editGameCallbackFunction = this.editGameCallbackFunction.bind(this)
    this.renderDeleteButton = this.renderDeleteButton.bind(this)
    this.renderGamesPlaying = this.renderGamesPlaying.bind(this)
    this.renderGamesInvited = this.renderGamesInvited.bind(this)
  }

  sendData(gameId) {
    this.props.parentCallback(gameId);
  }

  onClick(gameId) {
    apiPost(`games/${gameId}/join`, '')
    .then(data => {
      if (data == null) {
        this.props.handleError('Unable to join game. Please try again or contact your game commissioner.')
      } else {
        this.sendData(gameId)
      }
    })
  }

  getGame(gameId) {
    apiGet(`games/${gameId}`)
    .then(data => {
      if (data === null) {
        this.props.handleError(`Unable to retrieve gameId: ${gameId}. Please refresh and try again.`)
      } else if(data.hasOwnProperty('_id')) {
        this.setState({gameToEdit: data})
        this.setState({editModalOpen: true})
        console.log(this.state.editModalOpen)
      }
    })
  }

  deleteGame(gameId) {
    apiDelete(`games/${gameId}`)
    .then(data => {
      if (data === null) {
        this.props.handleError(`Unable to delete gameId: ${gameId}. Please refresh and try again.`)
      } else {
        this.props.deleteGameCallbackFunction(gameId)
      }
    })
  }

  renderEditButton(commissionerId, gameId, auctionDate) {
    return this.props.userId === commissionerId && moment() < moment(auctionDate)?
      (
        <Button
          variant='outlone'
          className='icon-buttons'
          onClick={() => { this.getGame(gameId) }}
        >
          <i className='material-icons icons'>border_color</i>
        </Button>
      ) : (
        null
      )
  }

  editGameCallbackFunction(editModalOpen) {
    this.setState({editModalOpen: editModalOpen})
  }

  renderDeleteButton(commissionerId, gameId) {
    return this.props.userId === commissionerId ?
      (
        <Button
          variant='outlone'
          className='icon-buttons'
          onClick={() => this.deleteGame(gameId)}>
            <i className='material-icons icons'>clear</i>
        </Button>
      ) : (
        null
      )
  }

  renderGamesPlaying(games) {
    return (
      <div>
        {games.map((game, i) => {
          return game.joined ? (
            <div
              className='user-game-div'
              key={i}
            >
              <Link
                to={`/games/${game.game_id}`}
                state={{gameId: `${game.game_id}`}}>
                {game.gameName}
              </Link>
              {this.renderEditButton(game.commissioner_id, game.game_id, game.auctionDate)}
              {this.renderDeleteButton(game.commissioner_id, game.game_id)}
            </div>
          ) : (
            null
          )
        })}
      </div>
    )
  }

  renderGamesInvited(games) {
    return (
      <div>
        {games.map((game, i) => {
          return !game.joined ? (
            <div
              className='user-game-div'
              key={i}>
              <span>{game.gameName}</span>
              <Button
                variant='outline'
                className='icon-buttons'
                onClick={() => this.onClick(game.game_id)}
              >
                <i className='material-icons icons'>person_add_alt_1</i>
              </Button>
            </div>
          ) : (
            null
          )
        })}
      </div>
    )
  }

  renderEditGameModal() {
    return this.state.editModalOpen ?
      <EditGame
        parentCallback={this.editGameCallbackFunction}
        modalOpen={this.state.editModalOpen}
        game={this.state.gameToEdit}
        handleError={this.props.handleError}
        updateGameNameCallbackFunction={this.props.updateGameNameCallbackFunction} />
      :
      null
  }

  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col sm={12} md={6}>
              <div className='userGameContainer'>
                <h3 id='playingGameHeader'>Games Playing</h3>
                {this.renderGamesPlaying(this.props.userGames)}
              </div>
            </Col>
            <Col sm={12} md={6}>
              <div className='userGameContainer'>
                <h3 id='invitedGameHeader'>Games Invited</h3>
                {this.renderGamesInvited(this.props.userGames)}
              </div>
            </Col>
          </Row>
        </Container>
        {this.renderEditGameModal()}
      </div>
    )
  }
}

export default UserGames;
