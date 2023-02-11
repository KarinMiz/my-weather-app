const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const RAIN_CODE = 60;
const PORT = 3000;
var temperature;
var isRain;

app.set("port", PORT);
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

// CORS middleware
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.get('/getWeather', (req, res) => {
  const { latitude, longitude } = req.query;
  getWeather(latitude, longitude);
  res.send(`${temperature}`);
});

app.get('/isRainy', (req, res) => {
  res.send(`${isRain}`);
});

// Get current temperature according lat&long
function getWeather(lat, long) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
  request(url, (error, res, body) => {
    if (error) {
      return console.log(error)
    };

    if (!error && res.statusCode == 200) {
      var objectValue = JSON.parse(body);
      temperature = objectValue["current_weather"].temperature;

      // weathercodeain > 60 => Its rainy now (API definitions)
      if (objectValue["current_weather"].weathercodeain > RAIN_CODE)
        isRain = "true";
      else
        isRain = "false";
      
    };
  });

};

