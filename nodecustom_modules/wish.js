exports.postwish = function postwish(req, res, Wish){
		console.log('post wish: ' + req.body.wishmessage);
		var otp = generateOTP();
	
		var newwish = new Wish({
			username : req.body.username,
			emailid : req.body.emailid,
			mobile : req.body.mobile,
			wishmessage : req.body.wishmessage,
			otp: otp,
			updatedOn : new Date()
		});

		newwish.save(function(err, doc) {
			if(err)
				res.send(JSON.stringify('ErrorWishPosting ' + err));
			else
				res.send(JSON.stringify(doc));
		});
}

exports.validateotp = function validateotp(req, res, Wish){
		Wish.findOne({ _id: req.body._id }, function (err, doc){
			if(err)
				res.send(JSON.stringify('ErrorValidatingOTP ' + err));
			else
			{
				if(req.body.otp == doc.otp){
					doc.statusflag = true;
					doc.updatedOn = new Date();
					doc.save();
					console.log('Wish ' + req.body._id + ' is updated successfully...' + doc._id);
					res.send(JSON.stringify('Success'));
				}
				else{
					res.send(JSON.stringify('InvalidOTP'));
				}
			}
		});

}

function generateOTP(){
	var x1 = Math.floor((Math.random() * 9) + 1).toString();
	var x2 = Math.floor((Math.random() * 9) + 1).toString();
	var x3 = Math.floor((Math.random() * 9) + 1).toString();
	var x4 = Math.floor((Math.random() * 9) + 1).toString();
	var x5 = Math.floor((Math.random() * 9) + 1).toString();
	var x6 = Math.floor((Math.random() * 9) + 1).toString();
	
	return x1 + x2 + x3 + x4 + x5 + x6;
}

exports.getwishlist = function getwishlist(req, res, Wish, User){
	
		Wish.find({}).sort({createdOn: -1}).exec(function(err, wishes){

			for(var i=0; i < wishes.length; i++){
				var w = wishes[i];
				
				if(w.userid != 'undefined'){
					User.findOne({ _id: w.userid }, function (err, user){
								if (err)
									console.log('Error while retrieving user information..' + err);
								else {
									console.log('Userid: ' + w.userid + ' Username: ' + user.username);
									w.userid = user.username;
								}
					});
				}
				else{
					w.userid = 'UNKNOWN';
				}
			}
			
			res.send(JSON.stringify(wishes));
		});
}

exports.getRecentWish = function getRecentWish(req, res, Wish, User){
	Wish.find({statusflag : true}).sort({createdOn: -1}).limit(1).exec(function(err, wishes){
		
		clearConsoleScreen();

			if(wishes.length != 0){
				var w = wishes[0];
				
					User.findOne({ _id: w.userid }, function (err, user){
								if (err){
									console.log('Error while retrieving user information..' + err);
									w.userid = 'UNKNOWN';
								}
								else {
									console.log('Userid: ' + w.userid + ' Username: ' + user.username);
									w.userid = user.username;
								}
								
							res.send(JSON.stringify(w));
					});
			}
			else{
				console.log('No records found!');
				res.send(JSON.stringify('Congrats! Wish you all success...'));
			}
		});
}

exports.getFewRecentWish = function getFewRecentWish(req, res, Wish){

	clearConsoleScreen();
	var maxLimit = 10;
	if(req.query.limit != undefined){
		maxLimit = req.query.limit;
	}
	
	console.log('Rec Limit: ' + maxLimit);
	
	Wish.find({}).sort({createdOn: -1}).limit(parseInt(maxLimit)).exec(function(err, wishes){
			console.log('Few Recent Wish Count: ' + wishes.length);
			res.send(JSON.stringify(wishes));
		});
}

function clearConsoleScreen(){
	process.stdout.write('\033c');
}