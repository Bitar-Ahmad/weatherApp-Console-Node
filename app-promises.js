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


const geoLocation = (address) => {
  return new Promise((resolve, reject) => {
    const encodedCode = encodeURIComponent(address);
    request(`https://www.mapquestapi.com/geocoding/v1/address?key=QtQDRbLgJ1E8QqkWbLInELheDX56xJx5&location=${encodedCode}`, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        resolve({
          lati:JSON.parse(body).results[0].locations[0].latLng.lat,
          longi:JSON.parse(body).results[0].locations[0].latLng.lng});
      } else {
        reject('Unable to fetch Address!');
      };
    });


  });
};

geoLocation(argv.address).then((results) => {
  getWeather(results, (errorMessage, res) => {
    if(!errorMessage) {
      console.log(res);
    }
  });
}).catch((err) => {
  console.log(err);
});

// geoLocation(argv.address, (errorMessage, results) => {
//   if (errorMessage) {
//     console.log(errorMessage);
//   } else if (results) {
//     getWeather(results.lattitude,results.longitude, (errorMessage, result) => {
//       if (errorMessage) {
//         console.log(errorMessage);
//       } else {
//         console.log(result);
//       };
//     });
//   };
// });

const getWeather = (results , callBack) => {
  const url = `https://api.darksky.net/forecast/5a954264bc5ae7fd7614fa0515d2b5a8/${results.lati},${results.longi}`;
  return new Promise((resolve, reject) => {
    request({uri:url, json:true}, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        resolve(callBack(undefined, {temp:body.currently.temperature,appTemp:body.currently.apparentTemperature}));
      } else {
        reject(err);
      };
    });
  });
};
