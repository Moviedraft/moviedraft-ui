import React, { Component } from 'react';
import '../styles/createGame.css'
import Modal from 'react-modal';
import CreateGameStep1 from './createGameStep1.js'
import CreateGameStep2 from './createGameStep2.js'
import CreateGameStep3 from './createGameStep3.js'
import CreateGameStep4 from './createGameStep4.js'

class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentStep: 1,
      gameName: '',
      auctionDollars: 100,
      startDate: '',
      endDate: '',
      auctionDate: '',
      movies: [],
      playWithRules: false,
      grossCapRule: {
        active: false,
        ruleName: 'grossCap',
        capValue: 224999999,
        centsOnDollar: 0.4,
        baseValue: 135200000
      },
      valueMultiplierRule: {
        active: false,
        ruleName: 'valueMultiplier',
        lowerThreshold: 8000000,
        upperThreshold: 13000000
      },
      playerEmails: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.resetValues = this.resetValues.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.previousButton = this.previousButton.bind(this)
    this.nextButton = this.nextButton.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.resetValues()
    }
  }

  handleCloseModal() {
    this.resetValues()
  }

  resetValues() {
    this.setState({currentStep: 1})
    this.setState({gameName: ''})
    this.setState({auctionDollars: 100})
    this.setState({startDate: ''})
    this.setState({endDate: ''})
    this.setState({auctionDate: ''})
    this.setState({movies: []})
    this.setState({playWithRules: false})
    this.setState({grossCapRule: {active: false, ruleName: 'grossCap', capValue: 224999999, centsOnDollar: 0.4, baseValue: 135200000}})
    this.setState({valueMultiplierRule: {active: false, ruleName: 'valueMultiplier', lowerThreshold: 8000000, upperThreshold: 13000000}})
    this.setState({playerEmails: []})
    this.props.parentCallback(false)
  }

  handleSubmit(event) {
    event.preventDefault()
    const { gameName, auctionDollars, startDate, endDate, auctionDate, movies, playWithRules, grossCapRule, valueMultiplierRule, playerEmails } = this.state
    alert(`Your game details: \n
      Game Name: ${gameName} \n
      Auction Dollars: ${auctionDollars} \n
      Start Date: ${startDate} \n
      End Date: ${endDate} \n
      Auction Date: ${auctionDate} \n
      Movies: ${movies.map(movie => movie.title)} \n
      Play With Rules: ${playWithRules} \n
      Gross cap rule: ${JSON.stringify(grossCapRule)} \n
      Value multiplier rule: ${JSON.stringify(valueMultiplierRule)} \n
      Player emails: ${playerEmails}`)
    this.setState({currentStep: 1})
    this.setState({gameName: ''})
    this.setState({auctionDollars: 100})
    this.setState({startDate: ''})
    this.setState({endDate: ''})
    this.setState({auctionDate: ''})
    this.setState({movies: []})
    this.setState({playWithRules: false})
    this.setState({grossCapRule: {active: false, ruleName: 'grossCap', capValue: 224999999, centsOnDollar: 0.4, baseValue: 135200000}})
    this.setState({valueMultiplierRule: {active: false, ruleName: 'valueMultiplier', lowerThreshold: 8000000, upperThreshold: 13000000}})
    this.setState({playerEmails: []})
    this.props.parentCallback(false)
  }

  next() {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 4 ? 4 : currentStep + 1
    this.setState({ currentStep: currentStep})
  }

  prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1 ? 1 : currentStep - 1
    this.setState({ currentStep: currentStep })
  }

  previousButton(){
    return (
      this.state.currentStep !== 1 ?
      (<button
          id='previousButton'
          type='button'
          onClick={this.prev}>
          Previous
        </button>)
      : null
    )
  }

  nextButton(){
    return (
      this.state.currentStep < 4 ?
        (<button
			     id='nextButton'
           type='button'
           onClick={this.next}>
           Next
         </button>)
       : this.state.currentStep === 4 ?
       (<button
          id='submitButton'
          type='button'
          onClick={this.handleSubmit}
          disabled={this.checkDisabled()}>
          CREATE GAME
        </button> )
      : null
    )
  }

  checkDisabled() {
    return (
      this.state.gameName === '' ||
      this.state.startDate === '' ||
      this.state.endDate === '' ||
      this.auctionDate === '' ||
      this.movies === []
    )
  }

  render() {
    return (
      <Modal
      isOpen={this.props.modalOpen}
      className='modal'
      onRequestClose={this.handleKeyPress}>
        <button
          id='closeModalButton'
          onClick={this.handleCloseModal}>
          Close Modal
        </button>
        <h1 id='createGameHeader'>Create Game</h1>
        <p>Step {this.state.currentStep}</p>
        <p>All fields are required to create a game.</p>
          <form
          onSubmit={e => { e.preventDefault(); }}>
            <div>
              <CreateGameStep1
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                gameName={this.state.gameName}
                auctionDollars={this.state.auctionDollars} />
              <CreateGameStep2
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                movies={this.state.movies} />
              <CreateGameStep3
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                playWithRules={this.state.playWithRules}
                grossCapRule={this.state.grossCapRule}
                valueMultiplierRule={this.state.valueMultiplierRule} />
              <CreateGameStep4
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                playerEmails={this.state.playerEmails} />
            </div>
            <div id='buttonsDiv'>
              {this.previousButton()}
              {this.nextButton()}
            </div>
        </form>
      </Modal>
    )
  }
}

export default CreateGame;
