var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['MainPage'] = class MainPage {
    constructor(root = $, options = {}) {
        this.root = root;

        this._cacheNodes();
        this._bindEvents();

        this.initialize();
    }

    destroy() {
        this.root.off();
        delete this.root;
        delete this.nodes;
    }

    initialize() {
        //console.log('MainPage');
    }

    _cacheNodes() {
        this.nodes = {};
    }

    _bindEvents() {
    }
};
