$$.FieldType.Integer = class FieldTypeInteger {
	constructor (options = {}) {
		this.options = {
			column: 's12',
			label: 'Integer',
			bindKey: '',
			uniqueId: _.uniqueId('integer_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_template () {
		"use strict";
		this.template = `
			<div class="field">
	          <input placeholder="Placeholder" id="${this.options.uniqueId}" type="number" data-bind="value: ${this.options.bindKey}.value">
	        </div>`;
	}
};
