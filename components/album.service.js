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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var globalConfig = require('./globalsettings');
var AlbumService = (function () {
    function AlbumService(http) {
        this.http = http;
        this.albumBaseServiceUrl = globalConfig.ALBUMSERVICEBASEURL;
        this.postwishurl = this.albumBaseServiceUrl + 'postwish';
        this.validateotpurl = this.albumBaseServiceUrl + 'validateotp';
        this.scrollwishurl = this.albumBaseServiceUrl + 'wishes';
        this.fewrecentwishesurl = this.albumBaseServiceUrl + 'getFewRecentWish?limit=9';
        this.circleimgurl = this.albumBaseServiceUrl + 'getFewRecentAlbumImages?limit=16';
        this.bannerimgurl = this.albumBaseServiceUrl + 'getBannerImage';
        this.quotemsgurl = this.albumBaseServiceUrl + 'getQuoteMsg';
    }
    AlbumService.prototype.getScrollingWishes = function () {
        return this.http.get(this.scrollwishurl)
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.getFewRecentWishes = function () {
        return this.http.get(this.fewrecentwishesurl)
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.postNewWish = function (newWish) {
        var body = "username=" + newWish.username + "&wishmessage=" + newWish.wishmessage + "&mobile=" + newWish.mobile + "&emailid=" + newWish.emailid;
        var firstheader = new http_1.Headers();
        firstheader.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.postwishurl, body, { headers: firstheader })
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.validateOTP = function (_id, otp) {
        var body = "otp=" + otp + "&_id=" + _id;
        var firstheader = new http_1.Headers();
        firstheader.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.validateotpurl, body, { headers: firstheader })
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.getCircleImages = function () {
        return this.http.get(this.circleimgurl)
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.getBannerImage = function () {
        return this.http.get(this.bannerimgurl)
            .map(function (response) { return response.json(); });
    };
    AlbumService.prototype.getQuoteMsg = function () {
        return this.http.get(this.quotemsgurl)
            .map(function (response) { return response.json(); });
    };
    AlbumService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AlbumService);
    return AlbumService;
}());
exports.AlbumService = AlbumService;
//# sourceMappingURL=album.service.js.map