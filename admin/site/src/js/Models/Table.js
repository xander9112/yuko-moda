var $$ = $$ || {};

$$.Model.Table = class ModelTable {
	constructor (root = $('main'), options = {}) {
		"use strict";

		this.options = options;
		this.root = root === '' ? $('main') : root;
		this.model = {};
		this.fieldsType = [];

		_.each($$.FieldType, (value, key) => {
			this.fieldsType.push(key)
		});

		faker.locale = "ru";

		this.fakerObject = {
			Boolean: faker.random.boolean,
			Integer: faker.random.number,
			String: faker.name.title,
			Text: faker.lorem.sentences, //(number) - количество предложений
			Media: faker.image.technics  //({min: 150,max: 200})
		};

		this.initialize();
	}

	initialize () {
		"use strict";

		/**
		 * TODO: Связать всё в одну модель и настройки и вывод таблицы
		 */


		this.getTable().then((response) => {
			response = $.parseJSON(response);

			this._createBindingHelpers();

			if (response.success) {
				this._template(_.size(response.data[0]) + 1);
				this.root.html(this.template);
				this.createTable(response.data);
			} else {
				this.tableSettings();
			}
		});
	}

	destroy () {
		"use strict";
		console.log('destroy Index');
	}

	_template (colspan) {
		"use strict";

		this.form = `
			<form action="core/TableSave.php" method="POST" data-bind="submit: saveTable" class="ui form">
					<table class="ui celled table">
			        <thead>
			        <tr data-bind="keysName: rows()"></tr>
			        </thead>
			        <tbody data-bind="foreach: rows">
						<tr data-bind="tableData: $data"></tr>
	                </tbody>
			        <tfoot>
			        <tr>
			            <th colspan="${colspan}">
							<div class="ui buttons right floated">
								<button class="ui button" data-bind='click: addRow'>Добавить</button>
								<div class="or"></div>
								<button class="ui positive button" type="submit" data-bind='enable: rows().length > 0'>Сохранить</button>
							</div>
			            </th>
			        </tr>
			        </tfoot>
			    </table>
		    </form>`;

		this.template = `
						<div class="messages"></div>
						<h1>${this.options.tableName}</h1>
						${this.form}`;
	}

	createTable (response) {
		"use strict";
		var _this = this;

		var TableModel = function (rows) {
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

				_.each(model, (object, key) => {
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
					success: (response) => {
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

	getTable () {
		"use strict";

		return $.ajax({
			type: 'POST',
			url: 'core/Table.php',
			data: {
				tableName: this.options.tableName
			}
		});
	}

	_createBindingHelpers () {
		"use strict";

		ko.bindingHandlers.tableData = {
			init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				_.each(valueAccessor(), function (object, key) {
					if (_.isUndefined($$.FieldType[object.fieldType])) {
						console.log(object);
					}

					var field = new $$.FieldType[object.fieldType]({
						bindKey: key,
						column: 's12'
					});

					$(element).append(`<td>${field.template}</td>`);

					if (object.fieldType === 'Boolean') {
						$(element).find('.ui.checkbox').checkbox();

						$(element).find('input').on('change', function (event) {
							object.value = $(this).prop('checked');
						});
					}
				});

				$(element).append(`<td class="center aligned"><a href='#' data-bind='click: $root.removeRow'><i class="trash icon"></i></a></td>`);
			},
			update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			}
		};

		ko.bindingHandlers.keysName = {
			init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				_.each(valueAccessor()[0], function (object, key) {
					$(element).append(`<th>${key}</th>`);
				});

				$(element).append(`<th class="center aligned"><i class="trash icon"></i></th>`);
			},
			update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			}
		};
	}

	tableSettings () {
		"use strict";
		var template = `
			<div class="ui modal">
				<div class="header">Header</div>
				<div class="content">
					<form action="core/TableSave.php" method="POST" class="ui form" data-bind="submit: saveTable">
						<div class="field" data-bind="foreach: { data: tableKeys, as: 'tableKey' }">
							<label>Название поля</label>
							<div class="two fields">
								<div class="field">
									<input type="text" data-bind="value: tableKey.key" placeholder="Название поля">
								</div>
								<div class="field">
									<select class="ui dropdown" data-bind="options: $root.types, selectedOptions: tableKey.fieldType"></select>
								</div>
							</div>
						</div>
						<div class="ui buttons right floated">
							<button class="ui button" data-bind='click: addRow'>Добавить</button>
							<div class="or"></div>
							<button class="ui positive button" type="submit" data-bind='enable: tableKeys().length > 0'>Сохранить</button>
						</div>
						<br>
						<br>
						<br>
					</form>
				</div>
			</div>
		`;
		this.root.html(template);

		$('.ui.modal').modal('show');


		var _this = this;

		var TableModel = function () {
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

				self.tableKeys().forEach(key => {
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
					success: (response) => {
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
};
