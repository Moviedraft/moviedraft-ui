import React, { Component } from 'react';
import '../styles/home.css'
import Header from '../components/header.js'

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className='shia'></div>
      </div>
    );
  }
}

export default Home;
