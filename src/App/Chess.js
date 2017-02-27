GollumJS.NS(App, function() {

	this.Chess = new GollumJS.Class({

		discord: null,
		
		initialize: function(discord) {
			this.discord = discord;
		},

		execute: function(commands) {
			return null;
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
		}

	});
});