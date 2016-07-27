import { Component } from '@angular/core';
import {enableProdMode} from '@angular/core';
enableProdMode();
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from '@angular/common';
import {AlbumService} from './album.service';
import globalConfig = require('./globalsettings');

@Component({
  selector: 'my-app',
  templateUrl: './templates/app-template.html',
  styleUrls:  ['mystyles.css'],
  providers: [AlbumService],
})
export class AppComponent { 
	submitAttempt: boolean = false;
	isOtpFormEnabled: boolean = false;
	isNewWishPostedSuccess : boolean = false;
	quoteMsg = 'Success is simple. Do what’s right, the right way, at the right time...';
	quoteAuthor = 'Arnold H. Glasgow';
	bannerImgRefresher: any;
	bannerImg = '';
	albumServiceObj : AlbumService;
	isloggedIn: Boolean;
	largeAlbumImg = '';

	username: Control;
	emailid: Control;
	mobile: Control;
	wishmessage: Control;
	otp: Control;
	newwishform: ControlGroup;
	
	public onetimepwd = '';
	public newWishStatusCode = '';
	public otpValidateMsg = '';
	public newWishId = '';
	
	public refreshSecs: number = 7;
	public n: number = this.refreshSecs;
	
	public albumImageList: Object[];
	public recentWishList: Object[];
	public wishRow1: Object[];
	public wishRow2: Object[];
	public wishRow3: Object[];
	
	
	constructor(private builder: FormBuilder, albumService: AlbumService){
		this.wishRow1 = new Array();
		this.wishRow2 = new Array();
		this.wishRow3 = new Array();
		this.albumServiceObj = albumService;
		this.bannerImg = globalConfig.BANNERIMGDEFAULT;
		
		this.initializeNewWishForm();
		
		this.getCircleImages();
		this.getFewRecentWish();
	}
	
	ngOnInit() {
    this.bannerImgRefresher = setInterval(() => {
						  this.n = this.n - 1;
						  if(this.n == -1)
						  {
							this.n = this.refreshSecs;
							this.refreshBannerImg();
							this.refreshQuoteMsg();
						  }
						}, 1000);
	}
  
  ngOnDestroy(){
	console.log('banner image refresh destroyed...');
	clearInterval(this.bannerImgRefresher);
  }
	
	initializeNewWishForm(){
		this.submitAttempt = false;
		this.isOtpFormEnabled = false;
		this.newWishStatusCode = '';

		this.username = new Control('', Validators.required);
		this.emailid = new Control('', Validators.required);
		this.mobile = new Control('', Validators.required);
		this.wishmessage = new Control('', Validators.required);
		this.otp = new Control('');

		this.newwishform = this.builder.group({
			  username: this.username,
			  emailid: this.emailid,
			  mobile: this.mobile,
			  wishmessage: this.wishmessage,
			  otp: this.otp,
		});
	}
	
	clearNewWishForm(){
	}
	
	refreshBannerImg(){
		this.albumServiceObj.getBannerImage().subscribe(data => {
			if(data != null){
				//console.log('Refresh @ ' + new Date());
				this.bannerImg = data;
			}
		}, error => console.log('Error while refreshing banner image...' + error));
	}
	
	refreshQuoteMsg(){
		this.albumServiceObj.getQuoteMsg().subscribe(data => {
			if(data != null){
				this.quoteMsg = data.quoteMsg;
				this.quoteAuthor = data.quoteAuthor;
			}
		}, error => console.log('Error while refreshing banner image...' + error));
	}
	
	setLargeAlbumImage(largeImg: string){
		this.largeAlbumImg = largeImg;
	}
	
	postWish(newWish: Object) {
		this.submitAttempt = true;
		this.isOtpFormEnabled = false;
		this.newWishStatusCode = '';
		
		if(this.newwishform == null || newWish == null){
			return;
		}
		
		if(this.newwishform.status == 'INVALID'){ 
			return;
		}
		
		this.albumServiceObj.postNewWish(newWish).subscribe(data => 
								{
									if(data != null && data.otp != null){
										this.newWishStatusCode = data;
										this.onetimepwd = data.otp;
										this.newWishId = data._id;
										this.isOtpFormEnabled = true;
									}
								},
								error => console.log('Error while posting new wish message... ' + error)
					);
	}
	
	validateOneTimePassword(){
		if(this.otp.value == null || this.otp.value == ''){
			this.otpValidateMsg = 'Please enter the OTP..';
			return;
		}
		
		this.albumServiceObj.validateOTP(this.newWishId, this.otp.value).subscribe(data => 
								{
									if(data != null){
										if(data == 'Success'){
											this.isNewWishPostedSuccess = true;
											this.otpValidateMsg = 'Your wish posted successfully..!';
											this.getFewRecentWish();
										}
										if(data == 'InvalidOTP'){
											this.otpValidateMsg = 'Invalid OTP...';
											this.isNewWishPostedSuccess = false;
										}
									}
								},
								error => console.log('Error while validating OTP...' + error)
					);
	}
	
	
	getCircleImages(){
		this.albumServiceObj.getCircleImages().subscribe(data => 
								{
									this.albumImageList = data;
								},
								error => console.log('Error while getting circle images...' + error)
					);
	}
	
	getFewRecentWish(){
		this.albumServiceObj.getFewRecentWishes().subscribe(data => 
								{
									this.recentWishList = data;
									this.mapAndFormatWishes();
								},
								error => console.log('Error while getting recent wishes...' + error)
					);
	}

	mapAndFormatWishes(){
		
		this.wishRow1 = new Array();
		this.wishRow2 = new Array();
		this.wishRow3 = new Array();

		var i = 1;
		
		for(var w in this.recentWishList){
			if(i<=3){
				this.wishRow1.push(this.recentWishList[w]);
			}
			
			if(i>3 && i<=6){
				this.wishRow2.push(this.recentWishList[w]);
			}
			
			if(i>6 && i<=9){
				this.wishRow3.push(this.recentWishList[w]);
			}
			i++;
			
			if(i==10){
				break;
			}
		}
	}
}