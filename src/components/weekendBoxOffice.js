import React, { Component } from 'react'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/weekendBoxOffice.css'
import '../styles/global.css'

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

  componentDidMount() {
    this.fetchWeekend()
  }

  fetchWeekend() {
    apiGet('games/' + this.props.gameId + '/weekend')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to load weekend box office. Please refresh and try again.')
      } else {
        this.setState({weekend: data.weekendBoxOffice})
        this.props.updateComponentLoadedFlag(this.props.componentName)
      }
    })
  }

  renderWeekendBoxOffice() {
    return (
      <div>
        <h2>Weekend Box Office</h2>
        <table className='responsive-table'>
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
                <td title='purchase price'>{movie.purchasePrice > 0 ? this._formatter.format(movie.purchasePrice) : '-'}</td>
                <td title='total gross'>{this._formatter.format(movie.totalGross)}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
        <div>
          {this.renderWeekendBoxOffice()}
        </div>
      )
  }
}

export default WeekendBoxOffice;
