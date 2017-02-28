GollumJS.NS(App.Server, function() {

	const Jimp = require("jimp");
	const http = require('http');

	this.Chess = new GollumJS.Class({

		Static: {
			BASE_URL: '/chess/'
		},

		server: null,
		
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
		
		initialize: function(server) {
			this.server = server;
		},
		
		init: function() {
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

		request(request, response) {
			var result = this.images['damier'].clone();
			
			var list = this.parsePosition(request.url);
			console.log(list);

			for(var i = 0; i < list.length; i++) {
				var	piece = list[i];

				if (typeof this.images[piece.id] != 'undefined') {
					var img = this.images[piece.id];
					result.composite(img, piece.x*64+26, piece.y*64+1);
				}
			}
			
			result.getBuffer(Jimp.MIME_PNG, function(err, buffer) {
				response.writeHead(200, {
					'Content-Type': Jimp.MIME_PNG,
					'Content-Length': buffer.length
				});
				response.end(buffer);
			});
		},

		parsePosition(str) {
			str = str.substr(this.self.BASE_URL.length);
			var results = [];

			while (str.length >= 4) {
				var posStr = str.substr(0, 4);
				var id = posStr.substr(0, 2);
				var x  = parseInt(posStr[2], 10);
				var y  = parseInt(posStr[3], 10);

				if (!isNaN(x) && !isNaN(y) && x < 8 && y < 8) {
					results.push({
						id: id, x: x, y : y
					});
				}

				str = str.substr(4);
			}
			

			return results;
		}
	});
});