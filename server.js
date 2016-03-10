var express = require('express');
var app = express();

app.use(express.static('view'));
app.use('/images', express.static('public/images'));
app.use('/scripts', express.static('public/scripts'));
app.use('/css', express.static('public/css'));

app.get('/', function(req, res){
	res.render('view/index.html');
});
app.get('/api/trashcar/getloc', function(req, res){
	var svc = require('./trashcarLocationSvc.js');
	svc(function(data){
			res.send(data);
		}, function(error){

		});
});

var port = process.env.PORT || 8888;
app.listen(port, function(){
	console.log('Example app listening on port 8888..');
});