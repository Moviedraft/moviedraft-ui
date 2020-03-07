import React, { Component } from 'react';
import '../styles/grossCapRule.css'

class GrossCapRule extends Component {
  constructor(props){
    super(props)
    this.state = {
      movieGross: this.props.grossCapRule.capValue + 10000000
    }

    this.updateMovieGross = this.updateMovieGross.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.calculateGrossCapEarnings = this.calculateGrossCapEarnings.bind(this)
    this.updateGrossCapRule = this.updateGrossCapRule.bind(this)
  }

  updateMovieGross(event) {
    this.setState({movieGross: event.target.value})
  }

  handleCheckbox(event) {
    event.target = {type:'boolean', value:!this.props.grossCapRule.active, name:event.target.name}
    this.updateGrossCapRule(event)
  }

  calculateGrossCapEarnings() {
    let grossEarnings =
      this.state.movieGross > this.props.grossCapRule.capValue ?
      (this.state.movieGross * this.props.grossCapRule.centsOnDollar + this.props.grossCapRule.baseValue) :
      this.state.movieGross

    return (Math.round(grossEarnings * 100) / 100).toFixed(2);
  }

  updateGrossCapRule(event) {
    let grossCapRule = this.props.grossCapRule

    grossCapRule[event.target.name] = event.target.type === "number" ?
        event.target.value.includes('.') ?
        parseFloat(event.target.value) :
        parseInt(event.target.value) :
      event.target.value

    event.target = {type:event.target.type, value:grossCapRule, name:'grossCapRule'}
    this.props.handleChange(event)
  }

  renderGrossCapRule() {
    return !this.props.grossCapRule.active ?
      null :
      <div>
        <div className='rulesHeader'>
          <div className='rulesHeaderCell'>
            Movie gross income
          </div>
          <div className='rulesHeaderCell'>
            Cap Value
          </div>
          <div className='rulesHeaderCell'>
            Cents on Dollar
          </div>
          <div className='rulesHeaderCell'>
            Total Gross Earnings
          </div>
        </div>
        <div className='rulesValues'>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell grossCapNumberInput"
                id="movieGross"
                name="movieGross"
                type="number"
                value={this.state.movieGross}
                onChange={this.updateMovieGross} />
            </span>
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell grossCapNumberInput"
                id="capValue"
                name="capValue"
                type="number"
                defaultValue={this.props.grossCapRule.capValue}
                onChange={event => {
                  event.target = {type:event.target.type, value:event.target.value, name:'capValue'}
                  this.updateGrossCapRule(event)
                  }} />
            </span>
            </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell grossCapNumberInput"
                id="centsOnDollar"
                name="centsOnDollar"
                type="number"
                defaultValue={this.props.grossCapRule.centsOnDollar}
                onChange={event => {
                  event.target = {type:event.target.type, value:event.target.value, name:'centsOnDollar'}
                  this.updateGrossCapRule(event)
                  }} />
            </span>
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">
              ${this.calculateGrossCapEarnings()}
            </span>
          </div>
        </div>
      </div>
  }

  render() {
    return (
      <div>
        <div className='rulesTitle'>
          <input
            type='checkbox'
            id='active'
            name='active'
            checked={this.props.grossCapRule.active}
            onChange={this.handleCheckbox} />
          {this.props.grossCapRule.ruleName.toUpperCase()}
        </div>
        {this.renderGrossCapRule()}
      </div>
    )
  }
}

export default GrossCapRule
