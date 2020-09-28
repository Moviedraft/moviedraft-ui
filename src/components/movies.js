import React, { Component } from 'react'
import moment from 'moment'
import Form from 'react-bootstrap/Form'
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
      this.handleSelectAll = this.handleSelectAll.bind(this)
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
        if (!(this.props.movies.filter(x => x.id === movie.id).length > 0)) {
          this.props.movies.push(movie)
        }
      } else {
        const index = this.props.movies.findIndex((x) => x.id === movie.id)
        this.props.movies.splice(index, 1)
      }
      this.forceUpdate()
    }

    handleSelectAll(event) {
      this.state.movieList.forEach((movie) => {
        this.handleCheckbox(event, movie)
      })
    }

    renderMovieDivs(movies) {
      return this.state.movieList.map(movie =>
        <div
          className='movieWrapper'
          key={movie.id}
        >
          <Form.Check
            id={movie.title}
            name={movie.title}
            value={movie.id}
            label={movie.title + ' - ' + moment.utc(movie.releaseDate).format('ll')}
            checked={(this.props.movies && this.props.movies.some(propMovie => movie.id === propMovie.id))}
            onChange={(event) => this.handleCheckbox(event, movie)}
          />
        </div>
      )
    }

    render() {
      if (this.state.movieList.length > 0) {
        return (
          <Form>
            <Form.Group id='movieFormGroup'>
              <Form.Label>Movies to Auction</Form.Label>
              <Form.Text className='text-muted'>
                Select the Movies you would like to be auctioned.
              </Form.Text>
              <div id='selectAllWrapper'>
                <Form.Check
                  label='select all'
                  id='selectAllMovies'
                  name='selectAllMovies'
                  onChange={(event => this.handleSelectAll(event))}
                  checked={this.state.movieList.every(x => this.props.movies.some(y => x.id === y.id))}
                />
              </div>
              {this.renderMovieDivs(this.state.movieList)}
            </Form.Group>
          </Form>
        )
      }

      return null
    }
}

export default Movies;
