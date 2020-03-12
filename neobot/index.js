const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios')

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});

let siteUrl;

bot.onText(/\/start/, (msg, match) => {
	bot.sendMessage(msg.chat.id, `Welcome to the Neobot! It is a weather telling bot right now but 
		we will add a lot of functionalities in future.
		to know about options of weather enter /weather. 
		To make bot speak enter /echo .... 
		And to me to tell this again enter /start .
		Have a good day my friend.`)
})

bot.onText(/\/weather/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which city do you want to know?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Bishkek',
          callback_data: 'Bishkek'
        },{
          text: 'Osh',
          callback_data: 'Osh'
        },{
          text: 'Almaty',
          callback_data: 'Almaty'
        }
      ]]
    }
  });
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.on("callback_query", (mesg) => {

	if(mesg.data === 'Bishkek'){
		get_forecast('Bishkek').then(result => {
			bot.sendMessage(mesg.message.chat.id, result)
		}).catch(err => {
			console.log(err)
		})
	} else if(mesg.data === 'Osh'){
		get_forecast('Osh').then(result => {
			bot.sendMessage(mesg.message.chat.id, result)
		}).catch(err => {
			console.log(err)
		})
	} else if(mesg.data === 'Almaty'){
		get_forecast('Almaty').then(result => {
			bot.sendMessage(mesg.message.chat.id, result)
		}).catch(err => {
			console.log(err)
		})
	} else if(mesg.data === 'weather'){
		  bot.sendMessage(mesg.message.chat.id,'Got it, in which city do you want to know?', {
		    reply_markup: {
		      inline_keyboard: [[
		        {
		          text: 'Bishkek',
		          callback_data: 'Bishkek'
		        },{
		          text: 'Osh',
		          callback_data: 'Osh'
		        },{
		          text: 'Almaty',
		          callback_data: 'Almaty'
		        }
		      ]]
		    }
		  });
	}

});

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
