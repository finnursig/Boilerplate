var express = require('express');
var app = express();
var auth = require('basic-auth');

var port = process.env.PORT || 5000;
var url = 'http://localhost:'+ port;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
	if(process.env.NODE_ENV !== 'production'){
		next();

		return;
	}

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'foo' || credentials.pass !== 'bar') {
		res.writeHead(401, {
			'WWW-Authenticate': 'Basic realm="example"'
		});

		res.end()
	} else {
		next();
	}
});

app.get('/*', function(req, res){
	res.render(__dirname + '/../public/index.ejs',{
		env: process.env.NODE_ENV || 'development'
	});
});

app.listen(port);

console.log('Express running on port '+ port);

module.exports = {
	url: url
};