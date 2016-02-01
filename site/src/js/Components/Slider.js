var $$ = $$ || {};

$$.Slider = class Slider {
	constructor (root, options) {
		this.root = root;

		this.options = {
			scrollStep: 300,
			duration: 300,
			rigidness: 40,
			damping: 0.9,
			from: 0,
			to: 0,
			targetLimits: [0, 1],
			positionLimits: [0, 1]
		};

		_.assign(this.options, options);

		this.currentOffset = 0;
		this.previousOffset = 0;

		this._cacheNodes();
		this._createComponents();
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
			progressWrapper: this.root.find('.js-progress-wrapper'),
			progress: this.root.find('.js-progress'),
			overflowEllipsis: this.root.find('.js-overflow-ellipsis')
		};
	}

	_createComponents () {
		var self = this;
		var roundFactor = 10000;

		this.spring = new $$.Simulation.Spring({
			rigidness: this.options.rigidness,
			damping:  this.options.damping,
			position: this.options.from,
			target: this.options.to,
			positionLimits: this.options.targetLimits,
			step: function () {
				var roundPosition = Math.round(this.position() * roundFactor) / roundFactor;
				var roundTarget = Math.round(this.target() * roundFactor) / roundFactor;

				if (roundPosition === roundTarget && !self.force) {
					return;
				}

				self.force = false;

				var position = Math.round(this.position() * roundFactor) / roundFactor;

				self.nodes.progress.css({
					marginLeft: Math.round(position * self.maxScrollBarPosition)
				});

				self.nodes.itemsWrapper.css({ marginLeft: -1 * position * self.rightLimit });
			}
		});
	}

	_bindEvents () {
		this.nodes.backwardButton.on('click', () => {
			this._goTo(-this.scrollStep);
		});

		this.nodes.forwardButton.on('click', () => {
			this._goTo(this.scrollStep);
		});

		this.nodes.progress.on('drag', { relative: true }, (event, data) => {
			this._scrollTo(data.offsetX - data.originalX + this.previousOffset);
			this.root.addClass('active');
		});

		this.nodes.progress.on('dragend', () => {
			this.previousOffset = this.currentOffset;
			this.root.removeClass('active');
		});

		$$.window.on('resize', () => {
			this._calculateScrollWidth();
			this._resizeSlider();
		});
	}

	_ready () {
		this._calculateScrollWidth();

		this.scrollStep = this.options.scrollStep;

		this.nodes.overflowEllipsis.dotdotdot({
			wrap: 'letter',
			height: 50
		});

		this.sliderWidth = this.nodes.inner.width();
	}

	_resizeSlider () {
		var sliderWidth = this.nodes.inner.width();

		this._scrollTo(this.currentOffset - sliderWidth + this.sliderWidth);
		this.sliderWidth = sliderWidth;
	}

	_calculateScrollWidth () {
		var containerWidth = this.nodes.itemsWrapper.width();
		var progressBarWidth = 100 * this.root.width() / containerWidth;

		this.nodes.progress.css({ width: `${progressBarWidth}%` });
		this.rightLimit = containerWidth - this.root.width();


		if (progressBarWidth < 100) {
			this.maxScrollBarPosition = this.nodes.inner.width() - this.nodes.progress.width();

			this.nodes.forwardButton.removeClass('hidden');
			this.nodes.backwardButton.removeClass('hidden');
			this.nodes.progressWrapper.removeClass('hidden');
		} else {
			this.nodes.forwardButton.addClass('hidden');
			this.nodes.backwardButton.addClass('hidden');
			this.nodes.progressWrapper.addClass('hidden');
		}
	}

	_scrollTo (offset) {
		var ratio = this.options.targetLimits[1] /  this.maxScrollBarPosition;
		var position = offset * ratio;

		if (position < -1 || offset < 0) {
			this.previousOffset = this.currentOffset;
			return;
		}

		position = $$.clamp(position, 0, 1);
		this.spring.target(position);
		this.currentOffset = offset;
	}

	_goTo (step) {
		var offset = step + this.currentOffset;

		if (offset < 0) {
			offset = 0;
		} else if (offset > this.rightLimit) {
			offset = this.rightLimit;
		}

		this._scrollTo(offset);
	}
};
