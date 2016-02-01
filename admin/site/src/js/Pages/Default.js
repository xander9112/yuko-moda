var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['Default'] = class Default {
	constructor (root = $, options = {}) {
		this.root = root;

		this._cacheNodes();
		this._bindEvents();

		this.initialize();
	}

	destroy () {
		delete this.root;
		delete this.nodes;
	}

	initialize () {
		//console.log('Default');
	}

	_cacheNodes () {
		this.nodes = {};
	}

	_bindEvents () {
	}

};
