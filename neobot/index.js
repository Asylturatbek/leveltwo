const TelegramBot = require('node-telegram-bot-api');
let { get_forecast, get_info } = require('./helper.js')


const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});

let siteUrl;
bot.onText(/\/start/, (msg, match) => {
	bot.sendMessage(msg.chat.id, `***Welcome to the Neobot! It is a weather telling bot right now but 
		***we will add a lot of functionalities in future.
		***to know about options of weather enter /weather. 
		***To make bot speak enter /echo .... 
		ex: (/echo my name is Bot)
		***To know the info of country enter /country_info ...
		ex: (/country_info Kyrgyzstan)
		***And to me to tell this again enter /start .
		***To end the chat enter /end
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

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  bot.sendMessage(chatId, resp);
});

bot.on("callback_query", (mesg) => {

	get_forecast(mesg.data).then(result => {
		bot.sendMessage(mesg.message.chat.id, result)
	}).catch(err => {
		console.log(err)
	})

});

bot.onText(/\/country_info (.+)/, (msg, match) => {
	const chatId = msg.chat.id;
  	const search = match[1];
  	console.log(search)
  	get_info(search).then(result => {
		bot.sendPhoto(chatId, 'https://www.worldometers.info/img/flags/'+result.code+'-flag.gif');
  		bot.sendMessage(chatId, `${result.countryname} is the name of country
  			It's capital is ${result.capital}
  			Its is located on ${result.region} region
  			It's native name is ${result.nativeName}`)
  	})
});


bot.onText(/\/end/, (msg, match) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, `It's been wonderful time with you my friend
		I hope you will visit me again soon.
		Whenever you want you can call me again okay?
		Bye bye!`)
});