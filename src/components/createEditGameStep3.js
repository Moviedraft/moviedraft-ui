import React, { Component } from 'react';
import Rules from './rules.js'

class CreateEditGameStep3 extends Component {
  constructor(props){
    super(props)
    this.state = {
    }

    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.renderRules = this.renderRules.bind(this)
  }

  handleCheckbox(event) {
    event.target = {type:'boolean', value:!this.props.playWithRules, name:event.target.name}
    this.props.handleChange(event)
  }

  renderRules() {
    return !this.props.playWithRules ?
      null
      :
      <Rules
        handleChange={this.props.handleChange}
        grossCapRule={this.props.grossCapRule}
        valueMultiplierRule={this.props.valueMultiplierRule} />
  }

  render() {
    if (this.props.currentStep !== 3) {
      return null
    }

    return (
      <div className='form-group'>
        <input
          type='checkbox'
          id='playWithRules'
          name='playWithRules'
          checked={this.props.playWithRules}
          onChange={this.handleCheckbox} />
        <label htmlFor='playWithRules'>
          Do you want to play with additional rules?
        </label>
        {this.renderRules()}
      </div>
    )
  }
}

export default CreateEditGameStep3
