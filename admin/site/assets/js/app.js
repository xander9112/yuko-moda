/**
 * Base emitter class.
 *
 * Dependencies: underscore.js.
 *
 * Example:
 *
 *   var e = new $$.Emitter();
 *
 *   e.on('event1', function() {});
 *   e.on('event2.namespace1', function() {});
 *   e.on('event2.namespace2', function() {});
 *   e.on('event3a.namespace3', function() {});
 *   e.on('event3b.namespace3', function() {});
 *   e.on('event3c.namespace3', function() {});
 *   e.emit('event1', { Some event data here... });
 *   e.emit('event2.namespace1');
 *   e.off('event1');
 *   e.off('event2.namespace1');
 *   e.off('event2.namespace2');
 *   e.off('.namespace3');
 *
 * Multiple event data arguments are supported.
 *
 *   e.on('event10', function(a, b, c) { ... });
 *   e.emit('event10', 2, 'qwe', { x: 3, y: 'zxc' });
 *
 * Also #trigger() is an alias for #emit().
 *
 * NOTE: The namespace name "*" has a special meaning in $$.Emitter.ItemContainer.
 */

'use strict';

var $$ = $$ || {};

/**
 * @constructor
 */
$$.Emitter = function () {
	this._itemContainer = new $$.Emitter.ItemContainer();
};

$$.Emitter.prototype = {
	/**
  * @param {String} eventId
  * @return {Boolean}
  * @private
  */
	_isEventIdJustANamespace: function _isEventIdJustANamespace(eventId) {
		eventId = String(eventId);

		return !!eventId.match(/^\.[a-z\d]+$/i);
	},

	/**
  * @param {String} eventId
  * @return {Array} [eventName, namespace]
  * @throws {Error}
  * @private
  */
	_parseAndValidateEventId: function _parseAndValidateEventId(eventId) {
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
	},

	/**
  * @param {String} eventId
  */
	emit: function emit(eventId /*, eventData1, eventData2, ... */) {
		eventId = String(eventId);

		var parts = this._parseAndValidateEventId(eventId);
		var items = this._itemContainer.getItems(parts[0], parts[1]);
		var args = Array.prototype.slice.call(arguments, 1);

		_.each(items, function (item) {
			item.callback.apply(null, args);
		});
	},

	/**
  * @param {String} eventId
  * @param {Function} callback
  */
	on: function on(eventId, callback) {
		if (callback == null) {
			throw Error('An event callback should be provided.');
		}

		if (!_.isFunction(callback)) {
			throw Error('An event callback should be a function.');
		}

		var parts = this._parseAndValidateEventId(eventId);

		this._itemContainer.add(parts[0], parts[1], callback);
	},

	off: function off(eventId) {
		eventId = String(eventId);

		if (this._isEventNameWithNamespaceJustANamespace(eventId)) {
			// Just a namespace.
			this._itemContainer.remove(null, eventId.substr(1));
		} else {
			// Event name and possible namespace.
			var parts = this._parseAndValidateEventId(eventId);
			this._itemContainer.remove(parts[0], parts[1]);
		}
	}
};

$$.Emitter.prototype.trigger = $$.Emitter.prototype.emit;

$$.Emitter.ItemContainer = function () {
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
};

$$.Emitter.ItemContainer.prototype = {
	/**
  * @param {String} eventName
  * @param {String}|null namespace
  * @param {Function} callback
  */
	add: function add(eventName, namespace, callback) {
		eventName = String(eventName);
		namespace = namespace == null ? '*' : String(namespace);

		if (!this._items.hasOwnProperty(eventName)) {
			this._items[eventName] = {};
		}

		if (!this._items[eventName].hasOwnProperty(namespace)) {
			this._items[eventName][namespace] = [];
		}

		this._items[eventName][namespace].push({
			callback: callback
		});
	},

	/**
  * @param {String} eventName
  * @param {String}|null namespace
  * @return {Array}
  */
	getItems: function getItems(eventName, namespace) {
		eventName = String(eventName);

		if (!this._items.hasOwnProperty(eventName)) {
			return [];
		}

		if (namespace == null) {
			// Return items for all namespaces of the event.

			var arraysOfItems = _.values(this._items[eventName]);

			return _.union.apply(null, arraysOfItems);
		}

		namespace = String(namespace);

		if (!this._items[eventName].hasOwnProperty(namespace)) {
			return [];
		}

		return this._items[eventName][namespace];
	},

	/**
  * Removes by event name, by namespace or by both.
  *
  * @param {String}|null eventName
  * @param {String}|null namespace
  */
	remove: function remove(eventName, namespace) {
		if (eventName == null && namespace == null) {
			throw Error('Only one of the arguments can be omitted.');
		}

		if (namespace == null) {
			this.removeByEventName(eventName);
		} else if (eventName == null) {
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
	},

	/**
  * @param {String} eventName
  */
	removeByEventName: function removeByEventName(eventName) {
		eventName = String(eventName);

		if (!this._items.hasOwnProperty(eventName)) {
			return;
		}

		delete this._items[eventName];
	},

	/**
  * @param {String} namespace
  */
	removeByNamespace: function removeByNamespace(namespace) {
		namespace = String(namespace);

		_.each(this._items, function (itemsByNamespace) {
			if (!itemsByNamespace.hasOwnProperty(namespace)) {
				return;
			}

			delete itemsByNamespace[namespace];
		});
	}
};;
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

$$.Simulation.__springSimulator = new $$.Simulation.SpringSimulator();;
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

_.each(['frozen', 'position', 'positionLimits', 'velocity', 'velocityLimit', 'rigidness', 'damping', 'forcePower',, 'targetVelocityLimit', 'targetVelocityLimitPower', 'stopAtTarget'], function (k) {
	$$.Simulation.Spring.prototype[k] = function (value) {
		if (arguments.length == 0) {
			return this['_' + k];
		}

		this['_' + k] = value;
	};
});;
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

$$.timeLine = function (startTime, factor, finishTime) {
	function getDecimal(num) {
		return +(num % 1).toFixed(6);
	}

	var time = [];
	var j = 0;
	for (var i = startTime; i <= finishTime; i += factor) {

		if (i >= 24) {
			time.push(Math.floor(j) + ':' + getDecimal(j) * 6 + '0');
			j += 0.5;
		} else {
			time.push(Math.floor(i) + ':' + getDecimal(i) * 6 + '0');
		}
	}
	return time;
};

$$.hoursToMinutes = function (from, to) {
	var minutesInHours = (to.replace(':', '').substr(0, 2) - from.replace(':', '').substr(0, 2)) * 60;
	var minutes = to.replace(':', '').substr(2) - from.replace(':', '').substr(2);
	return minutes + minutesInHours;
};;
"use strict";

$$ = $$ || {};

$$.Model = $$.Model || {};
$$.Component = $$.Component || {};
$$.FieldType = $$.FieldType || {};;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Model.Index = (function () {
	function ModelIndex() {
		"use strict";

		var root = arguments.length <= 0 || arguments[0] === undefined ? $('main') : arguments[0];

		_classCallCheck(this, ModelIndex);

		this.root = root === '' ? $('main') : root;

		this._template();
		this.initialize();
	}

	_createClass(ModelIndex, [{
		key: 'initialize',
		value: function initialize() {

			"use strict";
			this.root.html(this.template);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			"use strict";
			console.log('destroy Index');
		}
	}, {
		key: '_template',
		value: function _template() {
			"use strict";
			this.template = '<h1>Index</h1>';
		}
	}]);

	return ModelIndex;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Model.NotFound = (function () {
	function ModelNotFound() {
		"use strict";

		var root = arguments.length <= 0 || arguments[0] === undefined ? $('main') : arguments[0];

		_classCallCheck(this, ModelNotFound);

		this.root = root === '' ? $('main') : root;

		this._template();
		this.initialize();
	}

	_createClass(ModelNotFound, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";
			this.root.html(this.template);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			"use strict";
			console.log('destroy NotFound');
		}
	}, {
		key: '_template',
		value: function _template() {
			"use strict";
			this.template = '<h1>NotFound</h1>';
		}
	}]);

	return ModelNotFound;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Model.Table = (function () {
	function ModelTable() {
		"use strict";

		var _this2 = this;

		var root = arguments.length <= 0 || arguments[0] === undefined ? $('main') : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, ModelTable);

		this.options = options;
		this.root = root === '' ? $('main') : root;
		this.model = {};
		this.fieldsType = [];

		_.each($$.FieldType, function (value, key) {
			_this2.fieldsType.push(key);
		});

		faker.locale = "ru";

		this.fakerObject = {
			Boolean: faker.random.boolean,
			Integer: faker.random.number,
			String: faker.name.title,
			Text: faker.lorem.sentences, //(number) - количество предложений
			Media: faker.image.technics //({min: 150,max: 200})
		};

		this.initialize();
	}

	_createClass(ModelTable, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			/**
    * TODO: Связать всё в одну модель и настройки и вывод таблицы
    */

			var _this3 = this;

			this.getTable().then(function (response) {
				response = $.parseJSON(response);

				_this3._createBindingHelpers();

				if (response.success) {
					_this3._template(_.size(response.data[0]) + 1);
					_this3.root.html(_this3.template);
					_this3.createTable(response.data);
				} else {
					_this3.tableSettings();
				}
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			"use strict";
			console.log('destroy Index');
		}
	}, {
		key: '_template',
		value: function _template(colspan) {
			"use strict";

			this.form = '\n\t\t\t<form action="core/TableSave.php" method="POST" data-bind="submit: saveTable" class="ui form">\n\t\t\t\t\t<table class="ui celled table">\n\t\t\t        <thead>\n\t\t\t        <tr data-bind="keysName: rows()"></tr>\n\t\t\t        </thead>\n\t\t\t        <tbody data-bind="foreach: rows">\n\t\t\t\t\t\t<tr data-bind="tableData: $data"></tr>\n\t                </tbody>\n\t\t\t        <tfoot>\n\t\t\t        <tr>\n\t\t\t            <th colspan="' + colspan + '">\n\t\t\t\t\t\t\t<div class="ui buttons right floated">\n\t\t\t\t\t\t\t\t<button class="ui button" data-bind=\'click: addRow\'>Добавить</button>\n\t\t\t\t\t\t\t\t<div class="or"></div>\n\t\t\t\t\t\t\t\t<button class="ui positive button" type="submit" data-bind=\'enable: rows().length > 0\'>Сохранить</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t            </th>\n\t\t\t        </tr>\n\t\t\t        </tfoot>\n\t\t\t    </table>\n\t\t    </form>';

			this.template = '\n\t\t\t\t\t\t<div class="messages"></div>\n\t\t\t\t\t\t<h1>' + this.options.tableName + '</h1>\n\t\t\t\t\t\t' + this.form;
		}
	}, {
		key: 'createTable',
		value: function createTable(response) {
			"use strict";
			var _this = this;

			var TableModel = function TableModel(rows) {
				var self = this;

				self.rows = ko.observableArray(ko.utils.arrayMap(rows, function (row) {
					var rowModel = {};

					_.each(row, function (object, key) {
						rowModel[key] = object;
					});

					return rowModel;
				}));

				var model = rows[0];

				self.addRow = function () {
					var emptyModel = {};

					_.each(model, function (object, key) {
						emptyModel[key] = {};
						emptyModel[key].value = object.value;
						emptyModel[key].fieldType = object.fieldType;

						if (object.fieldType === 'Boolean') {
							emptyModel[key].value = false;
						} else {
							emptyModel[key].value = '';
						}
					});

					self.rows.push(emptyModel);
				};

				self.removeRow = function (contact) {
					self.rows.remove(contact);
				};

				self.saveTable = function () {
					//self.lastSavedJson(JSON.stringify(ko.toJS(self.rows), null, 2));
					$.ajax({
						type: 'POST',
						url: 'core/TableSave.php',
						data: {
							tableName: _this.options.tableName,
							data: ko.toJSON(self.rows)
						},
						success: function success(response) {
							response = $.parseJSON(response);

							if (response.success) {
								$('body').trigger('showMessage', {
									type: 'success',
									message: 'Таблица успешно сохранена'
								});
							} else {
								$('body').trigger('showMessage', {
									type: 'error',
									message: 'Ошибка при сохранении'
								});
							}
						}
					});
				};
			};

			ko.applyBindings(new TableModel(response));
		}
	}, {
		key: 'getTable',
		value: function getTable() {
			"use strict";

			return $.ajax({
				type: 'POST',
				url: 'core/Table.php',
				data: {
					tableName: this.options.tableName
				}
			});
		}
	}, {
		key: '_createBindingHelpers',
		value: function _createBindingHelpers() {
			"use strict";

			ko.bindingHandlers.tableData = {
				init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
					_.each(valueAccessor(), function (object, key) {
						if (_.isUndefined($$.FieldType[object.fieldType])) {
							console.log(object);
						}

						var field = new $$.FieldType[object.fieldType]({
							bindKey: key,
							column: 's12'
						});

						$(element).append('<td>' + field.template + '</td>');

						if (object.fieldType === 'Boolean') {
							$(element).find('.ui.checkbox').checkbox();

							$(element).find('input').on('change', function (event) {
								object.value = $(this).prop('checked');
							});
						}
					});

					$(element).append('<td class="center aligned"><a href=\'#\' data-bind=\'click: $root.removeRow\'><i class="trash icon"></i></a></td>');
				},
				update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {}
			};

			ko.bindingHandlers.keysName = {
				init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
					_.each(valueAccessor()[0], function (object, key) {
						$(element).append('<th>' + key + '</th>');
					});

					$(element).append('<th class="center aligned"><i class="trash icon"></i></th>');
				},
				update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {}
			};
		}
	}, {
		key: 'tableSettings',
		value: function tableSettings() {
			"use strict";
			var template = '\n\t\t\t<div class="ui modal">\n\t\t\t\t<div class="header">Header</div>\n\t\t\t\t<div class="content">\n\t\t\t\t\t<form action="core/TableSave.php" method="POST" class="ui form" data-bind="submit: saveTable">\n\t\t\t\t\t\t<div class="field" data-bind="foreach: { data: tableKeys, as: \'tableKey\' }">\n\t\t\t\t\t\t\t<label>Название поля</label>\n\t\t\t\t\t\t\t<div class="two fields">\n\t\t\t\t\t\t\t\t<div class="field">\n\t\t\t\t\t\t\t\t\t<input type="text" data-bind="value: tableKey.key" placeholder="Название поля">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="field">\n\t\t\t\t\t\t\t\t\t<select class="ui dropdown" data-bind="options: $root.types, selectedOptions: tableKey.fieldType"></select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="ui buttons right floated">\n\t\t\t\t\t\t\t<button class="ui button" data-bind=\'click: addRow\'>Добавить</button>\n\t\t\t\t\t\t\t<div class="or"></div>\n\t\t\t\t\t\t\t<button class="ui positive button" type="submit" data-bind=\'enable: tableKeys().length > 0\'>Сохранить</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t<br>\n\t\t\t\t\t\t<br>\n\t\t\t\t\t</form>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';
			this.root.html(template);

			$('.ui.modal').modal('show');

			var _this = this;

			var TableModel = function TableModel() {
				var self = this;

				self.types = ko.observableArray(_this.fieldsType);
				self.tableKeys = ko.observableArray([]);

				self.addRow = function () {
					self.tableKeys.push({
						key: '',
						fieldType: ko.observableArray(['Boolean'])
					});
				};

				self.removeRow = function (key) {
					self.tableKeys.remove(key);
				};

				self.saveTable = function () {
					var model = {};

					self.tableKeys().forEach(function (key) {
						model[key.key] = {
							value: '',
							fieldType: key.fieldType()[0]
						};
					});

					$.ajax({
						type: 'POST',
						url: 'core/TableSave.php',
						data: {
							tableName: _this.options.tableName,
							data: ko.toJSON([model])
						},
						success: function success(response) {
							response = $.parseJSON(response);

							if (response.success) {
								$('body').trigger('showMessage', {
									type: 'success',
									message: 'Таблица успешно сохранена'
								});

								location.reload(true);
							} else {
								$('body').trigger('showMessage', {
									type: 'error',
									message: 'Ошибка при сохранении'
								});
							}
						}
					});
				};
			};

			ko.applyBindings(new TableModel());
		}
	}]);

	return ModelTable;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Model.Tables = (function () {
	function ModelTables() {
		"use strict";

		var root = arguments.length <= 0 || arguments[0] === undefined ? $('main') : arguments[0];

		_classCallCheck(this, ModelTables);

		this.root = root === '' ? $('main') : root;

		this._template();
		this.initialize();
	}

	_createClass(ModelTables, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			this.getTables();

			this.root.html(this.template);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			"use strict";
			console.log('destroy Index');
		}
	}, {
		key: '_template',
		value: function _template() {
			"use strict";
			this.template = '\n\t\t\t<div class="ui grid container">\n\t\t\t\t<div class="column row">\n\t\t\t\t\t<h1>Tables</h1>\n\t\t\t\t</div>\n\t\t\t\t<div class="column row two">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t';
		}
	}, {
		key: 'getTables',
		value: function getTables() {
			"use strict";

			var _this = this;

			$.ajax({
				type: 'POST',
				url: 'core/Tables.php',
				success: function success(response) {
					response = $.parseJSON(response);

					var list = $('<div class="ui items column">').appendTo(_this.root.find('.row.two'));

					response.forEach(function (table) {
						list.append('<a href="tables/' + table + '" class="item">' + table + '</a>');
					});

					list.append('\n\n\t\t\t\t<div class="item ui form grid">\n\t\t\t\t\t<div class="field four wide column">\n\t\t\t\t\t<label for="create_table">Название таблицы</label>\n\t\t\t\t\t\t<input placeholder="Название таблицы" id="create_table" type="text" class="validate">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="field four wide column right floated">\n\t\t\t\t\t\t<div class="ui animated fade button js-create-table" tabindex="0">\n\t\t\t\t\t\t\t<div class="visible content">Создать</div>\n\t\t\t\t\t\t\t<div class="hidden content">\n\t\t\t\t\t\t\t\t<i class="icon add Circle"></i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>');
				}
			});

			this.root.on('click', '.js-create-table', function (event) {
				event.preventDefault();

				var tableName = $('#create_table').val();

				if (tableName === '') {
					$('body').trigger('showMessage', {
						type: 'error',
						message: 'Название таблицы не должно быть пустым'
					});
					return;
				}

				$.ajax({
					type: 'POST',
					url: 'core/TableCreate.php',
					data: {
						tableName: tableName
					},
					success: function success(response) {
						response = $.parseJSON(response);

						if (response.success) {
							$('body').trigger('showMessage', {
								type: 'success',
								message: 'Таблица успешно создана'
							});

							$('.item.ui.form.grid').before('<a href="tables/' + tableName + '" class="item">' + tableName + '</a>');
						} else {
							$('body').trigger('showMessage', {
								type: 'error',
								message: 'Ошибка при создании'
							});
						}
					}
				});
			});
		}
	}]);

	return ModelTables;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.FieldType.Boolean = (function () {
	function FieldTypeBoolean() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, FieldTypeBoolean);

		this.options = {
			column: 's12',
			label: 'Integer',
			bindKey: '',
			uniqueId: _.uniqueId('boolean_')
		};

		_.assign(this.options, options);
		this._template();
	}

	_createClass(FieldTypeBoolean, [{
		key: '_template',
		value: function _template() {
			"use strict";
			//col ${this.options.column}
			this.template = '\n\t\t\t\t<div class="field center aligned">\n\t\t\t\t\t<div class="ui toggle checkbox">\n\t\t\t\t\t\t<input type="checkbox" id="' + this.options.uniqueId + '" data-bind="checked: ' + this.options.bindKey + '.value" tabindex="0" class="hidden">\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
		}
	}]);

	return FieldTypeBoolean;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.FieldType.Integer = (function () {
	function FieldTypeInteger() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, FieldTypeInteger);

		this.options = {
			column: 's12',
			label: 'Integer',
			bindKey: '',
			uniqueId: _.uniqueId('integer_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_createClass(FieldTypeInteger, [{
		key: '_template',
		value: function _template() {
			"use strict";
			this.template = '\n\t\t\t<div class="field">\n\t          <input placeholder="Placeholder" id="' + this.options.uniqueId + '" type="number" data-bind="value: ' + this.options.bindKey + '.value">\n\t        </div>';
		}
	}]);

	return FieldTypeInteger;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.FieldType.Media = (function () {
	function FieldTypeMedia() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, FieldTypeMedia);

		this.options = {
			column: 's12',
			label: 'Media',
			bindKey: '',
			uniqueId: _.uniqueId('media_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_createClass(FieldTypeMedia, [{
		key: '_template',
		value: function _template() {
			"use strict";

			var id = _.uniqueId('input_');
			//col ${this.options.column}
			this.template = '\n\t\t\t<div class="field">\n\t          <input placeholder="Placeholder" id="' + this.options.uniqueId + '" type="text" data-bind="value: ' + this.options.bindKey + '.value">\n\t        </div>';
		}
	}]);

	return FieldTypeMedia;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.FieldType.String = (function () {
	function FieldTypeString() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, FieldTypeString);

		this.options = {
			column: 's12',
			label: 'String',
			bindKey: '',
			uniqueId: _.uniqueId('string_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_createClass(FieldTypeString, [{
		key: '_template',
		value: function _template() {
			"use strict";

			var id = _.uniqueId('input_');
			//col ${this.options.column}
			this.template = '\n\t\t\t<div class="field">\n\t          <input placeholder="Placeholder" id="' + this.options.uniqueId + '" type="text" data-bind="value: ' + this.options.bindKey + '.value">\n\t        </div>';
		}
	}]);

	return FieldTypeString;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.FieldType.Text = (function () {
	function FieldTypeText() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, FieldTypeText);

		this.options = {
			column: 's12',
			label: 'Textarea',
			bindKey: '',
			uniqueId: _.uniqueId('text_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_createClass(FieldTypeText, [{
		key: '_template',
		value: function _template() {
			"use strict";
			this.template = '\n\t\t\t<div class="field">\n\t          <textarea id="' + this.options.uniqueId + '" data-bind="value: ' + this.options.bindKey + '.value, uniqueName: true" rows="1"></textarea>\n\t        </div>';
		}
	}]);

	return FieldTypeText;
})();;
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$$.Component.Menu = (function () {
	function ComponentMenu() {
		var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, ComponentMenu);

		var defaultOptions = {};

		this.root = root;
		this.options = _.merge(options || {}, defaultOptions, _.defaults);
		this.current = '';

		this._template();
		this._cacheNodes();
		this.initialize();
	}

	_createClass(ComponentMenu, [{
		key: "initialize",
		value: function initialize() {
			"use strict";

			this.root.append(this.template);
		}
	}, {
		key: "_template",
		value: function _template() {
			"use strict";

			this.template = $("\n\t\t\t<div class=\"ui attached stackable menu\">\n\t\t\t  <div class=\"ui container\">\n\t\t\t    <a href=\"/admin/\" class=\"item\">\n\t\t\t      <i class=\"home icon\"></i> Главная\n\t\t\t    </a>\n\t\t\t    <a href=\"tables\" class=\"item\">\n\t\t\t      <i class=\"grid layout icon\"></i> Таблицы\n\t\t\t    </a>\n\t\t\t    <div class=\"right item\">\n\t\t\t      <div class=\"ui\"><a href=\"/\" target=\"_blank\">На сайт</a></div>\n\t\t\t    </div>\n\t\t\t  </div>\n\t\t\t</div>");
		}
	}, {
		key: "updateMenu",
		value: function updateMenu(currentItem) {
			this.nodes.items.each(function (index, element) {
				$(element).removeClass('selected active');
			});

			if (!_.isUndefined(currentItem)) {
				currentItem.addClass('active');
			}
		}
	}, {
		key: "findUrl",
		value: function findUrl(url) {
			var currentItem = undefined;

			if (url !== '/') {
				if (url.charAt(url.length - 1) === '/') {
					url = url.substring(0, url.length - 1);
				}
			}

			this.nodes.items.each(function (index, element) {
				var href = $(element).find('a').attr('href');

				if (href === url) {
					currentItem = $(element);
				}
			});

			return currentItem;
		}
	}, {
		key: "_cacheNodes",
		value: function _cacheNodes() {
			this.nodes = {
				nav: this.template.find('ul'),
				items: this.template.find('li')
			};
		}
	}, {
		key: "currentItem",
		set: function set(url) {
			"use strict";

			this.updateMenu(this.findUrl(url));
		}
	}, {
		key: "userInfo",
		set: function set(template) {
			"use strict";

			this.nodes.nav.append(template);
		}
	}]);

	return ComponentMenu;
})();;
"use strict";;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

$$.Component.Route = (function () {
	function Route() {
		var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Route);

		this.root = root;
		this.currentModel = null;

		this.menu = options.menu;

		this.initialize();
	}

	_createClass(Route, [{
		key: 'initialize',
		value: function initialize() {
			this.currentUrl = window.location.pathname;
			this._registerRoutes();
		}
	}, {
		key: '_registerRoutes',
		value: function _registerRoutes() {
			var _this = this;

			page.base('/admin');

			page('/', function (options) {
				"use strict";
				_this._initModel(options);
			});

			page('/tables', function (options) {
				"use strict";
				_this._initModel(options);
			});

			page('/tables/:tableName', function (options) {
				"use strict";
				_this._initModel(options);
			});

			page('*', function (options) {
				"use strict";

				options.pathname = '/notFound';
				_this._initModel(options);
			});

			page({
				hashbang: true
			});
		}
	}, {
		key: '_initModel',
		value: function _initModel(options) {
			"use strict";

			var pathname = options.path.split('/')[1];

			if (pathname === '') {
				var modelName = 'Index';
			} else {
				var modelName = pathname.charAt(0).toUpperCase() + pathname.substr(1);
			}

			if (_.size(options.params)) {
				modelName = modelName.slice(0, -1);
			}

			if (this.currentModel) {
				this.currentModel.destroy();
			}

			if (!_.isUndefined($$.Model[modelName])) {
				this.currentModel = new $$.Model[modelName]('', options.params);
				this.menu.currentItem = options.pathname;

				return;
			}

			//page.redirect('/');
		}
	}]);

	return Route;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['ContentPage'] = (function () {
    function ContentPage() {
        var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, ContentPage);

        this.root = root;

        this._cacheNodes();
        this._bindEvents();

        this.initialize();
    }

    _createClass(ContentPage, [{
        key: 'destroy',
        value: function destroy() {
            this.root.off();
            delete this.root;
            delete this.nodes;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            //console.log('ContentPage');
        }
    }, {
        key: '_cacheNodes',
        value: function _cacheNodes() {
            this.nodes = {};
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {}
    }]);

    return ContentPage;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['Default'] = (function () {
	function Default() {
		var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Default);

		this.root = root;

		this._cacheNodes();
		this._bindEvents();

		this.initialize();
	}

	_createClass(Default, [{
		key: 'destroy',
		value: function destroy() {
			delete this.root;
			delete this.nodes;
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			//console.log('Default');
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {}
	}]);

	return Default;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Pages = $$.Pages || {};

$$.Pages['MainPage'] = (function () {
    function MainPage() {
        var root = arguments.length <= 0 || arguments[0] === undefined ? $ : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, MainPage);

        this.root = root;

        this._cacheNodes();
        this._bindEvents();

        this.initialize();
    }

    _createClass(MainPage, [{
        key: 'destroy',
        value: function destroy() {
            this.root.off();
            delete this.root;
            delete this.nodes;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            //console.log('MainPage');
        }
    }, {
        key: '_cacheNodes',
        value: function _cacheNodes() {
            this.nodes = {};
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {}
    }]);

    return MainPage;
})();;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Application = (function () {
	function Application() {
		_classCallCheck(this, Application);

		this.currentPage = undefined;

		this.root = $('body');

		this._cacheNodes();
		this._createComponents();

		this._initialize();
	}

	_createClass(Application, [{
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {
				messages: this.root.find('.g-messages')
			};
		}

		/**
   * Создает необходимые компоненты.
   *
   * @private
   */
	}, {
		key: '_createComponents',
		value: function _createComponents() {
			this.siteMenu = new $$.Component.Menu($('.js-application > header'));

			this.route = new $$.Component.Route($('body'), {
				menu: this.siteMenu
			});
		}
	}, {
		key: '_initialize',
		value: function _initialize() {
			var _this = this;

			var messages = function messages(text) {
				return {
					success: '\n\t\t\t\t<div class="ui positive message">\n\t\t\t\t\t<i class="close icon"></i>\n\t\t\t\t\t<div class="header">\n\t\t\t\t\t\t' + text + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>',
					error: '\n\t\t\t\t<div class="ui negative  message">\n\t\t\t\t\t<i class="close icon"></i>\n\t\t\t\t\t<div class="header">\n\t\t\t\t\t\t' + text + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>'
				};
			};

			this.root.on('showMessage', function (event, data) {
				"use strict";
				$(messages[data.type]);

				var message = $(messages(data.message)[data.type]).appendTo(_this.nodes.messages);

				setTimeout(function () {
					message.slideUp(400, function () {
						message.remove();
					});
				}, 2000);
			});
		}
	}]);

	return Application;
})();

$(function () {
	$$.window = $(window);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();

	$$.application = new $$.Application();

	$$.window.on('resize', function () {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});
});
//# sourceMappingURL=app.js.map
