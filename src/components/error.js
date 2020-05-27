import React, { Component } from 'react'
import Header from './header.js'

class Error extends Component {
    constructor(props){
      super(props)
      this.state = {
        errorMessage: this.props.errorMessage
      }
    }

    render() {
      return (
        <div>
          <Header />
          <h1>{this.state.errorMessage}</h1>
        </div>
      )
    }
}

export default Error;
