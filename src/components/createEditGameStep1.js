import React, { Component } from 'react';
import '../styles/createEditGameStep1.css'

class CreateEditGameStep1 extends Component {
    constructor(props){
      super(props)
      this.state = {
      }
    }

  render() {
    if (this.props.currentStep !== 1) {
      return null
    }

    return(
      <div className='form-group'>
        <p>Choose a name for your game.</p>
        <label htmlFor='gameName'>Game Name:</label>
        <input
          className='form-control'
          id='gameName'
          name='gameName'
          type='text'
          placeholder='Enter game name'
          value={this.props.gameName}
          onChange={this.props.handleChange} />
        <p>Select the amount of fake dollars each player can auction with:</p>
        <label htmlFor='auctionDollars'>Auction Dollars:</label>
        <span className='currencyinput'>$
          <input
            className='form-control'
            id='auctionDollars'
            name='auctionDollars'
            type='number'
            min='0'
            value={this.props.auctionDollars}
            onChange={this.props.handleChange}
            onKeyPress={this.handleKeyPress} />
        </span>
      </div>
    )
  }
}

export default CreateEditGameStep1
