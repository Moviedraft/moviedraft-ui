import React, { Component } from 'react'
import moment from 'moment'
import { apiGet, apiPost } from '../utilities/apiUtility.js'
import '../styles/auctionItem.css';
import Timer from './timer.js';

class AuctionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      auctionStarted: false,
      auctionExpiry: this.props.serverOffset < 0 ?
        moment(this.props.auctionExpiry).subtract(this.props.serverOffset, 'milliseconds') :
        moment(this.props.auctionExpiry).add(this.props.serverOffset, 'milliseconds'),
      auctionExpirySet: this.props.auctionExpirySet,
      dollarSpendingCap: this.props.dollarSpendingCap,
      minBid: 0,
      currentHighBid: this.props.currentHighBid ?? 0,
      highestBidder: '',
      bid: 1,
      timerDone: false,
      error: '',
      auctionID: this.props.gameId + this.props.movie.id,
      connectedToWebSocket: false
    }

    this.webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.timerDone = this.timerDone.bind(this)
    this.joinAuction = this.joinAuction.bind(this)
    this.updateBid = this.updateBid.bind(this)
    this.beginAuction = this.beginAuction.bind(this)
    this.submitBid = this.submitBid.bind(this)
    this.allIn = this.allIn.bind(this)
    this.renderMoviePoster = this.renderMoviePoster.bind(this)
    this.renderAuctionItem = this.renderAuctionItem.bind(this)
    this.setStates = this.setStates.bind(this)
    this.updateHighBid = this.updateHighBid.bind(this)
  }

  handleKeyDown(event) {
    if (['Enter'].includes(event.key)) {
      this.submitBid()
    }
  }

  timerDone(timerDone) {
    this.setState({timerDone: timerDone})
    this.setState({error: ''})
    this.setState({auctionExpiry: moment().subtract(1, 'y')})
	}

  componentDidMount() {
    this.webSocket.onopen = () => {
      this.setState({connectedToWebSocket: true})
    }

    this.webSocket.onclose = () => {
      this.webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    }
  }

  componentWillUnmount() {
    if (this.state.connectedToWebSocket) {
      let message = {
        'message': 'leaveauction',
        'auctionID': this.state.auctionID
      }
      this.webSocket.send(JSON.stringify(message))
    }
  }

  joinAuction() {
    let message = {
      'message': 'joinauction',
      'auctionID': this.state.auctionID
    }
    this.webSocket.send(JSON.stringify(message))

    this.webSocket.onmessage = (event) => {
      let eventData = JSON.parse(event.data)

      if(eventData.message.hasOwnProperty('auctionID') && eventData.message.auctionID === this.state.auctionID) {
        this.updateHighBid(eventData.message)
      }
    }
  }

 updateBid(event) {
   this.setState({bid: event.target.value})
 }

  beginAuction(movieId) {
    let currentTime = this.props.serverOffset < 0 ?
      moment().subtract(this.props.serverOffset, 'milliseconds') :
      moment().add(this.props.serverOffset, 'milliseconds')

    apiGet('bids/' + this.props.gameId + '/' + movieId)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to begin auction. Please refresh and try again.')
      } else {
        let auctionExpiryTime = this.props.serverOffset < 0 ?
          moment(data.auctionExpiry).subtract(this.props.serverOffset, 'milliseconds') :
          moment(data.auctionExpiry).add(this.props.serverOffset, 'milliseconds')

        if(!data.auctionExpirySet) {
          this.setState({error: 'The auction for this item has not begun yet.'})
        } else if (currentTime < auctionExpiryTime) {
          this.setStates(data)
          this.setState({auctionStarted: true})
          this.joinAuction()
        } else {
          this.setStates(data)
          this.setState({error: 'The auction has completed for this item.'})
        }
      }
    })
  }

  setStates(data) {
    this.setState({error: ''})
    this.setState({auctionExpiry:
      this.props.serverOffset < 0 ?
      moment(data.auctionExpiry).subtract(this.props.serverOffset, 'milliseconds') :
      moment(data.auctionExpiry).add(this.props.serverOffset, 'milliseconds')})
    this.setState({auctionExpirySet: data.auctionExpirySet})
    this.setState({dollarSpendingCap: data.dollarSpendingCap})

    if (data.bid && data.userHandle) {
      this.setState({currentHighBid: data.bid})
      this.setState({minBid: parseInt(data.bid, 10) + 1})
      this.setState({bid: data.bid + 1})
      this.setState({highestBidder: data.userHandle})
    }
  }

  submitBid() {
    this.setState({error: ''})
    let currentTime = this.props.serverOffset < 0 ?
      moment().subtract(this.props.serverOffset, 'milliseconds') :
      moment().add(this.props.serverOffset, 'milliseconds')
    if (currentTime > moment(this.state.auctionExpiry)) {
      this.setState({error: 'The auction for this item has completed.'})
    } else if (this.state.bid <= this.state.currentHighBid) {
      this.setState({error: 'Your bid must be higher than the current bid.'})
      this.setState({bid: parseInt(this.state.currentHighBid, 10) + 1})
    } else if (this.state.bid > this.state.dollarSpendingCap){
      this.setState({error: 'You may not bid higher than the maximum: $' + this.state.dollarSpendingCap})
      this.setState({bid: parseInt(this.state.currentHighBid, 10) + 1})
    } else {
      let body = {
        gameId: this.props.gameId,
        movieId: this.props.movie.id,
        bid: this.state.bid
      }

      apiPost('bids', body)
      .then(data => {
        if (data !== null) {
          if (data.hasOwnProperty('message')) {
              this.setState({error: data.message})
          } else {
            let message = {
              'message': 'postbid',
              'auctionID': this.state.auctionID,
              'bid': data.bid,
              'userHandle': data.userHandle,
              'auctionExpiry': data.auctionExpiry
            }
            this.webSocket.send(JSON.stringify(message))
          }
        }
      })
    }
  }

  allIn() {
    this.setState({bid: this.state.dollarSpendingCap - this.props.currentUserTotalBids}, () => { this.submitBid() })
  }

  updateHighBid(bid) {
    this.props.fetchPlayers()
    this.setState({highestBidder: bid.userHandle});
    this.setState({minBid: parseInt(bid.bid, 10) + 1});
    this.setState({bid: parseInt(bid.bid, 10) + 1});
    this.setState({currentHighBid: bid.bid});

    bid.bid === this.state.dollarSpendingCap ?
      this.timerDone(true) :
      this.setState({auctionExpiry:
        this.props.serverOffset < 0 ?
        moment(bid.auctionExpiry.toUpperCase()).subtract(this.props.serverOffset, 'milliseconds') :
        moment(bid.auctionExpiry.toUpperCase()).add(this.props.serverOffset, 'milliseconds')})

    if (this.refs.timer !== undefined) {
      this.refs.timer.resetTimer(this.state.auctionExpiry)
    }
  }

  renderMoviePoster() {
    return this.props.movie.posterUrl && this.props.movie.posterUrl !== '' ?
    (
      <div>
        <div className='posterWrapper'>
          <a
            href={this.props.movie.url}
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={this.props.movie.posterUrl}
              className='posterImage'
              alt='movie poster' />
          </a>
        </div>
        <p>{this.props.movie.title}</p>
        <p>{moment.utc(this.props.movie.releaseDate).format('dddd, MMMM Do YYYY')}</p>
      </div>
    ) : (
      <div>
        <div className='posterWrapper'>
          <a
            href={this.props.movie.url}
            target='_blank'
            rel='noopener noreferrer'>
            <i className='material-icons posterPlaceholder'>local_movies</i>
          </a>
        </div>
        <p>{this.props.movie.title}</p>
        <p>{moment.utc(this.props.movie.releaseDate).format('dddd, MMMM Do YYYY')}</p>
      </div>
    )
  }

  renderAuctionItem() {
    let currentTime = this.props.serverOffset < 0 ?
      moment().subtract(this.props.serverOffset, 'milliseconds') :
      moment().add(this.props.serverOffset, 'milliseconds')

    if (this.state.auctionExpirySet &&
        (this.state.currentHighBid >= this.state.dollarSpendingCap ||
        currentTime >= moment(this.state.auctionExpiry))) {
      return null
    }

    return !this.state.auctionStarted ? (
      <div className='movieParent'>
        {this.renderMoviePoster()}
        <button
          className='auctionButton'
          onClick={() => this.beginAuction(this.props.movie.id)}>
          JOIN AUCTION
        </button>
        <p>{this.state.error}</p>
      </div>
    ) : (
      <div className='movieParent'>
        {this.renderMoviePoster()}
        <Timer ref='timer'
          parentCallback={this.timerDone}
          auctionExpiry={this.state.auctionExpiry} />
        <p>
          {'Current bid: ' + this.state.highestBidder + ' $' + this.state.currentHighBid}
        </p>
        <input
          className='bidInput'
          id='bid'
          name='bid'
          type='number'
          min={this.state.minBid}
          step='1'
          value={this.state.bid}
          onChange={(event) => this.updateBid(event)}
          onKeyDown={this.handleKeyDown}
          />
        <button
          className='auctionButton'
          onClick={() => this.submitBid()}>
          SUBMIT BID
        </button>
        <button
          className='auctionButton'
          onClick={() => this.allIn()}>
          ALL-IN
        </button>
        <p>{this.state.error}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderAuctionItem()}
      </div>
    )
  }
}

export default AuctionItem;
