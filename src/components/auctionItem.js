import React, { Component } from 'react';
import moment from 'moment'
import '../styles/auctionItem.css'

class AuctionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: ''

    }

    this.beginAuction = this.beginAuction.bind(this)
    this.renderAuctionPage = this.renderAuctionItem.bind(this)
  }

  componentDidMount(){
    document.addEventListener('click', this.setState({error: ''}))
  }

  componentWillUnmount(){
   document.removeEventListener('click', this.setState({error: ''}))
 }


  beginAuction(movieId) {
    fetch('https://api-dev.couchsports.ca/movies/bid/' + this.props.gameId + '/' + movieId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
      }
    })
    .then(res => res.json())
    .then((data) => {
      if(!data.auctionExpirySet) {
        this.setState({error: 'The auction for this item has not begun yet.'})
      }
    })
    .catch(console.log);
  }

  renderAuctionItem() {
      return (
        <div className='movieParent'>
          <div className='posterWrapper'>
            <img
              src={this.props.movie.posterUrl}
              className='posterImage'
              alt='movie poster' />
          </div>
          <p>{this.props.movie.title}</p>
          <p>{moment(this.props.movie.releaseDate).format('dddd, MMMM Do YYYY')}</p>
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
