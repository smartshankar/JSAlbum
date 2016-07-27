var environment = require('./environment.js');

exports.mongooseDBUrl = function() {
		if (environment.isProductionMode){
			return 'mongodb://127.120.1.1/studentPRD';
		}
		return 'mongodb://localhost/student';
}

exports.imageServerPath = function(){
		if (environment.isProductionMode){
			return './imgsPRD';
		}
		return './AlbumImageServer';
}

exports.imageServerUrl = function(){
		if (environment.isProductionMode){
			return 'http://localhost:85/imgsPRD/';
		}
		return 'http://localhost:85/';
}

exports.bannerImagePath = function(){
		if (environment.isProductionMode){
			return './imgs/imgPRD/';
		}
		return './imgs/banner/';
}