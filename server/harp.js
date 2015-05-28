var harp = require('harp');

var port = process.env.PORT || 5000;
var url = 'http://localhost:'+ port;

harp.server(__dirname + '/../public', {
	port: port
}, function(){
	console.log('Harp running on port '+ port);
});

module.exports = {
	url: url
};
