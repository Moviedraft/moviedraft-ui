import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import moment from 'moment'
import { apiGet, apiPost, apiPatch } from '../utilities/apiUtility.js'
import '../styles/sideBet.css'
import '../styles/global.css'

class SideBet extends Component {
  _sideBetColumnNames = ['Player', 'Bet']
  _formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  constructor(props){
    super(props)
    this.state = {
      currentSideBet: null,
      previousSideBet: null,
      currentSideBetLoaded: false,
      previousSideBetLoaded: false,
      bet: 0,
      newSideBetMovieChoice: null,
      movies: [],
      prizeInMillions: 0,
      sideBetCloseDate: null,
      createSideBetModalOpen: false,
      error: ''
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseCreateSideBetModal = this.handleCloseCreateSideBetModal.bind(this)
    this.createSideBet = this.createSideBet.bind(this)
    this.fetchSideBet = this.fetchSideBet.bind(this)
    this.fetchMovies = this.fetchMovies.bind(this)
    this.submitBet = this.submitBet.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
  }

  componentDidMount() {
    this.fetchSideBet('current')
    this.fetchSideBet('previous')
  }

  handleCheckbox(event, movie) {
    if(event.target.checked) {
      this.setState({newSideBetMovieChoice: movie})
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.handleCloseCreateSideBetModal()
    }
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleCloseCreateSideBetModal() {
    this.setState({createSideBetModalOpen: false})
  }

  createSideBet() {
    let body = {
      'prizeInMillions': this.state.prizeInMillions,
      'movieId': this.state.newSideBetMovieChoice.id,
      'closeDate': moment(this.state.sideBetCloseDate).endOf('day').format()
    }

    apiPost(`games/${this.props.gameId}/sidebet`, body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to create side bet. Please refresh and try again.')
      } else {
        this.fetchSideBet('previous')
        this.setState({currentSideBet: data.sideBet})
        this.setState({currentSideBetLoaded: true})
        this.setState({createSideBetModalOpen: false})
      }
    })
  }

  fetchSideBet(status) {
    apiGet(`games/${this.props.gameId}/sidebet?status=${status}`)
    .then(data => {
      if (data !== null) {
        if (data.sideBet.status === 'current') {
          this.setState({currentSideBet: data.sideBet})
          this.setState({currentSideBetLoaded: true})
        }
        if (data.sideBet.status === 'previous') {
          this.setState({previousSideBet: data.sideBet})
          this.setState({previousSideBetLoaded: true})
        }

        this.props.updateComponentLoadedFlag(this.props.componentName)
      }
    })
  }

  fetchMovies() {
    let wednesday = 3
    let friday = 5
    let today = moment().isoWeekday()
    let startDate = null
    let endDate = null

    if (today <= wednesday) {
      startDate = moment().utc().isoWeekday(wednesday).startOf('day').format()
      endDate = moment().utc().isoWeekday(friday).startOf('day').format()
    } else if (today <= friday) {
      startDate = moment().utc().isoWeekday(friday).startOf('day').format()
      endDate = moment().utc().isoWeekday(friday).startOf('day').format()
    } else {
      startDate = moment().utc().add(1, 'weeks').isoWeekday(wednesday).startOf('day').format()
      endDate = moment().utc().add(1, 'weeks').isoWeekday(friday).startOf('day').format()
    }

    apiGet(`movies?startDate=${startDate}&endDate=${endDate}`)
    .then(data => {
      if (data === null) {
        this.props.handleError('Could not load movies. Please try again.')
      } else {
        this.setState({movies: data.movies})
        this.setState({createSideBetModalOpen: true})
      }
    })
  }

  submitBet(bet) {
    this.setState({error: ''})

    let body = {
      bet: this.state.bet
    }

    apiPatch(`games/${this.props.gameId}/sidebet`, body)
    .then(data => {
      if (data.hasOwnProperty('message')) {
        this.setState({error: data.message})
      } else {
        this.setState({currentSideBet: data.sideBet})
      }
    })
  }

  checkDisabled() {
    return (
      this.state.newSideBetMovieChoice === null ||
      this.state.sideBetCloseDate === null
    )
  }

  renderMovieDivs() {
    return this.state.movies && this.state.movies.length ?
    (
      this.state.movies.map(movie =>
      <div key={movie.id} className='movie'>
        <input
          type='radio'
          value={movie.id}
          id={movie.title}
          name='movieList'
          onChange={(event) => this.handleCheckbox(event, movie)} />
        <label htmlFor={movie.title}>
          {movie.title} - {moment.utc(movie.releaseDate).format('ll')}
        </label>
      </div>
      )
    ) : (
      <p>There are no new movies coming out this weekend.</p>
    )
  }

  renderSideBetDiv() {
    return this.state.currentSideBetLoaded ?
      (
        <div className='sideBetBox'>
          {this.renderCreateSideBetButton()}
          {this.renderSideBet()}
          {this.renderPreviousSideBet()}
        </div>
      ) : (
        <div className='sideBetBox'>
          {this.renderCreateSideBetButton()}
          {this.renderPreviousSideBet()}
        </div>
      )
  }

  renderSideBetHeader() {
    return this.props.commissionerId === this.props.userId || (this.state.currentSideBetLoaded || this.state.previousSideBetLoaded) ? (
      <h2>Side Bet</h2>
    ) : (
      null
    )
  }

  renderCreateSideBetButton() {
    return this.props.commissionerId === this.props.userId ?
      (
        <div id='createSideBetButtonDiv'>
          <Button
            variant='outline'
            className='icon-buttons'
            onClick={() => {this.fetchMovies()}}
          >
            <i className='material-icons icons'>create</i>
          </Button>
        </div>
      ) : (
        null
      )
  }

  renderSideBet() {
    if (this.state.currentSideBet.bets.some(bet => bet.userHandle === this.props.userHandle)) {
      return (
        <div>
          {this.renderSideBetInformation(false)}
          <table
            className='responsive-table'
            id='sideBetTable'
          >
            <thead>
              <tr>
                {this._sideBetColumnNames.map((columnName, i) => (
                  <th key={i}>
                    {columnName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.currentSideBet.bets.map((bet, i) => (
                <tr key={i}>
                  <td title='player'>{bet.userHandle}</td>
                  <td title='bet'>{this._formatter.format(bet.bet)}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
      )
    }

    if (moment(moment().format()).isBefore(moment(this.state.currentSideBet.closeDate))) {
      return (
        <div>
          <div>
            Estimate the opening weekend domestic gross of the movie and win the prize amount which will be added to your total gross earnings.
            Winner is whoever estimated closest to without going over for the opening weekend box office.
            <br/><span className='sideBetSpan'>You only have one chance to make a bet... choose wisely.</span><br/><br/>
          </div>
          {this.renderSideBetInformation(true)}
          <div id='placeBetDiv' className='input-group-prepend'>
            <span className='input-group-text'>$</span>
            <input
              className='number-input-field form-control'
              id='bet'
              name='bet'
              type='number'
              min='0'
              step='1000000'
              onChange={this.handleChange} />
          </div>
          <div id='placeBetButtonDiv'>
            <Button
              variant='outline'
              className='text-buttons'
              onClick={() => this.submitBet(this.state.bet)}
              disabled={this.state.bet === 0}>
              PLACE BET
            </Button>
          </div>
          <div>
            {this.state.error}
          </div>
        </div>
      )
    }

    return null
  }

  renderPreviousSideBet() {
    return this.state.previousSideBetLoaded ? (
      <div>
        <h3>Previous Side Bet</h3>
        <div>
          <span className='sideBetSpan'>Movie:</span> {this.state.previousSideBet.movieTitle}
        </div>
        <div>
          <span className='sideBetSpan'>WeekendGross: $</span> {this._formatter.format(this.state.previousSideBet.weekendGross)}
        </div>
        <div>
          <span className='sideBetSpan'>Prize Amount:</span> ${this.state.previousSideBet.prizeInMillions},000,000
        </div>
        <table className='responsive-table'
          id='sideBetTable'>
          <thead>
            <tr>
              {this._sideBetColumnNames.map((columnName, i) => (
                <th key={i}>
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.previousSideBet.bets.map((bet, i) => (
              <tr
                key={i}
                winner={bet.userHandle === this.state.previousSideBet.winner ? 'true' : undefined}
              >
                <td title='player'>{bet.userHandle}</td>
                <td title='bet'>{this._formatter.format(bet.bet)}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    ) : (
      null
    )
  }

  renderSideBetInformation(withDate) {
    return withDate ? (
      <div>
        <div>
          <span className='sideBetSpan'>Movie:</span> {this.state.currentSideBet.movieTitle}
        </div>
        <div>
          <span className='sideBetSpan'>Prize Amount:</span> ${this.state.currentSideBet.prizeInMillions},000,000
        </div>
        <div>
          <span className='sideBetSpan'>Close Date:</span> {moment(this.state.currentSideBet.closeDate).format('LLL')}
        </div>
      </div>
    ) : (
      <div>
        <div>
          <span className='sideBetSpan'>Movie:</span> {this.state.currentSideBet.movieTitle}
        </div>
        <div>
          <span className='sideBetSpan'>Prize Amount:</span> ${this.state.currentSideBet.prizeInMillions},000,000
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderSideBetHeader()}
        {this.renderSideBetDiv()}
        <Modal
          centered
          show={this.state.createSideBetModalOpen}
          onHide={this.handleCloseCreateSideBetModal}
          backdrop='static'
          animation={false}
          dialogClassName='modal-width'
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Side Bet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Text>
                  The side bets allow players to estimate the weekend opening gross total of a chosen movie.
                  The player who estimates closest to without going over is considered the winner.
                  If you choose, the winner can have a prize amount (in millions) added to their total gross earnings.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Choose a movie to bet on:</Form.Label>
                {this.renderMovieDivs()}
              </Form.Group>

              <Form.Group>
                <Form.Label>How much do you want the winner to recieve (in millions)?</Form.Label>
                <div className='input-group-prepend'>
                  <span className='input-group-text'>$</span>
                  <Form.Control
                    className='number-input-field'
                    id='prizeInMillions'
                    name='prizeInMillions'
                    type='number'
                    min='0'
                    defaultValue='0'
                    onChange={this.handleChange}
                    onKeyDown={(e) => { e.preventDefault() }}
                  />
                </div>
                <Form.Text className='text-muted'>
                  If you do not want the winner to have any value added to their gross total, leave the value as 0.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>When you do want the side bet to close (end of day)?</Form.Label>
                <Form.Control
                  id='sideBetCloseDate'
                  name='sideBetCloseDate'
                  type='date'
                  min={moment().format('YYYY-MM-DD')}
                  onChange={this.handleChange}
                  onKeyDown={(e) => { e.preventDefault() }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant='outline'
              className='text-buttons'
              onClick={this.createSideBet}
              disabled={this.checkDisabled()}>
              CREATE SIDE BET
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default SideBet;
