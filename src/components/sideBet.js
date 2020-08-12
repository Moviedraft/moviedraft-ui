import React, { Component } from 'react'
import Modal from 'react-modal'
import moment from 'moment'
import { apiGet, apiPost, apiPatch } from '../utilities/apiUtility.js'
import '../styles/poll.css'

class SideBet extends Component {
  constructor(props){
    super(props)
    this.state = {
      vote: '',
      voteSubmitted: false,
      newSideBetChoice: null,
      movies: [],
      prizeAmount: 0,
      sideBetCloseDate: null,
      choices: [],
      createSideBetModalOpen: false
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseCreateSideBetModal = this.handleCloseCreateSideBetModal.bind(this)
    this.handleCreateSideBet = this.handleCreateSideBet.bind(this)
    this.fetchSideBet = this.fetchSideBet.bind(this)
    this.submitVote = this.submitVote.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
  }

  componentDidMount() {
    this.fetchSideBet()
  }

  handleCheckbox(event, movie) {
    if(event.target.checked) {
      this.setState({newSideBetChoice: movie})
    } else {
      this.setState({newSideBetChoice: null})
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

  handleCreateSideBet() {
    console.log('side bet created')
  }

  fetchSideBet() {
    console.log('side bet fetched')
    this.props.updateComponentLoadedFlag(this.props.componentName)
  }

  fetchMovies() {
    let wednesday = 3
    let friday = 5
    let today = moment().isoWeekday()
    let startDate = null
    let endDate = null

    if (today <= wednesday) {
      startDate = moment().isoWeekday(wednesday).startOf('day').format()
      endDate = moment().isoWeekday(friday).startOf('day').format()
    } else if (today <= friday) {
      startDate = moment().isoWeekday(friday).startOf('day').format()
      endDate = moment().isoWeekday(friday).startOf('day').format()
    } else {
      startDate = moment().add(1, 'weeks').isoWeekday(wednesday).startOf('day').format()
      endDate = moment().add(1, 'weeks').isoWeekday(friday).startOf('day').format()
    }

    apiGet(`movies?startDate=${startDate}&endDate=${endDate}`)
    .then(data => {
      if (data === null) {
        this.props.handleError('Could not load movies. Please try again.')
      } else {
        console.log(data)
        this.setState({movies: data.movies})
      }
    })
  }

  submitVote(vote) {
    let body = { vote: vote }

    console.log('vote submitted')
  }

  checkDisabled() {
    return (
      this.state.newSideBetChoice === null ||
      this.state.sideBetCloseDate === null
    )
  }

  renderPollDiv() {
    return this._pollLoaded ?
      (
        <div className='pollBox'>
          {this.renderCreatePollButton()}
          {this.renderPoll()}
        </div>
      ) : (
        <div className='pollBox'>
          {this.renderCreatePollButton()}
        </div>
      )
  }

  renderCreatePollButton() {
    return this.props.commissionerId === this.props.userId ?
      (
        <div id='createPollButtonDiv'>
          <button
            id='createPollButton'
            onClick={() => {
              this.fetchMovies()
              this.setState({createSideBetModalOpen: true})
            }}>
            CREATE SIDE BET
            </button>
        </div>
      ) : (
        null
      )
  }

  renderQuestion() {
    return (
      <div>
        {this.state.question}
      </div>
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
          name={movie.title}
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

  renderChoices() {
    return (
      <div id='PollChoices'>
        {this.state.choices.map((choice, i) => {
          return (
            <div key={i}>
              <input
                type='radio'
                id={'choice' + i}
                name='choices'
                value={choice.displayText}
                onClick={(event) => this.setVote(event.target.value)} />
              <label htmlFor={'choice' + i}>{choice.displayText}</label><br />
            </div>
          )
        })}
      </div>
    )
  }

  renderResults() {
    let data = this.state.choices.map(choice => {
      return [choice.displayText, choice.votes]
    })

    return (
      <div id='pollResults'>
        <h4>
          {this.renderQuestion()}
        </h4>
      </div>
    )
  }

  renderPoll() {
    return  !this.state.voteSubmitted ?
    (
      <div>
        {this.renderQuestion()}
        {this.renderChoices()}
        <button
          id='voteButton'
          onClick={() => this.submitVote(this.state.vote)}
          disabled={this.state.vote === ''}>
          VOTE
        </button>
        <button
          id='resultsButton'
          onClick={() => {this.fetchPoll(); this.setState({voteSubmitted: true})}}>
          VIEW RESULTS
        </button>
      </div>
    ) : (
      <div>
        {this.renderResults()}
      </div>
    )
  }

  render() {
    return (
      <div id='pollBox'>
        <h2>Side Bet</h2>
        {this.renderPollDiv()}
        <Modal
          isOpen={this.state.createSideBetModalOpen}
          id='createPollModal'
          className='modal'
          onRequestClose={this.handleKeyPress}>
          <button
            id='closeModalButton'
            onClick={this.handleCloseCreateSideBetModal}>
            Close Modal
          </button>
          <h1>Create Side Bet</h1>
          <p>The side bets allow players to estimate the weekend opening gross total of a chosen movie.</p>
          <p>The player who estimates closest to without going over is considered the winner.</p>
          <p>if you choose, the winner can have a prize amount (in millions) added to their total gross earnings.</p>
          <div className='form-group'>
            <h3>Choose a movie to bet on:</h3>
            {this.renderMovieDivs()}
            <h3>How much do you want the winner to recieve (in millions)?</h3>
            <p>If you do not want the winner to have any value added to their gross total, leave the value as 0.</p>
            <span>
            $
            <input
              className='form-control'
              id='prizeAmount'
              name='prizeAmount'
              type='number'
              min='0'
              defaultValue='0'
              onChange={this.handleChange}
              onKeyDown={(e) => { e.preventDefault() }} />
            </span>
            <h3>When you do want the side bet to close (end of day)?</h3>
            <input
              className='form-control'
              id='sideBetCloseDate'
              name='sideBetCloseDate'
              type='date'
              min={moment().format('YYYY-MM-DD')}
              onChange={this.handleChange}
              onKeyDown={(e) => { e.preventDefault() }} />
            <button
              id='closeModalButton'
              onClick={this.handleCreatePoll}
              disabled={this.checkDisabled()}>
              CREATE POLL
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default SideBet;
