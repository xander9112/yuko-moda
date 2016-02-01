'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $$ = $$ || {};

$$.Emitter = function () {
	function Emitter() {
		_classCallCheck(this, Emitter);

		this._itemContainer = new $$.Emitter.ItemContainer();
	}

	/**
  * @param {String} eventId
  * @return {Boolean}
  * @private
  */

	_createClass(Emitter, [{
		key: '_isEventIdJustANamespace',
		value: function _isEventIdJustANamespace(eventId) {
			eventId = String(eventId);

			return !!eventId.match(/^\.[a-z\d]+$/i);
		}

		/**
   * @param {String} eventId
   * @return {Array} [eventName, namespace]
   * @throws {Error}
   * @private
   */

	}, {
		key: '_parseAndValidateEventId',
		value: function _parseAndValidateEventId(eventId) {
			eventId = String(eventId);

			// Either a single event name.

			var match = eventId.match(/^[a-z\d]+$/i);

			if (match) {
				return [match[0], null];
			}

			// Or an event name + a namespace name.

			match = eventId.match(/^([a-z\d]+)\.([a-z\d]+)$/i);

			if (!match) {
				throw Error('Full event names should not be empty, should consist of letters and numbers' + ' and may contain only single dot in the middle.');
			}

			return [match[1], match[2]];
		}

		/**
   * @param {String} eventId
   */

	}, {
		key: 'trigger',
		value: function trigger(eventId /*, eventData1, eventData2, ... */) {
			eventId = String(eventId);

			var parts = this._parseAndValidateEventId(eventId);
			var items = this._itemContainer.getItems(parts[0], parts[1]);
			var args = Array.prototype.slice.call(arguments, 1);

			_.each(items, function (item) {
				item.callback.apply(null, args);
			});
		}

		/**
   * @param {String} eventId
   * @param {Function} callback
   */

	}, {
		key: 'on',
		value: function on(eventId, callback) {
			if (!callback) {
				throw Error('An event callback should be provided.');
			}

			if (!_.isFunction(callback)) {
				throw Error('An event callback should be a function.');
			}

			var parts = this._parseAndValidateEventId(eventId);

			this._itemContainer.add(parts[0], parts[1], callback);
		}
	}, {
		key: 'off',
		value: function off(eventId) {
			if (!arguments.length) {
				this._itemContainer.clear();
				return;
			}

			eventId = String(eventId);

			if (!this._isEventIdJustANamespace(eventId)) {
				// Event name and possible namespace.
				var parts = this._parseAndValidateEventId(eventId);
				this._itemContainer.remove(parts[0], parts[1]);
			} else {
				// Just a namespace.
				this._itemContainer.remove(null, eventId.substr(1));
			}
		}
	}]);

	return Emitter;
}();

$$.Emitter.ItemContainer = function () {
	function EmitterItemContainer() {
		_classCallCheck(this, EmitterItemContainer);

		/* Items:
   *
   * {
   *   eventName1: {
   *     namespace1: [ { callback, *... }, ... ],
   *     namespace2: [ ... ]
   *     ...
   *   },
   *
   *   eventName2: { ... }
   *   ...
   * }
   */
		this._items = {};
	}

	/**
  * @param {String} eventName
  * @param {String} namespace
  * @param {Function} callback
  */

	_createClass(EmitterItemContainer, [{
		key: 'add',
		value: function add(eventName, namespace, callback) {
			eventName = String(eventName);
			namespace = !namespace ? '*' : String(namespace);

			if (!this._items.hasOwnProperty(eventName)) {
				this._items[eventName] = {};
			}

			if (!this._items[eventName].hasOwnProperty(namespace)) {
				this._items[eventName][namespace] = [];
			}

			this._items[eventName][namespace].push({
				callback: callback
			});
		}

		/**
   * @param {String} eventName
   * @param {String}|null namespace
   * @return {Array}
   */

	}, {
		key: 'getItems',
		value: function getItems(eventName, namespace) {
			eventName = String(eventName);

			if (!this._items.hasOwnProperty(eventName)) {
				return [];
			}

			if (!namespace) {
				// Return items for all namespaces of the event.

				var arraysOfItems = _.values(this._items[eventName]);

				return _.union.apply(null, arraysOfItems);
			}

			namespace = String(namespace);

			if (!this._items[eventName].hasOwnProperty(namespace)) {
				return [];
			}

			return this._items[eventName][namespace];
		}

		/**
   * Removes by event name, by namespace or by both.
   *
   * @param {String} eventName
   * @param {String} namespace
   */

	}, {
		key: 'remove',
		value: function remove(eventName, namespace) {
			if (!eventName && !namespace) {
				throw Error('Only one of the arguments can be omitted.');
			}

			if (!namespace) {
				this.removeByEventName(eventName);
			} else if (!eventName) {
				this.removeByNamespace(namespace);
			} else {
				// Both eventName and namespace are not null.

				eventName = String(eventName);
				namespace = String(namespace);

				if (!this._items.hasOwnProperty(eventName) || !this._items[eventName].hasOwnProperty(namespace)) {
					return;
				}

				delete this._items[eventName][namespace];
			}
		}

		/**
   * @param {String} eventName
   */

	}, {
		key: 'removeByEventName',
		value: function removeByEventName(eventName) {
			eventName = String(eventName);

			if (!this._items.hasOwnProperty(eventName)) {
				return;
			}

			delete this._items[eventName];
		}

		/**
   * @param {String} namespace
   */

	}, {
		key: 'removeByNamespace',
		value: function removeByNamespace(namespace) {
			namespace = String(namespace);

			_.each(this._items, function (itemsByNamespace) {
				if (!itemsByNamespace.hasOwnProperty(namespace)) {
					return;
				}

				delete itemsByNamespace[namespace];
			});
		}
	}, {
		key: 'clear',
		value: function clear() {
			this._items = {};
		}
	}]);

	return EmitterItemContainer;
}();
"use strict";

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
	}, 20);
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

_.each(['frozen', 'position', 'positionLimits', 'velocity', 'velocityLimit', 'rigidness', 'damping', 'forcePower',, 'targetVelocityLimit', 'targetVelocityLimitPower', 'stopAtTarget'], function (k) {
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

$$.makeVideoPlayerHtml = function (videoType, videoId, width, height) {
	if (videoType == 'youtube') {
		return '<iframe class="youtube-player" type="text/html"' + ' width="' + width + '" height="' + height + '" src="' + 'http://www.youtube.com/embed/' + videoId + '?autoplay=0&rel=0&amp;controls=0&amp;showinfo=0' + '" frameborder="0" wmode="opaque" autoplay="false"></iframe>';
	} else if (videoType == 'vimeo') {
		return '<iframe wmode="opaque" width="' + width + '" height="' + height + '" src="' + 'http://player.vimeo.com/video/' + videoId + '?autoplay=1' + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
	}

	return '';
};

$$.ScrollWidth = function () {
	// создадим элемент с прокруткой
	var div = document.createElement('div');

	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';

	// при display:none размеры нельзя узнать
	// нужно, чтобы элемент был видим,
	// visibility:hidden - можно, т.к. сохраняет геометрию
	div.style.visibility = 'hidden';

	document.body.appendChild(div);
	var scrollWidth = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);

	return scrollWidth;
};

$$.FakerInfo = function (block) {
	var news = block.find('.news-block');

	news.each(function () {
		var item = $(this);
		var hasImage = item.find('img').length == 0 ? false : true;
		var hasTitle = item.find('.title').length == 0 ? false : true;

		if (hasTitle) {
			var title = item.find('.title');
			var subtitle = item.find('.subtitle');
			var description = item.find('.description');
			var date = item.find('.date');
			var rating = item.find('.rating');

			var timeDate = new Date(faker.date.between(2010, 2014));
			var curr_date = timeDate.getDate();
			var curr_month = timeDate.getMonth() + 1;
			var curr_year = timeDate.getFullYear() % 1000;
			var formatDate = curr_date + "." + numb(curr_month) + "." + curr_year;
			var formatTime = numb(timeDate.getHours()) + ":" + numb(timeDate.getMinutes());

			date.text(formatDate + ', ' + formatTime);
			title.text(faker.lorem.words(1)[0]);
			subtitle.text(faker.lorem.paragraph(1));
			description.text(faker.lorem.paragraph(1));
			rating.text($$.getRandomInt(0, 4) + '.' + $$.getRandomInt(0, 9));
		}

		if (hasImage) {
			var width = item.width();
			var height = item.height();
			item.find('img').attr('src', faker.image.imageUrl(width, height, 'transport'));
		}
	});

	function numb(number) {
		if (number < 10) {
			return '0' + number;
		} else {
			return number;
		}
	}
};

$$.number_format = function (number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
	    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
	    s = '',
	    toFixedFix = function toFixedFix(n, prec) {
		var k = Math.pow(10, prec);
		return '' + Math.round(n * k) / k;
	};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

$$.getVideoID = function (url) {
	var id = '';
	url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		id = url[2].split(/[^0-9a-z_\-]/i);
		id = id[0];
	} else {
		id = url;
	}
	return id;
};

$$.secondsToTime = function (seconds) {
	"use strict";

	var allTime = seconds;
	var minutes = parseInt(seconds / 60);
	var sec = parseInt(seconds - minutes * 60);

	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	if (sec < 10) {
		sec = '0' + sec;
	}

	return {
		minutes: minutes,
		sec: sec
	};
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

$$.Component = function (_$$$Emitter) {
	_inherits(Component, _$$$Emitter);

	function Component(root, options) {
		_classCallCheck(this, Component);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));

		_this.root = root;
		_this.options = _.merge(_this._defaultOptions, options);

		_this.initialize();
		return _this;
	}

	_createClass(Component, [{
		key: "initialize",
		value: function initialize() {
			this._cacheNodes();
			this._bindEvents();
			this._ready();
		}
	}, {
		key: "_cacheNodes",
		value: function _cacheNodes() {}
	}, {
		key: "_bindEvents",
		value: function _bindEvents() {}
	}, {
		key: "_ready",
		value: function _ready() {}
	}]);

	return Component;
}($$.Emitter);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $$ = $$ || {};

var Application = function () {
	function Application() {
		"use strict";

		_classCallCheck(this, Application);

		this._initFunction();
	}

	_createClass(Application, [{
		key: "_initFunction",
		value: function _initFunction() {
			"use strict";

			console.log('Init Function');
		}
	}]);

	return Application;
}();

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
