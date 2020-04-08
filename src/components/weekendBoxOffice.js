import React, { Component } from 'react';
import '../styles/weekendBoxOffice.css'

class WeekendBoxOffice extends Component {
  _weekendBoxOfficeLoaded = false
  _weekendBoxOfficeColumnNames = ['Rank', 'Title', 'Weekend Gross', 'Owner', 'Purchase Price', 'Total Gross']
  _formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  constructor(props){
    super(props)
    this.state = {
      weekend: []
    }

    this.fetchWeekend = this.fetchWeekend.bind(this)
    this.renderWeekendBoxOffice = this.renderWeekendBoxOffice.bind(this)
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

  renderWeekendBoxOffice() {
    return (
      <div>
        <h2>Weekend Box Office</h2>
        <table
          id='weekendBoxOfficeTable'>
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
              <tr
                key={movie.id}
                openingweekend={movie.openingWeekend.toString()}
              >
                <td title='rank'>{++i}</td>
                <td title='title'>{movie.title}</td>
                <td title='weekend gross'>{this._formatter.format(movie.weekendGross)}</td>
                <td title='owner'>{movie.owner ?? '-'}</td>
                <td title='purchase price'>{this._formatter.format(movie.purchasePrice)}</td>
                <td title='total gross'>{this._formatter.format(movie.totalGross)}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    if (!this._weekendBoxOfficeLoaded) {
      this.fetchWeekend()
      this._weekendBoxOfficeLoaded = true
    }

    if (this._weekendBoxOfficeLoaded) {
      return (
        <div>
          {this.renderWeekendBoxOffice()}
        </div>
      )
    }

    return null
  }
}

export default WeekendBoxOffice;
