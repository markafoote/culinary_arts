/**
 * @fileOverview Contains all objects and functions for mathSkills.utils.
 * @author Noah Freitas
 * @version 1.0
 */


/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for utility functions.
 */
mathSkills.utils = mathSkills.utils || {};

/**
 * Converts the first letter of a string to uppercase.
 * 
 * @param {String} string The input string.
 * 
 * @return {String} The string with an uppercase first letter.
 * 
 * @example
 * var lower = "foo";
 * var upper = mathSkills.utils.ucword(lower);
 * 
 * upper; // = "Foo"
 */
mathSkills.utils.ucword = function(string) {
	return string.substring(0,1).toUpperCase()+string.substring(1);
};

/**
 * Searches the query string for a given parameter key and returns its value.
 * 
 * @param {String} parameter The query string key whose value you want.
 * 
 * @return {String|Null} The value of the query string parameter if present otherwise null.
 * 
 * @example
 * // If your current URL is http://example.com/index.html?foo=12&bar=23
 * var fooParam = mathSkills.utils.getQueryParameter('foo');
 * var barParam = mathSkills.utils.getQueryParameter('bar');
 * 
 * fooParam // = "12"
 * barParam // = "23"
 */
mathSkills.utils.getQueryParameter = function(parameter) {
	if (window.location.search === '') {
		return null;
	}
	var queryStrings = window.location.search.substring(1).split('&');
	for (var ii = queryStrings.length - 1; ii >= 0; ii--) {
		var queryParts = queryStrings[ii].split('=');
		if (queryParts[0] === parameter) {
			return queryParts[1];
		}
	}
	return null;
};

/**
 * Initiates the use of a navigation session using HTML5 sessionStorage.
 * 
 * @requires mathSkills.utils.Navigation
 * 
 * @example
 * // To use navigation, simply write:
 * 
 * mathSkills.utils.useSession();
 */
 
 // replaced useSession = function(scope) with useSession = function() to allow additional numPagesPassed parameter
mathSkills.utils.useSession = function() {
	
	/*for (var n in arguments[0]){
		alert (arguments[0][n]);
	}*/
	//alert ("array in useSession is: "+JSON.stringify(arguments[0]));
	
		var argArray = 
			[scope1 = "",
			numPages1 = 0,
			scope2 = "",
			numPages2 = 0,
			scope3 = "",
			numPages3 = 0,
			scope4 = "",
			numPages4 = 0,
			scope5 = "",
			numPages5 = 0,
			scope6 = "",
			numPages6 = 0,
			scope7 = "",
			numPages7 = 0];

		if (arguments.length>0){
			for (var n in argArray) { 
				argArray[n] = arguments[0][n]; 
			}
		} 
	//alert ("array in useSession is: "+JSON.stringify(argArray));

	mathSkills.nav = mathSkills.nav || JSON.parse(sessionStorage.getItem('nav')) || new mathSkills.utils.Navigation(argArray);
	// "Cast" the navigation object if it does not have its prototype functions.
	if (!mathSkills.nav.goToNextPage) {
		mathSkills.nav.__proto__ = mathSkills.utils.Navigation.prototype;
	}
	var page = mathSkills.nav.getCurrentPage();
	if (page) {
		mathSkills.utils.navigation.Page.startTimer(page);	
	}
};

/**
 * Format a number as a string with commas separating the thousands.
 * 
 * @param {Number} num The number to be formatted (e.g. 10000)
 * 
 * @return {String} A string representing the formatted number (e.g. "10,000")
 * 
 * @example
 * var formattedNumber = mathSkills.utils.formatNumber(100000);
 * 
 * formattedNumber // = "100,000"
 */
mathSkills.utils.formatNumber = function(num) {
	var array = num.toString().split('');
	var index = -3;
	while (array.length + index > 0) {
		array.splice(index, 0, ',');
		// Decrement by 4 since we just added another unit to the array.
		index -= 4;
	}
	return array.join('');
};

/**
 * Performs a deep clone of an object.  It includes any properties (primitives, objects,
 * and functions) that are a part of the original object or its prototype chain.
 * 
 * @param {Object} oldObject The object to clone.
 * 
 * @return {Object} newObject The cloned object.
 * 
 * @example
 * var a = {
 * 	string: 'This is a string',
 * 	number: 2
 * };
 * var b = mathSkills.utils.objectClone(a);
 * 
 * a === b // False: not the same object reference.
 * a.string === b.string // True: same property values.
 */
mathSkills.utils.objectClone = function(oldObject) {
	var newObject = mathSkills.utils.isArray(oldObject) ? [] : {}, 
		property;
		
	for (property in oldObject) {
		// If this property is itself an object, call the function recursively.
		if (typeof oldObject[property] === 'object') {
			newObject[property] = mathSkills.utils.objectClone(oldObject[property]);
		} else {
			newObject[property] = oldObject[property];
		}
	}
	
	return newObject;
};

/**
 * Returns a random number between (inclusive) the two parameters.
 * 
 * @param {Number} low Lower bounds
 * @param {Number} high Upper bounds
 */
mathSkills.utils.numberBetween = function(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
};

mathSkills.utils.formatTime = function(milliseconds) {
	var hours = 0,
		minutes = 0,
		seconds = 0;
	
	hours = Math.floor(milliseconds / 3600000);
	milliseconds = milliseconds % 3600000;
	minutes = Math.floor(milliseconds / 60000);
	milliseconds = milliseconds % 60000;
	seconds = Math.floor(milliseconds / 1000);
	
	return (hours > 0 ? hours + ' hours, ' : '') + (minutes > 0 ? minutes + ' minutes, ' : '') + seconds + ' seconds';
};

mathSkills.utils.isArray = function(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
};

mathSkills.utils.randomId = function() {
	return Math.random().toString().substring(2, 12);
};
