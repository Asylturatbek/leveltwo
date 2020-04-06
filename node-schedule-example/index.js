const app = require('express')()
const schedule = require('node-schedule')

var job = schedule.scheduleJob('42 * * * * *', ()=> {
	console.log('The answer to life, the universe, and everything!')
})

let startTime = new Date(Date.now() + 5000);
let endTime = new Date(startTime.getTime() + 5000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
  console.log('Time for tea!');
});

app.listen(8000, ()=> {
	console.log('listening to port 8000 ..')
})
