(function () {
	if (!_.isUndefined(window.google)) {
		const gm = google.maps
	}
}());

class GoogleMap {
	constructor(root, options = {}) {
		var defaultOptions = {
			offset:     false,
			coords:     [-34.397, 150.644],
			mapOptions: {
				mapTypeId:          !_.isUndefined(window.google) ? google.maps.MapTypeId.ROADMAP : '', //MapTypeId.SATELLITE, MapTypeId.HYBRID, MapTypeId.TERRAIN
				maxZoom:            45,
				zoom:               15,
				minZoom:            0,
				zoomControl:        true,
				overviewMapControl: true
			}
		};

		this.root = root;
		this.options = _.assign(defaultOptions, options);

		this.MercatorProjection = null;
		this.MapIcon = null;
		this.MapCenter = null;
	}

	initialize() {
	}

	set icon(value) {
		if (value) {
			this.MapIcon = {
				url:    value.url,
				size:   new google.maps.Size(value.size[0], value.size[1]),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(value.size[0] / 2, value.size[1])
			};
		}
	}

	get icon() {
		return this.MapIcon;
	}

	set marker(value) {
		var position = null;

		_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

		var icon = this.icon == null ? '' : this.icon;

		var marker = new gm.Marker({
			position: position,
			map:      this.map,
			icon:     icon
		});

		google.maps.event.addListener(marker, 'click', _.bind(function () {
			this.panTo = marker.getPosition();
		}, this));
	}

	set center(value) {
		var position = null;

		_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

		this.map.setCenter(position);

		this.MapCenter = position;
	}

	set panTo(value) {
		var position = null;

		_.isArray(value) ? position = new gm.LatLng(value[0], value[1]) : position = value;

		this.map.panTo(position);
		this.MapCenter = position;

		if (this.MercatorProjection) {
			var offset = this.root.width() - this.options.offset;

			var point = new google.maps.Point(offset / 2, this.root.height() / 2);
			var latLng = this.MercatorProjection.PixelToLatLng(point);
			this.map.panTo(latLng);

			this.MapCenter = latLng;
		}
	}

	_createMap() {
		var centerMap = new gm.LatLng(this.options.coords[0], this.options.coords[1]);
		this.map = new gm.Map(this.root.get(0), this.options.mapOptions);
		this.map.setCenter(centerMap);
		this.MapCenter = centerMap;

		google.maps.event.addListenerOnce(this.map, 'idle', f => {
			if (this.options.offset) {
				this.MercatorProjection = new MercatorProjection(this.map);

				var offset = this.root.width() - this.options.offset;

				var point = new google.maps.Point(offset / 2, this.root.height() / 2);
				var latLng = this.MercatorProjection.PixelToLatLng(point);

				this.map.setCenter(latLng);

				this.MapCenter = latLng;
			}
		});

		google.maps.event.addListener(this.map, 'click', _.bind(function (event) {
			this.trigger('mapClick', event);
		}, this));

		google.maps.event.addListener(this.map, 'zoom_changed', f => {
			if (this.MapCenter) {
				this.map.panTo(this.MapCenter);
			}
		});

		google.maps.event.addListener(this.map, 'dragstart', _.bind(function (event) {
			this.center = null;
		}, this));
	}

	_cacheNodes() {
		this.nodes = {};
	}

	_bindEvents() {
	}

	_ready() {
		gm.event.addDomListener(window, 'load', this._createMap());

		this.icon = {
			url:  './site/assets/images/point.png',
			size: [32, 37]
		};

		if (!this.nodes.addresses.length) {
			return;
		}

		this.nodes.addresses.each((index) => {
			var item = $(this);
			var coords = $.parseJSON(item.data('coords').json);

			this.marker = coords;

			item.on('click', function (e) {
				e.preventDefault();
				var item = $(this);

				if (item.hasClass('active')) {
					return;
				}

				item.siblings().removeClass('active').end().addClass('active');

				GoogleMaps.panTo = coords;
			})
		});
	}
}

class MercatorProjection {
	constructor(map) {
		this.map = map;
		this.mapOverlay = new google.maps.OverlayView();
		this.mapOverlay.draw = function () {
		};

		this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
			TILE_SIZE / 2);

		this._ready();
	}

	/**
	 * Specified LatLng value is used to calculate pixel coordinates and
	 * update the control display. Container is also repositioned.
	 * @param {google.maps.LatLng} latLng Position to display
	 */
	LatLngToPixel(latLng) {
		var projection = this.mapOverlay.getProjection();
		var point = projection.fromLatLngToContainerPixel(latLng);
		return point
	}

	/**
	 * Specified LatLng value is used to calculate pixel coordinates and
	 * update the control display. Container is also repositioned.
	 * @param {google.maps.Point} Point Position to display
	 */
	PixelToLatLng(point) {
		var projection = this.mapOverlay.getProjection();
		var newPoint = projection.fromContainerPixelToLatLng(point);

		return newPoint;
	}

	_ready() {
		this.mapOverlay.setMap(this.options.map);
	}
}
