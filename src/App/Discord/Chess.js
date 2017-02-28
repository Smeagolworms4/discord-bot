GollumJS.NS(App.Discord, function() {

	this.Chess = new GollumJS.Class({

		Extends: App.Discord.AbstractCommand,

		Static: {
			CMD_START: 'start',
			CMD_STOP: 'stop',
		},

		current: null,
		
		execute: function(commands) {
			var response = null;
			var baseCommand = this.config().get('commandChess');

			if (commands[0]) {

				if (commands[0] == this.self.CMD_START) {
					if (this.current) {
						response = 
							'Une partie est déjà en cours vous devez l\'arrêter avant de continuer.'+"\n"+
							'Commande: '+baseCommand+' '+this.self.CMD_STOP
						;
					} else {
						this.current = this.initGame();
						response = 'Démarrage d\'une nouvelle partie.'+"\n\n"+this.getDisplayUrl(); 
					}
				} else
				if (commands[0] == this.self.CMD_STOP) {
					if (!this.current) {
						response = 
							'Aucune partie n\'est en cours vous devez en démarrer une.'+"\n"+
							'Commande: '+baseCommand+' '+this.self.CMD_START
						; 
					} else {
						this.current = null;
						response = 'Arret de la partie en cours';
					}
				}
				if (commands[0].length == 4 && commands[0].match(new RegExp('[a-e][1-8][a-e][1-8]', 'i'))) {
					var values =  commands[0].toLowerCase();
					
					var y1 = values[0].charCodeAt() - 'a'.charCodeAt();
					var x1 = 8 - parseInt(values[1], 10);
					var y2 = values[2].charCodeAt() - 'a'.charCodeAt();
					var x2 = 8 - parseInt(values[3], 10);

					var id = this.current[x1][y1];
					
					this.current[x1][y1] = null;
					this.current[x2][y2] = id;

					response = this.getDisplayUrl(); 
				}

			}

			return response;
		},

		initGame: function() {
			return [
				[ 'BT', 'BC', 'BF', 'BQ', 'BK', 'BF', 'BC', 'BT' ],
				[ 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP' ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP' ],
				[ 'WT', 'WC', 'WF', 'WQ', 'WK', 'WF', 'WC', 'WT' ],
			];
		},

		getDisplayUrl() {
			var host = this.config().get('hostname');
			var port = this.config().get('port');

			var url = 'http://'+host+':'+port+App.Server.Chess.BASE_URL;

			if (this.current) {
				for(var y = 0; y < this.current.length; y++) {
					for(var x = 0; x < this.current[y].length; x++) {
						var id = this.current[y][x];
						if (id) {
							url += id+x+y;
						}
					}
				}
			}

			return url;
		}

	});
});