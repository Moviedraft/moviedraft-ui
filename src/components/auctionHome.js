import React, { Component } from 'react'
import moment from 'moment'
import PubNub from 'pubnub'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { apiGet, apiPatch } from '../utilities/apiUtility.js'
import { getCurrentTime } from '../utilities/dateTimeUtility.js'
import AuctionItem from './auctionItem.js'
import Chat from './chat.js'
import '../styles/auctionHome.css'
import '../styles/global.css'

class AuctionHome extends Component {
  _isMounted = false;
  _auctionPlayersColumnNames = ['Name', 'Money Remaining', 'Movies Purchased'];

  constructor(props){
    super(props)
    this.state = {
      movies: this.props.movies,
      auctionDurationLoaded: false,
      currentUser: this.props.currentUser,
      currentTime: '',
      auctionCountdownIntervalId: '',
      auctionDuration: null,
      players: [],
      playersLoaded: false,
      bids: [],
      bidsLoaded: false,
      minimumBid: this.props.minimumBid
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
    this.getBids = this.getBids.bind(this)
    this.fetchPlayers = this.fetchPlayers.bind(this)
    this.beginAuction = this.beginAuction.bind(this)
    this.updateHighBid = this.updateHighBid.bind(this)
    this.endAuction = this.endAuction.bind(this)
    this.renderAuctionPage = this.renderAuctionPage.bind(this)
    this.renderAuctionEndButton = this.renderAuctionEndButton.bind(this)
  }

  componentDidMount() {
    this.webSocket.onopen = () => {
      this.joinGameAuction()
      this.setState({connectedToWebSocket: true})
    }

    this.webSocket.onmessage = (event) => {
      let eventData = JSON.parse(event.data)

      if(eventData.message.hasOwnProperty('action') && eventData.message.action === 'beginauction') {
        this.beginAuction(eventData.message)
      }

      if(eventData.message.hasOwnProperty('action') && eventData.message.action === 'closeAuction') {
        window.location.reload(true)
      }

      if(eventData.message.hasOwnProperty('action') && eventData.message.action === 'joinedgameauction') {
        this.fetchPlayers()
      }

      if(eventData.message.hasOwnProperty('auctionID')) {
        this.updateHighBid(eventData.message)
        this.fetchPlayers()
      }
    }

    this.webSocket.onclose = () => {
      this.leaveGameAuction()
    }

    window.addEventListener('beforeunload', () =>{
      this.leaveGameAuction()
    })

    this.setDuration()
    this.getBids()
    this.fetchPlayers()

    getCurrentTime()
    .then(data => {
      this.setState({currentTime: data.time})
    })

    let intervalId = setInterval(() => {
      if (this.state.auctionDuration > 0) {
        this.setDuration()
      } else {
        clearInterval(intervalId)
      }
    }, 1000)

    this.setState({auctionCountdownIntervalId: intervalId})
    this.setState({auctionDurationLoaded: true}, () => {
      if (this.state.auctionDuration && this.state.auctionDuration <= 0) {
        let message = 'System: ' + this.state.currentUser.userHandle + ' has entered the auction room.'
        this.sendMessage(message)
      }
    })

    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    clearInterval(this.state.auctionCountdownIntervalId)
    this.leaveGameAuction()

    if (this.state.auctionDuration && this.state.auctionDuration <= 0) {
      let message = 'System: ' + this.state.currentUser.userHandle + ' has left the auction room.'
      this.sendMessage(message)
    }
  }

  sendMessage(message) {
    message = moment.utc().format() + '_' + message
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

  getBids() {
    apiGet('bids/' + this.props.gameId)
    .then(data => {
      if (data === null) {
        this.props.handleError('Unable to retrieve auction bids. Please refresh and try again.')
      } else {
        let bids = data.bids
        bids.map(bid => ({
          ...bid,
          auctionStarted: false
        }))

        this.setState({bids: bids})
        this.setState({bidsLoaded: true})
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
        this.setState({currentUserTotalBids: sortedPlayers.find(player => player.id === this.state.currentUser.id).totalSpent})
        this.setState({playersLoaded: true})
      }
    })
  }

  beginAuction(message) {
    getCurrentTime().then(data => {
      this.setState({currentTime: data.time})
    })

    let index = this.state.bids.findIndex(existingBid => existingBid.game_id === message.gameID && existingBid.movie_id === message.movieID)
    let movieIndex = this.state.movies.findIndex(movie => movie.id === message.movieID)

    if (index > -1) {
      let bidsCopy = [...this.state.bids]
      bidsCopy[index].auctionExpiry = message.auctionExpiry.toUpperCase()
      bidsCopy[index].auctionExpirySet = true
      bidsCopy[index].auctionStarted = true
      bidsCopy[index].bid = 0
      bidsCopy[index].userHandle = ''

      this.state.movies.splice(0, 0, this.state.movies.splice(movieIndex, 1)[0])

      this.setState({bids: bidsCopy})
    }

    if (this.refs.timer !== undefined) {
      this.refs.timer.resetTimer(this.state.auctionExpiry)
    }
  }

  updateHighBid(bid) {
    getCurrentTime().then(data => {
      this.setState({currentTime: data.time})
    })

    const index = this.state.bids.findIndex(existingBid => existingBid.game_id + existingBid.movie_id === bid.auctionID)

    if (index > -1) {
      let bidsCopy = [...this.state.bids]
      bidsCopy[index].auctionStarted = true
      bidsCopy[index].userHandle = bid.userHandle
      bidsCopy[index].bid = parseInt(bid.bid, 10)
      bidsCopy[index].currentHighBid = bid.bid

      bidsCopy[index].bid === this.state.dollarSpendingCap ?
        bidsCopy[index].auctionExpiry = moment(bid.auctionExpiry.toUpperCase()).subtract(1, 'y').format() :
        bidsCopy[index].auctionExpiry = bid.auctionExpiry.toUpperCase()

      this.setState({bids: bidsCopy})
    }

    if (this.refs.timer !== undefined) {
      this.refs.timer.resetTimer(bid.auctionExpiry.toUpperCase())
    }
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
      <h5>
        Auction will be held on {moment(this.props.auctionDate).format('LLLL')}
        <span className='auctionCountdownSpan'>
          &nbsp;
          (now)
        </span>
      </h5> :
      <h5>
        Auction will be held on {moment(this.props.auctionDate).format('LLLL')}
        <span className='auctionCountdownSpan'>
          &nbsp;
          ({days === 0 ? '' : days + 'd '}
          {hours < 10 ? '0' + hours : hours}:
          {minutes < 10 ? '0' + minutes : minutes}.
          {seconds < 10 ? '0' + seconds : seconds} from now)
        </span>
      </h5>
  }

  renderAuctionPlayers() {
    return this.state.players.length > 0 ?
    (
      <table id='auctionPlayersTable' className='responsive-table'>
        <thead>
          <tr>
            {this._auctionPlayersColumnNames.map((columnName, i) => (
              <th key={i}>
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.state.players.map((player, i) => {
            return (
              <tr key={player.id}>
                <td title='name' className='vertical-align-top'>{player.userHandle}</td>
                <td title='money remaining' className='vertical-align-top'>${this.props.dollarSpendingCap - player.totalSpent}</td>
                <td title='movies purchased'>
                  { !player.movies.length ? '-' :
                      player.movies
                      .sort((movie1, movie2) => moment(movie1.releaseDate) > moment(movie2.releaseDate) ? 1 : -1)
                      .map(movie => {
                        return (
                          <div key={player.id + movie.title}>
                            { movie.title + ' ($' + movie.cost + ')' }
                          </div>
                        )
                      })
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    ) : (
      null
    )
  }

  renderAuctionPage() {
    return this.state.movies.map((movie) => {
      return (
        <Col key={movie.id} align='center' xs={12} sm={4}>
          <AuctionItem
            key={movie.id}
            movie={movie}
            gameId={this.props.gameId}
            currentTime={this.state.currentTime}
            auctionItemsExpireInSeconds={this.props.auctionItemsExpireInSeconds}
            currentUserTotalBids={this.state.currentUserTotalBids}
            auctionStarted={this.state.bids.find(bid => bid.movie_id === movie.id).auctionStarted}
            auctionExpiry={this.state.bids.find(bid => bid.movie_id === movie.id).auctionExpiry}
            auctionExpirySet={this.state.bids.find(bid => bid.movie_id === movie.id).auctionExpirySet}
            dollarSpendingCap={this.state.bids.find(bid => bid.movie_id === movie.id).dollarSpendingCap}
            bid={this.state.bids.find(bid => bid.movie_id === movie.id).bid}
            minimumBid={this.state.minimumBid}
            userHandle={this.state.bids.find(bid => bid.movie_id === movie.id).userHandle}
            fetchPlayers={this.fetchPlayers}
            webSocket={this.webSocket}
            handleError={this.handleError}/>
        </Col>
      )
    })
  }

  renderAuctionEndButton() {
    return this.state.currentUser.id === this.props.commissionerId ?
      (
        <div id='closeAuctionButtonWrapper'>
          <Button
            id='closeAuctionButton'
            variant='outline'
            onClick={() => this.endAuction()}>
            CLOSE AUCTION
          </Button>
        </div>
      ) : (
        null
      )
  }

  render() {
    if (!this.state.auctionDurationLoaded ||
      !this.state.playersLoaded ||
      !this.state.bidsLoaded) {
      return null
    }

    return (
      <Container fluid id='auctionHomeContainer'>
        <Row>
          <Col>
            {this.renderAuctionDate()}
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Player Auction Details:</h5>
            {this.renderAuctionPlayers()}
          </Col>
        </Row>
        <Row>
          <Col>
            {this.renderAuctionEndButton()}
          </Col>
        </Row>
        <Row>
          {this.renderAuctionPage()}
        </Row>
        <Row>
          <Col>
            <Chat
              gameId={this.props.gameId} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default AuctionHome;
