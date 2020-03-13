import React, { Component } from 'react'
import moment from 'moment'

class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      resetTriggered: false
    }

    this.sendData = this.sendData.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  sendData() {
         this.props.parentCallback(true);
  }

  startTimer() {
    this.setState({
      time: moment(this.props.auctionExpiry).diff(moment(), 'seconds'),
      start: this.state.start - this.state.time
    })
    this.timer = setInterval(() => {
      this.setState({
        time: this.state.time - 1
      })
      if (this.state.time <= 0){
        this.stopTimer();
        this.sendData();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  componentDidMount() {
      document.body.style.overflow = 'hidden';
      this.startTimer();
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
