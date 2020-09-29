import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import '../styles/global.css'

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

    return (
      <Form>
        <Form.Group>
          <Form.Label>Game Name</Form.Label>
          <Form.Control
            placeholder='Game Name'
            id='gameName'
            name='gameName'
            value={this.props.gameName}
            onChange={this.props.handleChange}
          />
          <Form.Text className='text-muted'>
            Enter the name you would like to call your game.
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Auction Dollars</Form.Label>
            <div className='input-group-prepend'>
              <span className='input-group-text'>$</span>
              <Form.Control
                className='number-input-field'
                id='auctionDollars'
                name='auctionDollars'
                type='number'
                min='1'
                value={this.props.auctionDollars}
                onChange={this.props.handleChange}
                onKeyPress={this.handleKeyPress}
              />
          </div>
          <Form.Text className='text-muted'>
            Enter the amount of fake auction dollars you would like players to start with.
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Minimum Bid</Form.Label>
            <div className='input-group-prepend'>
              <span className='input-group-text'>$</span>
              <Form.Control
                className='number-input-field'
                id='minimumBid'
                name='minimumBid'
                type='number'
                min='1'
                max={this.props.auctionDollars}
                value={this.props.minimumBid}
                onChange={this.props.handleChange}
                onKeyPress={this.handleKeyPress}
              />
          </div>
          <Form.Text className='text-muted'>
            Enter the minimum bid for each movie.
          </Form.Text>
        </Form.Group>
      </Form>
    )
  }
}

export default CreateEditGameStep1
