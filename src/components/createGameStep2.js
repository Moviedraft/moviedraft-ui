import React, { Component } from 'react';
import moment from 'moment';
import '../styles/createGameStep2.css'
import Movies from './movies.js'

class CreateGameStep2 extends Component {
    constructor(props){
      super(props)
      this.state = {
      }
    }

  render() {
    if (this.props.currentStep !== 2) {
      return null
    }

    return(
      <div id='createGameStep2Div' className='form-group'>
        <p>Choose the start, end and auction dates for your game as well as the movies.</p>
        <div id='startDateDiv'>
          <label htmlFor='startDate'>
            Start Date:
            </label>
          <input
            className='form-control'
            id='startDate'
            name='startDate'
            type='date'
            placeholder='YYYY-MM-DD'
            min={moment().add(1, 'days').format('YYYY-MM-DD')}
            value={this.props.startDate}
            onChange={this.props.handleChange} />
        </div>
        <div id='endDateDiv'>
          <label htmlFor='endDate'>
            End Date (at least three months after start date):
          </label>
          <input
            className='form-control'
            id='endDate'
            name='endDate'
            type='date'
            placeholder='YYYY-MM-DD'
            min={moment().add(3, 'M').format('YYYY-MM-DD')}
            value={this.props.endDate}
            onChange={this.props.handleChange} />
        </div>
        <div id='auctionDateDiv'>
          <label htmlFor='auctionDate'>
            Auction Date (must be before start date):
          </label>
          <input
            className='form-control'
            id='auctionDate'
            name='auctionDate'
            type='datetime-local'
            min={moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}
            max={moment(this.props.startDate).format('YYYY-MM-DDTHH:mm')}
            defaultValue={moment().add(7, 'days').format('YYYY-MM-DDTHH:mm')}
            onChange={this.props.handleChange} />
        </div>
        <div id='auctionItemExpiryDiv'>
          <label htmlFor='auctionItemExpiryTimeSeconds'>
            How long (in seconds) do you want the auction to last for each movie?
          </label>
          <input
            className='form-control'
            id='auctionItemExpiryTimeSeconds'
            name='auctionItemExpiryTimeSeconds'
            type='number'
            min='30'
            value={this.props.auctionItemExpiry}
            defaultValue='30'
            onChange={this.props.handleChange} />
        </div>
        <label htmlFor='Movies'>
          Select movies for your game (based on game start and end dates):
        </label>
        <Movies
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          movies={this.props.movies} />
      </div>
    )
  }
}

export default CreateGameStep2
