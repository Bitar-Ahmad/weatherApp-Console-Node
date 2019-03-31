const yargs = require('yargs');
const request = require('request');
var rp = require('request-promise');
const argv = yargs
.options('address', {
  address: {
    describe:'Address for fetching weather',
    demandOption:true,
    alias:'-a',
    type:'String'
}})
.help('h', 'help')
.argv;


const geoLocation = (address, callBack) => {
  const encodedCode = encodeURIComponent(address);
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=QtQDRbLgJ1E8QqkWbLInELheDX56xJx5&location=${encodedCode}`;

  const tags = request({
    uri:url
    // json:true
  }, (err , response , body) => {
      if(!err && response.statusCode === 200) {
        callBack(undefined , {
          lattitude:JSON.parse(body).results[0].locations[0].latLng.lat,
          longitude:JSON.parse(body).results[0].locations[0].latLng.lng
        });
      } else {
        callBack('Unable to fetch Address!');
      };
    });
  };

geoLocation(argv.address, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else if (results) {
    getWeather(results.lattitude,results.longitude, (errorMessage, result) => {
      if (errorMessage) {
        console.log(errorMessage);
      } else {
        console.log(result);
      };
    });
  };
});

const getWeather = (lat, lng, callBack) => {
  const url = `https://api.darksky.net/forecast/5a954264bc5ae7fd7614fa0515d2b5a8/${lat},${lng}`;
  request({uri:url, json:true}, (err , response , body) => {
    if (!err && response.statusCode === 200) {
      callBack(`temperature: ${body.currently.temperature}`);
      callBack(`Feels like: ${body.currently.apparentTemperature}`);
    };
  });
};
