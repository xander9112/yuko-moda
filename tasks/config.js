module.exports = {
	config:     {
		spa: false // Not work yet
	},
	production: require('./configs/production'),
	path:       require('./configs/variables'),
	webserver:  {
		tunnel:    true,
		host:      'localhost',
		port:      9000,
		proxy:     'yuko-moda.dev',
		logPrefix: "Frontend"
	}
};

