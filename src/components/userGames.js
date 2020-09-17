import React, { Component } from 'react';
import { Link } from '@reach/router'
import moment from 'moment';
import { apiGet, apiPost, apiDelete } from '../utilities/apiUtility.js'
import EditGame from './editGame.js'
import '../styles/userGames.css'

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
    this.renderGameDivs = this.renderGameDivs.bind(this)
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
    console.log(commissionerId)
    console.log(gameId)
    console.log(auctionDate)
    console.log(this.props.userId)
    return this.props.userId === commissionerId && moment() < moment(auctionDate)?
      (
        <button
        className='adminButtons'
        onClick={() => { this.getGame(gameId) }}>
          <b>EDIT GAME</b>
        </button>
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
        <button
        className='adminButtons'
        onClick={() => this.deleteGame(gameId)}>
          <b>DELETE GAME</b>
        </button>
      ) : (
        null
      )
  }

  renderGameDivs(games) {
    return (
      <div>
        {this.renderGamesPlaying(games)}
        {this.renderGamesInvited(games)}
      </div>
    )
  }

  renderGamesPlaying(games) {
    return (
      <div className='playingGame'>
        {games.map((game, i) => {
          return game.joined ? (
            <div key={i}>
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
      <div className='playingGame'>
        {games.map((game, i) => {
          return !game.joined ? (
            <div key={i}>
              <span>{game.gameName}</span>
              <button
                id='joinButton'
                onClick={() => this.onClick(game.game_id)}
              >
                <b>JOIN</b>
              </button>
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
      <div id='userGames'>
        <div>
          <h3 id='playingGameHeader'>Games You are Playing</h3>
          <h3 id='invitedGameHeader'>Games You are Invited To</h3>
        </div>
        {this.renderGameDivs(this.props.userGames)}
        {this.renderEditGameModal()}
      </div>
    )
  }
}

export default UserGames;
