import React, { Component } from 'react';
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
    fetch('https://api-dev.couchsports.ca/users/current', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token")
      },
      method: 'PATCH',
      body: JSON.stringify( { userHandle: this.state.newUserHandle } )
    })
    .then(res => res.json())
    .then(async (data) => {
      await this.sendData(data)
      this.setState({newUserHandle: ''})
      this.setState({editMode: !this.state.editMode})
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td id='userHandleCell'>
              {this.state.editMode ? (
                <input
                  autoFocus
                  className='userHandle'
                  type="text"
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
                <button
                id='editButton'
                onClick={this.onClick}>
                  <i className="material-icons">clear</i>
                </button>
                <button
                id='editButton'
                onClick={this.patchUserHandle}>
                  <i className="material-icons">done</i>
                </button>
                </div>
              ) : (
                <button
                id='editButton'
                onClick={this.onClick}>
                  <i className="material-icons">border_color</i>
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default UserHandle;
