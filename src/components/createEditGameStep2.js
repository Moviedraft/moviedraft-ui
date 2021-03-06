import React, { Component } from 'react'
import moment from 'moment'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Movies from './movies.js'

class CreateEditGameStep2 extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    if (this.props.currentStep !== 2) {
      return null
    }

    return (
      <div>
        <Form>
          <Form.Group>
            <Container>
              <Row>
                <Col xs={6}>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date'
                    id='startDate'
                    name='startDate'
                    placeholder='YYYY-MM-DD'
                    min={moment().format('YYYY-MM-DD')}
                    value={this.props.startDate}
                    onChange={this.props.handleChange}
                  />
                  <Form.Text className='text-muted'>
                    Choose the start date for your draft season.
                  </Form.Text>
                </Col>
                <Col xs={6}>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type='date'
                    id='endDate'
                    name='endDate'
                    placeholder='YYYY-MM-DD'
                    min={moment().add(3, 'M').format('YYYY-MM-DD')}
                    value={this.props.endDate}
                    onChange={this.props.handleChange}
                  />
                  <Form.Text className='text-muted'>
                    Choose the end date for your draft season.
                  </Form.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Auction Date</Form.Label>
                  <Form.Control
                    type='datetime-local'
                    id='auctionDate'
                    name='auctionDate'
                    min={moment().format('YYYY-MM-DDTHH:mm')}
                    max={moment(this.props.startDate).format('YYYY-MM-DDTHH:mm')}
                    value={moment(this.props.auctionDate).isValid() ?  moment(this.props.auctionDate).format('YYYY-MM-DDTHH:mm') : moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}
                    onChange={this.props.handleChange}
                    onKeyDown={e => { e.preventDefault() }}
                  />
                  <Form.Text className='text-muted'>
                    Choose the date and time you want to hold your auction.
                  </Form.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Auction Item Expiry (seconds)</Form.Label>
                  <Form.Control
                    type='number'
                    id='auctionItemExpiryTimeSeconds'
                    name='auctionItemExpiryTimeSeconds'
                    min='10'
                    max='60'
                    value={this.props.auctionItemExpiryTimeSeconds}
                    onChange={this.props.handleChange}
                    onKeyDown={e => { e.preventDefault() }}
                  />
                  <Form.Text className='text-muted'>
                    Choose how long (in seconds) you want the auction to last for each movie.
                  </Form.Text>
                </Col>
              </Row>
            </Container>
          </Form.Group>
        </Form>
        <Movies
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          movies={this.props.movies}
          handleError={this.props.handleError} />
      </div>
    )
  }
}

export default CreateEditGameStep2
