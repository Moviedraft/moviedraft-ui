import React, { Component } from 'react'
import moment from 'moment'
import { apiGet } from '../utilities/apiUtility.js'
import '../styles/movies.css'

class Movies extends Component {
    constructor(props){
      super(props)
      this.state = {
        movieList: []
      }

      this.getMovies = this.getMovies.bind(this)
      this.handleCheckbox = this.handleCheckbox.bind(this)
      this.renderMovieDivs = this.renderMovieDivs.bind(this)
    }

    componentDidMount() {
      if (this.props.movies && this.props.startDate && this.props.endDate) {
        this.getMovies()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.startDate && this.props.endDate && (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate)){
        this.getMovies()
      }
    }

    getMovies() {
      apiGet(`movies?startDate=${this.props.startDate}&endDate=${this.props.endDate}`)
      .then(data => {
        if (data === null) {
          this.props.handleError('Could not load movies. Please try again.')
        } else {
          this.setState({movieList: data.movies})
        }
      })
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
            defaultChecked={this.props.movies && this.props.movies.some(propMovie => movie.id === propMovie.id)}
            onChange={(event) => this.handleCheckbox(event, movie)} />
          <label htmlFor={movie.title}>
            {movie.title} - {moment.utc(movie.releaseDate).format('ll')}
          </label>
        </div>
        )
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
