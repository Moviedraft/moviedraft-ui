import React, { Component } from 'react';
import '../styles/gameHome.css'

class GameHome extends Component {
  _dataLoaded = false
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
    fetch('https://api-dev.couchsports.ca/games/' + this.props.gameId + '/players', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'GET'
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        let sortedPlayers = jsonResponse.players.sort((a, b) => b.totalGross - a.totalGross)
        this.setState({players: sortedPlayers})
      }
    })
    .catch(error => console.log(error))
  }

  renderPlayers() {
    return (
      <div>
        <h2>Player Rankings</h2>
        <table className='playerTable'>
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
                <td title='movies purchased'>{player.moviesPurchasedTitles.join(', ')}</td>
              </tr>))}
          </tbody>
        </table>
        <br/>
        <h2>Value Rankings</h2>
        <table
          className='playerTable'
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
    if (!this._dataLoaded) {
      this.fetchPlayers()
      this._dataLoaded = true
    }

    if (this._dataLoaded) {
      return (
        <div id='gameHomeDiv'>
          {this.renderPlayers()}
        </div>
      )
    }

    return null
  }
}

export default GameHome;
