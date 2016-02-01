$$.Component.Route = class Route {
	constructor (root = $, options = {}) {
		this.root = root;
		this.currentModel = null;

		this.menu = options.menu;

		this.initialize();
	}

	initialize () {
		this.currentUrl = window.location.pathname;
		this._registerRoutes();
	}

	_registerRoutes () {
		page.base('/admin');

		page('/', (options) => {
			"use strict";
			this._initModel(options);
		});

		page('/tables', (options) => {
			"use strict";
			this._initModel(options);
		});

		page('/tables/:tableName', (options) => {
			"use strict";
			this._initModel(options);
		});

		page('*', (options) => {
			"use strict";

			options.pathname = '/notFound';
			this._initModel(options);
		});

		page({
			hashbang: true
		});
	}

	_initModel (options) {
		"use strict";

		var pathname = options.path.split('/')[1];

		if (pathname === '') {
			var modelName = 'Index';
		} else {
			var modelName = pathname.charAt(0).toUpperCase() + pathname.substr(1);
		}

		if (_.size(options.params)) {
			modelName = modelName.slice(0, -1);
		}


		if (this.currentModel) {
			this.currentModel.destroy();
		}

		if (!_.isUndefined($$.Model[modelName])) {
			this.currentModel = new $$.Model[modelName]('', options.params);
			this.menu.currentItem = options.pathname;

			return;
		}

		//page.redirect('/');
	}
};
