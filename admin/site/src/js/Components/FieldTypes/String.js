$$.FieldType.String = class FieldTypeString {
	constructor (options = {}) {
		this.options = {
			column: 's12',
			label: 'String',
			bindKey: '',
			uniqueId: _.uniqueId('string_')
		};

		_.assign(this.options, options);

		this._template();
	}

	_template () {
		"use strict";

		var id = _.uniqueId('input_');
		//col ${this.options.column}
		this.template = `
			<div class="field">
	          <input placeholder="Placeholder" id="${this.options.uniqueId}" type="text" data-bind="value: ${this.options.bindKey}.value">
	        </div>`;
	}
};
