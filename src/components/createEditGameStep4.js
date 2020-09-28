import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import '../styles/createEditGameStep4.css'

class CreateEditGameStep4 extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.blurInput = this.blurInput.bind(this)
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
      if (email && !this.props.playerEmails.includes(email) && this.isEmail(email) &&
        (email.includes('gmail.com') || email.includes('googlemail.com') || email.includes('google.com'))) {
        this.props.playerEmails.push(email)
      }
      this.setState({value: ''})
    }
  }

  handlePaste(event) {
    event.preventDefault();
    let paste = event.clipboardData.getData('text');
    let emails = paste.match(/[\w\d.-]+@[\w\d.-]+[\w\d-]+/g);
    if(emails) {
      let emailsToBeAdded = emails.filter(email => !this.props.playerEmails.includes(email) &&
        (email.includes('gmail.com') || email.includes('googlemail.com') || email.includes('google.com')))

      emailsToBeAdded.forEach((email) => {
        this.props.playerEmails.push(email)
      });
    }

    this.setState({value: ''})
    this.blurInput()
  }

  blurInput(){
    this.refs.emailInput.blur()
 }

  handleDelete(email) {
    const index = this.props.playerEmails.findIndex((x) => x === email);
    this.props.playerEmails.splice(index, 1);
    this.setState({value: this.state.value})
  }

  isEmail(email) {
    return /^[\w\d.-]+@[\w\d.-]+.[\w\d-]+$/.test(email);

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
      <Form>
        <Form.Group>
          <Form.Label>Invite Players</Form.Label>
            <Form.Control
              ref='emailInput'
              placeholder='Type or paste email addresses'
              id='email'
              name='email'
              type='email'
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onPaste={this.handlePaste}
            />
          <Form.Text className='text-muted'>
            Emails must use the following Google domains: 'gmail.com', 'googlemail.com', or 'google.com'
          </Form.Text>
        </Form.Group>
        {this.renderEmails()}
      </Form>
    )
  }
}

export default CreateEditGameStep4
