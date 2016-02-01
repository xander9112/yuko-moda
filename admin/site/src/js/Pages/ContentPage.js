var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['ContentPage'] = class ContentPage {
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
        //console.log('ContentPage');
    }

    _cacheNodes() {
        this.nodes = {};
    }

    _bindEvents() {
    }
};
