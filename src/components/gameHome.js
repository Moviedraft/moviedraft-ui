import React, { Component } from 'react';
import '../styles/gameHome.css'

class GameHome extends Component {
  _dataLoaded = false
  _playerColumnNames = ['Rank', 'Player', 'Total Gross', 'Total Spent', 'Movies Purchased']
  _valueColumnNames = ['Rank', 'Player', 'Value']
  _weekendBoxOfficeColumnNames = ['Rank', 'Title', 'Weekend Gross', 'Owner', 'Purchase Price', 'Total Gross', 'Note']
  _formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  constructor(props){
    super(props)
    this.state = {
      players: [],
      weekend: []
    }

    this.fetchPlayers = this.fetchPlayers.bind(this)
    this.fetchWeekend = this.fetchWeekend.bind(this)
    this.renderPlayers = this.renderPlayers.bind(this)
    this.renderWeekendBoxOffice = this.renderWeekendBoxOffice.bind(this)
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

  fetchWeekend() {
    fetch('https://api-dev.couchsports.ca/games/' + this.props.gameId + '/weekend', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'GET'
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        this.setState({weekend: jsonResponse.weekendBoxOffice})
      }
    })
    .catch(error => console.log(error))
  }

  renderPlayers() {
    return (
      <div>
        <h2>Player Rankings</h2>
        <table className='gameTable'>
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
          className='gameTable'
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

  renderWeekendBoxOffice() {
    return (
      <div>
        <h2>Weekend Box Office</h2>
        <table
          className='gameTable'>
          <thead>
            <tr>
              {this._weekendBoxOfficeColumnNames.map((columnName, i) => (
                <th key={i}>
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.weekend.map((movie, i) => (
              <tr key={movie.id}>
                <td title='rank'>{++i}</td>
                <td title='title'>{movie.title}</td>
                <td title='weekend gross'>{this._formatter.format(movie.weekendGross)}</td>
                <td title='owner'>{movie.owner ?? '-'}</td>
                <td title='purchase price'>{this._formatter.format(movie.purchasePrice)}</td>
                <td title='total gross'>{this._formatter.format(movie.totalGross)}</td>
                <td title='note'>{movie.note ?? '-'}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    if (!this._dataLoaded) {
      this.fetchPlayers()
      this.fetchWeekend()
      this._dataLoaded = true
    }

    if (this._dataLoaded) {
      return (
        <div id='gameHomeDiv'>
          {this.renderPlayers()}
          {this.renderWeekendBoxOffice()}
        </div>
      )
    }

    return null
  }
}

export default GameHome;
