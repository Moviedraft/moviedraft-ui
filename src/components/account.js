import React, { Component } from 'react'
import { navigate } from '@reach/router'
import Dropdown from 'react-bootstrap/Dropdown'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/account.css'
import DownArrow from '../downArrow.png'
import GenericPerson from '../genericPerson.jpeg'

class Account extends Component {
  constructor(props){
    super(props)
    this.state = {

    }

    this.logOut = this.logOut.bind(this)
  }

  logOut() {
    apiGet('logout')
    .then(() => {
      localStorage.clear()
      this.props.parentCallback(false)
      navigate('/')
    })
  }

  render() {
    return (
      <div id='dropdownContainer'>
        <Dropdown>
          <Dropdown.Toggle id='dropdown-basic' className='dropDownButton buttonOutline shadow-none' variant='outline'>
            <img
              id='AccountButtonProfilePic'
              src={this.props.picture ?? GenericPerson}
              alt='Profile Pic'
            />
            <img
              id='DownArrow'
              src={DownArrow}
              alt='Down Arrow'
            />
          </Dropdown.Toggle>

          <Dropdown.Menu id='menu' className='dropdown-menu-right'>
            <Dropdown.Item href='/user'>Account</Dropdown.Item>
            <Dropdown.Item onClick={() => this.logOut()}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

export default Account;
