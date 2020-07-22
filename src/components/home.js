import React, { Component } from 'react';
import '../styles/home.css'
import { apiGet } from '../utilities/apiUtility.js'
import moment from 'moment'
import Header from '../components/header.js'
import Error from './error.js'

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentUser: null,
      errorMessage: '',
      dataLoaded: false
    }

    this.getCurrentUser = this.getCurrentUser.bind(this)
  }

  componentDidMount() {
    this.getCurrentUser()
  }

  getCurrentUser() {
    if (localStorage.getItem('CouchSportsToken') === null ||
      moment() > moment(localStorage.getItem('CouchSportsTokenExpiry'))) {
        this.setState({dataLoaded: true})
        return
    }

    apiGet('users/current')
    .then((data) => {
      if (data === null) {
        this.setState({errorMessage: 'Unable to retrieve user information. Please try logging out and back in.'})
      } else {
        this.setState({currentUser: data})
        this.setState({dataLoaded: true})
      }
    })
  }

  render() {
    if (!this.state.dataLoaded) {
      return null
    }
    
    if (this.state.errorMessage !== '') {
      return <Error errorMessage={this.state.errorMessage} />;
    }

    return (
      <div>
        <Header
          picture={this.state.currentUser === null ? null : this.state.currentUser.picture}/>
        <div className='shia'></div>
      </div>
    );
  }
}

export default Home;
