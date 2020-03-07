import React, { Component } from 'react';
import '../styles/createGameStep4.css'

class CreateGameStep4 extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.isEmail = this.isEmail.bind(this)
    this.renderEmails = this.renderEmails.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyDown(event) {
    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault();
      let email = this.state.value.trim();
      if (email && !this.props.playerEmails.includes(email) && this.isEmail(email)) {
        this.props.playerEmails.push(email)
      }
      this.setState({value: ''})
    }
  }

  handlePaste(event) {
    event.preventDefault();
    let paste = event.clipboardData.getData('text');
    let emails = paste.match(/[\w\d.-]+@[\w\d.-]+[\w\d-]+/g);
    let emailsToBeAdded = emails.filter(email => !this.props.playerEmails.includes(email))

    emailsToBeAdded.forEach((email) => {
      this.props.playerEmails.push(email)
    });

    this.setState({value: ''})
  }

  handleDelete(email) {
    const index = this.props.playerEmails.findIndex((x) => x === email);
    this.props.playerEmails.splice(index, 1);
    this.setState({value: this.state.value})
  }

  isEmail(email) {
    return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$/.test(email);

  }

  renderEmails() {
    return this.props.playerEmails.map(email => (
      <div
        key={email}
        className='emailDivWrapper'>
        <div className='emailDiv'>{email}</div>
        <div className='buttonDiv'>
          <button
            type='button'
            className='deleteEmailButton'
            onClick={() =>  this.handleDelete(email)} >
            &times;
          </button>
        </div>
      </div>))
  }

  render() {
    if (this.props.currentStep !== 4) {
      return null
    }

    return (
      <div id='emailWrapper'>
        <input
          placeholder="Type or paste email addresses and press `Enter`"
          id='email'
          name='email'
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onPaste={this.handlePaste} />
          {this.renderEmails()}
      </div>
    )
  }
}

export default CreateGameStep4
