require('dotenv').config();
const axios = require('axios')
let openWeatherUrl = process.env.OPENWEATHER_API_URL;

function get_forecast(city){
    let new_url = openWeatherUrl + city+"&appid="+process.env.OPENWEATHER_API_KEY;
    return axios.get(new_url).then(response => {

        let temp = response.data.main.temp;
        let feelslike = response.data.main.feels_like;
        //converts temperature from kelvin to celsuis
        temp = Math.round(temp - 273.15);
        feelslike = Math.round(feelslike - 273.15); 
		let city_name = response.data.name;

        let resp = `It's ${temp} degrees in ${city_name}
        	But it feels like ${feelslike} degrees.`
        return resp;
    }).catch(error => {
        console.log(error);
    });
}


let countries_url = 'https://restcountries.eu/rest/v2/name/'
function get_info(name) {
    return axios.get(countries_url+name).then(response => {
        let countryname = response.data[0].name
        let capital = response.data[0].capital
        let region = response.data[0].region
        let nativeName = response.data[0].nativeName
        let flag_url = response.data[0].flag
        let code = response.data[0].alpha2Code

        let country = {
            countryname : countryname,
            capital : capital,
            region : region,
            nativeName : nativeName,
            flag_url : flag_url,
            code : code.toLowerCase()
        }

        return country

    }).catch(error => {
        console.log(error)
    })
}

module.exports = { get_forecast, get_info }