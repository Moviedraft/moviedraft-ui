import React, { Component } from 'react';
import { Link } from '@reach/router'
import '../styles/userGames.css'

class UserGames extends Component {
  constructor(props){
    super(props)
    this.state = {
    }

    this.sendData = this.sendData.bind(this)
    this.onClick = this.onClick.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
    this.renderGameDivs = this.renderGameDivs.bind(this)
  }

  sendData(gameId) {
    this.props.parentCallback(gameId);
  }

  onClick(gameId) {
    fetch(`https://api-dev.couchsports.ca/games/${gameId}/join`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'POST',
      body: ''
    })
    .then(res => {
      if (res.ok) {
        this.sendData(gameId)
      }
    })
    .catch(error => console.log(error))
  }

  deleteGame(gameId) {
    fetch(`https://api-dev.couchsports.ca/games/${gameId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        this.props.deleteGameCallbackFunction(gameId)
      }
    })
    .catch(error => console.log(error))
  }

  renderDeleteButton(commissionerId, gameId) {
    return this.props.userId === commissionerId ?
      (
        <button
        id='deleteButton'
        onClick={() => this.deleteGame(gameId)}>
          <b>DELETE GAME</b>
        </button>
      ) : (
        null
      )
  }

  renderGameDivs(array) {
    return array.map(item =>
      item.joined ? (
        <div key={item.id} className='userGamesData'>
          <div className='playingGame'>
            <Link
              to={`/games/${item.game_id}`}
              state={{gameId: `${item.game_id}`}}>
              {item.gameName}
            </Link>
            {this.renderDeleteButton(item.commissioner_id, item.game_id)}
          </div>
          <div className='invitedGame'></div>
        </div>
      ) : (
        <div key={item.id}>
          <div className='playingGame'></div>
          <div className='invitedGame'>
            <div className='invitedGameRow'>
              {item.gameName}
              <button
              id='joinButton'
              onClick={() => this.onClick(item.game_id)}>
                <b>JOIN</b>
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  render() {
    return (
      <div id='userGames'>
        <div>
          <h3 id='playingGameHeader'>Games You are Playing</h3>
          <h3 id='invitedGameHeader'>Games You are Invited To</h3>
        </div>
        {this.renderGameDivs(this.props.userGames)}
      </div>
    )
  }
}

export default UserGames;
