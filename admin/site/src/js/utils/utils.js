var $$ = $$ || {};

$$.extend = function (Child, Parent) {
	var F = function () {
	};
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
	function getDecimal (num) {
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
	var minutes = (to.replace(':', '').substr(2) - from.replace(':', '').substr(2));
	return (minutes + minutesInHours);
};
