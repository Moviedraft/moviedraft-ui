import React, { Component } from 'react';
import moment from 'moment';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
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
      auctionItemChannelId: this.props.gameId + this.props.movie.id
    }

    this.pubnub = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.gameId + this.props.gameId
    });

    this.auctionItemPubNub = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.gameId + this.props.gameId + this.props.movie.id
    });

    this.callbackFunction = this.callbackFunction.bind(this)
    this.updateBid = this.updateBid.bind(this)
    this.checkWinner = this.checkWinner.bind(this)
    this.beginAuction = this.beginAuction.bind(this)
    this.submitBid = this.submitBid.bind(this)
    this.renderAuctionPage = this.renderAuctionItem.bind(this)
    this.setStates = this.setStates.bind(this)
    this.publishHighBid = this.publishHighBid.bind(this)
  }

  callbackFunction(timerDone) {
      this.setState({timerDone: timerDone})
      this.setState({error: ''})
      this.setState({auctionStarted: false})
	}

  componentDidMount(){
    document.addEventListener('click', this.setState({error: ''}))

    this.auctionItemPubNub.addListener({
      message: messageEvent => {
        let splitMessage = messageEvent.message.split(' ')
        this.setState({highestBidder: splitMessage[0]});
        this.setState({minBid: parseInt(splitMessage[1], 10) + 1});
        this.setState({bid: parseInt(splitMessage[1], 10) + 1});
        this.setState({currentHighBid: splitMessage[1]});

        this.setState({auctionExpiry: moment(splitMessage[2])})
        this.refs.timer.resetTimer(splitMessage[2])
      }
    });

    this.auctionItemPubNub.subscribe({
      channels: [this.state.auctionItemChannelId],
      withPresence: true
    });

    this.auctionItemPubNub.fetchMessages(
      {
        channels: [this.state.auctionItemChannelId],
        count: 1
      },
      (status, response) => {
        if (response.channels && this.state.auctionItemChannelId in response.channels) {
          response.channels[this.state.auctionItemChannelId].forEach((message) => {
            let splitMessage = message.message.split(' ')
            this.setState({highestBidder: splitMessage[0]});
            this.setState({minBid: parseInt(splitMessage[1], 10) + 1});
            this.setState({bid: parseInt(splitMessage[1], 10) + 1});
            this.setState({currentHighBid: splitMessage[1]});
          });
        }
      }
    );
  }

  componentWillUnmount(){
   document.removeEventListener('click', this.setState({error: ''}))

   this.pubnub.unsubscribe({ channels: [this.state.auctionItemChannelId] });
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
        if (!res.ok) {
          let message = jsonRes.message
          if (message.includes('closed')) {
            this.setState({error: 'Auction is closed for this item.'})
          }
          if (res.status === 400) {
            this.setState({error: message})
          }
        }
        if (jsonRes.bid) {
          this.setState({currentHighBid: jsonRes.bid})
          this.setState({minBid: parseInt(jsonRes.bid, 10) + 1})
          this.setState({bid: jsonRes.bid + 1})
          this.setState({highestBidder: jsonRes.userHandle})

          this.publishHighBid(jsonRes.auctionExpiry)
        }
      })
      .catch(error => console.log(error))
    }
  }

  publishHighBid(auctionExpiry) {
    let channel = this.state.auctionItemChannelId
    let message = this.state.highestBidder + ' ' + this.state.currentHighBid + ' ' + auctionExpiry
    this.auctionItemPubNub.publish( {channel, message } );
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
              auctionExpiry={this.state.auctionExpiry}
              auctionItemsExpireInSeconds={this.props.auctionItemsExpireInSeconds} />
            <PubNubProvider client={this.auctionItemPubNub}>
              <p>
                {'Current bid: ' + this.state.highestBidder + ' $' + this.state.currentHighBid}
              </p>
            </PubNubProvider>
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
