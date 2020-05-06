import React, { Component } from 'react';
import moment from 'moment';
import AuctionItem from './auctionItem.js'
import Chat from './chat.js'
import '../styles/auctionHome.css'

class AuctionHome extends Component {
  _isMounted = false;
  _auctionDurationLoaded = false;

  constructor(props){
    super(props)
    this.state = {
      currentUser: '',
      webSocket: null,
      auctionCountdownIntervalId: '',
      auctionDuration: null
    }

    this.setDuration = this.setDuration.bind(this)
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
    this.endAuction = this.endAuction.bind(this)
    this.renderAuctionPage = this.renderAuctionPage.bind(this)
    this.renderAuctionEndButton = this.renderAuctionEndButton.bind(this)
  }

  webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

  componentDidMount() {
    this.fetchCurrentUser()

    let intervalId = setInterval(() => this.setDuration(), 1000);
    this.setState({auctionCountdownIntervalId: intervalId})

    this._isMounted = true

    this.webSocket.onclose = () => {
      this.webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    clearInterval(this.state.auctionCountdownIntervalId)
  }

  setDuration() {
    let timeDifference = moment(this.props.auctionDate).diff(moment())
    this.setState({auctionDuration: moment.duration(timeDifference)})
    if (this.state.auctionDuration !== null) {
      this._auctionDurationLoaded = true
    }
  }

  fetchCurrentUser() {
    fetch('https://api-dev.couchsports.ca/users/current', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(async res => {
      if (res.ok) {
        let currentUser = await res.json()
        if (this._isMounted) {
          this.setState({currentUser: currentUser})
        }
      }
    })
    .catch(error => console.log(error))
  }

  endAuction() {
    fetch('https://api-dev.couchsports.ca/games/' + this.props.gameId, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      },
      method: 'PATCH',
      body: JSON.stringify( { auctionComplete: true } )
    })
    .then(async res => {
      if (res.ok) {
        this.props.parentCallback(true)
      }
    })
    .catch(error => console.log(error))
  }

  renderAuctionDate() {
    if (this.state.auctionDuration === null) {
      return <div></div>
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
          ({days === 0 ? '' : days + 'd '}{hours}:{minutes}.{seconds} from now)
        </span>
      </h3>
  }

  renderAuctionPage() {
    return this.props.movies.map((movie) => {
      return <AuctionItem
        key={movie.id}
        movie={movie}
        gameId={this.props.gameId}
        auctionItemsExpireInSeconds={this.props.auctionItemsExpireInSeconds}
        webSocket={this.webSocket}/>
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
    if (!this._auctionDurationLoaded) {
      return <div></div>
    }

    return (
      <div>
        <div id='auctionDateDiv'>
          {this.renderAuctionDate()}
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
