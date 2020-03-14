const TelegramBot = require('node-telegram-bot-api');
let { get_forecast } = require('./helper.js')


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

