GollumJS.NS(App, function() {

	const Jimp = require("jimp");
	const http = require('http');

	this.Server = new GollumJS.Class({

		app: null,
		engine: null,
		
		images: {
			'damier': null,
			'WC': null,
			'WF': null,
			'WK': null,
			'WQ': null,
			'WT': null,
			'WP': null,
			'BC': null,
			'BF': null,
			'BK': null,
			'BQ': null,
			'BT': null,
			'BP': null,
		},

		initialize: function(app) {
			this.app = app;
		},
		
		start: function() {
			var _this = this;
			this.loadImage()
				.then(function() {
					console.log('next');
					_this.runServer()
				})
			;
		},

		loadImage() {
			var _this = this;
			console.log('Load images ...');

			return GollumJS.Utils.Collection.eachStep(this.images, function(i, value, step) {
				
				var path = "./data/"+i+".png";
				
				Jimp.read(path)
					.then(function (img) {
						console.log('Load image: '+path);
						_this.images[i] = img;
						step(img);
					})
					.catch(function(e) {
						console.error('Error load image: '+path, e);
						step();
					})
				;
			})
		},

		runServer() {
			var _this = this;
			this.engine = http.createServer();
			this.engine.on('request', function(request, response) {
				_this.request(request, response);
			})
				.listen(this.config().get('port'))
			;
			console.log('Start server on port:', this.config().get('port'));
		},

		request(request, response) {
			var result = this.images['damier'].clone();
			
			console.log(request.url);

			var positions = this.parsePosition(request.url);

			for(var i = 0; i < positions.length; i++) {
				var	piece = positions[i];
				var img = this.images[piece.id];
				result.composite(img, piece.x*64+26, piece.y*64+1);
			}
			
			result.getBuffer(Jimp.MIME_PNG, function(err, buffer) {
				response.writeHead(200, {
					'Content-Type': Jimp.MIME_PNG,
					'Content-Length': buffer.length
				});
				response.end(buffer);
			});
		},

		getPiece() {
			return [
				'BT', 'BC', 'BF', 'BQ', 'BK', 'BF', 'BC', 'BT',
				'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP',
				'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP',
				'WT', 'WC', 'WF', 'WQ', 'WK', 'WF', 'WC', 'WT',
			];
		},

		parsePosition(str) {
			str = str.substr(1);
			var list = this.getPiece();
			var results = [];
			
			for (var i = 0; i < list.length; i++) {
				var piece = list[i];
				if (str.length >= 2) {
					var posStr = str.substr(0, 2);
					str = str.substr(2);
					var x = parseInt(posStr[0], 10);
					var y = parseInt(posStr[1], 10);
					if (!isNaN(x) && !isNaN(y) && x < 8 && y < 8) {
						results.push({
							id: piece, x: x, y : y
						});
					}
				}
			}
			

			return results;
		},


		config() {
			return this.app.config;
		}
	});
});