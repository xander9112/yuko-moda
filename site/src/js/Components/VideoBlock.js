var $$ = $$ || {};

$$.VideoBlock = class VideoBlock {
	constructor(root) {
		this.root = root;

		this._cacheNodes();
		this._bindEvents();
	}

	_cacheNodes () {
		this.nodes = {
			inner: this.root.find('.js-inner')
		};
	}

	_bindEvents () {
		this.root.on('click', () => {
			var videoType = this.root.data('videoType');
			var videoId = this.root.data('videoId');
			var width = this.root.width();
			var height = this.root.height();
			var template = $$.makeVideoPlayerHtml(videoType, videoId, width, height);

			this.nodes.inner.html(template);
		});
	}
};
