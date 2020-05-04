import React, { Component } from 'react';
import AuctionItem from './auctionItem.js'
import Chat from './chat.js'
import '../styles/auctionHome.css'

class AuctionHome extends Component {
  _isMounted = false;

  constructor(props){
    super(props)
    this.state = {
      currentUser: '',
      webSocket: null
    }

    this.fetchCurrentUser = this.fetchCurrentUser.bind(this)
    this.endAuction = this.endAuction.bind(this)
    this.renderAuctionPage = this.renderAuctionPage.bind(this)
    this.renderAuctionEndButton = this.renderAuctionEndButton.bind(this)
  }

  webSocket = new WebSocket('wss://bqq55pqgj9.execute-api.us-east-2.amazonaws.com/Test')

  componentDidMount() {
    this.fetchCurrentUser()
    this._isMounted = true

    this.webSocket.onclose = () => {
      this.webSocket = new WebSocket('wss://bqq55pqgj9.execute-api.us-east-2.amazonaws.com/Test')
    }
  }

  componentWillUnmount() {
    this._isMounted = false
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
    return (
      <div>
        <div id="auctionHomeDiv">
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
