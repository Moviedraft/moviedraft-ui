import React, { Component } from 'react'
import moment from 'moment'
import { apiGet, apiPost } from '../utilities/apiUtility.js'
import '../styles/auctionItem.css';
import Timer from './timer.js';

class AuctionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      auctionStarted: this.props.auctionStarted,
      currentTime: this.props.currentTime,
      auctionExpiry: this.props.auctionExpiry,
      auctionExpirySet: this.props.auctionExpirySet,
      dollarSpendingCap: this.props.dollarSpendingCap,
      minBid: 0,
      currentHighBid: this.props.bid ?? 0,
      highestBidder: this.props.userHandle ?? '',
      bid: this.props.bid && this.props.bid > 1 ? parseInt(this.props.bid, 10) + 1 : 1,
      timerDone: false,
      error: '',
      auctionID: this.props.gameId + this.props.movie.id
    }

    this.updateBid = this.updateBid.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.timerDone = this.timerDone.bind(this)
    this.beginAuction = this.beginAuction.bind(this)
    this.submitBid = this.submitBid.bind(this)
    this.allIn = this.allIn.bind(this)
    this.renderMoviePoster = this.renderMoviePoster.bind(this)
    this.renderAuctionItem = this.renderAuctionItem.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.auctionExpiry !== this.props.auctionExpiry) {
      this.setState({auctionStarted: this.props.auctionStarted})
      this.setState({currentTime: this.props.currentTime})
      this.setState({auctionExpiry: this.props.auctionExpiry})
      this.setState({currentHighBid: this.props.bid})
      this.setState({highestBidder: this.props.userHandle})
      this.setState({bid: parseInt(this.props.bid, 10) + 1})

      if (this.refs.timer !== undefined) {
        this.refs.timer.resetTimer(this.props.auctionExpiry)
      }
    }
  }

  updateBid(event) {
   this.setState({bid: event.target.value})
 }

  handleKeyDown(event) {
    if (['Enter'].includes(event.key)) {
      this.submitBid()
    }
  }

  timerDone(timerDone) {
    this.setState({auctionExpiry: moment().subtract(1, 'y')})
    this.setState({timerDone: timerDone})
    this.setState({error: ''})
	}

  beginAuction(movieId) {
    apiGet('bids/' + this.props.gameId + '/' + movieId)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to begin auction. Please refresh and try again.')
      } else {
        if(!data.auctionExpirySet) {
          this.setState({error: 'The auction for this item has not begun yet.'})
        } else if (moment(this.state.currentTime) < moment(data.auctionExpiry)) {
          this.setState({auctionStarted: true})
          this.setState({auctionExpiry: data.auctionExpiry})
          this.setState({auctionExpirySet: true})

          if (this.state.highestBidder === '') {
            let message = {
              'message': 'beginauction',
              'gameID': this.props.gameId,
              'movieID': this.props.movie.id,
              'auctionExpiry': data.auctionExpiry
            }
            this.props.webSocket.send(JSON.stringify(message))
          }
        } else {
          this.setState({error: 'The auction has completed for this item.'})
        }
      }
    })
  }

  submitBid() {
    this.setState({error: ''})
    if (moment(this.state.currentTime) > moment(this.state.auctionExpiry)) {
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
              'gameID': this.props.gameId,
              'auctionID': this.state.auctionID,
              'bid': data.bid,
              'userHandle': data.userHandle,
              'auctionExpiry': data.auctionExpiry
            }
            this.props.webSocket.send(JSON.stringify(message))
          }
        }
      })
    }
  }

  allIn() {
    this.setState({bid: this.state.dollarSpendingCap - this.props.currentUserTotalBids}, () => { this.submitBid() })
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
    if ((this.props.auctionExpirySet || this.state.auctionExpirySet) &&
      (this.state.currentHighBid >= this.state.dollarSpendingCap ||
      moment(this.state.currentTime) >= moment(this.state.auctionExpiry))) {

        if (this.state.highestBidder === '') {
          return (
            <div className='movieParent'>
              {this.renderMoviePoster()}
              <p>No bid placed</p>
            </div>
          )
        }

        return (
          <div className='movieParent'>
          {this.renderMoviePoster()}
          <p>The winner was {this.state.highestBidder} with ${this.state.currentHighBid}</p>
        </div>
      )
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
