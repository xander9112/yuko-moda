$$.FieldType.Media = class FieldTypeMedia {
	constructor (options = {}) {
		this.options = {
			column: 's12',
			label: 'Media',
			bindKey: '',
			uniqueId: _.uniqueId('media_')
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
