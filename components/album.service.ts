import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import globalConfig = require('./globalsettings');

@Injectable()
export class AlbumService{
	
  	private albumBaseServiceUrl = globalConfig.ALBUMSERVICEBASEURL;
	
	private postwishurl = this.albumBaseServiceUrl + 'postwish';
	private validateotpurl = this.albumBaseServiceUrl + 'validateotp';
	private scrollwishurl = this.albumBaseServiceUrl + 'wishes';
	private fewrecentwishesurl = this.albumBaseServiceUrl + 'getFewRecentWish?limit=9';
	private circleimgurl = this.albumBaseServiceUrl + 'getFewRecentAlbumImages?limit=16';
	private bannerimgurl = this.albumBaseServiceUrl + 'getBannerImage';
	private quotemsgurl = this.albumBaseServiceUrl + 'getQuoteMsg';	
	
	constructor(private http: Http){
	}
	
	getScrollingWishes() {
		return this.http.get(this.scrollwishurl)
                    .map(response => response.json());
	}
	
	getFewRecentWishes() {
		return this.http.get(this.fewrecentwishesurl)
                    .map(response => response.json());
	}
	
	postNewWish(newWish: any){
		  var body = "username=" + newWish.username + "&wishmessage=" + newWish.wishmessage + "&mobile=" + newWish.mobile + "&emailid=" + newWish.emailid;
		  var firstheader = new Headers();
		  firstheader.append('Content-Type', 'application/x-www-form-urlencoded');
		  
		return this.http.post(this.postwishurl, body, {headers : firstheader})
				 .map(response => response.json());
	}
	
	postNewWish1(newWish: any){
	}
	
	validateOTP(_id: any, otp: any){
		  var body = "otp=" + otp + "&_id=" + _id;
		  var firstheader = new Headers();
		  firstheader.append('Content-Type', 'application/x-www-form-urlencoded');
		  
		return this.http.post(this.validateotpurl, body, {headers : firstheader})
				 .map(response => response.json());
	}
	
	getCircleImages() {
		return this.http.get(this.circleimgurl)
                    .map(response => response.json());
	}
	
	getBannerImage(){
		return this.http.get(this.bannerimgurl)
                    .map(response => response.json());
	}
	
	getQuoteMsg(){
		return this.http.get(this.quotemsgurl)
					.map(response => response.json());
	}

}