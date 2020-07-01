import React, { Component } from 'react'
import moment from 'moment'
import { apiGet } from '../utilities/apiUtility.js'
import { getCurrentTime } from '../utilities/dateTimeUtility.js'

class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      timerId: '',
      currentTime: ''
    }

    this.sendData = this.sendData.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  sendData() {
    this.props.parentCallback(true);
  }

  startTimer() {
    getCurrentTime().then(data => {
      let duration = moment.duration(moment(this.props.auctionExpiry).diff(moment(data.time)))
      this.setState({time: duration.seconds()})
    })

    let timerId = setInterval(() => {
      this.setState({
        time: this.state.time - 1
      })
      if (this.state.time <= 0){
        this.stopTimer();
        this.sendData();
      }
    }, 1000);

    this.setState({timerId: timerId})
  }

  stopTimer() {
    clearInterval(this.state.timerId)
  }

  resetTimer(time) {
    getCurrentTime().then(data => {
      let duration = moment.duration(moment(time).diff(moment(data.time)))
      this.setState({time: duration.seconds()})
    })
  }

  render() {
    return(
      <div>
        <h3>{this.state.time} seconds left</h3>
      </div>
    )
  }
}

export default Timer;
