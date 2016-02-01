var $$ = $$ || {};

$$.Application = class Application {
	constructor () {
		this.currentPage = undefined;

		this.root = $('body');

		this._cacheNodes();
		this._createComponents();

		this._initialize();
	}

	_cacheNodes () {
		this.nodes = {
			messages: this.root.find('.g-messages')
		};
	}

	/**
	 * Создает необходимые компоненты.
	 *
	 * @private
	 */
	_createComponents () {
		this.siteMenu = new $$.Component.Menu($('.js-application > header'));

		this.route = new $$.Component.Route($('body'), {
			menu: this.siteMenu
		});
	}

	_initialize () {
		var messages = function (text) {
			return {
				success: `
				<div class="ui positive message">
					<i class="close icon"></i>
					<div class="header">
						${text}
					</div>
				</div>`,
				error: `
				<div class="ui negative  message">
					<i class="close icon"></i>
					<div class="header">
						${text}
					</div>
				</div>`
			};
		};

		this.root.on('showMessage', (event, data) => {
			"use strict";
			$(messages[data.type]);

			var message = $(messages(data.message)[data.type]).appendTo(this.nodes.messages);

			setTimeout(() => {
				message.slideUp(400, () => {
					message.remove();
				});
			}, 2000);

		});
	}
};

$(function () {
	$$.window = $(window);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();

	$$.application = new $$.Application();

	$$.window.on('resize', () => {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});
});
