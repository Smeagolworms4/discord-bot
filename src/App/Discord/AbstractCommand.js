GollumJS.NS(App.Discord, function() {

	this.AbstractCommand = new GollumJS.Class({

		discord: null,
		
		initialize: function(discord) {
			this.discord = discord;
		},

		app() {
			return this.discord.app;
		},

		config() {
			return this.app().config;
		},

		execute: function(commands) {
		}

	});
});