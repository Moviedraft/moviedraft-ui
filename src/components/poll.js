import React, { Component } from 'react'
import { BarChart } from 'react-chartkick'
import Modal from 'react-modal';
import 'chart.js'
import { apiGet, apiPost, apiPatch } from '../utilities/apiUtility.js'
import '../styles/poll.css'

class Poll extends Component {
  _pollLoaded = false
  _noPoll = false

  constructor(props){
    super(props)
    this.state = {
      vote: '',
      voteSubmitted: false,
      question: '',
      choices: [],
      createPollModalOpen: false,
      newPollQuestion: '',
      newPollChoice1: '',
      newPollChoice2: '',
      newPollChoice3: ''
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseCreatePollModal = this.handleCloseCreatePollModal.bind(this)
    this.handleCreatePoll = this.handleCreatePoll.bind(this)
    this.fetchPoll = this.fetchPoll.bind(this)
    this.setVote = this.setVote.bind(this)
    this.submitVote = this.submitVote.bind(this)
  }

  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.handleCloseCreatePollModal()
    }
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleCloseCreatePollModal() {
    this.setState({createPollModalOpen: false})
    this.setState({newPollQuestion: ''})
    this.setState({newPollChoice1: ''})
    this.setState({newPollChoice2: ''})
    this.setState({newPollChoice3: ''})
  }

  handleCreatePoll() {
    let choicesArray = []
    if (this.state.newPollChoice1 !== '') {
      choicesArray.push(this.state.newPollChoice1)
    }
    if (this.state.newPollChoice2 !== '') {
      choicesArray.push(this.state.newPollChoice2)
    }
    if (this.state.newPollChoice3 !== '') {
      choicesArray.push(this.state.newPollChoice3)
    }

    let body = {
      question: this.state.newPollQuestion,
      choices: choicesArray
    }

    apiPost('games/' + this.props.gameId + '/poll', body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to create poll. Please refresh and try again.')
      } else {
        this.setState({question: data.question})
        this.setState({choices: data.choices})
      }
    })
    .then(() => {
      this._pollLoaded = false
      this._noPoll = false
      this.setState({voteSubmitted: false})
      this.handleCloseCreatePollModal()
    })
  }

  fetchPoll() {
    apiGet('games/' + this.props.gameId + '/poll')
    .then(data => {
      if (data === null) {
        this._noPoll = true
      } else {
        this.setState({question: data.question})
        this.setState({choices: data.choices})
        this._pollLoaded = true
      }
    })
  }

  setVote(vote) {
    this.setState({vote: vote})
  }

  submitVote(vote) {
    let body = { vote: vote }

    apiPatch('games/' + this.props.gameId + '/poll', body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to submit vote. Please refresh and try again.')
      } else {
        this.setState({question: data.question})
        this.setState({choices: data.choices})
      }
    })

    this.setState({voteSubmitted: true})
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
            onClick={() => this.setState({createPollModalOpen: true})}>
            CREATE POLL
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
        <BarChart data={data} />
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
    if (!this._pollLoaded && !this._noPoll) {
      this.fetchPoll()
    }

    return (
      <div id='pollBox'>
        <h2>Poll</h2>
        {this.renderPollDiv()}
        <Modal
          isOpen={this.state.createPollModalOpen}
          id='createPollModal'
          className='modal'
          onRequestClose={this.handleKeyPress}>
          <button
            id='closeModalButton'
            onClick={this.handleCloseCreatePollModal}>
            Close Modal
          </button>
          <h1>Create Poll</h1>
          <div className='form-group'>
            <label htmlFor='pollQuestion'>Poll Question:</label>
            <input
              className='form-control'
              id='newPollQuestion'
              name='newPollQuestion'
              type='text'
              placeholder='Enter poll question'
              value={this.state.newPollQuestion}
              onChange={this.handleChange} />
            <label htmlFor='pollChoices'>Poll Choices:</label>
            <input
              className='form-control'
              id='newPollChoice1'
              name='newPollChoice1'
              type='text'
              placeholder='Enter poll choice'
              value={this.state.newPollChoice1}
              onChange={this.handleChange} />
            <input
              className='form-control'
              id='newPollChoice2'
              name='newPollChoice2'
              type='text'
              placeholder='Enter poll choice'
              value={this.state.newPollChoice2}
              onChange={this.handleChange} />
            <input
              className='form-control'
              id='newPollChoice3'
              name='newPollChoice3'
              type='text'
              placeholder='Enter poll choice'
              value={this.state.newPollChoice3}
              onChange={this.handleChange} />
            <button
              id='closeModalButton'
              onClick={this.handleCreatePoll}>
              CREATE POLL
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Poll;
