GollumJS.NS(App.Discord, function() {

	this.Chess = new GollumJS.Class({

		Extends: App.Discord.AbstractCommand,

		Static: {
			CMD_START: 'start',
			CMD_STOP : 'stop',
			CMD_UNDO : 'undo',
			CMD_ADD  : 'add',
			CMD_HELP : 'help',

			PIECES: [
				'BT', 'BC', 'BF', 'BQ', 'BK', 'BP',
				'WT', 'WC', 'WF', 'WQ', 'WK', 'WP'
			],
		},

		current: null,
		history: [],
		
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
						this.initGame();
						response = 'Démarrage d\'une nouvelle partie.'+"\n\n"+this.getDisplayUrl(); 
					}
				} else
				if (commands[0] == this.self.CMD_HELP) {
					response = 
						'Aide partie d\'échec :'+"\n\n"+
						' **'+baseCommand+' a1b1**: Déplace une pièce remplacer a1 par la coordonnée de départ et b1 par la destination.'+"\n"+
						' **'+baseCommand+' '+this.self.CMD_HELP+'**: Affiche l\'aide'+"\n"+
						' **'+baseCommand+' '+this.self.CMD_START+'**: Démarre une nouvelle partie'+"\n"+
						' **'+baseCommand+' '+this.self.CMD_STOP+'**: Arrête la partie en cours'+"\n"+
						' **'+baseCommand+' '+this.self.CMD_UNDO+'**: Annule la dernière action'+"\n"+
						' **'+baseCommand+' '+this.self.CMD_ADD+' a1 PIECE**: Ajoute une pièce. Remplacer a1 par la coordonnée et PIECE par:'+"\n"+
						'          *BT* : Tour noire '+"\n"+
						'          *BC* : Cavalier noir '+"\n"+
						'          *BF* : Fou noir '+"\n"+
						'          *BQ* : Reine noire '+"\n"+
						'          *BK* : Roi noir '+"\n"+
						'          *BP* : Pion noir '+"\n"+
						'          *WT* : Tour Blanche '+"\n"+
						'          *WC* : Cavalier Blanc '+"\n"+
						'          *WF* : Fou Blanc '+"\n"+
						'          *WQ* : Reine Blanche '+"\n"+
						'          *WK* : Roi Blanc '+"\n"+
						'          *WP* : Pion Blanc '+"\n"
					; 
				} else
				if (!this.current) {
					
					response = 
						'Aucune partie n\'est en cours vous devez en démarrer une.'+"\n"+
						'Commande: '+baseCommand+' '+this.self.CMD_START
					; 


				} else
				if (commands[0] == this.self.CMD_STOP) {
					this.current = null;
					response = 'Arret de la partie en cours';
				} else
				if (commands[0] == this.self.CMD_UNDO) {
					this.popState();

					response = this.getDisplayUrl(); 
				} else
				if (
					commands[0] == this.self.CMD_ADD &&
					commands[1] && commands[1].match(new RegExp('[a-h][1-8]', 'i')) &&
					commands[2] && this.self.PIECES.indexOf(commands[2].toUpperCase()) != -1
				) {
					this.pushState();

					var values =  commands[1].toLowerCase();
					var y = values[0].charCodeAt() - 'a'.charCodeAt();
					var x = 8 - parseInt(values[1], 10);
					var id = commands[2].toUpperCase();

					this.current[x][y] = id;

					response = this.getDisplayUrl(); 
				} else
				if (commands[0].length == 4 && commands[0].match(new RegExp('[a-h][1-8][a-h][1-8]', 'i'))) {

					this.pushState();
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
			this.current = [
				[ 'BT', 'BC', 'BF', 'BQ', 'BK', 'BF', 'BC', 'BT' ],
				[ 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP' ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP' ],
				[ 'WT', 'WC', 'WF', 'WQ', 'WK', 'WF', 'WC', 'WT' ],
			];
			this.history = [];
			this.pushState();
		},

		pushState: function() {
			this.history.push(GollumJS.Utils.clone(this.current));
		},

		popState: function() {
			if (this.history.length) {
				var pop = this.history.pop();
				this.current = pop;
			}
		},

		getDisplayUrl: function() {
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