import React, { Component } from 'react'
import { navigate } from '@reach/router'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/account.css'
import DownArrow from '../downArrow.png'
import GenericPerson from '../genericPerson.jpeg'

class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      showMenu: false
    }

    this.showMenu = this.showMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  showMenu() {
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {
    if (this.dropdownMenu !== null && !this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
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
     <div id='Account'>
      <div id='AccountButtonDiv'>
       <button
         id='AccountButton'
         onClick={() => this.showMenu()}>
         <img
          id='AccountButtonProfilePic'
          src={this.props.picture ?? GenericPerson}
          alt='Profile Pic' />
         <img
           id='DownArrow'
           src={DownArrow}
           alt='Down Arrow' />
       </button>
       </div>

       {
          this.state.showMenu ?
          (
            <div
              className='menu'
              ref={(element) => {
                this.dropdownMenu = element;
              }}>
              <button
                className='DropDownButton'
                onClick={() => navigate('/user')}>
                Account
              </button>
              <button
                className='DropDownButton'
                onClick={() => this.logOut()}>
                Logout
              </button>
            </div>
          ) : (
              null
          )
        }
     </div>
   )
  }
}

export default Account;
