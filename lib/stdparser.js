'use strict';

//parse std structure return by phantom laucnher, ex :
//	[
//	{
//		type : "networkerror", message : "Receive failed 404 on request url http://localhost:9999/missingimg.png", status : 404, url : http://localhost:9999/missingimg.png
//	},
//	{
//		type : "console", message : "bip"
//	},
//	{	
//		type : "javascripterror", message : "object is undefined", trace : "object line 427"
//	}

exports.init = function (grunt) {


	var exports = {};

	/*
	return array with object of type
	 */
	exports.gettype = function (std,type) {
		var matches = [];
		if(std==null) {
			return matches;
		}

		for(var i=0;i<std.length;i++){
			if(std[i].type === type){
				matches.push(std[i]);
			}
		}
		return matches;
	};

	/*
	contains a type of error
	 */
	exports.containstype = function (std,type) {
		
		return exports.gettype(std,type).length>0;
	};

	/*
	return array with object containing message
	 */
	exports.getmessage = function (std,message) {
		var matches = [];
		if(std==null) {
			return matches;
		}

		for(var i=0;i<std.length;i++){
			if(std[i].message.indexOf(message)>=0){
				matches.push(std[i]);
			}
		}
		return matches;
	};


	/*
	contains a message
	 */
	exports.containsmessage = function (std,message) {
		return exports.getmessage(std,message).length>0;
	};


	exports.geterrcode = function (std,errcode) {
		var matches = [];
		if(std==null) {
			return matches;
		}

		for(var i=0;i<std.length;i++){
			if(std[i].type ==="networkerror"  && std[i].errorCode === errcode){
				matches.push(std[i]);
			}
		}
		return matches;
	};

	exports.containserrcode = function (std,errcode) {
		return exports.geterrcode(std,errcode).length>0;
	};



return exports;
};
