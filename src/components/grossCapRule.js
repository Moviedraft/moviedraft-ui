import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../styles/grossCapRule.css'
import '../styles/global.css'

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
    event.target = {type:'boolean', value:!this.props.grossCapRule.grossCapActive, name:event.target.name}
    this.updateGrossCapRule(event)
  }

  calculateGrossCapEarnings() {
    let grossEarnings =
      this.state.movieGross > this.props.grossCapRule.capValue ?
      (this.state.movieGross - this.props.grossCapRule.capValue) * this.props.grossCapRule.centsOnDollar + this.props.grossCapRule.capValue :
      this.state.movieGross

    return (Math.round(grossEarnings * 100) / 100).toFixed(2);
  }

  updateGrossCapRule(event) {
    let grossCapRule = this.props.grossCapRule

    grossCapRule[event.target.name] = event.target.type === 'number' ?
        event.target.value.includes('.') ?
        parseFloat(event.target.value) :
        parseInt(event.target.value) :
      event.target.value

    event.target = {type:event.target.type, value:grossCapRule, name:'grossCapRule'}
    this.props.handleChange(event)
  }

  renderGrossCapRule() {
    return !this.props.grossCapRule.grossCapActive ?
      null :
      <Container fluid>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Movie gross income</Form.Label>
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
          <Col>
            <Form.Label>Cap value</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  className='number-input-field'
                  id='capValue'
                  name='capValue'
                  type='number'
                  min='0'
                  step='1000000'
                  defaultValue={this.props.grossCapRule.capValue}
                  onChange={event => {
                    event.target = {type:event.target.type, value:event.target.value, name:'capValue'}
                    this.updateGrossCapRule(event)
                    }}
                />
            </div>
            <Form.Text className='text-muted'>
              Adjust the cap value for the threshold before a player earns diminishing returns.
            </Form.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Cents on Dollar</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  className='number-input-field'
                  id='centsOnDollar'
                  name='centsOnDollar'
                  type='number'
                  min='0'
                  step='0.01'
                  defaultValue={this.props.grossCapRule.centsOnDollar}
                  onChange={event => {
                    event.target = {type:event.target.type, value:event.target.value, name:'centsOnDollar'}
                    this.updateGrossCapRule(event)
                    }}
                />
            </div>
            <Form.Text className='text-muted'>
              Adjust the diminishing returns amount a player will recieve after the cap threshold has been reached.
            </Form.Text>
          </Col>
          <Col>
            <Form.Label>Total Gross Earnings</Form.Label>
              <div className='input-group-prepend'>
                <span className='input-group-text'>$</span>
                <Form.Control
                  readOnly
                  type='number'
                  placeholder={this.calculateGrossCapEarnings()}
                />
              </div>
          </Col>
        </Row>
      </Container>
  }

  render() {
    return (
      <div>
        <Form.Group>
          <div id='grossCapCheckWrapper'>
            <Form.Check
              label={this.props.grossCapRule.displayTitle}
              id='grossCapActive'
              name='grossCapActive'
              checked={this.props.grossCapRule.grossCapActive}
              onChange={this.handleCheckbox}
            />
          </div>
        </Form.Group>
        {this.renderGrossCapRule()}
      </div>
    )
  }
}

export default GrossCapRule
