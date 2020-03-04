import React, { Component } from 'react';

class CreateGameStep1 extends Component {
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
      <div className="form-group">
        <p>Choose a name for your game.</p>
        <label htmlFor="gameName">Game Name:</label>
        <input
          className="form-control"
          id="gameName"
          name="gameName"
          type="text"
          placeholder="Enter game name"
          value={this.props.gameName}
          onChange={this.props.handleChange} />
      </div>
    )
  }
}

export default CreateGameStep1
