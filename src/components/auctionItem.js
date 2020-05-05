import React, { Component } from 'react';
import moment from 'moment';
import PubNub from 'pubnub';
import '../styles/auctionItem.css';
import Timer from './timer.js';

class AuctionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      auctionStarted: false,
      auctionExpiry: '',
      dollarSpendingCap: 0,
      minBid: 0,
      currentHighBid: 0,
      highestBidder: '',
      bid: 1,
      timerDone: false,
      error: '',
      auctionID: this.props.gameId + this.props.movie.id,
      connectedToWebSocket: false
    }

    this.pubnub = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.gameId + this.props.gameId
    });

    this.callbackFunction = this.callbackFunction.bind(this)
    this.joinAuction = this.joinAuction.bind(this)
    this.updateBid = this.updateBid.bind(this)
    this.checkWinner = this.checkWinner.bind(this)
    this.beginAuction = this.beginAuction.bind(this)
    this.submitBid = this.submitBid.bind(this)
    this.renderAuctionPage = this.renderAuctionItem.bind(this)
    this.setStates = this.setStates.bind(this)
    this.updateHighBid = this.updateHighBid.bind(this)
  }

  callbackFunction(timerDone) {
    this.setState({timerDone: timerDone})
    this.setState({error: ''})
    this.setState({auctionStarted: false})
	}

  componentDidMount() {
    this.props.webSocket.onopen = () => {
      this.setState({connectedToWebSocket: true})
    }
  }

  componentWillUnmount() {
    if (this.state.connectedToWebSocket) {
      let message = {
        'message': 'leaveauction',
        'auctionID': this.state.auctionID
      }
      this.props.webSocket.send(JSON.stringify(message))
    }
  }

  joinAuction() {
    let message = {
      'message': 'joinauction',
      'auctionID': this.state.auctionID
    }
    this.props.webSocket.send(JSON.stringify(message))

    this.props.webSocket.onmessage = (event) => {
      let eventData = JSON.parse(event.data)

      if(eventData.message.hasOwnProperty('auctionExpiry')) {
        this.updateHighBid(eventData.message)
      }
    }
  }

 updateBid(event) {
   this.setState({bid: event.target.value})
 }

 checkWinner() {
   let message = this.state.highestBidder === '' && this.state.currentHighBid === 0 ?
     (
       'System: No bid was placed for "' +
       this.props.movie.title +
       '"'
     ) : (
       'System: ' +
       'The winner of the auction for "' +
       this.props.movie.title +
       '" was ' +
       this.state.highestBidder +
       ' with a bid of $' +
       this.state.currentHighBid
     )

   this.pubnub.publish(
     {
       channel: this.props.gameId,
       message: message
     }
   );
 }

  beginAuction(movieId) {
    fetch('https://api-dev.couchsports.ca/bids/' + this.props.gameId + '/' + movieId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      if(!data.auctionExpirySet) {
        this.setState({error: 'The auction for this item has not begun yet.'})
      } else if (moment() < moment(data.auctionExpiry)) {
        this.setStates(data)
        this.setState({auctionStarted: true})
        this.joinAuction()
      } else {
        this.setStates(data)
        this.setState({error: 'The auction has completed for this item.'})
      }
    })
    .catch(error => console.log(error));
  }

  setStates(data) {
    this.setState({error: ''})
    this.setState({auctionExpiry: moment(data.auctionExpiry)})
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

    if (moment() > moment(this.state.auctionExpiry)) {
      this.setState({error: 'The auction for this item has completed.'})
    } else if (this.state.bid <= this.state.currentHighBid) {
      this.setState({error: 'Your bid must be higher than the current bid.'})
      this.setState({bid: parseInt(this.state.currentHighBid, 10) + 1})
    } else if (this.state.bid > this.state.dollarSpendingCap){
      this.setState({error: 'You may not bid higher than the maximum: $' + this.state.dollarSpendingCap})
      this.setState({bid: parseInt(this.state.currentHighBid, 10) + 1})
    } else {
      fetch('https://api-dev.couchsports.ca/bids', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('CouchSportsToken')
        },
        method: 'POST',
        body: JSON.stringify( { gameId: this.props.gameId, movieId: this.props.movie.id, bid: this.state.bid } )
      })
      .then(async res => {
        let jsonRes = await res.json()
        if (res.ok) {
          let message = {
            'message': 'postbid',
            'auctionID': this.state.auctionID,
            'bid': jsonRes.bid,
            'userHandle': jsonRes.userHandle,
            'auctionExpiry': jsonRes.auctionExpiry
          }
          this.props.webSocket.send(JSON.stringify(message))
        }
        else {
          let message = jsonRes.message
          if (message.includes('closed')) {
            this.setState({error: 'Auction is closed for this item.'})
          }
          if (res.status === 400) {
            this.setState({error: message})
          }
        }
      })
      .catch(error => console.log(error))
    }
  }

  updateHighBid(bid) {
    this.setState({highestBidder: bid.userHandle});
    this.setState({minBid: parseInt(bid.bid, 10) + 1});
    this.setState({bid: parseInt(bid.bid, 10) + 1});
    this.setState({currentHighBid: bid.bid});
    this.setState({auctionExpiry: moment(bid.auctionExpiry.toUpperCase())})

    if (this.refs.timer !== undefined) {
      this.refs.timer.resetTimer(this.state.auctionExpiry)
    }
  }

  renderAuctionItem() {
      return this.state.auctionStarted && moment() < moment(this.state.auctionExpiry) ?
        (
          <div className='movieParent'>
            <div className='posterWrapper'>
              <img
                src={this.props.movie.posterUrl}
                className='posterImage'
                alt='movie poster' />
            </div>
            <p>{this.props.movie.title}</p>
            <Timer ref='timer'
              parentCallback={this.callbackFunction}
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
              />
            <button
              className='auctionButton'
              onClick={() => this.submitBid()}>
              SUBMIT BID
            </button>
            <p>{this.state.error}</p>
          </div>
        ) : moment() > moment(this.state.auctionExpiry) ?
          (
            <div className='movieParent'>
              <div className='posterWrapper'>
                <img
                  src={this.props.movie.posterUrl}
                  className='posterImage'
                  alt='movie poster' />
              </div>
              <p>{this.props.movie.title}</p>
              <p>{moment.utc(this.props.movie.releaseDate).format('dddd, MMMM Do YYYY')}</p>
              <button
                className='auctionButton'
                onClick={() => this.checkWinner()}>
                CHECK WINNER
              </button>
              <p>{this.state.error}</p>
            </div>
          ) : (
            <div className='movieParent'>
              <div className='posterWrapper'>
                <img
                  src={this.props.movie.posterUrl}
                  className='posterImage'
                  alt='movie poster' />
              </div>
              <p>{this.props.movie.title}</p>
              <p>{moment.utc(this.props.movie.releaseDate).format('dddd, MMMM Do YYYY')}</p>
              <button
                className='auctionButton'
                onClick={() => this.beginAuction(this.props.movie.id)}>
                BEGIN AUCTION
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
