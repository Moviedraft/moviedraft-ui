import React, { Component } from 'react';
import '../styles/createGame.css'
import Modal from 'react-modal';
import CreateGameStep1 from './createGameStep1.js'
import CreateGameStep2 from './createGameStep2.js'

class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentStep: 1,
      gameName: '',
      startDate: '',
      endDate: ''
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.previousButton = this.previousButton.bind(this)
    this.nextButton = this.nextButton.bind(this)
  }

  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.setState({currentStep: 1})
      this.setState({gameName: ''})
      this.setState({startDate: ''})
      this.setState({endDate: ''})
      this.props.parentCallback(false)
    }
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleCloseModal() {
    this.setState({currentStep: 1})
    this.setState({gameName: ''})
    this.setState({startDate: ''})
    this.setState({endDate: ''})
    this.props.parentCallback(false)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { gameName, startDate, endDate } = this.state
    alert(`Your registration detail: \n
      Game Name: ${gameName} \n
      Start Date: ${startDate} \n
      End Date: ${endDate}`)
    this.setState({currentStep: 1})
    this.setState({gameName: ''})
    this.setState({startDate: ''})
    this.setState({endDate: ''})
    this.props.parentCallback(false)
  }

  next() {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 2 ? 2: currentStep + 1
    this.setState({ currentStep: currentStep})
  }

  prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1 ? 1: currentStep - 1
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
      this.state.currentStep < 2 ?
        (<button
			     id='nextButton'
           type='button'
           onClick={this.next}>
           Next
         </button>)
       : this.state.currentStep === 2 ?
       (<button
          id='submitButton'
          type='button'
          onClick={this.handleSubmit}>
          CREATE GAME
        </button> )
      : null
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
        <h1>Create Game</h1>
        <p>Step {this.state.currentStep}</p>
          <form
          onSubmit={e => { e.preventDefault(); }}>
            <div>
              <CreateGameStep1
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                email={this.state.gameName} />
              <CreateGameStep2
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                startDate={this.state.startDate}
                endDate={this.state.endDate} />
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
