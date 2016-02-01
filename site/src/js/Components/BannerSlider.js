var $$ = $$ || {};

$$.BannerSlider = class BannerSlider {
	constructor(root, options) {
		this.root = root;

		this.options = {
			scrollStep: 400,
			duration: 300,
			menuWidth: 240
		};

		_.assign(this.options, options);

		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_cacheNodes () {
		this.nodes = {
			inner: this.root.find('.js-inner'),
			itemsWrapper: this.root.find('.js-items'),
			items: this.root.find('.js-item'),
			backwardButton: this.root.find('.js-backward-button'),
			forwardButton: this.root.find('.js-forward-button'),
			pageWrapper: this.root.find('.js-pages'),
			pages: this.root.find('.js-page')
		};
	}

	_bindEvents () {
		this.nodes.backwardButton.on('click', () => {
			this._checkoutSlide(this.currentSlide - 1);
		});

		this.nodes.forwardButton.on('click', () => {
			this._checkoutSlide(this.currentSlide + 1);
		});

		this.nodes.pages.on('click', () => {
			var slideNumber = $(event.target).index();
			var scrollStep = 0;

			if (slideNumber > this.currentSlide) {
				scrollStep = this.scrollStep;
			} else if (slideNumber < this.currentSlide) {
				scrollStep = -this.scrollStep;
			}

			this._checkoutSlide(slideNumber);
		});

		$$.window.on('resize', () => {
			_.defer(() => {
				var slideWidth = $$.windowWidth - this.options.menuWidth;
				var slidesCount = this.nodes.items.length;

				this.nodes.items.css({ width: slideWidth });
				this.nodes.itemsWrapper.css({ width: slideWidth * slidesCount });
				this.scrollStep = slideWidth;
				this.nodes.inner.scrollLeft(slideWidth * this.currentSlide);
			});
		});
	}

	_ready () {
		var slideWidth = this.nodes.inner.width();

		this.currentSlide = 0;
		this.isAnimating = false;

		this.nodes.items.css({ width: slideWidth });
		this.nodes.itemsWrapper.css({ width: slideWidth * this.nodes.items.length });
		this.scrollStep = this.nodes.items.first().width();
		this.rightLimit = this.nodes.itemsWrapper.width();
	}

	_checkoutSlide (slideNumber) {
		if (this.isAnimating) {
			return;
		}

		if (slideNumber < 0) {
			this._limitScroll(false);
			return;
		} else if (slideNumber >= this.nodes.items.length) {
			this._limitScroll(true);
			return;
		}

		this.isAnimating = true;
		this.nodes.pages.eq(this.currentSlide).removeClass('active');
		this.currentSlide = slideNumber;
		this.nodes.pages.eq(this.currentSlide).addClass('active');

		this.nodes.inner.animate({
			scrollLeft: slideNumber * this.scrollStep
		}, this.options.duration, 'swing', () => {
			this.isAnimating = false;
		});
	}

	_limitScroll (isToStart) {
		if (isToStart) {
			this._goToStart();
		} else {
			this._goToEnd();
		}
	}

	_goToEnd () {
		var slideItem = this.nodes.items.last().clone();
		var slideWidth = slideItem.width();
		var containerWidth = this.nodes.itemsWrapper.width();

		this.nodes.itemsWrapper.prepend(slideItem);
		this.nodes.itemsWrapper.width(containerWidth + slideItem.width());

		this.nodes.pages.eq(this.currentSlide).removeClass('active');
		this.currentSlide = this.nodes.pages.length - 1;
		this.nodes.pages.eq(this.currentSlide).addClass('active');

		this.nodes.inner.scrollLeft(slideWidth);

		this.nodes.inner.animate({
			scrollLeft: 0
		}, this.options.duration, 'swing', () => {
			this.nodes.inner.scrollLeft((this.nodes.items.length - 1) * slideWidth);
			slideItem.remove();
			this.nodes.itemsWrapper.width(containerWidth);
		});
	}

	_goToStart () {
		var slideItem = this.nodes.items.first().clone();
		var containerWidth = this.nodes.itemsWrapper.width();

		this.nodes.itemsWrapper.append(slideItem);
		this.nodes.itemsWrapper.width(containerWidth + slideItem.width());

		this.nodes.pages.eq(this.currentSlide).removeClass('active');
		this.currentSlide = 0;
		this.nodes.pages.eq(this.currentSlide).addClass('active');

		this.nodes.inner.animate({
			scrollLeft: this.nodes.items.length * this.scrollStep
		}, this.options.duration, 'swing', () => {
			this.nodes.inner.scrollLeft(0);
			slideItem.remove();
			this.nodes.itemsWrapper.width(containerWidth);
		});
	}
};
