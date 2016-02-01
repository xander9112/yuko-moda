var $$ = $$ || {};

$$.Model.Tables = class ModelTables {
	constructor (root = $('main')) {
		"use strict";

		this.root = root === '' ? $('main') : root;

		this._template();
		this.initialize();
	}

	initialize () {
		"use strict";

		this.getTables();

		this.root.html(this.template);
	}

	destroy () {
		"use strict";
		console.log('destroy Index');
	}

	_template () {
		"use strict";
		this.template = `
			<div class="ui grid container">
				<div class="column row">
					<h1>Tables</h1>
				</div>
				<div class="column row two">
				</div>
			</div>
			`;
	}

	getTables () {
		"use strict";

		$.ajax({
			type: 'POST',
			url: 'core/Tables.php',
			success: (response) => {
				response = $.parseJSON(response);

				var list = $('<div class="ui items column">').appendTo(this.root.find('.row.two'));

				response.forEach(table => {
					list.append(`<a href="tables/${table}" class="item">${table}</a>`);
				});

				list.append(`

				<div class="item ui form grid">
					<div class="field four wide column">
					<label for="create_table">Название таблицы</label>
						<input placeholder="Название таблицы" id="create_table" type="text" class="validate">
					</div>
					<div class="field four wide column right floated">
						<div class="ui animated fade button js-create-table" tabindex="0">
							<div class="visible content">Создать</div>
							<div class="hidden content">
								<i class="icon add Circle"></i>
							</div>
						</div>
					</div>
				</div>`);
			}
		});


		this.root.on('click', '.js-create-table', (event) => {
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
				success: (response) => {
					response = $.parseJSON(response);

					if (response.success) {
						$('body').trigger('showMessage', {
							type: 'success',
							message: 'Таблица успешно создана'
						});

						$('.item.ui.form.grid').before(`<a href="tables/${tableName}" class="item">${tableName}</a>`);

					} else {
						$('body').trigger('showMessage', {
							type: 'error',
							message: 'Ошибка при создании'
						});
					}
				}
			});
		})
	}
};
