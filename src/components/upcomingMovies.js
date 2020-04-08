import React, { Component } from 'react';
import '../styles/upcomingMovies.css';
import moment from 'moment';

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
    let startDate = moment().format();
    let endDate = moment().startOf('isoWeek').add(1, 'week').format();

    fetch('https://api-dev.couchsports.ca/movies?startDate=' + startDate + '&endDate=' + endDate, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'GET'
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        jsonResponse.movies.forEach((movie) => {
          let bid = this.fetchBid(this.props.gameId, movie.id)
          if (bid) {
            let upcomingMovie = {
              id: movie.id,
              title: movie.title,
              releaseDate: movie.releaseDate,
              owner: bid.userHandle,
              purchasePrice: bid.purchasePrice
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
        });
      }
    })
    .catch(error => console.log(error))
  }

  fetchBid(gameId, movieId) {
    fetch('https://api-dev.couchsports.ca/bids/' + gameId + '/' + movieId, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'GET'
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        return jsonResponse
      }

      return null
    })
    .catch(error => console.log(error))
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
