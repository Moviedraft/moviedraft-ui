import React, { Component } from 'react'
import '../styles/flavorText.css'
import { apiGet, apiPost, apiPatch } from '../utilities/apiUtility.js'

class flavorText extends Component {
  constructor(props){
    super(props)
    this.state = {
      text: '',
      editMode: false,
      defaultCreate: true
    }

    this.getFlavorText = this.getFlavorText.bind(this)
    this.editFlavorText = this.editFlavorText.bind(this)
    this.updateInputValue = this.updateInputValue.bind(this)
    this.saveInputValue = this.saveInputValue.bind(this)
    this.postInputValue = this.postInputValue.bind(this)
    this.patchInputValue = this.patchInputValue.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
  }

  componentDidMount() {
    this.getFlavorText()
  }

  getFlavorText() {
    apiGet('/games/' + this.props.gameId + '/flavortext/' + this.props.flavorType)
    .then(data => {
      if (data !== null) {
        this.setState({text: data.flavorText.text})
        this.setState({defaultCreate: false})
      }
    })
  }

  editFlavorText() {
    this.setState({editMode: true})
  }

  updateInputValue(event) {
    this.setState({text: event.target.value});
  }

  saveInputValue() {
    this.state.defaultCreate ? this.postInputValue() : this.patchInputValue()
  }

  async postInputValue() {
    let body = {
      'text': this.state.text,
      'type': this.props.flavorType
    }

    await apiPost('/games/' + this.props.gameId + '/flavortext', body)
    .then(data => {
      if (data.hasOwnProperty('message')) {
        this.props.handleError('Unable to add new flavor text. Please refresh and try again.')
      } else {
        this.setState({text: data.flavorText.text})
        this.setState({defaultCreate: false})
      }
    })

    this.setState({editMode: false})
  }

  async patchInputValue() {
    let body = {
      'text': this.state.text
    }

    await apiPatch('/games/' + this.props.gameId + '/flavortext/' + this.props.flavorType, body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to save edited flavor text. Please refresh and try again.')
      } else {
        this.setState({text: data.flavorText.text})
      }
    })

    this.setState({editMode: false})
  }

  cancelEdit() {
    this.setState({editMode: false})
  }

  renderEditButton() {
    if (this.props.commissionerId !== this.props.userId) {
        return null
      }

    if (this.state.text === '' && this.state.editMode === false) {
      return (
        <div>
          <button
            id='createButton'
            onClick={this.editFlavorText}>
            <i className='material-icons'>create</i>
          </button>
        </div>
      )
    }

      return this.state.editMode ?
          <div>
            <button
              id='editButton'
              onClick={this.cancelEdit}>
              <i className='material-icons'>clear</i>
            </button>
            <button
              id='editButton'
              onClick={this.saveInputValue}>
              <i className='material-icons'>done</i>
            </button>
          </div>
        :
          <button
            className='editFlavorTextButton'
            onClick={this.editFlavorText}>
            <i className='material-icons'>border_color</i>
          </button>
  }

  render() {
    return (
      this.state.editMode ?
        <div id='flavorTextDiv'>
          <div>
            {this.renderEditButton()}
          </div>
          <textarea
            rows='10'
            className='flavorTextInput'
            value={this.state.text}
            onChange={event => this.updateInputValue(event)} />
        </div>
      :
        <div id='flavorTextDiv'>
          <div>
            {this.renderEditButton()}
          </div>
          <div className='text'>
            {this.state.text}
          </div>
        </div>
    )
  }
}

export default flavorText;
