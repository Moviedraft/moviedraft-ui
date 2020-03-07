import React, { Component } from 'react';
import '../styles/valueMultiplierRule.css'

class valueMultiplierRule extends Component {
  constructor(props){
    super(props)
    this.state = {
      movieGross: 100000000,
      purchasePrice: 10,
      valueMultiplier: 1,
      movieValue: 0
    }

    this.updateMovieGross = this.updateMovieGross.bind(this)
    this.updatePurchasePrice = this.updatePurchasePrice.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.calculateMovieValue = this.calculateMovieValue.bind(this)
    this.calculateValueMultiplier = this.calculateValueMultiplier.bind(this)
    this.updateValueMultiplierRule = this.updateValueMultiplierRule.bind(this)
    this.renderValueMultiplierRule = this.renderValueMultiplierRule.bind(this)
  }

  updateMovieGross(event) {
    this.setState({movieGross: event.target.value})
  }

  updatePurchasePrice(event) {
    this.setState({purchasePrice: event.target.value})
  }

  handleCheckbox(event) {
    event.target = {type:'boolean', value:!this.props.valueMultiplierRule.active, name:event.target.name}
    this.updateValueMultiplierRule(event)
  }

  calculateMovieValue() {
    let movieValue = this.state.movieGross / this.state.purchasePrice
    let roundedMovieValue = (Math.round(movieValue * 100) / 100).toFixed(2)
    return roundedMovieValue
  }

  calculateValueMultiplier(movieValue) {
    let lowerThreshold = this.props.valueMultiplierRule.lowerThreshold
    let upperThreshold = this.props.valueMultiplierRule.upperThreshold

    return movieValue >= upperThreshold
      ? 3
      : movieValue < upperThreshold && movieValue >= lowerThreshold
        ? 2
        : 1
  }

  calculateValueMultiplierEarnings(movieValue, valueMultiplier) {
    let grossEarnings = movieValue * valueMultiplier + this.state.movieGross
    return (Math.round(grossEarnings * 100) / 100).toFixed(2);
  }

  updateValueMultiplierRule(event) {
    let valueMultiplierRule = this.props.valueMultiplierRule

    valueMultiplierRule[event.target.name] = event.target.type === "number" ?
        event.target.value.includes('.') ?
        parseFloat(event.target.value) :
        parseInt(event.target.value) :
      event.target.value

    event.target = {type:event.target.type, value:valueMultiplierRule, name:'valueMultiplierRule'}
    this.props.handleChange(event)
  }

  renderValueMultiplierRule() {
    const movieValue = this.calculateMovieValue()
    const valueMultiplier = this.calculateValueMultiplier(movieValue)
    const totalEarnings = this.calculateValueMultiplierEarnings(movieValue, valueMultiplier)

    return !this.props.valueMultiplierRule.active ?
      null :
      <div>
        <div className='rulesHeader'>
          <div className='rulesHeaderCell'>
            Movie gross income
          </div>
          <div className='rulesHeaderCell'>
            Auction purchase price
          </div>
          <div className='rulesHeaderCell'>
            Movie Value
          </div>
          <div className='rulesHeaderCell'>
            Value Multiplier lower Threshold
          </div>
          <div className='rulesHeaderCell'>
            Value Multiplier upper Threshold
          </div>
          <div className='rulesHeaderCell'>
            Value Multiplier
          </div>
          <div className='rulesHeaderCell'>
            Total Gross Earnings
          </div>
        </div>
        <div className='rulesValues'>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell valueMultiplierNumberInput"
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
                className="rulesCell valueMultiplierNumberInput"
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                defaultValue={this.state.purchasePrice}
                onChange={this.updatePurchasePrice} />
            </span>
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">
              ${movieValue}
            </span>
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell valueMultiplierNumberInput"
                id="lowerThreshold"
                name="lowerThreshold"
                type="number"
                defaultValue={this.props.valueMultiplierRule.lowerThreshold}
                onChange={event => {
                  event.target = {type:event.target.type, value:event.target.value, name:'lowerThreshold'}
                  this.updateValueMultiplierRule(event)
                  }} />
            </span>
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">$
              <input
                className="rulesCell valueMultiplierNumberInput"
                id="upperThreshold"
                name="upperThreshold"
                type="number"
                defaultValue={this.props.valueMultiplierRule.upperThreshold}
                onChange={event => {
                  event.target = {type:event.target.type, value:event.target.value, name:'upperThreshold'}
                  this.updateValueMultiplierRule(event)
                  }} />
            </span>
          </div>
          <div className='rulesCell'>
            {valueMultiplier}
          </div>
          <div className='rulesCell'>
            <span className="rulesCurrencyInput">
              ${totalEarnings}
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
            checked={this.props.valueMultiplierRule.active}
            onChange={this.handleCheckbox} />
          {this.props.valueMultiplierRule.ruleName.toUpperCase()}
        </div>
        {this.renderValueMultiplierRule()}
      </div>
    )
  }
}

export default valueMultiplierRule;
