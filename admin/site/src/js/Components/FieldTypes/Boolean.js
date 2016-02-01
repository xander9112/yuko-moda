$$.FieldType.Boolean = class FieldTypeBoolean {
	constructor (options = {}) {
		this.options = {
			column: 's12',
			label: 'Integer',
			bindKey: '',
			uniqueId: _.uniqueId('boolean_')
		};

		_.assign(this.options, options);
		this._template();
	}

	_template () {
		"use strict";
		//col ${this.options.column}
		this.template = `
				<div class="field center aligned">
					<div class="ui toggle checkbox">
						<input type="checkbox" id="${this.options.uniqueId}" data-bind="checked: ${this.options.bindKey}.value" tabindex="0" class="hidden">
					</div>
				</div>`;
	}
};
