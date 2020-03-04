import React, { Component } from 'react';
import '../styles/createGameStep2.css'

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
        <p>Choose the start and end date for your game.</p>
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
            value={this.props.startDate}
            onChange={this.props.handleChange} />
        </div>
        <div id='endDateDiv'>
          <label htmlFor='endDate'>
            End Date:
          </label>
          <input
            className='form-control'
            id='endDate'
            name='endDate'
            type='date'
            placeholder='YYYY-MM-DD'
            value={this.props.endDate}
            onChange={this.props.handleChange} />
        </div>
      </div>
    )
  }
}

export default CreateGameStep2
