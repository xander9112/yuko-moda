$$.Component.Menu = class ComponentMenu {
	constructor (root = $, options = {}) {
		var defaultOptions = {};

		this.root = root;
		this.options = _.merge(options || {}, defaultOptions, _.defaults);
		this.current = '';

		this._template();
		this._cacheNodes();
		this.initialize();
	}

	initialize () {
		"use strict";

		this.root.append(this.template);
	}

	_template () {
		"use strict";

		this.template = $(`
			<div class="ui attached stackable menu">
			  <div class="ui container">
			    <a href="/admin/" class="item">
			      <i class="home icon"></i> Главная
			    </a>
			    <a href="tables" class="item">
			      <i class="grid layout icon"></i> Таблицы
			    </a>
			    <div class="right item">
			      <div class="ui"><a href="/" target="_blank">На сайт</a></div>
			    </div>
			  </div>
			</div>`);
	}

	set currentItem (url) {
		"use strict";

		this.updateMenu(this.findUrl(url));
	}

	updateMenu (currentItem) {
		this.nodes.items.each((index, element) => {
			$(element).removeClass('selected active')
		});

		if (!_.isUndefined(currentItem)) {
			currentItem.addClass('active');
		}
	}

	findUrl (url) {
		var currentItem = undefined;

		if (url !== '/') {
			if (url.charAt(url.length - 1) === '/') {
				url = url.substring(0, url.length - 1);
			}
		}

		this.nodes.items.each((index, element) => {
			var href = $(element).find('a').attr('href');

			if (href === url) {
				currentItem = $(element);
			}
		});

		return currentItem;
	}

	set userInfo (template) {
		"use strict";

		this.nodes.nav.append(template);
	}

	_cacheNodes () {
		this.nodes = {
			nav: this.template.find('ul'),
			items: this.template.find('li')
		};
	}
};
