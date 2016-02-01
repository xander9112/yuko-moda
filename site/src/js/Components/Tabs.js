var $$ = $$ || {};

$$.Tabs = class Tabs {
	constructor (root) {
		this.root = root;
		this.isAnimating = false;
		this.tabsWidth = this.root.width();
		this.currentTab = 0;

		this.options = {
			duration: 300,
			easing: 'swing',
			emptySpace: 30
		};

		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_cacheNodes () {
		this.nodes = {
			tabs: this.root.find('.js-tab'),
			tabContents: this.root.find('.js-tab-content'),
			contentWrapper: this.root.find('.js-content-wrapper'),
			outer: this.root.find('.js-outer')
		};
	}

	_bindEvents () {
		this.nodes.tabs.on('click', (event) => {
			var tab = $(event.currentTarget);

			if (tab.hasClass('current')) {
				return;
			}

			this._goTo(tab.index());
		});
	}

	_ready () {
		var height = this.nodes.tabContents.first().height();

		this.nodes.outer.css({ height: height + this.options.emptySpace });
	}

	_goTo (position) {
		if (this.isAnimating) {
			return;
		}

		var isNext = position > this.currentTab;

		this.nodes.tabContents.each((number, tabElement) => {
			var tab = $(tabElement);

			if (number === position || number === this.currentTab) {
				tab.show();
			} else {
				tab.hide();
			}
		});

		this.isAnimating = true;
		this.nodes.tabContents.eq(this.currentTab).removeClass('show');
		this.nodes.tabs.eq(this.currentTab).removeClass('current');

		this.currentTab = position;

		this.nodes.tabContents.eq(this.currentTab).addClass('show');
		this.nodes.tabs.eq(this.currentTab).addClass('current');

		if (isNext) {
			this.nodes.contentWrapper.css({ marginLeft: 0 });
		} else {
			this.nodes.contentWrapper.css({ marginLeft: -this.tabsWidth });
		}

		_.defer(() => {
			var tabHeight = this.nodes.tabContents.eq(position).height();

			this.nodes.outer.animate({
				height: tabHeight + this.options.emptySpace
			}, this.options.duration, this.options.easing);
		});

		this.nodes.contentWrapper.animate({
			marginLeft: isNext ? -this.tabsWidth : 0
		}, this.options.duration, this.options.easing, () => {
			this.isAnimating = false;
		});
	}
};
