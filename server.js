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
//https://api.themoviedb.org/3/search/movie?api_key=730795695fbd9330eebb90692a123233&query=usa&page=1&include_adult=false
  //localhost:3060/movies?cityName=amman
  server.get('/movies', getMoviesHandler)
  function  getMoviesHandler(req, res) {
    let cityName = req.query.cityName;
    let key = process.env.MOVIE_API_KEY;
    console.log(cityName,key);
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityName}&page=1`;
    console.log('outside');
    axios.get(url).then(result =>{
        console.log('inside');
        const movieArray = result.data.results;
        res.send(movieArray)
    })
  }
 //localhost:3060 .....
 server.get("*", (req, res) => {
  res.status(404).send("sorry, this page not found");
});
server.listen(process.env.PORT || 3060, () => {
  console.log(`Listening on PORT ${PORT}`);
});
