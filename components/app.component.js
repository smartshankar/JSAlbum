"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
core_2.enableProdMode();
var common_1 = require('@angular/common');
var album_service_1 = require('./album.service');
var globalConfig = require('./globalsettings');
var AppComponent = (function () {
    function AppComponent(builder, albumService) {
        this.builder = builder;
        this.submitAttempt = false;
        this.isOtpFormEnabled = false;
        this.isNewWishPostedSuccess = false;
        this.quoteMsg = 'Success is simple. Do what’s right, the right way, at the right time...';
        this.quoteAuthor = 'Arnold H. Glasgow';
        this.bannerImg = '';
        this.largeAlbumImg = '';
        this.onetimepwd = '';
        this.newWishStatusCode = '';
        this.otpValidateMsg = '';
        this.newWishId = '';
        this.refreshSecs = 7;
        this.n = this.refreshSecs;
        this.wishRow1 = new Array();
        this.wishRow2 = new Array();
        this.wishRow3 = new Array();
        this.albumServiceObj = albumService;
        this.bannerImg = globalConfig.BANNERIMGDEFAULT;
        this.initializeNewWishForm();
        this.getCircleImages();
        this.getFewRecentWish();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bannerImgRefresher = setInterval(function () {
            _this.n = _this.n - 1;
            if (_this.n == -1) {
                _this.n = _this.refreshSecs;
                _this.refreshBannerImg();
                _this.refreshQuoteMsg();
            }
        }, 1000);
    };
    AppComponent.prototype.ngOnDestroy = function () {
        console.log('banner image refresh destroyed...');
        clearInterval(this.bannerImgRefresher);
    };
    AppComponent.prototype.initializeNewWishForm = function () {
        this.submitAttempt = false;
        this.isOtpFormEnabled = false;
        this.newWishStatusCode = '';
        this.username = new common_1.Control('', common_1.Validators.required);
        this.emailid = new common_1.Control('', common_1.Validators.required);
        this.mobile = new common_1.Control('', common_1.Validators.required);
        this.wishmessage = new common_1.Control('', common_1.Validators.required);
        this.otp = new common_1.Control('');
        this.newwishform = this.builder.group({
            username: this.username,
            emailid: this.emailid,
            mobile: this.mobile,
            wishmessage: this.wishmessage,
            otp: this.otp,
        });
    };
    AppComponent.prototype.clearNewWishForm = function () {
    };
    AppComponent.prototype.refreshBannerImg = function () {
        var _this = this;
        this.albumServiceObj.getBannerImage().subscribe(function (data) {
            if (data != null) {
                //console.log('Refresh @ ' + new Date());
                _this.bannerImg = data;
            }
        }, function (error) { return console.log('Error while refreshing banner image...' + error); });
    };
    AppComponent.prototype.refreshQuoteMsg = function () {
        var _this = this;
        this.albumServiceObj.getQuoteMsg().subscribe(function (data) {
            if (data != null) {
                _this.quoteMsg = data.quoteMsg;
                _this.quoteAuthor = data.quoteAuthor;
            }
        }, function (error) { return console.log('Error while refreshing banner image...' + error); });
    };
    AppComponent.prototype.setLargeAlbumImage = function (largeImg) {
        this.largeAlbumImg = largeImg;
    };
    AppComponent.prototype.postWish = function (newWish) {
        var _this = this;
        this.submitAttempt = true;
        this.isOtpFormEnabled = false;
        this.newWishStatusCode = '';
        if (this.newwishform == null || newWish == null) {
            return;
        }
        if (this.newwishform.status == 'INVALID') {
            return;
        }
        this.albumServiceObj.postNewWish(newWish).subscribe(function (data) {
            if (data != null && data.otp != null) {
                _this.newWishStatusCode = data;
                _this.onetimepwd = data.otp;
                _this.newWishId = data._id;
                _this.isOtpFormEnabled = true;
            }
        }, function (error) { return console.log('Error while posting new wish message... ' + error); });
    };
    AppComponent.prototype.validateOneTimePassword = function () {
        var _this = this;
        if (this.otp.value == null || this.otp.value == '') {
            this.otpValidateMsg = 'Please enter the OTP..';
            return;
        }
        this.albumServiceObj.validateOTP(this.newWishId, this.otp.value).subscribe(function (data) {
            if (data != null) {
                if (data == 'Success') {
                    _this.isNewWishPostedSuccess = true;
                    _this.otpValidateMsg = 'Your wish posted successfully..!';
                    _this.getFewRecentWish();
                }
                if (data == 'InvalidOTP') {
                    _this.otpValidateMsg = 'Invalid OTP...';
                    _this.isNewWishPostedSuccess = false;
                }
            }
        }, function (error) { return console.log('Error while validating OTP...' + error); });
    };
    AppComponent.prototype.getCircleImages = function () {
        var _this = this;
        this.albumServiceObj.getCircleImages().subscribe(function (data) {
            _this.albumImageList = data;
        }, function (error) { return console.log('Error while getting circle images...' + error); });
    };
    AppComponent.prototype.getFewRecentWish = function () {
        var _this = this;
        this.albumServiceObj.getFewRecentWishes().subscribe(function (data) {
            _this.recentWishList = data;
            _this.mapAndFormatWishes();
        }, function (error) { return console.log('Error while getting recent wishes...' + error); });
    };
    AppComponent.prototype.mapAndFormatWishes = function () {
        this.wishRow1 = new Array();
        this.wishRow2 = new Array();
        this.wishRow3 = new Array();
        var i = 1;
        for (var w in this.recentWishList) {
            if (i <= 3) {
                this.wishRow1.push(this.recentWishList[w]);
            }
            if (i > 3 && i <= 6) {
                this.wishRow2.push(this.recentWishList[w]);
            }
            if (i > 6 && i <= 9) {
                this.wishRow3.push(this.recentWishList[w]);
            }
            i++;
            if (i == 10) {
                break;
            }
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: './templates/app-template.html',
            styleUrls: ['mystyles.css'],
            providers: [album_service_1.AlbumService],
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, album_service_1.AlbumService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map