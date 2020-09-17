import React, { Component } from 'react'
import { apiPatch } from '../utilities/apiUtility.js'
import Button from 'react-bootstrap/Button'
import '../styles/userHandle.css'

class UserHandle extends Component {
  constructor(props){
    super(props)
    this.state = {
      editMode: false,
      newUserHandle: ''
    }

    this.sendData = this.sendData.bind(this)
    this.updateInputValue = this.updateInputValue.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.onClick = this.onClick.bind(this)
    this.patchUserHandle = this.patchUserHandle.bind(this)
  }

  async sendData(user) {
    this.props.parentCallback(user.userHandle);
  }

  updateInputValue(evt) {
    this.setState({newUserHandle: evt.target.value});
  }

  handleKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.patchUserHandle()
    }
  }

  onClick() {
    this.setState({editMode: !this.state.editMode})
  }

  patchUserHandle() {
    let body = { userHandle: this.state.newUserHandle }

    apiPatch('users/current', body)
    .then(async data => {
      if (data === null) {
        this.props.handleError('Unable to change userHandle. Please refresh the page.')
      } else {
        await this.sendData(data)

        localStorage.setItem('CouchSportsHandle', data.userHandle)

        this.setState({newUserHandle: ''})
        this.setState({editMode: !this.state.editMode})
      }
    })
  }

  render() {
    return (
      <table id='userHandleTable'>
        <tbody>
          <tr>
            <td>
              {this.state.editMode ? (
                <input
                  autoFocus
                  className='userHandle'
                  type='text'
                  placeholder={this.props.userHandle}
                  value={this.state.newUserHandle}
                  onChange={evt => this.updateInputValue(evt)}
                  onKeyPress={this.handleKeyPress}
                />
              ) : (
                <div className='userHandle'>{this.props.userHandle}</div>
              )}
            </td>
            <td>
              {this.state.editMode ? (
                <div>
                <Button
                  className='editButton'
                  onClick={this.onClick}
                  variant='outline'
                >
                  <i className='material-icons editIcons'>clear</i>
                </Button>
                <Button
                  className='editButton'
                  onClick={this.patchUserHandle}
                  variant='outline'
                >
                  <i className='material-icons editIcons'>done</i>
                </Button>
                </div>
              ) : (
                <Button
                  className='editButton'
                  onClick={this.onClick}
                  variant='outline'
                >
                  <i className='material-icons editIcons'>border_color</i>
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default UserHandle;
