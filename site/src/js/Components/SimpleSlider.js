class MainSlider {
	constructor(root = $, options = {}) {
		var defaultOptions = {};

		//super(root, _.merge(options || {}, defaultOptions, _.defaults));

		//$$.Emitter.call(this);
	}

	_cacheNodes() {
		this.nodes = {
			slides:     this.root.find('.slide'),
			arrows:     this.root.find('.slide-button'),
			pagination: this.root.find('.pagination')
		};
	}

	_ready() {
		this._resizeSlider();
		this._initSpring();

		this.slidesLength = this.nodes.slides.length;
		this.nodes.pagination.append('<ul />');

		for (var i = 1; i <= this.slidesLength; i++) {
			this.nodes.pagination.find('ul').append('<li/>');
		}

		this.nodes.pagination = this.nodes.pagination.find('li');
		this.index = 0;

		this.nodes.pagination.eq(this.index).addClass('active');
	}

	_bindEvents() {
		this.on('slideChange', _.bind(function () {
			this.nodes.pagination.eq(this.index).siblings().removeClass('active');
			this.nodes.pagination.eq(this.index).addClass('active');
		}, this));

		this.nodes.arrows.on('click', event = (event) => {
			var item = $(event.currentTarget);

			var newIndex = this.index + item.data('direction');

			if (newIndex < 0) {
				newIndex = this.slidesLength - 1;
			} else if (newIndex > this.slidesLength - 1) {
				newIndex = 0;
			}

			if (item.data('direction') > 0) {
				this.nodes.slides.eq(this.index).data('spring').target(-1);

				this.nodes.slides.eq(newIndex).data('spring').position(1);
				this.nodes.slides.eq(newIndex).data('spring').target(0);
			} else {
				this.nodes.slides.eq(this.index).data('spring').target(1);

				this.nodes.slides.eq(newIndex).data('spring').position(-1);
				this.nodes.slides.eq(newIndex).data('spring').target(0);
			}

			this.index = newIndex;

			this.emit('slideChange');
		});

		this.nodes.pagination.on('click', event = (event) => {
			var item = $(event.currentTarget);

			if (this.index == item.index()) {
				return;
			}

			this.setIndex(this.index, item.index());
		});
	}

	slideRight(index, newIndex) {
		this.nodes.slides.eq(index).data('spring').target(-1);

		this.nodes.slides.eq(newIndex).data('spring').position(1);
		this.nodes.slides.eq(newIndex).data('spring').target(0);
	}

	slideLeft(index, newIndex) {
		this.nodes.slides.eq(this.index).data('spring').target(1);

		this.nodes.slides.eq(newIndex).data('spring').position(-1);
		this.nodes.slides.eq(newIndex).data('spring').target(0);
	}

	_initSpring() {
		this.nodes.slides.each(function (index) {
			var item = $(this);

			var spring = new $$.Simulation.Spring({
				rigidness:    100,
				damping:      1.5,
				target:       1,
				position:     1,
				targetLimits: [-1, 1],
				step:         function () {
					var position = Math.round(this.position() * 1000) / 1000;

					item.css({
						left: 100 * position + '%'
					});
				}
			});

			item.data('spring', spring);

		});

		if (this.nodes.slides.eq(0).data() != undefined) {
			this.nodes.slides.eq(0).data('spring').position(0);
			this.nodes.slides.eq(0).data('spring').target(0);
		}
	}

	setIndex(index, newIndex) {
		if (index > newIndex) {
			this.slideLeft(index, newIndex);
		} else {
			this.slideRight(index, newIndex);
		}

		this.nodes.pagination.eq(newIndex).siblings().removeClass('active');
		this.nodes.pagination.eq(newIndex).addClass('active');
		this.index = newIndex;
	}

	_resizeSlider() {
		var startWidth = 1420;
		var fontSize = 16;

		$('window').resize(_.bind(function () {
			var currentWidth = $$.window.width() + $$.ScrollWidth();

			if ($('window').width() >= 1420) {
				var ratio = (1420 / startWidth * 100) / 100;

				this.root.css({
					fontSize: (fontSize * ratio) + 'px'
				});

				return;
			}

			if ($('window').width() <= 960) {
				var ratio = (960 / startWidth * 100) / 100;

				this.root.css({
					fontSize: (fontSize * ratio) + 'px'
				});

				return;
			}

			var ratio = (currentWidth / startWidth * 100) / 100;

			this.root.css({
				fontSize: (fontSize * ratio) + 'px'
			});
		}, this));

		$('window').resize();
	}
}
