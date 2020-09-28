import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
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
      <div>
        <Form.Group>
          <GrossCapRule
            handleChange={this.props.handleChange}
            grossCapRule={this.props.grossCapRule} />
        </Form.Group>
        <Form.Group>
          <ValueMultiplierRule
            handleChange={this.props.handleChange}
            valueMultiplierRule={this.props.valueMultiplierRule} />
        </Form.Group>
      </div>
    )
  }
}

export default Rules
