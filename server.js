const express = require("express");
const server = express();
const weatherData = require("./data/weather.json");
const cors = require("cors");
server.use(cors());

const PORT = 3060;
let arr =[]
server.get("/", (req, res) => {
  res.send("Hello you are in the root , I\'m Roaa");
});

class Forecast {
  constructor( date1, description1){
       this.date = date1;
       this.description= description1;
  }
}

//localhost:3060/getCity?cityLan=31.9515694&cityLon=35.9239625
server.get('/getCity',(req,res)=>{
  let lan=req.query.cityLan;
  let lon=req.query.cityLon;
      let getCity = weatherData.city.find(item=>{
          if(item.lat == lan && item.lon==lon)
          return item.city_name;
      })
      // let forecast1 = new Forecast(getCity.date,getCity.description) ;
      // arr.push(forecast1);
      res.send(getCity);
  })

// //localhost:3000 .....
server.get('*',(req,res) =>{
    res.status(404).send('sorry, this page not found');
})

server.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`);
})
