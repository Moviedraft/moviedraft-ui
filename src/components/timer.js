import React, { Component } from 'react'
import moment from 'moment'

class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      timerId: ''
    }

    this.sendData = this.sendData.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
    this.setState({time: moment(this.props.auctionExpiry).diff(moment(), 'seconds')})
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  sendData() {
         this.props.parentCallback(true);
  }

  startTimer() {
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
    let newTime = moment(time).diff(moment(), 'seconds') > this.props.auctionItemsExpireInSeconds ?
      this.props.auctionItemsExpireInSeconds :
      moment(time).diff(moment(), 'seconds')

    this.setState({time: newTime})
    this.stopTimer()
    this.startTimer()
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
