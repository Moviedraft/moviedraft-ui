import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/upcomingMovies.css'
import moment from 'moment'

class UpcomingMovies extends Component {
  _upcomingMoviesRetrieved = false
  _upcomingMoviesColumnNames = ['Title', 'Release Date', 'Owner', 'Purchase Price']
  _formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  constructor(props){
    super(props)
    this.state = {
      upcomingMovies: []
    }

    this.fetchUpcomingMovies = this.fetchUpcomingMovies.bind(this)
    this.fetchBid = this.fetchBid.bind(this)
    this.renderUpcomingMovies = this.renderUpcomingMovies.bind(this)
  }

  fetchUpcomingMovies() {
    let startDate = moment().utc().startOf('isoWeek').add(4, 'day').format();
    let endDate = moment().utc().startOf('isoWeek').add(1, 'week').format();

    apiGet('movies?startDate=' + startDate + '&endDate=' + endDate)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to load upcoming movies. Please refresh and try again.')
      } else {
        data.movies.forEach((movie) => {
          this.fetchBid(this.props.gameId, movie)
        });
      }

      this.props.updateComponentLoadedFlag(this.props.componentName)
    })
  }

  fetchBid(gameId, movie) {
    apiGet('bids/' + gameId + '/' + movie.id)
    .then(data => {
      if (data) {
        let upcomingMovie = {
          id: movie.id,
          title: movie.title,
          releaseDate: movie.releaseDate,
          owner: data.userHandle,
          purchasePrice: data.bid
        }
        this.setState({
          upcomingMovies:[...this.state.upcomingMovies, upcomingMovie]
        });
      } else {
        let upcomingMovie = {
          id: movie.id,
          title: movie.title,
          releaseDate: movie.releaseDate,
          owner: null,
          purchasePrice: null
        }
        this.setState({
          upcomingMovies:[...this.state.upcomingMovies, upcomingMovie]
        });
      }
    })
  }

  renderUpcomingMovies() {
    return (
      <div>
        <h2>Upcoming Movies</h2>
        <table
          id='upcomingMoviesTable'>
          <thead>
            <tr>
              {this._upcomingMoviesColumnNames.map((columnName, i) => (
                <th key={i}>
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.upcomingMovies.map((movie) => (
              <tr key={movie.id}>
                <td title='title'>{movie.title}</td>
                <td title='release date'>{moment(movie.releaseDate).utc().format('YYYY-MM-DD')}</td>
                <td title='owner'>{movie.owner ?? '-'}</td>
                <td title='purchase price'>{this._formatter.format(movie.purchasePrice ?? '0')}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
      if (!this._upcomingMoviesRetrieved) {
        this.fetchUpcomingMovies()
        this._upcomingMoviesRetrieved = true
      }

      if (this._upcomingMoviesRetrieved) {
        return (
          <div>
            {this.renderUpcomingMovies()}
          </div>
        )
      }

      return null
  }
}

export default UpcomingMovies;
