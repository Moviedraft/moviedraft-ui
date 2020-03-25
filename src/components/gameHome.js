import React, { Component } from 'react';
import '../styles/gameHome.css'

class GameHome extends Component {
  _dataLoaded = false
  _columnNames = ['Rank', 'Player', 'Total Gross', 'Total Spent', 'Movies Purchased']
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
      <table id='playerTable'>
        <thead>
          <tr>
            {this._columnNames.map((columnName, i) => (
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
    )
  }

  render() {
    if (!this._dataLoaded) {
      this.fetchPlayers()
      this._dataLoaded = true
    }

    if (this._dataLoaded) {
      return (
        <div>
          {this.renderPlayers()}
        </div>
      )
    }

    return null
  }
}

export default GameHome;
