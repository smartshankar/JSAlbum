var configSetting = require('./nodecustom_modules/serverConfig.js');
var userfns = require('./nodecustom_modules/user.js');
var wishfns = require('./nodecustom_modules/wish.js');

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var db = mongoose.connection;

var mongooseDb = configSetting.mongooseDBUrl();
var imageServerPath = configSetting.imageServerPath();
var imageServerUrl = configSetting.imageServerUrl();
var bannerImagePath = configSetting.bannerImagePath();

console.log('Connected with Mongoose DB: ' + mongooseDb);

mongoose.connect(mongooseDb);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to student mongoose db...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var albumSchema = new Schema({
	albumName : String,
	imagepath : String,
	imageData : Buffer,
	createdOn : Date,
	updatedOn : Date
});
var Album = mongoose.model('Album', albumSchema);
module.exports = Album;

var userSchema = new Schema({
	username: String,
	password: String,
	profilepic: String,
	emailid : String,
	mobile : String,
	createdOn : Date,
	updatedOn : Date
});
var User = mongoose.model('User', userSchema);
module.exports = User;

var wishSchema = new Schema({
	wishmessage : String,
	username : String,
	emailid : String,
	mobile : String,
	otp : String,
	statusflag: {type: Boolean, default: false},
	createdOn : {type: Date, default: Date.now},
	updatedOn : {type: Date, default: Date.now}
});
var Wish = mongoose.model('Wish', wishSchema);
module.exports = Wish;

app.get('/', function(req, res){
	res.send(JSON.stringify('jai first expresss'));
	console.log('Base url executed');
}); 

app.get('/albums', function(req, res){
	Album.find({}, function(err, albums){
		console.log('Album list...')
			res.send(JSON.stringify(albums));
		});
});

app.post('/postnewalbum', upload.array(), function(req, res, next){
	var albumname = req.body.albumname;
	console.log('AlbumName : ' + albumname);
	res.json(req.body.albumname + ' new album added successfully in server...');
});

app.get('/savenewalbum', function(req, res){
	var newalbum = new Album({
			albumName: req.query.albumname,
			imagepath: req.query.imagepath,
			createdOn : new Date(),
			updatedOn : new Date()
	});
	
	console.log('albumname: q ' + req.query.albumname);
	newalbum.save(function(err) {
		if(err)
			res.send('error while creating album..');
		else
			res.send('album ' + req.param('albumname') + ' is created successfully...');
	});
});

app.get('/deletealbum', function(req, res){
	console.log('Album delete request for ' + req.query.albumname);
	
	Album.remove({_id: req.query._id}, function(err){
		if(err)
			res.send('error while delete album..');
		else
			res.send('album ' + req.query.albumname + ' is deleted successfully...');
	});
});

app.get('/updatealbum', function(req, res){
	console.log('Album update request for ' + req.query.albumname + ' ' + req.query._id);
	
	Album.findOne({ _id: req.query._id }, function (err, doc){
			if(err)
				res.send('error while update album.. ' + req.query._id);
			else
			{
				doc.albumName = req.query.albumname;
				doc.imagepath = req.query.imagepath;
				doc.updatedOn = new Date();
				doc.save();
				console.log('album ' + req.query.albumname + ' is updated successfully...' + doc._id);
				res.send('album ' + req.query.albumname + ' is updated successfully...' + doc._id);
			}
		});
});

app.get('/updatealbumdummy', function(req, res){
	Album.findOne({ _id: '575a62e4d7e6d84032b3f6cf' }, function (err, doc){
			if(err)
				res.send('error while update album via code.. ');
			else
			{
				doc.albumName = 'Updated via code';
				doc.imagepath = 'DummyImage';
				doc.updatedOn = new Date();
				doc.save();
				res.send('album ' + doc.albumname + ' is updated successfully...' + doc._id);
			}
		});
});

app.post('/validateuser', upload.array(), function(req, res, next){
	userfns.validateuser(req, res, User);
});

app.post('/createuser', upload.array(), function(req, res, next){
	userfns.createuser(req, res, User);
});

app.get('/adddummyuser', function(req, res){
	userfns.adddummyuser(req, res, User);
});

app.post('/postwish', upload.array(), function(req, res, next){
	wishfns.postwish(req, res, Wish);
});

app.post('/validateotp', upload.array(), function(req, res, next){
	wishfns.validateotp(req, res, Wish);
});

app.get('/wishes', function(req, res){
	console.log('Get Wish List Request...');
	wishfns.getwishlist(req, res, Wish, User);
});

app.get('/getrecentwish', function(req, res){
	wishfns.getRecentWish(req, res, Wish, User);
});

app.get('/getfewrecentwish', function(req, res){
	wishfns.getFewRecentWish(req, res, Wish, User);
});

app.get('/getOTP', function(req, res){
	var r = generateOTP();
	
	res.send(JSON.stringify(r));
});

function generateOTP(){
	var x1 = Math.floor((Math.random() * 9) + 1).toString();
	var x2 = Math.floor((Math.random() * 9) + 1).toString();
	var x3 = Math.floor((Math.random() * 9) + 1).toString();
	var x4 = Math.floor((Math.random() * 9) + 1).toString();
	
	return x1 + x2 + x3 + x4;
}

app.get('/getAlbumImages', function(req, res){
	
	var albumImgs = [];
	fs.readdir(imageServerPath, function(err, items) {
				for(var i=0; i<items.length; i++){
					var imgpath = imageServerUrl + items[i];
					var imgFileExtn = path.extname(imgpath);
					if(imgFileExtn){
						albumImgs.push(imgpath);
					}
				}
				
			res.end(JSON.stringify(albumImgs));
		});
});

app.get('/getFewRecentAlbumImages', function(req, res){
	
	var albumImgs = [];
	var maxLimit = 5;
	if(req.query.limit != undefined){
		maxLimit = req.query.limit;
	}
	
	fs.readdir(imageServerPath, function(err, items) {
			
				for(var i=0; i<items.length; i++){
					var imgpath = imageServerUrl + items[i];
					var imgFileExtn = path.extname(imgpath);
					if(imgFileExtn){
						albumImgs.push(imgpath);
					}
					
					if(i == maxLimit){
						break;
					}
				}
				
			res.end(JSON.stringify(albumImgs));
		});
});

app.get('/getBannerImage', function(req, res){
	var x1 = Math.floor((Math.random() * 9) + 1).toString();
	var bannerImg = bannerImagePath + '01.jpg';
	
	if(x1 < 9)
	{
		bannerImg = bannerImagePath + '0' + x1 + '.jpg';
	}
	else
	{
		bannerImg = bannerImagePath + '09.jpg';
	}
	
	res.end(JSON.stringify(bannerImg));
});

app.get('/getQuoteMsg', function(req, res){
	var r = Math.floor((Math.random() * 9) + 1).toString();
	var quoteMsg = [
		{ "quoteMsg" : "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", "quoteAuthor" : "Buddha" },
		{ "quoteMsg" : "We do not remember days, we remember moments.", "quoteAuthor" : "Cesare Pavese" },
		{ "quoteMsg" : "You have enemies? Good. That means you've stood up for something, sometime in your life.", "quoteAuthor" : "Winston Churchill" },
		{ "quoteMsg" : "Life is ten percent what happens to you and ninety percent how you respond to it.", "quoteAuthor" : "Lou Holtz" },
		{ "quoteMsg" : "Happiness is acceptance.", "quoteAuthor" : "Unknown" },
		{ "quoteMsg" : "Progress is impossible without change, and those who cannot change their minds cannot change anything.", "quoteAuthor" : "George Bernard Shaw" },
		{ "quoteMsg" : "Without a struggle, there can be no progress.", "quoteAuthor" : "Frederick Douglass" },
		{ "quoteMsg" : "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", "quoteAuthor" : "Albert Einstein" },
		{ "quoteMsg" : "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", "quoteAuthor" : "Rumi" },
		{ "quoteMsg" : "The secret of success - 'STOP Wishing, START Doing'", "quoteAuthor" : "Unknown" },
	];
	
	res.end(JSON.stringify(quoteMsg[r]));
});

var server = app.listen(8081, function(){
	var host = server.address().address
	var port = server.address().port
	
	console.log("My express started listening..");
});