import React, { Component } from 'react';
import AuctionItem from './auctionItem.js'
import Chat from './chat.js'
import '../styles/auctionHome.css'

class AuctionHome extends Component {
  constructor(props){
    super(props)
    this.state = {
    }

    this.renderAuctionPage = this.renderAuctionPage.bind(this)
  }

  renderAuctionPage() {
    return this.props.movies.map((movie) => {
      return <AuctionItem
        key={movie.id}
        movie={movie}
        gameId={this.props.gameId}/>
    })
  }

  render() {
    return (
      <div>
        <div id="auctionHomeDiv">
          {this.renderAuctionPage()}
        </div>
        <Chat
          gameId={this.props.gameId} />
      </div>
    )
  }
}

export default AuctionHome;
