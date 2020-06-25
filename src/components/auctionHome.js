import React, { Component } from 'react'
import moment from 'moment'
import PubNub from 'pubnub'
import { apiGet, apiPatch } from '../utilities/apiUtility.js'
import AuctionItem from './auctionItem.js'
import Chat from './chat.js'
import '../styles/auctionHome.css'

class AuctionHome extends Component {
  _isMounted = false;

  constructor(props){
    super(props)
    this.state = {
      auctionDurationLoaded: false,
      currentUser: '',
      auctionCountdownIntervalId: '',
      auctionDuration: null,
      players: [],
      playersLoaded: false,
      serverOffset: 0,
      bids: []
    }

    this.webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

    this.pubnub = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.gameId + this.props.gameId
    });

    this.sendMessage = this.sendMessage.bind(this)
    this.joinGameAuction = this.joinGameAuction.bind(this)
    this.leaveGameAuction = this.leaveGameAuction.bind(this)
    this.setDuration = this.setDuration.bind(this)
    this.getCurrentTime = this.getCurrentTime.bind(this)
    this.getBids = this.getBids.bind(this)
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
    this.fetchPlayers = this.fetchPlayers.bind(this)
    this.endAuction = this.endAuction.bind(this)
    this.renderAuctionPage = this.renderAuctionPage.bind(this)
    this.renderAuctionEndButton = this.renderAuctionEndButton.bind(this)
  }

  componentDidMount() {
    this.webSocket.onopen = () => {
      this.joinGameAuction()
    }

    this.setDuration()
    this.fetchCurrentUser()
    this.fetchPlayers()
    this.getBids()
    this.getCurrentTime()

    let intervalId = setInterval(() => {
      if (this.state.auctionDuration > 0) {
        this.setDuration()
      } else {
        clearInterval(intervalId)
      }
    }, 1000);
    this.setState({auctionCountdownIntervalId: intervalId})
    this.setState({auctionDurationLoaded: true})
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    clearInterval(this.state.auctionCountdownIntervalId)
    this.leaveGameAuction()

    if (this.state.auctionDuration <= 0) {
      let message = 'System: ' + this.state.currentUser.userHandle + ' has left the auction room.'
      this.sendMessage(message)
    }
  }

  sendMessage(message) {
    this.pubnub.publish(
      {
        channel: this.props.gameId,
        message,
      });
  }

  joinGameAuction() {
    let message = {
      'message': 'joingameauction',
      'gameID': this.props.gameId
    }
    this.webSocket.send(JSON.stringify(message))

    this.webSocket.onmessage = (event) => {
      let eventData = JSON.parse(event.data)

      if(eventData.message.hasOwnProperty('action') && eventData.message.gameID === this.props.gameId) {
        window.location.reload(true);
      }
    }
  }

  leaveGameAuction() {
    let message = {
      'message': 'leavegameauction',
      'gameID': this.props.gameId
    }
    this.webSocket.send(JSON.stringify(message))
  }

  setDuration() {
    let timeDifference = moment(this.props.auctionDate).diff(moment())
    this.setState({auctionDuration: moment.duration(timeDifference)})
  }

  getCurrentTime() {
    apiGet('games/time')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to retrieve current time. Please refresh and try again.')
      } else {
        let serverTime = data.time
        let serverOffset = moment(serverTime).diff(new Date());
        this.setState({serverOffset: serverOffset})
      }
    })
  }

  getBids() {
    apiGet('bids/' + this.props.gameId)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to retrieve auction bids. Please refresh and try again.')
      } else {
        this.setState({bids: data.bids})
      }
    })
  }

  fetchCurrentUser() {
    apiGet('users/current')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to load your user information. Please refresh and try again.')
      } else {
        let currentUser = data
        if (this._isMounted) {
          this.setState({currentUser: currentUser})

          if (this.state.auctionDuration <= 0) {
            let message = 'System: ' + currentUser.userHandle + ' has entered the auction room.'
            this.sendMessage(message)
          }
        }
      }
    })
  }

  fetchPlayers() {
    apiGet('games/' + this.props.gameId + '/players')
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to load players for auction amounts remaining. Please refresh and try again.')
      } else {
        let sortedPlayers = data.players.sort((player1, player2) => {
          let player1Name = player1.userHandle.toLowerCase()
          let player2Name = player2.userHandle.toLowerCase()
          if (player1.totalSpent > player2.totalSpent) return 1
          if (player1.totalSpent < player2.totalSpent) return -1
          if (player1Name > player2Name) return 1
          if (player1Name < player2Name) return -1
          return 1
        })
        this.setState({players: sortedPlayers})
        this.setState({playersLoaded: true})
      }
    })
  }

  endAuction() {
    let body = { auctionComplete: true }

    apiPatch('games/' + this.props.gameId, body)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to update auction. Please refresh and try again.')
      } else {
        let message = {
          'message': 'closegameauction',
          'gameID': this.props.gameId
        }
        this.webSocket.send(JSON.stringify(message))
      }
    })
  }

  renderAuctionDate() {
    if (this.state.auctionDuration === null) {
      return null
    }

    let days = Math.abs(moment(this.props.auctionDate).diff(moment(), 'days'))
    let hours = this.state.auctionDuration.hours()
    let minutes = this.state.auctionDuration.minutes()
    let seconds = this.state.auctionDuration.seconds()

    return moment() > moment(this.props.auctionDate) ?
      <h3>
        Auction will be held on {moment(this.props.auctionDate).format('LLLL')}
        <span className='auctionCountdownSpan'>
          &nbsp;
          (now)
        </span>
      </h3> :
      <h3>
        Auction will be held on {moment(this.props.auctionDate).format('LLLL')}
        <span className='auctionCountdownSpan'>
          &nbsp;
          ({days === 0 ? '' : days + 'd '}
          {hours < 10 ? '0' + hours : hours}:
          {minutes < 10 ? '0' + minutes : minutes}.
          {seconds < 10 ? '0' + seconds : seconds} from now)
        </span>
      </h3>
  }

  renderAuctionPlayers() {
    return this.state.players.length > 0 ?
    (
      this.state.players.map(player => {
        let amountRemaining = this.props.dollarSpendingCap - player.totalSpent
        let movieTitles =  player.movies.map(movie => movie.title + ' ($' + movie.cost + ')').join(', ')
        return (
          <div key={player.id}>
            <span>{player.userHandle}</span>{' - $' + amountRemaining + ' - ' + movieTitles}
          </div>
        )
      })
    ) : (
      null
    )
  }

  renderAuctionPage() {
    return this.props.movies.map((movie) => {
      return <AuctionItem
        key={movie.id}
        movie={movie}
        gameId={this.props.gameId}
        auctionItemsExpireInSeconds={this.props.auctionItemsExpireInSeconds}
        auctionExpiry={this.state.bids.find(bid => bid.movie_id === movie.id).auctionExpiry}
        auctionExpirySet={this.state.bids.find(bid => bid.movie_id === movie.id).auctionExpirySet}
        dollarSpendingCap={this.state.bids.find(bid => bid.movie_id === movie.id).dollarSpendingCap}
        currentHighBid={this.state.bids.find(bid => bid.movie_id === movie.id).bid}
        fetchPlayers={this.fetchPlayers}
        serverOffset={this.state.serverOffset}
        handleError={this.handleError}/>
    })
  }

  renderAuctionEndButton() {
    return this.state.currentUser.id === this.props.commissionerId ?
      (
        <div id='auctionEndButton'>
          <button
            onClick={() => this.endAuction()}>
            CLOSE AUCTION
          </button>
        </div>
      ) : (
        null
      )
  }

  render() {
    if (!this.state.auctionDurationLoaded || !this.state.playersLoaded) {
      return <div></div>
    }

    return (
      <div>
        <div id='auctionDateDiv'>
          {this.renderAuctionDate()}
        </div>
        <div id='auctionPlayersDiv'>
          <h3>
            Auction Details:
          </h3>
          {this.renderAuctionPlayers()}
        </div>
        <div id='auctionHomeDiv'>
          {this.renderAuctionPage()}
        </div>
        <div>
          {this.renderAuctionEndButton()}
        </div>
        <Chat
          gameId={this.props.gameId} />
      </div>
    )
  }
}

export default AuctionHome;
