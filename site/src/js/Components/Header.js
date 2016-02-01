var $$ = $$ || {};

$$.Header = class Header {
	constructor (root) {
		this.root = root;
		this.additionalClass = '';
		this.searchInputDefaultClass = '';
		this.isOpened = false;
		this.currentName = '';

		this.allClasses = {};
		this.tabStates = {};

		this.options = {
			duration: 300,
			defaultHeight: 60,
			easing: 'swing'
		};

		this.formStates = {
			closed: 'g-icon-eye-closed',
			opened: 'g-icon-eye-opened'
		};

		this.oldHeight = this.options.defaultHeight;
		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_cacheNodes () {
		this.nodes = {
			listItems: this.root.find('.js-list-item'),
			closeIcons: this.root.find('.js-close-icon'),
			eye: this.root.find('.js-eye'),
			passwordInput: this.root.find('.js-password-input'),
			searchInput: this.root.find('.js-search-input'),
			clearableInputs: this.root.find('.js-clearable-input'),
			cityItems: this.root.find('.js-city-item'),
			contentInner: this.root.find('.js-content-inner'),
			overlay: $('.js-header-overlay'),
			enter: this.root.find('.js-enter'),
			profile: this.root.find('.js-profile'),
			cityNameInHeader: this.root.find('.js-city-name-in-header')
		};
	}

	_bindEvents () {
		this.nodes.listItems.on('click', (event) => {
			this._toggleMenu($(event.currentTarget));
		});

		this.nodes.closeIcons.on('click', () => {
			this._closeHeader();
		});

		this.nodes.eye.on('click', () => {
			this._togglePasswordInput();
		});

		this.nodes.searchInput.on('input', () => {
			this._inputHandler();
		});

		this.root.on('click', (event) => {
			event.stopPropagation();
		});

		this.nodes.overlay.on('click', () => {
			this._closeHeader();
		});

		this.nodes.cityItems.on('click', (event) => {
			var currentCity = $(event.currentTarget);

			if (currentCity.hasClass('disabled') || currentCity.hasClass('letter')) {
				return;
			}

			this._citySelect(currentCity);
		});

		$$.window.on('keydown', (event) => {
			if (event.keyCode !== $$.ESCAPE_KEY_CODE) {
				return;
			}

			this._closeHeader();
		});
	}

	_ready () {
		var parameters = $$.parseUrlParams(location.href);
		var auth = parameters.auth;

		if ('auth' in parameters && auth.toString() === 'true') {
			this.nodes.enter.addClass('hidden');
			this.nodes.profile.removeClass('hidden');
		}

		this.iconSpace = Number.parseInt(this.nodes.closeIcons.css('right'));

		this.currentCity = this.nodes.cityItems.filter((index, city) => {
			return $(city).hasClass('disabled');
		}).first();
	}

	_calculateScrollWidth () {
		$$.body.css({ overflow: 'hidden' });

		var minWidth = $$.body.width();

		$$.body.css({ overflow: 'auto' });

		var width = $$.body.width();

		return minWidth - width;
	}

	_citySelect (currentCity) {
		var cityName = currentCity.text();

		this.nodes.cityNameInHeader.text(cityName);
		this.currentCity.removeClass('disabled');
		this.currentCity = currentCity;
		this.currentCity.addClass('disabled');
		this._closeHeader();
	}

	_closeHeader () {
		this.nodes.clearableInputs.val('');
		this.currentName = '';
		this._dropSearchState();
		this.nodes.overlay.removeClass('show');

		this.nodes.overlay.fadeOut();

		this.root.animate({
			height: this.options.defaultHeight
		}, this.options.duration, this.options.easing, () => {
			this.oldHeight = this.options.defaultHeight;
			this.isOpened = false;

			_.forEach(this.allClasses, (state) => {
				this.root.removeClass(state);
			});
		});
	}

	_dropSearchState () {
		if (!this.root.hasClass(this.root.data('searchCity'))) {
			return;
		}

		this.nodes.searchInput.val('');
		this.root.removeClass(this.root.data('searchCity'));
		this.nodes.cityItems.removeClass('hidden');
	}

	_inputHandler () {
		if (!this.searchInputDefaultClass) {
			this.searchInputDefaultClass = this.additionalClass;
		}

		var searchData = this.nodes.searchInput.val().toLowerCase();

		if (searchData) {
			this.root.removeClass(this.additionalClass);
			this.additionalClass = this.root.data('searchCity');
			this.root.addClass(this.additionalClass);

			this.nodes.cityItems.removeClass('hidden');
			this.root.stop();

			this.nodes.cityItems.filter((index, element) => {
				var cityItem = $(element);
				var cityItemName = cityItem.text().toLowerCase();
				var isValidStart = !_.startsWith(cityItemName, searchData);
				var isValidLetter = cityItem.hasClass('letter') && _.first(searchData) === cityItemName;

				return isValidStart && !isValidLetter;
			}).addClass('hidden');
		} else {
			this.root.removeClass(this.additionalClass);
			this.additionalClass = this.searchInputDefaultClass;
			this.root.addClass(this.additionalClass);

			this.nodes.cityItems.removeClass('hidden');
		}

		let oldHeight = this.root.height();

		this.root.css({ height: 'auto' });

		let realHeight = this.root.height();

		this.root.css({ height: oldHeight });

		this.root.animate({
			height: realHeight
		}, this.options.duration);
	}

	_toggleMenu (listItem) {
		var currentName = _.trim(listItem.text());
		var currentAdditionalClass = this.additionalClass;
		var additionalClass = listItem.data('for');
		var scrollWidth = this._calculateScrollWidth();

		if (currentName === this.currentName) {
			this._closeHeader();
			return;
		}

		this.nodes.closeIcons.css({ right: this.iconSpace + scrollWidth });
		this.allClasses[additionalClass] = additionalClass;
		this._dropSearchState();
		this.currentName = currentName;

		if (!listItem.hasClass('js-tab')) {
			currentAdditionalClass = additionalClass;
		} else {
			this.nodes.listItems.removeClass('active');
			listItem.addClass('active');
		}

		if ((!listItem.hasClass('js-tab') && !(currentAdditionalClass in this.tabStates))
			|| listItem.hasClass('js-tab')) {
			this.tabStates[currentAdditionalClass] = additionalClass;
		}

		_.forEach(this.allClasses, (state) => {
			this.root.removeClass(state);
		});

		this.additionalClass = currentAdditionalClass;
		this.root.addClass(this.tabStates[this.additionalClass]);
		this.root.css({ height: 'auto' });

		var endHeight = this.root.height();

		this.root.css({ height: this.oldHeight });

		if (!this.isOpened) {
			this.nodes.overlay.fadeIn();
		}

		this.root.animate({
			height: endHeight
		}, this.options.duration, 'swing', () => {
			this.oldHeight = endHeight;
			this.isOpened = true;
		});
	}

	_togglePasswordInput () {
		if (this.nodes.eye.hasClass(this.formStates.opened)) {
			this.nodes.eye.removeClass(this.formStates.opened);
			this.nodes.eye.addClass(this.formStates.closed);
			this.nodes.passwordInput.attr('type', 'password');
		} else if (this.nodes.eye.hasClass(this.formStates.closed)) {
			this.nodes.eye.removeClass(this.formStates.closed);
			this.nodes.eye.addClass(this.formStates.opened);
			this.nodes.passwordInput.attr('type', 'text');
		}
	}
};
