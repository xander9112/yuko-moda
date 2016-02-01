var $$ = $$ || {};

$$.ContentSlider = class ContentSlider {
	constructor (root, options) {
		this.root = root;
		this.currentSlide = 0;
		this.isAnimating = false;

		this.options = {
			duration: 300,
			easing: 'swing',
			slideWidth: 700
		};

		_.assign(this.options, options);
		this._cacheNodes();
		this._bindEvents();
	}

	_cacheNodes () {
		this.nodes = {
			itemsWrapper: this.root.find('.js-items'),
			backward: this.root.find('.js-backward'),
			forward: this.root.find('.js-forward'),
			currentSlide: this.root.find('.js-current-slide'),
			items: this.root.find('.js-item'),
			description: this.root.find('.js-description')
		};
	}

	_bindEvents () {
		this.nodes.backward.on('click', () => {
			this._previousSlide();
		});

		this.nodes.forward.on('click', () => {
			this._nextSlide();
		});
	}

	_nextSlide () {
		this.nodes.description.eq(this.currentSlide).removeClass('show');
		this.currentSlide = this.currentSlide + 1;
		this._goToSlide(this.currentSlide);
	}

	_previousSlide () {
		this.nodes.description.eq(this.currentSlide).removeClass('show');
		this.currentSlide = this.currentSlide - 1;
		this._goToSlide(this.currentSlide);
	}

	_goToSlide (slideNumber) {
		if (this.isAnimating) {
			return;
		}

		if (slideNumber < 0) {
			this.currentSlide = this.nodes.items.length - 1;
			this._goToEnd();
			return;
		} else if (slideNumber >= this.nodes.items.length) {
			this.currentSlide = 0;
			this._goToStart();
			return;
		}

		this.isAnimating = true;
		this.nodes.description.eq(slideNumber).addClass('show');
		this.nodes.currentSlide.text(slideNumber + 1);

		this.nodes.itemsWrapper.animate({
			marginLeft: -this.options.slideWidth * slideNumber
		}, this.options.duration, this.options.easing, () => {
			this.isAnimating = false;
		});
	}

	_goToEnd () {
		var slideItem = this.nodes.items.last().clone();

		this.nodes.itemsWrapper.prepend(slideItem);
		this.nodes.itemsWrapper.css({ marginLeft: -this.options.slideWidth });
		this.nodes.currentSlide.text(this.currentSlide + 1);
		this.nodes.description.last().addClass('show');

		this.nodes.itemsWrapper.animate({
			marginLeft: 0
		}, this.options.duration, this.options.easing, () => {
			var marginLeft = -this.currentSlide * this.options.slideWidth;

			this.isAnimating = false;
			this.nodes.itemsWrapper.css({ marginLeft: marginLeft });
			slideItem.remove();
		});
	}

	_goToStart () {
		var slideItem = this.nodes.items.first().clone();

		this.nodes.itemsWrapper.append(slideItem);
		this.nodes.currentSlide.text(this.currentSlide + 1);
		this.nodes.description.first().addClass('show');

		this.nodes.itemsWrapper.animate({
			marginLeft: -this.nodes.items.length * this.options.slideWidth
		}, this.options.duration, 'swing', () => {
			slideItem.remove();
			this.nodes.itemsWrapper.css({ marginLeft: 0 });
			this.isAnimating = false;
		});
	}
};
