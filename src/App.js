GollumJS.NS(function() {


	this.App = new GollumJS.Class({

		config: null,
		discod: null,
		server: null,

		run: function() {

			var _this = this;
			this.config = new App.Config();
			this.config.load()
				.then(function(config) {
					console.log('Configuration loaded', config);

					this.discod = new App.Discord(_this);
					this.discod.start();

					this.server = new App.Server(_this);
					this.server.start();


				})
				.catch(function(e) {
					console.error(e);
				})
			;
		}
	});
});