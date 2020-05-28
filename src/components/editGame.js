import React, { Component } from 'react'
import moment from 'moment'
import { apiPut } from '../utilities/apiUtility.js'
import '../styles/createGame.css'
import Modal from 'react-modal'
import CreateEditGameStep1 from './createEditGameStep1.js'
import CreateEditGameStep2 from './createEditGameStep2.js'
import CreateEditGameStep3 from './createEditGameStep3.js'
import CreateEditGameStep4 from './createEditGameStep4.js'

class EditGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentStep: 1,
      gameId: '',
      gameName: '',
      auctionDollars: 0,
      startDate: '',
      endDate: '',
      auctionDate: '',
      auctionItemExpiryTimeSeconds: 0,
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
      this.handleCloseModal()
    }
  }

  handleCloseModal() {
    this.props.parentCallback(false)
  }

  componentDidMount() {
    this.setState({currentStep: 1})
    this.setState({gameId: this.props.game._id})
    this.setState({gameName: this.props.game.gameName})
    this.setState({auctionDollars: this.props.game.dollarSpendingCap})
    this.setState({startDate: moment(this.props.game.startDate).format('YYYY-MM-DD')})
    this.setState({endDate: moment(this.props.game.endDate).format('YYYY-MM-DD')})
    this.setState({auctionDate: this.props.game.auctionDate})
    this.setState({auctionItemExpiryTimeSeconds: this.props.game.auctionItemsExpireInSeconds})
    this.setState({movies: this.props.game.movies})
    this.setState({playWithRules: this.props.game.rules.length})

    let grossCapRule = this.props.game.rules.find(rule => rule.ruleName === this.state.grossCapRule.ruleName)
    if (grossCapRule) {
      let grossCapRuleState = this.state.grossCapRule

      grossCapRuleState.grossCapActive = true
      grossCapRuleState.capValue = grossCapRule.rules.capValue
      grossCapRuleState.centsOnDollar = grossCapRule.rules.centsOnDollar
      grossCapRuleState.baseValue = grossCapRule.rules.baseValue

      this.setState({grossCapRule: grossCapRuleState})
    }

    let valueMultiplierRule = this.props.game.rules.find(rule => rule.ruleName === this.state.valueMultiplierRule.ruleName)
    if (valueMultiplierRule) {
      let valueMultiplierRuleState = this.state.valueMultiplierRule

      valueMultiplierRuleState.valueMultiplierActive = true
      valueMultiplierRuleState.lowerThreshold = valueMultiplierRule.rules.lowerThreshold
      valueMultiplierRuleState.upperThreshold = valueMultiplierRule.rules.upperThreshold

      this.setState({valueMultiplierRule: valueMultiplierRuleState})
    }


    this.setState({playerEmails: this.props.game.playerIds})
  }

  handleSubmit(event) {
    event.preventDefault()

    let requestAuctionDate = moment(this.state.auctionDate)
    if (!requestAuctionDate.isValid()) {
      requestAuctionDate = moment.max()
    }

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
          lowerThreshold: parseInt(this.state.valueMultiplierRule.lowerThreshold),
          upperThreshold: parseInt(this.state.valueMultiplierRule.upperThreshold)
        }
      })
    }

    let body = {
      playerIds: this.state.playerEmails,
      dollarSpendingCap: this.state.auctionDollars,
      rules: rules,
      auctionItemsExpireInSeconds: this.state.auctionItemExpiryTimeSeconds,
      movies: this.state.movies.map((movie) => movie.id),
      startDate: moment(this.state.startDate).format(),
      endDate: moment(this.state.endDate).format(),
      gameName: this.state.gameName,
      auctionDate: requestAuctionDate.format(),
      auctionComplete: false
    }

    apiPut('games/' + this.state.gameId, body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to edit game. Please try again.')
      }
    })

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
          SAVE GAME
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
        <h1 id='createGameHeader'>Edit Game</h1>
        <p>Step {this.state.currentStep}</p>
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
                movies={this.state.movies} />
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

export default EditGame;
