import React, { Component } from 'react'
import moment from 'moment'
import { apiPost } from '../utilities/apiUtility.js'
import '../styles/createGame.css'
import Modal from 'react-modal'
import CreateEditGameStep1 from './createEditGameStep1.js'
import CreateEditGameStep2 from './createEditGameStep2.js'
import CreateEditGameStep3 from './createEditGameStep3.js'
import CreateEditGameStep4 from './createEditGameStep4.js'

class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentStep: 1,
      gameName: '',
      auctionDollars: 100,
      startDate: '',
      endDate: '',
      auctionDate: moment().add(1, 'days'),
      auctionItemExpiryTimeSeconds: 30,
      movies: [],
      playWithRules: false,
      grossCapRule: {
        grossCapActive: false,
        ruleName: 'grossCap',
        displayTitle: 'GROSS CAP',
        capValue: 224999999,
        centsOnDollar: 0.4,
        baseValue: 135200000
      },
      valueMultiplierRule: {
        valueMultiplierActive: false,
        ruleName: 'valueMultiplier',
        displayTitle: 'VALUE MULTIPLIER',
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
    this.setState({auctionDate: moment().add(1, 'days')})
    this.setState({auctionItemExpiryTimeSeconds: 30})
    this.setState({movies: []})
    this.setState({playWithRules: false})
    this.setState({grossCapRule: {grossCapActive: false, ruleName: 'grossCap', displayTitle: 'GROSS CAP', capValue: 224999999, centsOnDollar: 0.4, baseValue: 135200000}})
    this.setState({valueMultiplierRule: {valueMultiplierActive: false, ruleName: 'valueMultiplier', displayTitle: 'VALUE MULTIPLIER', lowerThreshold: 8000000, upperThreshold: 13000000}})
    this.setState({playerEmails: []})
    this.props.parentCallback(false)
  }

  async handleSubmit(event) {
    event.preventDefault()

    let rules = []
    if (this.state.playWithRules && this.state.grossCapRule.grossCapActive) {
      rules.push({
        ruleName: this.state.grossCapRule.ruleName,
        rules: {
          capValue: parseInt(this.state.grossCapRule.capValue),
          centsOnDollar: parseFloat(this.state.grossCapRule.centsOnDollar),
          baseValue: parseInt(this.state.grossCapRule.baseValue)
        }
      })
    }
    if (this.state.playWithRules && this.state.valueMultiplierRule.valueMultiplierActive) {
      rules.push({
        ruleName: this.state.valueMultiplierRule.ruleName,
        rules: {
          lowerThreshold: this.state.valueMultiplierRule.lowerThreshold,
          upperThreshold: this.state.valueMultiplierRule.upperThreshold
        }
      })
    }

    let body = {
      playerIds: this.state.playerEmails,
      dollarSpendingCap: this.state.auctionDollars,
      rules: rules,
      auctionItemsExpireInSeconds: this.state.auctionItemExpiryTimeSeconds,
      movies: this.state.movies.filter(movie => (moment(movie.releaseDate).isBetween(this.state.startDate, this.state.endDate))).map((movie) => movie.id),
      startDate: moment(this.state.startDate).format(),
      endDate: moment(this.state.endDate).format(),
      gameName: this.state.gameName,
      auctionDate: moment(this.state.auctionDate).format()
    }

    await apiPost('games', body)
    .then(data => {
      if (data.hasOwnProperty('message')) {
        this.props.handleError('Unable to create game: ' + data.message + '\nPlease refresh and try again.')
      }
    })

    this.resetValues()
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
              <CreateEditGameStep1
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                gameName={this.state.gameName}
                auctionDollars={this.state.auctionDollars} />
              <CreateEditGameStep2
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                auctionDate={this.state.auctionDate}
                auctionItemExpiryTimeSeconds={this.state.auctionItemExpiryTimeSeconds}
                movies={this.state.movies}
                handleError={this.props.handleError} />
              <CreateEditGameStep3
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                playWithRules={this.state.playWithRules}
                grossCapRule={this.state.grossCapRule}
                valueMultiplierRule={this.state.valueMultiplierRule} />
              <CreateEditGameStep4
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
