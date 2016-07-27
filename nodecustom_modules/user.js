exports.test = function testuserfn(){
	console.log('user function testing completed..');
};

exports.validateuser = function validateuserlogin(req, res, User){
		console.log('login user name: ' + req.body.loginusername);
	
	 	User.findOne({ username: req.body.loginusername, password: req.body.loginpassword }, 
			function (err, user){
				if(err){
					console.log('LoginError');
					res.send(JSON.stringify('LoginError'));
				}
				else{
					if(user){
						console.log('LoginSuccess');
						res.send(JSON.stringify('LoginSuccess'));
					}
					else{
						console.log('LoginFailed');
						res.send(JSON.stringify('LoginFailed'));
					}
				}
		});
}

exports.createuser = function createuser(req, res, User){
		console.log('create user name: ' + req.body.username);
	
		var newuser = new User({
				username: req.body.username,
				password: req.body.password,
				profilepic: '',
				emailid : req.body.emailid,
				mobile : req.body.mobile,
				createdOn : new Date(),
				updatedOn : new Date()
		});

		newuser.save(function(err) {
			if(err)
				res.send(JSON.stringify('ErrorUserCreation'));
			else
				res.send(JSON.stringify('UserCreationSuccess'));
		});
}


exports.adddummyuser  = function adduser(req, res, User){
	var dummyuser = new User({
			username: req.query.username,
			password: req.query.password,
			profilepic: 'mydummypic.jpg',
			createdOn : new Date(),
			updatedOn : new Date()
	});
	
	console.log('Username: ' + req.param('username'));
	console.log('Pwd: ' + req.param('password'));
	console.log('Params ' + req.query.username);

	// dummyuser.save(function(err){
		// if(err)
			// res.send('error while creating dummy user..');
		// else
			// res.send('User ' + req.param('username') + ' is created successfully...');
	// });
} 