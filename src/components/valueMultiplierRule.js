import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../styles/valueMultiplierRule.css'
import '../styles/global.css'

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
    event.target = {type:'boolean', value:!this.props.valueMultiplierRule.valueMultiplierActive, name:event.target.name}
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
    let grossEarnings = parseInt(movieValue * valueMultiplier) + parseInt(this.state.movieGross, 10)
    return (Math.round(grossEarnings * 100) / 100).toFixed(2);
  }

  updateValueMultiplierRule(event) {
    let valueMultiplierRule = this.props.valueMultiplierRule

    valueMultiplierRule[event.target.name] = event.target.type === 'number' ?
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

    return !this.props.valueMultiplierRule.valueMultiplierActive ?
      null :
      <Container fluid>
        <Row>
          <Form.Group>
            <Form.Text>
              Fields bordered in red are the fields that will be used to calculate the gross
              total of a movie for game purposes.
            </Form.Text>
            <Form.Text>
              The value multiplier rule rewards players who buy movies that earn high gross incomes
              for cheap prices during the auction. If a player's movie value (gross income / purchase price)
              meets or exceeds defined thresholds, a multiplier will be applied to their value and that value
              will be added to that movies gross total.
            </Form.Text>
            <Form.Text>
              For example, if a player purchases a movie for $10 and that movie earns $100,000,000, their value
              would be $10,000,000. If the "value multiplier lower threshold" was set to $8,000,000 that means
              once a movie earns $8,000,000 a multiplier of two will be applied to their value. the calculated bonus
              would be $20,000,000 and that bonus would be added to their movie's gross total.
            </Form.Text>
          </Form.Group>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Movie Gross Income</Form.Label>
                <div className='input-group-prepend'>
                  <span className='input-group-text'>$</span>
                  <Form.Control
                    className='number-input-field'
                    id='movieGross'
                    name='movieGross'
                    type='number'
                    min='0'
                    step='1000000'
                    value={this.state.movieGross}
                    onChange={this.updateMovieGross}
                  />
              </div>
              <Form.Text className='text-muted'>
                Adjust the movie domestic gross value.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Auction Purchase Price</Form.Label>
                <div className='input-group-prepend'>
                  <span className='input-group-text'>$</span>
                  <Form.Control
                    className='number-input-field'
                    id='purchasePrice'
                    name='purchasePrice'
                    type='number'
                    min='1'
                    step='0.5'
                    defaultValue={this.state.purchasePrice}
                    onChange={this.updatePurchasePrice}
                  />
              </div>
              <Form.Text className='text-muted'>
                Adjust the purchase price for this movie to calculate value.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Movie Value</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  readOnly
                  type='number'
                  placeholder={movieValue}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Value Multiplier Lower Threshold</Form.Label>
                <div className='input-group-prepend important-field'>
                  <span className='input-group-text'>$</span>
                  <Form.Control
                    className='number-input-field'
                    id='lowerThreshold'
                    name='lowerThreshold'
                    type='number'
                    min='0'
                    step='1000000'
                    defaultValue={this.props.valueMultiplierRule.lowerThreshold}
                    onChange={event => {
                      event.target = {type:event.target.type, value:event.target.value, name:'lowerThreshold'}
                      this.updateValueMultiplierRule(event)
                      }}
                  />
              </div>
              <Form.Text className='text-muted'>
                Adjust the lower threshold for when the lower value multiplier comes into effect.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Value Multiplier Upper Threshold</Form.Label>
                <div className='input-group-prepend important-field'>
                  <span className='input-group-text'>$</span>
                  <Form.Control
                    className='number-input-field'
                    id='upperThreshold'
                    name='upperThreshold'
                    type='number'
                    min='0'
                    step='1000000'
                    defaultValue={this.props.valueMultiplierRule.upperThreshold}
                    onChange={event => {
                      event.target = {type:event.target.type, value:event.target.value, name:'upperThreshold'}
                      this.updateValueMultiplierRule(event)
                      }}
                  />
              </div>
              <Form.Text className='text-muted'>
                Adjust the upper threshold for when the lower value multiplier comes into effect.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Value Multiplier</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  readOnly
                  type='number'
                  placeholder={valueMultiplier}
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Total Gross Earnings</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  readOnly
                  type='number'
                  placeholder={totalEarnings}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
  }

  render() {
    return (
      <div>
        <Form.Group>
          <div id='valueMultiplierCheckWrapper'>
            <Form.Check
              label={this.props.valueMultiplierRule.displayTitle}
              id='valueMultiplierActive'
              name='valueMultiplierActive'
              checked={this.props.valueMultiplierRule.valueMultiplierActive}
              onChange={this.handleCheckbox}
            />
          </div>
        </Form.Group>
        {this.renderValueMultiplierRule()}
      </div>
    )
  }
}

export default valueMultiplierRule;
