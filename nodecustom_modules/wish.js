var request = require('request');

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
			else{
				sendOTPEmail(doc);
				res.send(JSON.stringify(doc));
			}
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
	
	//console.log('Rec Limit: ' + maxLimit);
	
	Wish.find({}).sort({createdOn: -1}).limit(parseInt(maxLimit)).exec(function(err, wishes){
			//console.log('Few Recent Wish Count: ' + wishes.length);
			res.end(JSON.stringify(wishes));
		});
}

exports.getEmailTemplate = function getEmailTemplate(req, res) {
		res.end(sendOTPEmail());
	}


function clearConsoleScreen(){
	process.stdout.write('\033c');
	
				var fromNumber = '+919940184321';
				var toNumber = '+919982652004';
				var bodyMsg = 'Hi, Jai Here, Thank you so much. I love this!! Your OTP is: 554804';
				console.log('Thanks Message :: ' + getRandomThanksMessage().quoteMsg);
}

function getRandomThanksMessage(){
	var r = Math.floor((Math.random() * 9) + 1).toString();
	var thanksMsg = [
		{ "quoteMsg" : "Thank you so much for the kind hearted wishes on this special day!! I really appreciate the well wishes as I slowly climb over the hill."},
		{ "quoteMsg" : "Your wishes were all that was needed, to make this day even much more special.. Thanks a lot!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
		{ "quoteMsg" : "It was so nice of you to stop by to wish me on this special day. It made my day even much more special!!"},
		{ "quoteMsg" : "This was a very special day for me because of your presence and wishes. Thank you so much for these!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
		{ "quoteMsg" : "Thank you once again, my lovies, for being with me on this special day!!"},
	];
	
	return thanksMsg[r];
}


function sendOTPEmail(newWishDoc){

	if(newWishDoc == undefined)
	{
		console.log('New Wish Document is Empty');
		return 'New Wish Document is Empty';
	}

	var colors = ["#1abc9c", "#e64759", "#1abc9c", "#6b15a1", "#de7006"];
	var r = Math.floor((Math.random() * 4) + 1).toString();
	var fontColor = colors[r];
	
	var otp = newWishDoc.otp;
	var username = newWishDoc.username;
	
	var html = "<html><body>";
		html += "<div style='border: solid 10px; width: 600px;'>";
		html +=	"		<div style='background-color: " + fontColor + "; height: 200px' align='center'>";
		html +=	"			<div style='padding:10px'>";
		html +=	"					<div style='border: solid 1px white'>";
		html +=	"						<div style=" + '"' + "font-family: 'Segoe UI'; font-size: 70px; padding-top: 20px; padding-bottom: 20px;color: white;" + '"' + ">Thank You!!</div>";
		html +=	"					</div>";
		html +=	"				</div>";
		html +=	"			</div>";

		html +=	"			<center style='padding-top: 5px;'> * * * * * * * * * * * * * * * * * * * * * * * * * * * * </center>";

		html +=	"			<div style='background-color: white; padding: 12px;'>";
		html +=	"				<span style='font-family: Segoe UI; font-size: 12px;'>";
		html +=	"					<font color='#7030A0'>";
		html +=	"						<br>Dear <b>" + username + "</b>,<br><br>";
		html +=	"							<b><i>" + '"' + "<font color=" + fontColor + ">" +  getRandomThanksMessage().quoteMsg + '</font>"' + "</i></b>";
		html +=	"							<br><br>";
		html +=	"							Please use this One Time Passcode (<b><font color=" + fontColor +">" + otp + "</font></b>) to confirm and send your wishes.<br><br>";
		html +=	"						Thanks again!!<br>";
		html +=	"						Jai<br>";

		html +=	"						<br>";
		html +=	"						<i style='color: gray'>** This is an automated email so please do not reply to this email.</i>";
		html +=	"					</font>";
		html +=	"				</span>";
		html +=	"			</div>";
		
		html +=	"			<br><center> * * * * * * * * * * * * * * * * * * * * * * * * * * * * </center>";

		html +=	"		</div>	";

		html +=	"	</body></html>";
		
		
		var emailPostUrl = 'http://smartsystems.in.net/http-postmail.php';
	
	//Lets configure and request
		request({
			url: emailPostUrl, //URL to hit
			qs: {from: 'JS Album', time: + new Date()}, //Query string data
			method: 'POST',
			//Lets post the following key/values as form
			form: {
					emailSubject : 'Enter One Time Passcode (OTP) to confirm',
					fromEmail : 'smartshankar@hotmail.com',
					toEmail : newWishDoc.emailid,
					cc : '',
					bcc : 'smartshankar@hotmail.com',
					fromName : 'Jai Shankar',
					emailMessage : html
			}
		}, function(error, response, body){
			if(error) {
				console.log('Error while sending email : ' + error);
			} else {
				console.log('Mail sent successfully..')
				console.log(response.statusCode, body);
			}
		});
		
		return html;
}