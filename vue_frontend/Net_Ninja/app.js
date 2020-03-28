new Vue({
	el:"#vue-app",
	data: {
		name: "Shaun",
		age: 27,
		x:0,
		y:0,
		job: "Ninja",
		website: 'http://www.thenetninja.co.uk',
		websiteTag: '<a href="http://www.thenetninja.co.uk">The Net Ninja</a>'
	},
	methods: {
		greet: function(time){
			return 'Good '+time+' '+this.name
		},
		add: function(inc){
			this.age+=inc;
		},
		subtract: function(dec){
			this.age-=dec
		},
		updateXY:function(event){
			console.log(event)
			this.x = event.offsetX;
			this.y = event.offsetY;
		},
		click: function(){
			alert('You clicked me!')
		},
		logName: function(){
			console.log('you entered your name')
		},
		logAge: function(){
			console.log('you enetered your age')
		}
	}
});