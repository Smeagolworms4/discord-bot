GollumJS.NS(App, function() {
	
	const Discord = require('discord.js');
	
	this.Discord = new GollumJS.Class({

		app: null,
		engine: null,
		
		mj: null,
		chess: null,

		initialize: function(app) {
			this.app = app;
		},

		start: function() {
			this.mj    = new App.Discord.MJ(this);
			this.chess = new App.Discord.Chess(this);
			this.connect();
		},

		connect() {
		

			this.engine = new Discord.Client();

			this.engine.on('ready', () => {
				console.log('Bot: I am ready!');
			});
			this.engine.on('message', message => {

				var split = message.content.split(' ');
				var commands = [];
				for (var i = 0; i < split.length; i++) {
					if (split[i]) {
					  commands.push(split[i]);
					}
				}
				if (commands.length) {
					var first = commands.shift();
					var response = null;

					if (first.toLowerCase() == this.config().get('commandMJ').toLowerCase()) {
						console.log('MJ Command');
						response = this.mj.execute(commands);
					}
					if (first.toLowerCase() == this.config().get('commandChess').toLowerCase()) {
						console.log('Chess Command');
						response = this.chess.execute(commands);
					}
					if (response) {
						message.reply(response);	
					}
				}
			});

			console.log('Connect to discord with token '+this.config().get('token'));
			this.engine.login(this.config().get('token'));
		},

		config() {
			return this.app.config;
		}

	});
});