GollumJS.NS(App.Discord, function() {

	this.MJ = new GollumJS.Class({

		Extends: App.Discord.AbstractCommand,
		
		execute: function(commands) {
			if (commands[0]) {
				var d = commands[0].toLowerCase().split('d');
				if (d[0] && d[1]) {
					var nb   = parseInt(d[0], 10);
					var size = parseInt(d[1], 10);
					if (!isNaN(nb) && !isNaN(size) && nb > 0 && size > 0 && nb < 30) {
						var response = '';
						response = "Lance"+nb+" dés à "+size+" faces\n";
						var total = 0;
						for(var i = 0; i < nb; i++) {
							var r = this.launch(size);
							response += "Jet "+(i+1)+" fait un "+r+"\n";
							total += r;
						}
						response += "Pour un total de "+total;
						return response;
					}
				}
			}
			return null;
		},

		launch: function(size) {
			return Math.floor((Math.random() * size) + 1);
		}

	});
});