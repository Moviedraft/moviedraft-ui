import React, { Component } from 'react'
import moment from 'moment'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/gamePlayers.css'
import '../styles/global.css'

class GamePlayers extends Component {
  _playersLoaded = false
  _playerColumnNames = ['Rank', 'Player', 'Total Earnings', 'Movie Gross', 'Bonus Earnings', 'Total Spent', 'Movies Purchased']
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
        let sortedPlayers = data.players.sort((a, b) => (b.totalGross + (b.bonusInMillions * 1000000)) - (a.totalGross + (a.bonusInMillions * 1000000)))
        this.setState({players: sortedPlayers})
        this.props.updateComponentLoadedFlag(this.props.componentName)
      }
    })
  }

  renderPlayers() {
    return (
      <div>
        <h2>Player Rankings</h2>
        <table className='responsive-table responsive-table-narrow'>
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
                <td title='rank' className='vertical-align-top'>{++i}</td>
                <td title='player' className='vertical-align-top'>{player.userHandle}</td>
                <td title='total earnings' className='vertical-align-top'>{this._formatter.format(player.totalGross + (player.bonusInMillions * 1000000))}</td>
                <td title='movie gross' className='vertical-align-top'>{this._formatter.format(player.totalGross)}</td>
                <td title='bonus earnings' className='vertical-align-top'>{this._formatter.format(player.bonusInMillions * 1000000)}</td>
                <td title='total spent' className='vertical-align-top'>{this._formatter.format(player.totalSpent)}</td>
                <td title='movies purchased'>
                  { !player.movies.length ? '-' :
                      player.movies
                      .sort((movie1, movie2) => moment(movie1.releaseDate) > moment(movie2.releaseDate) ? 1 : -1)
                      .map(movie => {
                        return (
                          <div key={player.id + movie.title}>
                            { moment(movie.releaseDate).isBetween(this.props.startDate, this.props.endDate) ?
                              movie.title + ' ($' + movie.cost + ')' :
                              'REMOVED - ' + movie.title + ' ($' + movie.cost + ')' }
                          </div>
                        )
                      })
                  }
                </td>
              </tr>))}
          </tbody>
        </table>
        <br/>
        <h2>Value Rankings</h2>
        <table
          className='responsive-table'
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
