import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/gamePlayers.css'

class GamePlayers extends Component {
  _playersLoaded = false
  _playerColumnNames = ['Rank', 'Player', 'Total Gross', 'Total Spent', 'Movies Purchased']
  _valueColumnNames = ['Rank', 'Player', 'Value']
  _formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  constructor(props){
    super(props)
    this.state = {
      players: []
    }

    this.fetchPlayers = this.fetchPlayers.bind(this)
    this.renderPlayers = this.renderPlayers.bind(this)
  }

  fetchPlayers() {
    apiGet('games/' + this.props.gameId + '/players')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to retrieve player information. Please refresh and try again.')
      } else {
        let sortedPlayers = data.players.sort((a, b) => b.totalGross - a.totalGross)
        this.setState({players: sortedPlayers})
        this.props.updateComponentLoadedFlag(this.props.componentName)
      }
    })
  }

  renderPlayers() {
    return (
      <div>
        <h2>Player Rankings</h2>
        <table className='playersTable'>
          <thead>
            <tr>
              {this._playerColumnNames.map((columnName, i) => (
                <th key={i}>
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.players.map((player, i) => (
              <tr key={player.id}>
                <td title='rank'>{++i}</td>
                <td title='player'>{player.userHandle}</td>
                <td title='total gross'>{this._formatter.format(player.totalGross)}</td>
                <td title='total spent'>{this._formatter.format(player.totalSpent)}</td>
                <td title='movies purchased'>{player.movies.map(movie => { return movie.title + ' ($' + movie.cost + ')'}).reduce((prev, curr) => [prev, ', ', curr])}</td>
              </tr>))}
          </tbody>
        </table>
        <br/>
        <h2>Value Rankings</h2>
        <table
          className='playersTable'
          id='valueTable'>
          <thead>
            <tr>
              {this._valueColumnNames.map((columnName, i) => (
                <th key={i}>
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.players.map((player, i) => (
              <tr key={player.id}>
                <td title='rank'>{++i}</td>
                <td title='player'>{player.userHandle}</td>
                <td title='value'>{this._formatter.format(player.value)}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    if (!this._playersLoaded) {
      this.fetchPlayers()
      this._playersLoaded = true
    }

    if (this._playersLoaded) {
      return (
        <div>
          {this.renderPlayers()}
        </div>
      )
    }

    return null
  }
}

export default GamePlayers;
