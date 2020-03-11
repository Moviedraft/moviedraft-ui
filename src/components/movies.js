import React, { Component } from 'react';
import moment from 'moment';
import '../styles/movies.css'

class Movies extends Component {
    constructor(props){
      super(props)
      this.state = {
        movieList: []
      }

      this.handleCheckbox = this.handleCheckbox.bind(this)
      this.renderMovieDivs = this.renderMovieDivs.bind(this)
    }

    handleCheckbox(event, movie) {
      if(event.target.checked) {
        this.props.movies.push(movie)
      } else {
        const index = this.props.movies.findIndex((x) => x.id === movie.id);
        this.props.movies.splice(index, 1);
      }
    }

    renderMovieDivs(movies) {
      return this.state.movieList.map(movie =>
        <div key={movie.id} className='movie'>
          <input
            type='checkbox'
            value={movie.id}
            id={movie.title}
            name={movie.title}
            defaultChecked
            onChange={(event) => this.handleCheckbox(event, movie)} />
          <label htmlFor={movie.title}>
            {movie.title} - {moment(movie.releaseDate).format('ll')}
          </label>
        </div>
        )
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.startDate && this.props.endDate && (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate)){
        fetch(`https://api-dev.couchsports.ca/movies?startDate=${this.props.startDate}&endDate=${this.props.endDate}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('CouchSportsToken')
          }
        })
        .then(res => res.json())
        .then((data) => {
          this.setState({movieList: data.movies})
          data.movies.forEach((movie) => {
            this.props.movies.push(movie)
          });
        })
      }
    }

    render() {
      return (
        <div id='moviesWrapper'>
          {this.renderMovieDivs(this.state.movieList)}
        </div>
      )
    }
}

export default Movies;
