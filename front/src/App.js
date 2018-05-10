import React, { Component } from 'react';
import fetch from 'node-fetch'
import './App.css'

const Movie = ({id,name,genre,removeMovie}) => {
  return(
    <div>
      <h2>Movie Name:{name}</h2>
      <h3>Genre: {genre}</h3>
      <a className="crud" href={'//localhost:8888/edit/' + id}>edit</a>
      <a className="crud" href={'//localhost:8888/delete/' + id}>delete</a>
      <hr/>
    </div>
  )
}
class App extends Component {
  state = {
    movies:[]
  }
  componentDidMount = () => {
    fetch("//localhost:8888/")
    .then((res) => res.json())
    .then((res) => this.setState({movies:res.movies}))
  }
  handleSubmit(e){
    e.preventDefault();
    let reqBody = {
      name: e.target.movie_name.value,
      genre: e.target.movie_genre.value
    };
    // console.log(reqBody)
    fetch("//localhost:8888/create_movie", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then((res) => res.json())
    .then((res) => console.log(res))
     e.target.movie_name.value = ''
     e.target.movie_genre.value = ''
  }
  // removeMovie = (movie) => {
  //   const movies = this.state.movies
  //   const index = movies.indexOf(movie)
  //   console.log(index)
  //   if(index<0){
  //     return;
  //   }
  //   movies.splice(index,1)
  // }
  renderMovies = () => {
    return(
      this.state.movies.map((movie) => <Movie name={movie.Name} genre={movie.Genre} key={movie.ID} removeMovie={() => this.removeMovie(movie)} id={movie.ID}/>)
    )
  }
  render() {
    const movie_list = this.renderMovies()
    return (
      <div className="App">
              <form onSubmit={this.handleSubmit} className="movie-form">
                <div>
                  <label>Name of the Movie:</label><br/>
                  <input type="text" name="movie_name" required/>
                </div>
                <div>
                  <label>Movie Genre:</label><br/>
                  <input type="text" name="movie_genre" required/>
                </div>
                <div>
                  <input type="submit" value="Submit"/>
                </div>
              </form>
              {movie_list}
        </div>
    );
  }
}

export default App;
