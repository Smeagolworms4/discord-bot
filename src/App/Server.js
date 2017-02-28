GollumJS.NS(App, function() {

	const http = require('http');

	this.Server = new GollumJS.Class({

		app: null,
		chess: null,
		engine: null,

		initialize: function(app) {
			this.app = app;
			this.chess = new App.Server.Chess(this);
		},
		
		start: function() {
			var _this = this;
			this.chess.init()
				.then(function() {
					_this.runServer()
				})
			;
		},

		runServer() {
			var _this = this;
			var port = this.config().get('port');

			this.engine = http.createServer();
			this.engine.on('request', function(request, response) {
				_this.request(request, response);
			})
				.listen(port)
			;
			console.log('Start server on port:', port);
		},

		request(request, response) {
			try {
				console.log('GET: '+request.url);
				if (request.url.indexOf(App.Server.Chess.BASE_URL) === 0) {
					this.chess.request(request, response);
					return
				}
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
			} catch(e) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(e + "\n");
				response.end();
			}
		},


		config() {
			return this.app.config;
		}
	});
});