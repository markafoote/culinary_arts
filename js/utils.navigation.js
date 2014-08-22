/**
 * @fileOverview Contains all objects and functions for mathSkills.utils.navigation,
 * mathSkills.utils.Navigation and mathSkills.utils.navigation.Page.
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
 * @namespace Namespace for navigation utility functions.
 */
mathSkills.utils.navigation = mathSkills.utils.navigation || {};

/**
 * An array of page information which will be randomly selected to build up a navigation session.
 * @constant
 */
mathSkills.utils.navigation.PAGES = {
	simplify_volume: [ 
		{
			url: 'simplify-volume.html',
			title: 'Simplify Volume',
			namespace: 'units',
			constructor: 'Volume'
		}
	],
	simplify_weight: [ 
		{
			url: 'simplify-weight.html',
			title: 'Simplify Volume',
			namespace: 'units',
			constructor: 'Volume'
		}
	],
	simplify_length: [ 
		{
			url: 'simplify-length.html',
			title: 'Simplify Length',
			namespace: 'units',
			constructor: 'Length'
		}
	],
	convert_length: [ 
		{
			url: 'convert-length.html',
			title: 'Convert Length',
			namespace: 'units',
			constructor: 'Length'
		}
	],
	convert_weight: [ 
		{
			url: 'convert-weight.html',
			title: 'Convert Weight',
			namespace: 'units',
			constructor: 'Weight'
		}
	],
	convert_volume: [ 
		{
			url: 'convert-volume.html',
			title: 'Convert Volume',
			namespace: 'units',
			constructor: 'Volume'
		}
	],
	'long-division': [
		{
			url: 'long-division.html',
			title: 'Long Division',
			namespace: 'problems',
			constructor: 'LongDivision'
		}
	]
};
mathSkills.utils.navigation.PAGES.simplify_volume.hasOffset = true;
mathSkills.utils.navigation.PAGES.simplify_weight.hasOffset = true;
mathSkills.utils.navigation.PAGES.simplify_length.hasOffset = true;
mathSkills.utils.navigation.PAGES.convert_length.hasOffset = false;
mathSkills.utils.navigation.PAGES.convert_weight.hasOffset = false;
mathSkills.utils.navigation.PAGES.convert_volume.hasOffset = false;
mathSkills.utils.navigation.PAGES['long-division'].hasOffset = false;

/**
 * Destroys the existing navigation session and creates a new.
 * 
 * @example
 * mathSkills.utils.navigation.startOver();
 */
mathSkills.utils.navigation.startOver = function(scope) {
	mathSkills.utils.navigation.clearSession();
	mathSkills.utils.useSession(scope);
};

mathSkills.utils.navigation.clearSession = function() {
	sessionStorage.removeItem('nav');
	delete mathSkills.nav;
};

/**
 * @class <h2>Navigation Class</h2>
 * Controls all the logic for a user session, including building up a random set of problem pages
 * and controlling the movement between pages.<br>
 * <br>
 * The constructor generates a set number of random pages, saves itself to sessionStorage, and
 * redirects to the first page of the set.<br>
 * <br>
 * @property {Number} currentPage The page index for the current page.
 * @property {mathSkills.utils.navigation.Page[]} pages An array containing all the pages for the 
 * 		current session.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * 
 * @requires mathSkills.utils.navigation.Page
 */
// replaced Navigation = function(scope) with Navigation = function() to allow additional numPagesPassed parameter
mathSkills.utils.Navigation = function() {

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

	for (var n in arguments[0]) { 
		argArray[n] = arguments[0][n]; 
	}

	this.currentPage = -1;
	this.pages = this.generatePages(argArray);
	sessionStorage.setItem('nav', JSON.stringify(this));
	this.goToNextPage();
};

/**
 * Determines whether the Navigation object has another page after the current.
 * 
 * @return {Boolean} True if there is another page, false otherwise.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * if(nav.hasNext()) {
 * 	// Do something.
 * }
 */
mathSkills.utils.Navigation.prototype.hasNext = function() {
	if (this.pages[parseInt(this.currentPage, 10) + 1]) {
		return true;
	} else {
		return false;
	}
};

/**
 * Determines whether the Navigation object has a previous page before the current.
 * 
 * @return {Boolean} True if there is a previous page, false otherwise.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * if(nav.hasPrevious()) {
 * 	// Do something.
 * }
 */
mathSkills.utils.Navigation.prototype.hasPrevious = function() {
	if (this.pages[parseInt(this.currentPage, 10) - 1]) {
		return true;
	} else {
		return false;
	}
};

/**
 * Returns the Page object for the current page of the navigation session.
 * 
 * @return {mathSkills.utils.navigation.Page} The current page.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * var currentPage = nav.getCurrentPage();
 * // Do something with the page object.
 */
mathSkills.utils.Navigation.prototype.getCurrentPage = function() {
	return this.pages[this.currentPage];
};

mathSkills.utils.Navigation.prototype.getCurrentInit = function() {
	var currentPage = this.getCurrentPage();
	// If we're on a page that is not in our current array, go to the first page.
	if (!currentPage) {
		this.goToPage(1);
	} else {
		return currentPage.init;
	}
};

/**
 * Returns the page number of the current page.
 * 
 * @return {Number} The current page number.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * var currentPageNumber = nav.getCurrentPageNumber();
 * // Do something with the page object.
 */
mathSkills.utils.Navigation.prototype.getCurrentPageNumber = function() {
	return this.currentPage + 1;
};

/**
 * Returns the total number of pages in the current session.
 * 
 * @return {Number} The total number of pages.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * var totalPages = nav.getTotalNumberOfPages();
 * // Do something with the page object.
 */
mathSkills.utils.Navigation.prototype.getTotalNumberOfPages = function() {
	return this.pages.length;
};

/**
 * Returns the Page object for the next page in the current navigation session if it exists.
 * 
 * @return {mathSkills.utils.navigation.Page|undefined} The Page object or undefined.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * var nextPage = nav.getNextPage();
 * // Do something with the next page.
 */
mathSkills.utils.Navigation.prototype.getNextPage = function() {
	if (this.pages[this.currentPage + 1]) {
		return this.pages[this.currentPage + 1];
	} else {
		return undefined;
	}
};

/**
 * Returns the Page object for the previous page in the current navigation session if it exists.
 * 
 * @return {mathSkills.utils.navigation.Page|undefined} The Page object or undefined.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * var nextPage = nav.getPreviousPage();
 * // Do something with the previous page.
 */
mathSkills.utils.Navigation.prototype.getPreviousPage = function() {
	if (this.pages[this.currentPage - 1]) {
		return this.pages[this.currentPage - 1];
	} else {
		return undefined;
	}
};

/**
 * Navigates to the next page in the current session.
 * 
 * @return {Boolean} The function returns false ONLY if there is not a next page; otherwise,
 * 		no explicit value is returned.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * nav.goToNextPage();
 * 
 * // If you want to do something if there is not a next page:
 * var nav = new mathSkills.utils.Navigation();
 * if (! nav.goToNextPage()) {
 * 	// Do something.
 * }
 */
mathSkills.utils.Navigation.prototype.goToNextPage = function() {
	if (this.pages[this.currentPage + 1]) {
		this.currentPage++;
		window.location = this.pages[this.currentPage].url;
		sessionStorage.setItem('nav', JSON.stringify(this));
	} else {
		return false;
	}
};

/**
 * Navigates to the previous page in the current session.
 * 
 * @return {Boolean} The function returns false ONLY if there is not a previous page; otherwise,
 * 		no explicit value is returned.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * nav.goToPreviousPage();
 * 
 * // If you want to do something if there is not a previous page:
 * var nav = new mathSkills.utils.Navigation();
 * if (! nav.goToPreviousPage()) {
 * 	// Do something.
 * }
 */
mathSkills.utils.Navigation.prototype.goToPreviousPage = function() {
	if (this.pages[parseInt(this.currentPage, 10) - 1]) {
		this.currentPage--;
		window.location = this.pages[this.currentPage].url;
		sessionStorage.setItem('nav', JSON.stringify(this));
	} else {
		return false;
	}
};

mathSkills.utils.Navigation.prototype.goToSummaryPage = function() {
	this.currentPage = null;
	window.location = 'summary.html';
	sessionStorage.setItem('nav', JSON.stringify(this));
};

/**
 * Navigates to an arbitrary page in the current session.
 * 
 * @param {Number} pageNum The page number to navigate to.  This parameter uses a 1-based index, as
 * 		opposed to the this.pages array, which is 0-based.
 * 
 * @return {Boolean} The function returns false ONLY if the specified page does not exist; otherwise,
 * 		no explicit value is returned.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * nav.goToPage(5);
 * 
 * // If you want to do something if the page number does not exist:
 * var nav = new mathSkills.utils.Navigation();
 * if (! nav.goToPage(5)) {
 * 	// Do something.
 * }
 */
mathSkills.utils.Navigation.prototype.goToPage = function(pageNum) {
	if (this.pages[pageNum - 1]) {
		this.currentPage = pageNum - 1;
		window.location = this.pages[this.currentPage].url;
		sessionStorage.setItem('nav', JSON.stringify(this));
	} else {
		return false;
	}
};

/**
 * Generates a specified number of random pages and returns them in a pages array.
 * 
 * @param {Number} numPages The number of pages to generate and return.
 * 
 * @return {mathSkills.utils.navigation.Page[]} The array of generated pages.
 * 
 * @requires mathSkills.utils.navigation.Page
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * nav.pages = nav.generatePages(20);
 */
 
 // replaced generatePages = function(numPages, scope) with generatePages = function() to allow additional parameters
mathSkills.utils.Navigation.prototype.generatePages = function() {
	
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
		
	for (var n in arguments[0]) { 
		argArray[n] = arguments[0][n]; 
	}

	var pages = [];
	for (var k= 0, j = argArray.length/2; k<j; k+=1) {
		for (var ii = 0; ii < argArray[1+(k*2)]; ii++) {
			pages.push(new mathSkills.utils.navigation.Page(ii, argArray[k*2]));
		}
	}
	return pages;
};

/**
 * Returns the menu structure for the current navigation session.
 * 
 * @return {String} HTML String containing &lt;nav>, &lt;ul>, and &lt;li> nested structure.
 * 
 * @example
 * var nav = new mathSkills.utils.Navigation();
 * $('#navMenu').html(nav.getMenu());
 */
mathSkills.utils.Navigation.prototype.getMenu = function() {
	var html = ['<nav id=problemMenu><ul>'], 
		pages = mathSkills.nav.pages;
		
	for (var ii = 0, len = pages.length; ii < len; ii++) {
		html.push('<li onclick="mathSkills.nav.goToPage('+(ii + 1)+');">');
		html.push(pages[ii].title+'</li>');
	}
	html.push('</ul></nav>');
	return html.join('');
};

mathSkills.utils.Navigation.prototype.getTotalTime = function() {
	var totalMilliseconds = 0;
	for (var ii = this.pages.length; ii > 0; ii--) {
		totalMilliseconds += mathSkills.utils.navigation.Page.getTotalTimeRaw(this.pages[ii - 1]);
	}
	return mathSkills.utils.formatTime(totalMilliseconds);
};

mathSkills.utils.Navigation.prototype.getTotalCompleted = function() {
	var complete = 0,
		possible = this.pages.length;
		
	for (var ii = this.pages.length; ii > 0; ii--) {
		if (mathSkills.utils.navigation.Page.isComplete(this.pages[ii - 1])) {
			complete++;
		}
	}
	return complete + ' out of ' + possible;
};

mathSkills.utils.Navigation.prototype.getTotalScore = function() {
	var totalComplete = 0,
		totalScore = 0;
		
	for (var ii = this.pages.length; ii > 0; ii--) {
		totalScore += mathSkills.utils.navigation.Page.getScoreRaw(this.pages[ii - 1]);
		if (mathSkills.utils.navigation.Page.isComplete(this.pages[ii - 1])) {
			totalComplete++;
		}
	}
	
	return totalScore + ' out of ' + totalComplete * 100;
};

mathSkills.utils.Navigation.prototype.getSetDetails = function() {
	var html = [],
		pages = this.pages,
		score,
		time;
		
	for (var ii = 0, len = pages.length; ii < len; ii++)  {
		score = mathSkills.utils.navigation.Page.getScore(pages[ii]);
		time = mathSkills.utils.navigation.Page.getTotalTime(pages[ii]);
		html.push('<tr><td>'+(ii + 1)+'</td><td>'+pages[ii].title+'</td><td>'+score+'</td><td>'+time+'</td></tr>');
		if (score !== 100) {
			for (var jj = 0, jLen = pages[ii].incorrect.length; jj < jLen; jj++) {
				var incorrect = pages[ii].incorrect[jj];
				if (jj === 0) {
					html.push('<tr class=details><td colspan=4><table><tr><th colspan=4>Incorrect Answers</th></tr>');
					html.push('<tr><th>Step</th><th>Your Answer</th><th>Correct Answer</th><th>Points</th></tr>');
				}
				html.push('<tr><td>'+incorrect.description+'</td><td>'+incorrect.answer+'</td>');
				html.push('<td>'+incorrect.correct+'</td><td>- 5</td></tr>');
			}
			if (jj > 0) {
				html.push('</table></td></tr>');
			}
			
			for (var kk = 0, kLen = pages[ii].helpsUsed.length; kk < kLen; kk++) {
				var helps = pages[ii].helpsUsed[kk];
				if (kk === 0) {
					html.push('<tr class=details><td colspan=4><table><tr><th colspan=2>Helps Used</th></tr>');
					html.push('<tr><th>Step</th><th>Points</th></tr>');
				}
				html.push('<tr><td>'+helps+'</td><td>-10</td></tr>');
			}
			if (kk > 0) {
				html.push('</table></td></tr>');
			}
		}
	}
	return html.join('');
};


/**
 * @class <h2>Navigation Page Class</h2>
 * Represents a page in a navigation session.<br>
 * <br>
 * The constructor generates a random URL and initializes the init property to null.<br>
 * <br>
 * @property {Object|null} init The problem initObject for this page.
 * @property {String} url The generated URL for the page.
 * 
 * @param {Number} pageNum The 0-index session page number for this page.
 * 
 * @example
 * // Create a new page, with the page number of 6.
 * // Notice the 0-based index.
 * 
 * var newPage = new mathSkills.utils.navigation.Page(5);
 * 
 * @see mathSkill.utils.Navigation
 */
 
mathSkills.utils.navigation.Page = function(pageNum, scope) {
	
	this.init = null;
	this.urlIndex = null;
	this.title = '';
	this.url = this.generateUrl(pageNum, scope);
	this.startTime = 0;
	this.endTime = 0;
	this.helpsUsed = [];
	this.incorrect = [];
	this.complete = false;
};

mathSkills.utils.navigation.Page.getTotalTime = function(page) {
	return mathSkills.utils.formatTime(mathSkills.utils.navigation.Page.getTotalTimeRaw(page));
};

mathSkills.utils.navigation.Page.getTotalTimeRaw = function(page) {
	if (page.endTime === 0) {
		return 0;
	} else {
		return page.endTime - page.startTime;
	}
};

mathSkills.utils.navigation.Page.startTimer = function(page) {
	page.startTime = (new Date()).getTime();
};

mathSkills.utils.navigation.Page.stopTimer = function(page) {
	page.endTime = (new Date()).getTime();
};

mathSkills.utils.navigation.Page.addHelp = function(page, description) {
	page.helpsUsed.push(description);
};

mathSkills.utils.navigation.Page.addIncorrectAnswer = function(page, details) {
	var incorrect = {
		description: details.description || 'N/A',
		answer: details.answer || 'N/A',
		correct: details.correct || 'N/A'
	};
	page.incorrect.push(incorrect);
};

mathSkills.utils.navigation.Page.getHelpsUsed = function(page) {
	return page.helpsUsed.length;
};

mathSkills.utils.navigation.Page.getIncorrectAnswers = function(page) {
	return page.incorrect.length;
};

mathSkills.utils.navigation.Page.getScore = function(page) {
	if (page.complete) {
		return (100 - (page.helpsUsed.length * 10) - (page.incorrect.length * 5)) + ' out of 100';
	} else {
		return '0 out of 100';
	}
};

mathSkills.utils.navigation.Page.getScoreRaw = function(page) {
	if (page.complete) {
		return (100 - (page.helpsUsed.length * 10) - (page.incorrect.length * 5));
	} else {
		return 0;
	}
};

mathSkills.utils.navigation.Page.completed = function(page) {
	page.complete = true;
};

mathSkills.utils.navigation.Page.isComplete = function(page) {
	return page.complete;
};

/**
 * Generates a random destination URL for the page, with generated query parameters.  As a side effect
 * it also sets the urlIndex property of the Page object to the randomly generated urlIndex.
 * 
 * @param {Number} pageNum The 0-index session page number for this page.
 * 
 * @return {String} The generated URL.
 * 
 * @example
 * // This is used by the constructor and would not be used directly.
 * // However, here is an example nonetheless.
 * 
 * var newPage = new mathSkills.utils.navigation.Page(5);
 * newPage.url = newPage.generateUrl(5);
 */

mathSkills.utils.navigation.Page.prototype.generateUrl = function(pageNum, scope) {
	
	//alert ("pageNum is: "+pageNum+" scope is: "+scope);
	var pages = mathSkills.utils.navigation.PAGES[scope],
		numUnits = this.getNumberOfUnits(pageNum, scope);
	
	// Set problem level to the page # (adds 1 because starts with 0-based index)
	var problemLevel = pageNum + 1;
	
	// Generate a random index number for the PAGES array.
	var urlIndex = Math.floor(Math.random() * pages.length);
	
	// Start building the URL string.
	var baseUrl = pages[urlIndex].url;

	baseUrl += '?units='+numUnits+'&level='+problemLevel;
	
	// If we can set an offset (i.e. if the number of unit pieces available on the selected page
	// is greater than the number of unit pieces in the problem) generate an offset.
	if (pages.hasOffset) {
		var page = pages[urlIndex];
		var availableUnits = window.mathSkills[page.namespace][page.constructor].prototype.UNITS.length;
		if (availableUnits > numUnits) {
			var offset = Math.floor((availableUnits - numUnits) * Math.random());
			baseUrl += '&offset='+offset;
		}
	}
	
	this.urlIndex = urlIndex;
	this.title = pages[urlIndex].title;
	//alert (baseUrl);
	return baseUrl;
};

mathSkills.utils.navigation.Page.prototype.getNumberOfUnits = function(pageNum, scope) {
	// If this is page # 6 or greater use three unit pieces; otherwise, use two.
	if (scope === 'long-division') {
		if (pageNum < 4) {
			return 1;
		} else if (pageNum < 9) {
			return 2;
		} else {
			return 3;
		}
	} else {
		return pageNum > 4 ? 3: 2;
	}
};
