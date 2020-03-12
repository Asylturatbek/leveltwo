const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
const bodyParser = require('body-parser')
require('dotenv').config();
const axios = require('axios')

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});

let siteUrl;

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

// bot.on('message', (msg) => {
//   bot.sendMessage(msg.chat.id,'Choose down the option', {
//     reply_markup: {
//       inline_keyboard: [[
//         {
//           text: 'Weather',
//           callback_data: 'weather'
//         },
//       ]]
//     }
//   });
// });

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

let telegram_url = "https://api.telegram.org/bot" + process.env.TELEGRAM_API_TOKEN +"/sendMessage";
let openWeatherUrl = process.env.OPENWEATHER_API_URL;

function get_forecast(city){
    let new_url = openWeatherUrl + city+"&appid="+process.env.OPENWEATHER_API_KEY;
    return axios.get(new_url).then(response => {
        let temp = response.data.main.temp;
        //converts temperature from kelvin to celsuis
        temp = Math.round(temp - 273.15); 
        let city_name = response.data.name;
        let resp = "It's "+temp+" degrees in "+city_name;
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

// get_forecast('Bishkek').then(result => {
// 	console.log(result)
// })

