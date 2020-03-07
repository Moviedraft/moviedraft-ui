import React, { Component } from 'react';
import '../styles/rules.css'
import GrossCapRule from './grossCapRule.js'
import ValueMultiplierRule from './valueMultiplierRule.js'

class Rules extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div id='rulesWrapper'>
        <GrossCapRule
          handleChange={this.props.handleChange}
          grossCapRule={this.props.grossCapRule} />
        <ValueMultiplierRule
          handleChange={this.props.handleChange}
          valueMultiplierRule={this.props.valueMultiplierRule} />
      </div>
    )
  }
}

export default Rules
