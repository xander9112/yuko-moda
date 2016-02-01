"use strict";

var $$ = $$ || {};

$$.Simulation = $$.Simulation || {};

/**
 * Не нужно использовать этот класс напрямую. Нужно использовать $$.Simulation.Spring.
 */
$$.Simulation.SpringSimulator = function () {
	var self = this;

	this._springs = [];
	this._lastTime = +new Date();

	setInterval(function () {
		var now = +new Date();
		var time = (now - self._lastTime) / 1000;
		var dt = 0.01;

		if (time > 0.2) {
			// Если жс работает слишком медленно, замедлить симуляцию.
			time = 0.2;
		}

		var i,
		    ni = self._springs.length,
		    spring,
		    dampings = [],
		    distance,
		    newDistance,
		    force,
		    newVelocity,
		    targetVelocityLimit,
		    velocityLimit,
		    positionLimits;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];
			dampings.push(2 * Math.sqrt(spring._rigidness) * spring._damping);
		}

		while (time > 0.000001) {
			for (i = 0; i < ni; i++) {
				spring = self._springs[i];

				if (spring._frozen) {
					continue;
				}

				distance = spring._target - spring._position;

				force = (distance >= 0 ? 1 : -1) * Math.pow(Math.abs(distance), spring._forcePower) * spring._rigidness - (spring._velocity >= 0 ? 1 : -1) * Math.abs(spring._velocity) * dampings[i];

				newVelocity = spring._velocity + force * dt;

				velocityLimit = spring._velocityLimit;
				targetVelocityLimit = spring._targetVelocityLimit;

				if (targetVelocityLimit !== null) {
					targetVelocityLimit *= Math.pow(spring._targetVelocityLimitPower, Math.abs(distance));

					if (velocityLimit === null || targetVelocityLimit < velocityLimit) {
						velocityLimit = targetVelocityLimit;
					}
				}

				if (velocityLimit !== null && Math.abs(newVelocity) > velocityLimit) {
					newVelocity = (newVelocity >= 0 ? 1 : -1) * velocityLimit;
				}

				spring._position += newVelocity * dt;
				spring._velocity = newVelocity;

				if (spring._stopAtTarget) {
					newDistance = spring._target - spring._position;

					if (distance > 0 && newDistance <= 0 || distance < 0 && newDistance >= 0) {
						spring._position = spring._target;
						spring._velocity = 0;
						continue;
					}
				}

				if (spring._positionLimits !== null) {
					positionLimits = spring._positionLimits;

					if (spring._position < positionLimits[0]) {
						spring._position = positionLimits[0];
						spring._velocity = 0;
					} else if (spring._position > positionLimits[1]) {
						spring._position = positionLimits[1];
						spring._velocity = 0;
					}
				}
			}

			time -= dt;
		}

		self._lastTime = now;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];

			if (spring == null) {
				continue;
			}

			if (!spring._frozen && spring._step) {
				spring._step.call();
			}
		}
	}, 16);
};

$$.Simulation.SpringSimulator.prototype = {
	addSpring: function addSpring(spring) {
		this._springs.push(spring);
	},

	deleteSpring: function deleteSpring(spring) {
		var i = _.indexOf(this._springs, spring);

		if (i != -1) {
			this._springs.splice(i, 1);
		}
	}
};

// Создать один "глобальный" экземпляр.

$$.Simulation.__springSimulator = new $$.Simulation.SpringSimulator();
'use strict';

var $$ = $$ || {};

$$.Simulation = $$.Simulation || {};

/**
 * @constructor
 */
$$.Simulation.Spring = function (options) {
	options = _.extend({
		frozen: false,
		position: 0,
		positionLimits: null,
		target: 0,
		targetLimits: null,
		velocity: 0,
		velocityLimit: null,
		rigidness: 1,
		damping: 1,
		forcePower: 1,
		targetVelocityLimit: null,
		targetVelocityLimitPower: 1.25,
		stopAtTarget: false,
		step: null
	}, options || {});

	this._frozen = options.frozen;
	this._position = options.position;
	this._positionLimits = options.positionLimits;
	this._target = options.target;
	this._targetLimits = options.targetLimits;
	this._velocity = options.velocity;
	this._velocityLimit = options.velocityLimit;
	this._rigidness = options.rigidness;
	this._damping = options.damping;
	this._forcePower = options.forcePower;
	this._targetVelocityLimit = options.targetVelocityLimit;
	this._targetVelocityLimitPower = options.targetVelocityLimitPower;
	this._stopAtTarget = options.stopAtTarget;
	this._step = null;

	if (options.step) {
		this.step(options.step);
	}

	this._applyTargetLimits();

	$$.Simulation.__springSimulator.addSpring(this);
};

$$.Simulation.Spring.prototype = {
	_applyTargetLimits: function _applyTargetLimits() {
		if (this._targetLimits === null) {
			return;
		}

		if (this._target < this._targetLimits[0]) {
			this._target = this._targetLimits[0];
		} else if (this._target > this._targetLimits[1]) {
			this._target = this._targetLimits[1];
		}
	},

	destroy: function destroy() {
		this._step = null;
		$$.Simulation.__springSimulator.deleteSpring(this);
	},

	moveTarget: function moveTarget(delta) {
		this._target += delta;
		this._applyTargetLimits();
	},

	step: function step(callback) {
		this._step = _.bind(callback, this);
	},

	target: function target(value) {
		if (arguments.length == 0) {
			return this._target;
		}

		this._target = value;
		this._applyTargetLimits();
	},

	targetLimits: function targetLimits(value) {
		if (arguments.length == 0) {
			return this._targetLimits;
		}

		this._targetLimits = value;
		this._applyTargetLimits();
	}
};

// Создать методы-аксессоры.

_.each(['frozen', 'position', 'positionLimits', 'velocity', 'velocityLimit', 'rigidness', 'damping', 'forcePower', 'targetVelocityLimit', 'targetVelocityLimitPower', 'stopAtTarget'], function (k) {
	$$.Simulation.Spring.prototype[k] = function (value) {
		if (arguments.length == 0) {
			return this['_' + k];
		}

		this['_' + k] = value;
	};
});
'use strict';

var $$ = $$ || {};

$$.extend = function (Child, Parent) {
	var F = function F() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
};

$$.trim = function (str, charlist) {
	charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
	return str.replace(re, '');
};

$$.parseUrlParams = function (url) {
	var url = url || location.href;
	var searchParam = {};
	var regExpParams = /\?{1}.+/;

	if (regExpParams.test(url)) {
		url = url.replace(regExpParams, '');

		var urlParams = location.search.replace('?', '');
		urlParams = urlParams.split('&');

		_.each(urlParams, function (item, index, list) {
			var param = item.split('=');
			searchParam[param[0]] = param[1];
		});
	}
	return searchParam;
};

$$.clamp = function (value, min, max) {
	return Math.min(max, Math.max(min, value));
};

$$.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

$$.Transitions = {
	linear: function linear(t) {
		return t;
	},

	quadIn: function quadIn(t) {
		return t * t;
	},

	quadInOut: function quadInOut(t) {
		t *= 2;

		if (t < 1) {
			return 0.5 * t * t;
		}

		return -0.5 * ((t - 1) * (t - 3) - 1);
	},

	quadOut: function quadOut(t) {
		return -t * (t - 2);
	},

	sineIn: function sineIn(t) {
		return 1 - Math.cos(t * Math.PI * 0.5);
	},

	sineInOut: function sineInOut(t) {
		return 0.5 - 0.5 * Math.cos(t * Math.PI);
	},

	sineOut: function sineOut(t) {
		return Math.sin(t * Math.PI * 0.5);
	}
};

$$.makeVideoPlayerHtml = function (videoType, videoId, width, height) {
	if (videoType == 'youtube') {
		return '<iframe class="youtube-player" type="text/html"' + ' width="' + width + '" height="' + height + '" src="' + 'http://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&amp;controls=0&amp;showinfo=0' + '" frameborder="0" wmode="opaque" autoplay="true"></iframe>';
	} else if (videoType == 'vimeo') {
		return '<iframe wmode="opaque" width="' + width + '" height="' + height + '" src="' + 'http://player.vimeo.com/video/' + videoId + '?autoplay=1' + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
	}

	return '';
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.BannerSlider = (function () {
	function BannerSlider(root, options) {
		_classCallCheck(this, BannerSlider);

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

	_createClass(BannerSlider, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
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
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.backwardButton.on('click', function () {
				_this._checkoutSlide(_this.currentSlide - 1);
			});

			this.nodes.forwardButton.on('click', function () {
				_this._checkoutSlide(_this.currentSlide + 1);
			});

			this.nodes.pages.on('click', function () {
				var slideNumber = $(event.target).index();
				var scrollStep = 0;

				if (slideNumber > _this.currentSlide) {
					scrollStep = _this.scrollStep;
				} else if (slideNumber < _this.currentSlide) {
					scrollStep = -_this.scrollStep;
				}

				_this._checkoutSlide(slideNumber);
			});

			$$.window.on('resize', function () {
				_.defer(function () {
					var slideWidth = $$.windowWidth - _this.options.menuWidth;
					var slidesCount = _this.nodes.items.length;

					_this.nodes.items.css({ width: slideWidth });
					_this.nodes.itemsWrapper.css({ width: slideWidth * slidesCount });
					_this.scrollStep = slideWidth;
					_this.nodes.inner.scrollLeft(slideWidth * _this.currentSlide);
				});
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			var slideWidth = this.nodes.inner.width();

			this.currentSlide = 0;
			this.isAnimating = false;

			this.nodes.items.css({ width: slideWidth });
			this.nodes.itemsWrapper.css({ width: slideWidth * this.nodes.items.length });
			this.scrollStep = this.nodes.items.first().width();
			this.rightLimit = this.nodes.itemsWrapper.width();
		}
	}, {
		key: '_checkoutSlide',
		value: function _checkoutSlide(slideNumber) {
			var _this2 = this;

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
			}, this.options.duration, 'swing', function () {
				_this2.isAnimating = false;
			});
		}
	}, {
		key: '_limitScroll',
		value: function _limitScroll(isToStart) {
			if (isToStart) {
				this._goToStart();
			} else {
				this._goToEnd();
			}
		}
	}, {
		key: '_goToEnd',
		value: function _goToEnd() {
			var _this3 = this;

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
			}, this.options.duration, 'swing', function () {
				_this3.nodes.inner.scrollLeft((_this3.nodes.items.length - 1) * slideWidth);
				slideItem.remove();
				_this3.nodes.itemsWrapper.width(containerWidth);
			});
		}
	}, {
		key: '_goToStart',
		value: function _goToStart() {
			var _this4 = this;

			var slideItem = this.nodes.items.first().clone();
			var containerWidth = this.nodes.itemsWrapper.width();

			this.nodes.itemsWrapper.append(slideItem);
			this.nodes.itemsWrapper.width(containerWidth + slideItem.width());

			this.nodes.pages.eq(this.currentSlide).removeClass('active');
			this.currentSlide = 0;
			this.nodes.pages.eq(this.currentSlide).addClass('active');

			this.nodes.inner.animate({
				scrollLeft: this.nodes.items.length * this.scrollStep
			}, this.options.duration, 'swing', function () {
				_this4.nodes.inner.scrollLeft(0);
				slideItem.remove();
				_this4.nodes.itemsWrapper.width(containerWidth);
			});
		}
	}]);

	return BannerSlider;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.ContentSlider = (function () {
	function ContentSlider(root, options) {
		_classCallCheck(this, ContentSlider);

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

	_createClass(ContentSlider, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				itemsWrapper: this.root.find('.js-items'),
				backward: this.root.find('.js-backward'),
				forward: this.root.find('.js-forward'),
				currentSlide: this.root.find('.js-current-slide'),
				items: this.root.find('.js-item'),
				description: this.root.find('.js-description')
			};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.backward.on('click', function () {
				_this._previousSlide();
			});

			this.nodes.forward.on('click', function () {
				_this._nextSlide();
			});
		}
	}, {
		key: '_nextSlide',
		value: function _nextSlide() {
			this.nodes.description.eq(this.currentSlide).removeClass('show');
			this.currentSlide = this.currentSlide + 1;
			this._goToSlide(this.currentSlide);
		}
	}, {
		key: '_previousSlide',
		value: function _previousSlide() {
			this.nodes.description.eq(this.currentSlide).removeClass('show');
			this.currentSlide = this.currentSlide - 1;
			this._goToSlide(this.currentSlide);
		}
	}, {
		key: '_goToSlide',
		value: function _goToSlide(slideNumber) {
			var _this2 = this;

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
			}, this.options.duration, this.options.easing, function () {
				_this2.isAnimating = false;
			});
		}
	}, {
		key: '_goToEnd',
		value: function _goToEnd() {
			var _this3 = this;

			var slideItem = this.nodes.items.last().clone();

			this.nodes.itemsWrapper.prepend(slideItem);
			this.nodes.itemsWrapper.css({ marginLeft: -this.options.slideWidth });
			this.nodes.currentSlide.text(this.currentSlide + 1);
			this.nodes.description.last().addClass('show');

			this.nodes.itemsWrapper.animate({
				marginLeft: 0
			}, this.options.duration, this.options.easing, function () {
				var marginLeft = -_this3.currentSlide * _this3.options.slideWidth;

				_this3.isAnimating = false;
				_this3.nodes.itemsWrapper.css({ marginLeft: marginLeft });
				slideItem.remove();
			});
		}
	}, {
		key: '_goToStart',
		value: function _goToStart() {
			var _this4 = this;

			var slideItem = this.nodes.items.first().clone();

			this.nodes.itemsWrapper.append(slideItem);
			this.nodes.currentSlide.text(this.currentSlide + 1);
			this.nodes.description.first().addClass('show');

			this.nodes.itemsWrapper.animate({
				marginLeft: -this.nodes.items.length * this.options.slideWidth
			}, this.options.duration, 'swing', function () {
				slideItem.remove();
				_this4.nodes.itemsWrapper.css({ marginLeft: 0 });
				_this4.isAnimating = false;
			});
		}
	}]);

	return ContentSlider;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
	if (!_.isUndefined(window.google)) {
		var _gm = google.maps;
	}
})();

var GoogleMap = (function () {
	function GoogleMap(root) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, GoogleMap);

		var defaultOptions = {
			offset: false,
			coords: [-34.397, 150.644],
			mapOptions: {
				mapTypeId: !_.isUndefined(window.google) ? google.maps.MapTypeId.ROADMAP : '', //MapTypeId.SATELLITE, MapTypeId.HYBRID, MapTypeId.TERRAIN
				maxZoom: 45,
				zoom: 15,
				minZoom: 0,
				zoomControl: true,
				overviewMapControl: true
			}
		};

		this.root = root;
		this.options = _.assign(defaultOptions, options);

		this.MercatorProjection = null;
		this.MapIcon = null;
		this.MapCenter = null;
	}

	_createClass(GoogleMap, [{
		key: 'initialize',
		value: function initialize() {}
	}, {
		key: '_createMap',
		value: function _createMap() {
			var _this = this;

			var centerMap = new gm.LatLng(this.options.coords[0], this.options.coords[1]);
			this.map = new gm.Map(this.root.get(0), this.options.mapOptions);
			this.map.setCenter(centerMap);
			this.MapCenter = centerMap;

			google.maps.event.addListenerOnce(this.map, 'idle', function (f) {
				if (_this.options.offset) {
					_this.MercatorProjection = new MercatorProjection(_this.map);

					var offset = _this.root.width() - _this.options.offset;

					var point = new google.maps.Point(offset / 2, _this.root.height() / 2);
					var latLng = _this.MercatorProjection.PixelToLatLng(point);

					_this.map.setCenter(latLng);

					_this.MapCenter = latLng;
				}
			});

			google.maps.event.addListener(this.map, 'click', _.bind(function (event) {
				this.trigger('mapClick', event);
			}, this));

			google.maps.event.addListener(this.map, 'zoom_changed', function (f) {
				if (_this.MapCenter) {
					_this.map.panTo(_this.MapCenter);
				}
			});

			google.maps.event.addListener(this.map, 'dragstart', _.bind(function (event) {
				this.center = null;
			}, this));
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {}
	}, {
		key: '_ready',
		value: function _ready() {
			var _this2 = this;

			gm.event.addDomListener(window, 'load', this._createMap());

			this.icon = {
				url: './site/assets/images/point.png',
				size: [32, 37]
			};

			if (!this.nodes.addresses.length) {
				return;
			}

			this.nodes.addresses.each(function (index) {
				var item = $(_this2);
				var coords = $.parseJSON(item.data('coords').json);

				_this2.marker = coords;

				item.on('click', function (e) {
					e.preventDefault();
					var item = $(this);

					if (item.hasClass('active')) {
						return;
					}

					item.siblings().removeClass('active').end().addClass('active');

					GoogleMaps.panTo = coords;
				});
			});
		}
	}, {
		key: 'icon',
		set: function set(value) {
			if (value) {
				this.MapIcon = {
					url: value.url,
					size: new google.maps.Size(value.size[0], value.size[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(value.size[0] / 2, value.size[1])
				};
			}
		},
		get: function get() {
			return this.MapIcon;
		}
	}, {
		key: 'marker',
		set: function set(value) {
			var position = null;

			_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

			var icon = this.icon == null ? '' : this.icon;

			var marker = new gm.Marker({
				position: position,
				map: this.map,
				icon: icon
			});

			google.maps.event.addListener(marker, 'click', _.bind(function () {
				this.panTo = marker.getPosition();
			}, this));
		}
	}, {
		key: 'center',
		set: function set(value) {
			var position = null;

			_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

			this.map.setCenter(position);

			this.MapCenter = position;
		}
	}, {
		key: 'panTo',
		set: function set(value) {
			var position = null;

			_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

			this.map.panTo(position);
			this.MapCenter = position;

			if (this.MercatorProjection) {
				var offset = this.root.width() - this.options.offset;

				var point = new google.maps.Point(offset / 2, this.root.height() / 2);
				var latLng = this.MercatorProjection.PixelToLatLng(point);
				this.map.panTo(latLng);

				this.MapCenter = latLng;
			}
		}
	}]);

	return GoogleMap;
})();

var MercatorProjection = (function () {
	function MercatorProjection(map) {
		_classCallCheck(this, MercatorProjection);

		this.map = map;
		this.mapOverlay = new google.maps.OverlayView();
		this.mapOverlay.draw = function () {};

		this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2, TILE_SIZE / 2);

		this._ready();
	}

	/**
  * Specified LatLng value is used to calculate pixel coordinates and
  * update the control display. Container is also repositioned.
  * @param {google.maps.LatLng} latLng Position to display
  */

	_createClass(MercatorProjection, [{
		key: 'LatLngToPixel',
		value: function LatLngToPixel(latLng) {
			var projection = this.mapOverlay.getProjection();
			var point = projection.fromLatLngToContainerPixel(latLng);
			return point;
		}

		/**
   * Specified LatLng value is used to calculate pixel coordinates and
   * update the control display. Container is also repositioned.
   * @param {google.maps.Point} Point Position to display
   */
	}, {
		key: 'PixelToLatLng',
		value: function PixelToLatLng(point) {
			var projection = this.mapOverlay.getProjection();
			var newPoint = projection.fromContainerPixelToLatLng(point);

			return newPoint;
		}
	}, {
		key: '_ready',
		value: function _ready() {
			this.mapOverlay.setMap(this.options.map);
		}
	}]);

	return MercatorProjection;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Header = (function () {
	function Header(root) {
		_classCallCheck(this, Header);

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

	_createClass(Header, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
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
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.listItems.on('click', function (event) {
				_this._toggleMenu($(event.currentTarget));
			});

			this.nodes.closeIcons.on('click', function () {
				_this._closeHeader();
			});

			this.nodes.eye.on('click', function () {
				_this._togglePasswordInput();
			});

			this.nodes.searchInput.on('input', function () {
				_this._inputHandler();
			});

			this.root.on('click', function (event) {
				event.stopPropagation();
			});

			this.nodes.overlay.on('click', function () {
				_this._closeHeader();
			});

			this.nodes.cityItems.on('click', function (event) {
				var currentCity = $(event.currentTarget);

				if (currentCity.hasClass('disabled') || currentCity.hasClass('letter')) {
					return;
				}

				_this._citySelect(currentCity);
			});

			$$.window.on('keydown', function (event) {
				if (event.keyCode !== $$.ESCAPE_KEY_CODE) {
					return;
				}

				_this._closeHeader();
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			var parameters = $$.parseUrlParams(location.href);
			var auth = parameters.auth;

			if ('auth' in parameters && auth.toString() === 'true') {
				this.nodes.enter.addClass('hidden');
				this.nodes.profile.removeClass('hidden');
			}

			this.iconSpace = Number.parseInt(this.nodes.closeIcons.css('right'));

			this.currentCity = this.nodes.cityItems.filter(function (index, city) {
				return $(city).hasClass('disabled');
			}).first();
		}
	}, {
		key: '_calculateScrollWidth',
		value: function _calculateScrollWidth() {
			$$.body.css({ overflow: 'hidden' });

			var minWidth = $$.body.width();

			$$.body.css({ overflow: 'auto' });

			var width = $$.body.width();

			return minWidth - width;
		}
	}, {
		key: '_citySelect',
		value: function _citySelect(currentCity) {
			var cityName = currentCity.text();

			this.nodes.cityNameInHeader.text(cityName);
			this.currentCity.removeClass('disabled');
			this.currentCity = currentCity;
			this.currentCity.addClass('disabled');
			this._closeHeader();
		}
	}, {
		key: '_closeHeader',
		value: function _closeHeader() {
			var _this2 = this;

			this.nodes.clearableInputs.val('');
			this.currentName = '';
			this._dropSearchState();
			this.nodes.overlay.removeClass('show');

			this.nodes.overlay.fadeOut();

			this.root.animate({
				height: this.options.defaultHeight
			}, this.options.duration, this.options.easing, function () {
				_this2.oldHeight = _this2.options.defaultHeight;
				_this2.isOpened = false;

				_.forEach(_this2.allClasses, function (state) {
					_this2.root.removeClass(state);
				});
			});
		}
	}, {
		key: '_dropSearchState',
		value: function _dropSearchState() {
			if (!this.root.hasClass(this.root.data('searchCity'))) {
				return;
			}

			this.nodes.searchInput.val('');
			this.root.removeClass(this.root.data('searchCity'));
			this.nodes.cityItems.removeClass('hidden');
		}
	}, {
		key: '_inputHandler',
		value: function _inputHandler() {
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

				this.nodes.cityItems.filter(function (index, element) {
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

			var oldHeight = this.root.height();

			this.root.css({ height: 'auto' });

			var realHeight = this.root.height();

			this.root.css({ height: oldHeight });

			this.root.animate({
				height: realHeight
			}, this.options.duration);
		}
	}, {
		key: '_toggleMenu',
		value: function _toggleMenu(listItem) {
			var _this3 = this;

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

			if (!listItem.hasClass('js-tab') && !(currentAdditionalClass in this.tabStates) || listItem.hasClass('js-tab')) {
				this.tabStates[currentAdditionalClass] = additionalClass;
			}

			_.forEach(this.allClasses, function (state) {
				_this3.root.removeClass(state);
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
			}, this.options.duration, 'swing', function () {
				_this3.oldHeight = endHeight;
				_this3.isOpened = true;
			});
		}
	}, {
		key: '_togglePasswordInput',
		value: function _togglePasswordInput() {
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
	}]);

	return Header;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.PageNotFound = (function () {
	function PageNotFound(root) {
		_classCallCheck(this, PageNotFound);

		this.root = root;
		this.sources = this.root.data('sources');
		this.currentImageUrl = _.first(this.sources);

		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_createClass(PageNotFound, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				whoIs: this.root.find('.js-who-is')
			};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.whoIs.on('click', function (event) {
				event.preventDefault();
				_this._checkoutImage();
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			var _this2 = this;

			this.timeOutId = setTimeout(function () {
				_this2._checkoutImage();
			}, 8000);
		}
	}, {
		key: '_checkoutImage',
		value: function _checkoutImage() {
			var _this3 = this;

			var sources = _.reject(this.sources, function (image) {
				return image === _this3.currentImageUrl;
			});

			this.currentImageUrl = sources[_.random(sources.length - 1)];
			this.root.css('background-image', 'url(' + this.currentImageUrl + ')');
			clearTimeout(this.timeOutId);

			this.timeOutId = setTimeout(function () {
				_this3._checkoutImage();
			}, 8000);
		}
	}]);

	return PageNotFound;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MainSlider = (function () {
	function MainSlider() {
		var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, MainSlider);

		var defaultOptions = {};

		//super(root, _.merge(options || {}, defaultOptions, _.defaults));

		//$$.Emitter.call(this);
	}

	_createClass(MainSlider, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				slides: this.root.find('.slide'),
				arrows: this.root.find('.slide-button'),
				pagination: this.root.find('.pagination')
			};
		}
	}, {
		key: '_ready',
		value: function _ready() {
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
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.on('slideChange', _.bind(function () {
				this.nodes.pagination.eq(this.index).siblings().removeClass('active');
				this.nodes.pagination.eq(this.index).addClass('active');
			}, this));

			this.nodes.arrows.on('click', event = function (event) {
				var item = $(event.currentTarget);

				var newIndex = _this.index + item.data('direction');

				if (newIndex < 0) {
					newIndex = _this.slidesLength - 1;
				} else if (newIndex > _this.slidesLength - 1) {
					newIndex = 0;
				}

				if (item.data('direction') > 0) {
					_this.nodes.slides.eq(_this.index).data('spring').target(-1);

					_this.nodes.slides.eq(newIndex).data('spring').position(1);
					_this.nodes.slides.eq(newIndex).data('spring').target(0);
				} else {
					_this.nodes.slides.eq(_this.index).data('spring').target(1);

					_this.nodes.slides.eq(newIndex).data('spring').position(-1);
					_this.nodes.slides.eq(newIndex).data('spring').target(0);
				}

				_this.index = newIndex;

				_this.emit('slideChange');
			});

			this.nodes.pagination.on('click', event = function (event) {
				var item = $(event.currentTarget);

				if (_this.index == item.index()) {
					return;
				}

				_this.setIndex(_this.index, item.index());
			});
		}
	}, {
		key: 'slideRight',
		value: function slideRight(index, newIndex) {
			this.nodes.slides.eq(index).data('spring').target(-1);

			this.nodes.slides.eq(newIndex).data('spring').position(1);
			this.nodes.slides.eq(newIndex).data('spring').target(0);
		}
	}, {
		key: 'slideLeft',
		value: function slideLeft(index, newIndex) {
			this.nodes.slides.eq(this.index).data('spring').target(1);

			this.nodes.slides.eq(newIndex).data('spring').position(-1);
			this.nodes.slides.eq(newIndex).data('spring').target(0);
		}
	}, {
		key: '_initSpring',
		value: function _initSpring() {
			this.nodes.slides.each(function (index) {
				var item = $(this);

				var spring = new $$.Simulation.Spring({
					rigidness: 100,
					damping: 1.5,
					target: 1,
					position: 1,
					targetLimits: [-1, 1],
					step: function step() {
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
	}, {
		key: 'setIndex',
		value: function setIndex(index, newIndex) {
			if (index > newIndex) {
				this.slideLeft(index, newIndex);
			} else {
				this.slideRight(index, newIndex);
			}

			this.nodes.pagination.eq(newIndex).siblings().removeClass('active');
			this.nodes.pagination.eq(newIndex).addClass('active');
			this.index = newIndex;
		}
	}, {
		key: '_resizeSlider',
		value: function _resizeSlider() {
			var startWidth = 1420;
			var fontSize = 16;

			$('window').resize(_.bind(function () {
				var currentWidth = $$.window.width() + $$.ScrollWidth();

				if ($('window').width() >= 1420) {
					var ratio = 1420 / startWidth * 100 / 100;

					this.root.css({
						fontSize: fontSize * ratio + 'px'
					});

					return;
				}

				if ($('window').width() <= 960) {
					var ratio = 960 / startWidth * 100 / 100;

					this.root.css({
						fontSize: fontSize * ratio + 'px'
					});

					return;
				}

				var ratio = currentWidth / startWidth * 100 / 100;

				this.root.css({
					fontSize: fontSize * ratio + 'px'
				});
			}, this));

			$('window').resize();
		}
	}]);

	return MainSlider;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Slider = (function () {
	function Slider(root, options) {
		_classCallCheck(this, Slider);

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

	_createClass(Slider, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
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
	}, {
		key: '_createComponents',
		value: function _createComponents() {
			var self = this;
			var roundFactor = 10000;

			this.spring = new $$.Simulation.Spring({
				rigidness: this.options.rigidness,
				damping: this.options.damping,
				position: this.options.from,
				target: this.options.to,
				positionLimits: this.options.targetLimits,
				step: function step() {
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
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.backwardButton.on('click', function () {
				_this._goTo(-_this.scrollStep);
			});

			this.nodes.forwardButton.on('click', function () {
				_this._goTo(_this.scrollStep);
			});

			this.nodes.progress.on('drag', { relative: true }, function (event, data) {
				_this._scrollTo(data.offsetX - data.originalX + _this.previousOffset);
				_this.root.addClass('active');
			});

			this.nodes.progress.on('dragend', function () {
				_this.previousOffset = _this.currentOffset;
				_this.root.removeClass('active');
			});

			$$.window.on('resize', function () {
				_this._calculateScrollWidth();
				_this._resizeSlider();
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			this._calculateScrollWidth();

			this.scrollStep = this.options.scrollStep;

			this.nodes.overflowEllipsis.dotdotdot({
				wrap: 'letter',
				height: 50
			});

			this.sliderWidth = this.nodes.inner.width();
		}
	}, {
		key: '_resizeSlider',
		value: function _resizeSlider() {
			var sliderWidth = this.nodes.inner.width();

			this._scrollTo(this.currentOffset - sliderWidth + this.sliderWidth);
			this.sliderWidth = sliderWidth;
		}
	}, {
		key: '_calculateScrollWidth',
		value: function _calculateScrollWidth() {
			var containerWidth = this.nodes.itemsWrapper.width();
			var progressBarWidth = 100 * this.root.width() / containerWidth;

			this.nodes.progress.css({ width: progressBarWidth + '%' });
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
	}, {
		key: '_scrollTo',
		value: function _scrollTo(offset) {
			var ratio = this.options.targetLimits[1] / this.maxScrollBarPosition;
			var position = offset * ratio;

			if (position < -1 || offset < 0) {
				this.previousOffset = this.currentOffset;
				return;
			}

			position = $$.clamp(position, 0, 1);
			this.spring.target(position);
			this.currentOffset = offset;
		}
	}, {
		key: '_goTo',
		value: function _goTo(step) {
			var offset = step + this.currentOffset;

			if (offset < 0) {
				offset = 0;
			} else if (offset > this.rightLimit) {
				offset = this.rightLimit;
			}

			this._scrollTo(offset);
		}
	}]);

	return Slider;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Tabs = (function () {
	function Tabs(root) {
		_classCallCheck(this, Tabs);

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

	_createClass(Tabs, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				tabs: this.root.find('.js-tab'),
				tabContents: this.root.find('.js-tab-content'),
				contentWrapper: this.root.find('.js-content-wrapper'),
				outer: this.root.find('.js-outer')
			};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.nodes.tabs.on('click', function (event) {
				var tab = $(event.currentTarget);

				if (tab.hasClass('current')) {
					return;
				}

				_this._goTo(tab.index());
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			var height = this.nodes.tabContents.first().height();

			this.nodes.outer.css({ height: height + this.options.emptySpace });
		}
	}, {
		key: '_goTo',
		value: function _goTo(position) {
			var _this2 = this;

			if (this.isAnimating) {
				return;
			}

			var isNext = position > this.currentTab;

			this.nodes.tabContents.each(function (number, tabElement) {
				var tab = $(tabElement);

				if (number === position || number === _this2.currentTab) {
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

			_.defer(function () {
				var tabHeight = _this2.nodes.tabContents.eq(position).height();

				_this2.nodes.outer.animate({
					height: tabHeight + _this2.options.emptySpace
				}, _this2.options.duration, _this2.options.easing);
			});

			this.nodes.contentWrapper.animate({
				marginLeft: isNext ? -this.tabsWidth : 0
			}, this.options.duration, this.options.easing, function () {
				_this2.isAnimating = false;
			});
		}
	}]);

	return Tabs;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.VideoBlock = (function () {
	function VideoBlock(root) {
		_classCallCheck(this, VideoBlock);

		this.root = root;

		this._cacheNodes();
		this._bindEvents();
	}

	_createClass(VideoBlock, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				inner: this.root.find('.js-inner')
			};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this = this;

			this.root.on('click', function () {
				var videoType = _this.root.data('videoType');
				var videoId = _this.root.data('videoId');
				var width = _this.root.width();
				var height = _this.root.height();
				var template = $$.makeVideoPlayerHtml(videoType, videoId, width, height);

				_this.nodes.inner.html(template);
			});
		}
	}]);

	return VideoBlock;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

var Application = (function () {
	function Application() {
		_classCallCheck(this, Application);

		this._initMainSlider();
		this._initSlider();
		this._initHeader();
		this._initPageNotFound();
		this._initContentSlider();
		this._initVideoBlocks();
		this._initTabs();
	}

	_createClass(Application, [{
		key: '_initMainSlider',
		value: function _initMainSlider() {
			$('.js-main-slider').each(function () {
				new $$.BannerSlider($(this));
			});
		}
	}, {
		key: '_initSlider',
		value: function _initSlider() {
			$('.js-slider').each(function () {
				new $$.Slider($(this));
			});
		}
	}, {
		key: '_initHeader',
		value: function _initHeader() {
			$('.js-header-wrapper').each(function () {
				new $$.Header($(this));
			});
		}
	}, {
		key: '_initPageNotFound',
		value: function _initPageNotFound() {
			$('.js-page-not-found').each(function () {
				new $$.PageNotFound($(this));
			});
		}
	}, {
		key: '_initContentSlider',
		value: function _initContentSlider() {
			$('.js-content-slider').each(function () {
				new $$.ContentSlider($(this));
			});
		}
	}, {
		key: '_initVideoBlocks',
		value: function _initVideoBlocks() {
			$('.js-video-block').each(function () {
				new $$.VideoBlock($(this));
			});
		}
	}, {
		key: '_initTabs',
		value: function _initTabs() {
			$('.js-tabs-handler').each(function () {
				new $$.Tabs($(this));
			});
		}
	}]);

	return Application;
})();

$(function () {
	$$.window = $(window);
	$$.body = $(document.body);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();
	$$.application = new Application();
	$$.ESCAPE_KEY_CODE = 27;

	$$.window.on('resize', function () {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});
});
//# sourceMappingURL=app.js.map
