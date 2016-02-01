var $$ = $$ || {};

$$.Model.Index = class ModelIndex {
	constructor (root = $('main')) {
		"use strict";

		this.root = root === '' ? $('main') : root;

		this._template();
		this.initialize();
	}

	initialize () {

		"use strict";
		this.root.html(this.template);
	}

	destroy () {
		"use strict";
		console.log('destroy Index');
	}

	_template () {
		"use strict";
		this.template = `<h1>Index</h1>`;
	}
};
