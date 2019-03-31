const yargs = require('yargs');
const request = require('request');
const axios = require('axios');

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

const encodedCode = encodeURIComponent(argv.address);
const geoCodeUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=QtQDRbLgJ1E8QqkWbLInELheDX56xJx5&location=${encodedCode}`;

axios.get(geoCodeUrl).then((response) => {
  const lng = response.data.results[0].locations[0].latLng.lng;
  const lat = response.data.results[0].locations[0].latLng.lat;
  const url = `https://api.darksky.net/forecast/5a954264bc5ae7fd7614fa0515d2b5a8/${lat},${lng}`;
  const formattedAddress = response.data.results[0].providedLocation.location;
  console.log(formattedAddress);
  return axios.get(url);
}).then((response) => {
  const temperature = response.data.currently.temperature;
  const appTemp = response.data.currently.apparentTemperature;
  console.log(`Temperature is ${Math.floor(temperature)}, it feels like ${Math.floor(appTemp)}`);

}).catch((e) => {
  if (e.code ==='ENDFRONT') {
    console.log('Unabe to connect to the API servers');
  } else {
    console.log(e.message);
  }
})
