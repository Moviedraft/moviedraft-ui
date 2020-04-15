import React, { Component } from 'react';
import { BarChart } from 'react-chartkick'
import 'chart.js'
import '../styles/poll.css'

class Poll extends Component {
  _pollLoaded = false

  constructor(props){
    super(props)
    this.state = {
      vote: '',
      voteSubmitted: false,
      question: '',
      choices: []
    }

    this.fetchPoll = this.fetchPoll.bind(this)
    this.setVote = this.setVote.bind(this)
    this.submitVote = this.submitVote.bind(this)
  }

  fetchPoll() {
    fetch('https://api-dev.couchsports.ca/games/' + this.props.gameId + '/poll', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'GET'
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        this.setState({question: jsonResponse.question})
        this.setState({choices: jsonResponse.choices})
      }
    })
    .catch(error => console.log(error))
  }

  setVote(vote) {
    this.setState({vote: vote})
  }

  submitVote(vote) {
    let body = JSON.stringify({
      vote: vote
    })

    fetch('https://api-dev.couchsports.ca/games/' + this.props.gameId + '/poll', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'POST',
      body: body
    })
    .then(async res => {
      if (res.ok) {
        let jsonResponse = await res.json()
        this.setState({question: jsonResponse.question})
        this.setState({choices: jsonResponse.choices})
      }
    })
    .catch(error => console.log(error))

    this.setState({voteSubmitted: true})
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
      <div>
        <h4>
          {this.renderQuestion()}
        </h4>
        <BarChart data={data}/>
      </div>
    )
  }

  renderPoll() {
    return  !this.state.voteSubmitted ?
    (
      <div id='pollBox'>
        <h2>Poll</h2>
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
      <div id='pollBox'>
        <h2>Poll Results</h2>
        {this.renderResults()}
      </div>
    )
  }

  render() {
    if (!this._pollLoaded) {
      this.fetchPoll()
      this._pollLoaded = true
    }

    if (this._pollLoaded) {
      return (
        <div>
          {this.renderPoll()}
        </div>
      )
    }
  }
}

export default Poll;
