'use strict';
const express = require("express");
const server = express();
const weatherData = require("./data/weather.json");
const axios= require("axios");
const cors = require("cors");
server.use(cors());
require("dotenv").config();

const PORT = process.env.PORT || 3060;
let arr = [];
//localhost:3060/
server.get("/", rootHandler);
//localhost:3060/getCity?cityLan=31.9515694&cityLon=35.9239625
server.get("/getCity", cityHandler);

//localhost:3060/
function rootHandler(req, res) {
  res.send("Hello you are in the root , I'm Roaa");
}
//localhost:3060/getCity?cityLan=31.9515694&cityLon=35.9239625
function cityHandler(req, res) {
  let lan = req.query.cityLan;
  let lon = req.query.cityLon;
  let getCity = weatherData.city.find((item) => {
    if (item.lat == lan && item.lon == lon) return item.city_name;
  });
  res.send(getCity);
}


//localhost:3060/forcast?lat=31.5126057&lon=34.42573776

server.get("/forcast",wetherHandler);

function wetherHandler(req, res){
  let lat = req.query.lat;
  let lon = req.query.lon;
  let key=process.env.WEATHER_API_KEY;
  let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`
//https://api.weatherbit.io/v2.0/forecast/daily?lat=31.5126057&lon=34.42573776
// console.log(lat);
// console.log(lon);
// console.log(key);
// console.log('result');

axios.get(weatherUrl).then(result =>{
  console.log(result);
  const weatherArray = result.data.data.map(item=>{
  return new Forcast (item);
  })
res.send(weatherArray);
})
.catch(err =>{
  res.send(`there is an error in getting the data => ${err}`);
})
}
class Forcast{
  constructor(item){
      this.description = item.weather.description;
      this.date = item.valid_date;
  }
}
server.get('/movies', getMoviesHandler)
  function  getMoviesHandler(req, res) {
    let cityName = req.query.cityName;
    let key = process.env.MOVIE_API_KEY;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityName}&page=1`;
    axios.get(url).then(result =>{
        const movieArray = result.data.results.map(item=>{
        return new Movie (item);
        })
    res.send(movieArray);
    })
    .catch(err =>{
      res.send(`there is an error in getting the data => ${err}`);
    })
  }
class Movie {
    constructor(item) {
        this.original=item.original_title;
        this.overview=item.overview;
        this.averageVotes=item.vote_average;
        this.totalVotes=item.total_votes;
        this.imagel=`https://image.tmdb.org/t/p/original${item.poster_path}`;
        this.popularity=item.popularity;
        this.releasedOn=item.release_date;
    }
    }
  
 //localhost:3060 .....
 server.get("*", (req, res) => {
  res.status(404).send("sorry, this page not found");
});
server.listen(process.env.PORT || 3060, () => {
  console.log(`Listening on PORT ${PORT}`);
});
