GollumJS.NS(App, function() {

	const fs = require('fs-promise');

	this.Config = new GollumJS.Class({

		values: {
			token: '',
			hostname: '127.0.0.1',
			port: '8976',
			commandMJ: '!mj',
			commandChess: '!c'
		},

		load: function() {
			var _this = this;
			console.log ('Load configuration.');
			return fs.readFile('./config.json', {encoding:'utf8'})
				.then(function(data) {
					var json = JSON.parse(data);
					GollumJS.Utils.extend(_this.values, json);
					return _this.values;
				})
				.catch(function(e) {
					console.error(e);
					return _this.values;
				})
			;
		},
		
		get: function(key) {
			return this.values[key];
		}

	});
});