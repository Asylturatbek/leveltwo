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

module.exports = { get_forecast }