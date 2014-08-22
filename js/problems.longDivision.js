/**
 * @fileOverview Contains all objects and functions for mathskills.problems.LongDivision
 * and mathSkills.problems.longDivision.
 * @author Noah Freitas
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for problem classes
 */
mathSkills.problems = mathSkills.problems || {};

/**
 * @namespace Namespace for Long Division problem class.
 */
mathSkills.problems.longDivision = mathSkills.problems.longDivision || {};

/**
 * @class <h2>Long Division Problem Class</h2>
 * This constructor builds a LongDivision problem object from the passed in 
 * <strong>initObject</strong>.  A random long division problem will be created
 * if the <strong>initObject</strong> indicates such; otherwise, the <strong>initObject</strong>
 * is expected to pass in the dividend and divisor.<br>
 * <br>
 * No matter how the Long Division object is created, the constructor function will determine
 * its solution as well as the steps for its workbook.<br>
 * <br>
 * @property {Object} initObject The original initObject passed into the constructor.
 * @property {Object} problem An object containing the pieces of the Long Division problem.
 * @property {Number} problem.dividend The problem's dividend.
 * @property {Number} problem.divisor The problem's divisor.
 * @property {Object} answer An object containing the pieces of the Long Division problem solution.
 * @property {Number} answer.quotient The solution's quotient.
 * @property {Number} answer.remainder The solution's remainder.
 * @property {Object[]} workbookStepPieces An array of workbook steps which illustrate the solution.
 * @property {Number} workbookStepPieces.currentStep An array index representing the step with which
 * 		the user is currently interacting.
 * @param {Object} initObject The initialization object which can contain a random flag or a 
 * 		predetermined dividend and divisor.
 * @param {Boolean} [initObject.random] An object describing how the random Long Division problem
 * 		is to be created.  The presence of a random property of the initObject triggers the creation
 * 		of a random problem.
 * @param {Number} [initObject.dividend] The dividend for the problem.
 * @param {Number} [initObject.divisor] The divisor for the problem.
 */
mathSkills.problems.LongDivision = function(initObject) {
	this.initObject = {};
	this.problem = {};
	this.answer = {};
	
	this.problem.dividend = 0;
	this.problem.divisor = 1;
	this.answer.quotient = 1;
	this.answer.remainder = 0;
	
	this.initialize(initObject);	
	this.solve();
	
	this.workbookStepPieces = [];
	this.getWorkbookStepPieces();
	this.workbookStepPieces.currentStep = 0;
};

mathSkills.problems.LongDivision.prototype.getQuotient = function() {
	return this.answer.quotient;
};

mathSkills.problems.LongDivision.prototype.getRemainder = function() {
	return this.answer.remainder;
};

mathSkills.problems.LongDivision.prototype.getDividend = function() {
	return this.problem.dividend;
};

mathSkills.problems.LongDivision.prototype.getDivisor = function() {
	return this.problem.divisor;
};

mathSkills.problems.LongDivision.prototype.initialize = function(initObject) {
	// If we've been passed a real initObject, use it.
	if (initObject.divisor !== undefined && initObject.dividend !== undefined) {
		this.problem.dividend = initObject.dividend;
		this.problem.divisor = initObject.divisor;
		this.initObject = initObject;
	// If we have a stored initObject, use it.
	} else if (mathSkills && mathSkills.nav && mathSkills.nav.getCurrentInit()) {
		this.initObject = mathSkills.nav.getCurrentInit();
		this.problem.dividend = this.initObject.dividend;
		this.problem.divisor = this.initObject.divisor;
	// Finally generate a new random initObject if nothing else.
	} else {
		var randInit = this.createRandom(initObject);
		this.problem.dividend = randInit.dividend;
		this.problem.divisor = randInit.divisor;
		this.initObject = randInit;
	}
};

/**
 * Builds a random long division problem.  It uses the three properties
 * of the <strong>initObject.random</strong> object to do so.
 * @param {Number} this.initObject.random.divisorPieces The number of digits to be
 * 		included in the divisor.
 * @param {Number} this.initObject.random.quotientPieces The number of digits to be
 * 		included in the quotient.
 * @param {Boolean} this.initObject.random.hasRemainder A flag indicating whether the
 * 		answer should include a remainder.
 */
mathSkills.problems.LongDivision.prototype.createRandom = function(initObject) {
	var difficulty = initObject.random.difficulty !== undefined ? initObject.random.difficulty > 9 ? 9 : initObject.random.difficulty : 2,
		divisorRandom = [mathSkills.utils.numberBetween(difficulty, 9)],
		quotientRandom = [mathSkills.utils.numberBetween(difficulty, 9)],
		ii,
		randInit = {},
		quotient,
		remainder;
	
	// Rule: if 3 digit divisor, it should have only a 1 or 2 for its first digit.
	if (initObject.random.divisorPieces === 3) {
		divisorRandom.pop();
		divisorRandom.push(Math.floor(Math.random() * 2) + 1);
	}
	
	// Rule: if 3 digit divisor, the dividend should have no more than 5 digits.
	if (initObject.random.divisorPieces === 3) { 
		initObject.random.quotientPieces = 2;
	}
	
	// Set up the divisor.
	for (ii = initObject.random.divisorPieces - 1; ii > 0; ii--) {
		// Generate random next digit between 0 & 9
		divisorRandom.push(Math.floor(Math.random() * 10));
	}
	randInit.divisor = parseInt(divisorRandom.join(''), 10);
	
	// Set up the quotient.
	for (ii = initObject.random.quotientPieces - 1; ii > 0; ii--) {
		quotientRandom.push(Math.floor(Math.random() * 10));
	}
	quotient = parseInt(quotientRandom.join(''), 10);
	
	// Set up the dividend.
	randInit.dividend = randInit.divisor * quotient;
	
	// Set up the remainder if necessary.
	if (initObject.random.hasRemainder) {
		remainder = Math.floor((randInit.divisor - 1) * Math.random() + 1);
		randInit.dividend += remainder;
	}
	
	// Store the init object.
	if (mathSkills.nav) {
		var page = mathSkills.nav.pages[mathSkills.nav.currentPage];
		page.init = randInit;
		page.title = 'Divide ' + randInit.divisor + ' into ' + randInit.dividend;
	}
	
	return randInit;
};

/**
 * Computes the answer for the long division problem.
 */
mathSkills.problems.LongDivision.prototype.solve = function() {
	this.answer.quotient = Math.floor(this.problem.dividend / this.problem.divisor);
	this.answer.remainder = this.problem.dividend % this.problem.divisor;
};

/**
 * Returns the text of the problem as an HTML string.
 * @return {String} An HTML formatted string representing the problem.
 */
mathSkills.problems.LongDivision.prototype.getProblemText = function() {
	var html = [];
	html.push('<h1 class=label>Find the quotient of </h1><br><span class=label>');
	html.push(mathSkills.utils.formatNumber(this.problem.dividend)+' and '+mathSkills.utils.formatNumber(this.problem.divisor));
	html.push('</span>');
	return html.join('');
};

/**
 * Returns a Problem object that contains the long division problem answer.
 * @return {mathSkills.widgets.Problem} An object containing the pieces of the long
 * 		division problem answer.
 */
mathSkills.problems.LongDivision.prototype.getAnswer = function() {
	var problem = new mathSkills.widgets.Problem()
		.setType(mathSkills.widgets.problem.types.LONG_DIVISION_ANSWER)
		.setOperands([ {
			value: this.getQuotient(), 
			unit: 'quotient',
			singular: 'quotient',
			plural: 'quotient'
		}, {
			value: this.getRemainder(), 
			unit: 'remainder',
			singular: 'remainder',
			plural: 'remainder'
		}])
		.setIncorrect('Sorry, that is not correct.');
		
	return problem;
};

/**
 * Returns the steps required to solve the long division problem.
 * @return {mathSkills.widgets.Problem[]} An array of problem objects to be placed in a
 * 		workbook.
 */
mathSkills.problems.LongDivision.prototype.getWorkbookSteps = function() {
	var steps = [],
		problem;
	
	// Set up the problem.
	problem = new mathSkills.widgets.Problem()
		.setType(mathSkills.widgets.problem.types.DRAG_AND_DROP)
		.setOperands([ {
				value: this.problem.divisor,
				unit: 'divisor'
			}, {
				value: this.problem.dividend,
				unit: 'dividend'
		}])
		.setInstructions('Drag and drop each number in its appropriate place on the division box.')
		.setSummary('<span class=label>You set up the problem as </span><span class=measurement><table class=division><tr><td>'+this.problem.divisor+'</td><td class=divisionBox>'+this.problem.dividend+'</td></tr></table></span>');
	steps.push(problem);
	
	// Determine first part of dividend.
	problem = new mathSkills.widgets.Problem()
		.setType(mathSkills.widgets.problem.types.SELECTION)
		.setOperands([ {
				value: this.problem.divisor,
				unit: 'divisor'
			}, {
				value: this.getSelectableDividend(),
				unit: 'dividend'
		}])
		.setInstructions('Select (click and drag the mouse) the first portion of the dividend that is larger than the divisor.')
		.setSummary('<span class=label>Your first division problem is </span><span class=measurement><table class=division><tr><td>'+this.problem.divisor+'</td><td class=divisionBox>'+this.workbookStepPieces[0].dividend+'</td></tr></table></span>');
	steps.push(problem);
	
	// Perform the first division operation.
	problem = new mathSkills.widgets.Problem()
		.setType(mathSkills.widgets.problem.types.LONG_DIVISION)
		.setOperands([ {
			value: this.breakUpUnits(this.problem.divisor),
			unit: 'divisor'
		}, {
			value: this.workbookStepPieces[0].dividendActive,
			unit: 'dividend'
		} ])
		.setInstructions('Divide '+this.problem.divisor+' into '+this.workbookStepPieces[0].dividend)
		.setAnswer(mathSkills.utils.objectClone(this.workbookStepPieces))
		.setLeadingSpaces(this.getDividendQuotientDifference())
		.setSummary('<span class=label>Your first division problem is </span><span class=measurement><table class=division><tr><td>'+this.problem.divisor+'</td><td>'+this.workbookStepPieces[0].dividend+'</td></tr></table></span>');
	steps.push(problem);
	
	return steps;
};

/**
 * Creates the intermediary steps for the workbook.
 */
mathSkills.problems.LongDivision.prototype.getWorkbookStepPieces = function() {
	var step,
		dividendArray = this.problem.dividend.toString().split(''),
		dividendQuotientDiff = this.getDividendQuotientDifference();
		
	for (var ii = 1, len = this.getNumberOfDivisionSteps() + 1; ii < len; ii++) {
		step = {};
		step.divisor = this.problem.divisor;
		if (ii === 1) {
			step.dividend = parseInt(dividendArray.slice(0, dividendQuotientDiff + ii).join(''), 10);
		} else {
			var prevRemainder = this.workbookStepPieces[this.workbookStepPieces.length - 1].remainder;
			step.dividend = parseInt(prevRemainder.toString() + dividendArray.slice(dividendQuotientDiff + ii - 1, dividendQuotientDiff + ii).join(''), 10);
		}
		step.quotient = Math.floor(step.dividend / step.divisor);
		step.product = step.quotient * step.divisor;
		step.remainder = step.dividend % step.divisor;
		if (ii + 1 !== len) {
			step.dividendDrop = dividendArray.slice(dividendQuotientDiff + ii, dividendQuotientDiff + ii + 1).join('');
		} else {
			step.dividendDrop = null;
		}
		var dividendActive = [];
		var dividendUnit = '';
		for (var jj = 0, jLen = dividendArray.length; jj < jLen; jj++) {
			dividendUnit = '<span class="numberUnit';
			dividendUnit += jj < dividendQuotientDiff + ii ? ' active">' : ' inactive">';
			dividendUnit += dividendArray[jj]+'</span>';
			dividendActive.push(dividendUnit);
		}
		step.dividendActive = dividendActive.join('');
		this.workbookStepPieces.push(step);
	}
};

/**
 * Returns the first portion of the dividend that is larger than the divisor
 * This serves as the dividend during the first step of solving the equation.
 * @return {Number} The first dividend.
 */
mathSkills.problems.LongDivision.prototype.getFirstDividend = function() {
	return Math.floor(this.problem.dividend / Math.pow(10, this.getDividendQuotientDifference()));
};

/**
 * Returns the long division dividend setup for use with jQuery UI selectable.
 * @return {String} An HTML formatted string for use with jQuery UI selectable functionality.
 */
mathSkills.problems.LongDivision.prototype.getSelectableDividend = function() {
	var selectedUnits = this.getDividendQuotientDifference() + 1;
	var array = this.problem.dividend.toString().split('');
	var html = [];
	html.push('<ul class="selectable ui-selectable">');
	for (var ii = 0, len = array.length; ii < len; ii++) {
		if (ii < selectedUnits) {
			html.push('<li class=ui-selectee data-select=true>'+array[ii]+'</li>');
		} else {
			html.push('<li class=ui-selectee data-select=false>'+array[ii]+'</li>');
		}
	}
	html.push('</ul>');
	return html.join('');
};

/**
 * Returns the number of unit place differences between the dividend and the quotient.
 * @return {Number} The number of digits different.
 */
mathSkills.problems.LongDivision.prototype.getDividendQuotientDifference = function() {
	return (this.problem.dividend.toString().length) - (this.answer.quotient.toString().length);
};

/**
 * Returns the number of intermediate division steps that will be required to solve
 * the problem when working it out in the workbook.
 * @return {Number} The number of division steps.
 */
mathSkills.problems.LongDivision.prototype.getNumberOfDivisionSteps = function() {
	return this.answer.quotient.toString().length;
};

/**
 * Wraps each digit of a number in an HTML &lt;span&gt; element with a class of "numberUnit".
 * It returns the formatted HTML string.
 * @param {Number} num The number to be broken up.
 * @return {String} The HTML string.
 */
mathSkills.problems.LongDivision.prototype.breakUpUnits = function(num) {
	var array = num.toString().split('');
	var html = [];
	for (var ii = 0, len = array.length; ii < len; ii++) {
		html.push('<span class=numberUnit>'+array[ii]+'</span>');
	}
	return html.join('');
};

mathSkills.problems.LongDivision.fillInDivisionInputs = function(event) {
	var page = mathSkills.nav.getCurrentPage();
	var $workbookPanel = $(mathSkills.workbook.getCurrentProblem().getDomElement());
	mathSkills.utils.navigation.Page.addHelp(page, $workbookPanel.find('h2.label').text());
	
	$('#workbook table.division input').each(function() {
		if ($(this).hasClass('incorrect') || $(this).val() === "") { 
			$(this).val($(this).data('answer'));
		}
	});
	mathSkills.problems.LongDivision.workbookDivisionInputHandler(event);
};

mathSkills.problems.LongDivision.moveToNextDivisionInput = function(event) {
	var nextInput = $(event.target).parent().prev('.numberUnit').find('input');
	if (nextInput) {
		mathSkills.utils.animation.focusFeedback(nextInput);
	}
};

mathSkills.problems.LongDivision.quotientCondition = function(event) {
	var container = $(event.target).closest('.panel');
	if (container.find('table.division input:first').val() === '' ||
		container.find('table.division input').length > 1) {
		return false;
	} else {
		return true;
	}
};

/**
 * Event handler for all of the logic for steps 3+ of the long division workbook.
 */
mathSkills.problems.LongDivision.workbookDivisionInputHandler = function(event) {
	var container = $('#workbook section.current');
	var step = container.data('step') || 'division';
	var ii, len, numberOfInputs, answerArray, html, leadingZeros = 0, 
		currentStep = mathSkills.workbookStepPieces[mathSkills.workbookStepPieces.currentStep];
	 
	if (step === 'division') {
		container.find('h2.label').text('Multiply '+$(event.target).val()+' times '+currentStep.divisor+' and place your answer below '+currentStep.dividend+' in the dividend.');
		
		mathSkills.utils.animation.bounceRight(
			container.find('.helpMessage').text('Press ENTER when complete.')
		);
		
		numberOfInputs = currentStep.dividend.toString().split('').length;
		answerArray = currentStep.product.toString().split('');
		
		// Pad the answer array with leading zeros if necessary.
		for (ii = numberOfInputs, len = answerArray.length; ii > len; ii--) {
			answerArray.unshift(0);
			leadingZeros++;
		}
		
		html = [];
		html.push('<tr class=body><td></td><td>');
		// Pad the line with any necessary empty spacers.
		ii = container.find('table.division tr:last td:last .numberUnit:not(.inactive)').length - answerArray.length;
		for (; ii > 0; ii--) {
			html.push('<span class=numberUnit></span>');
		}
		for (ii = 0, len = numberOfInputs; ii < len; ii++) {
			if (leadingZeros > 0) {
				html.push('<span class=numberUnit><input class=leadingZero data-answer='+answerArray[ii]+' type=text></span>');
				leadingZeros--;
			} else {
				html.push('<span class=numberUnit><input data-answer='+answerArray[ii]+' type=text></span>');
			}
		}
		html.push('</td></tr>');
		container.find('table.division').append(html.join(''));
		
		container.find('table.division input:last').focus();
		
		mathSkills.utils.animation.scrollToBottom();
		
		container.data('step', 'multiplication');
	} else if (step === 'multiplication') {			
		container.find('h2.label').text('Subtract '+currentStep.product+' from '+currentStep.dividend+'.');
		
		mathSkills.utils.animation.bounceRight(
			container.find('.helpMessage').text('Press ENTER when complete.')
		);
		
		// Convert correct answer inputs to non-interactive unit values.
		container.find('table.division .numberUnit input').each(function() {
			var value = $(this).val();
			if ($(this).hasClass('leadingZero')) {
				$(this).parent().html('');
			} else {
				$(this).parent().html(value);
			}
		});
		
		numberOfInputs = currentStep.dividend.toString().split('').length;
		answerArray = currentStep.remainder.toString().split('');
		
		// Pad the answer array with leading zeros if necessary.
		for (ii = numberOfInputs, len = answerArray.length; ii > len; ii--) {
			answerArray.unshift(0);
			leadingZeros++;
		}
		
		// Put in a subtraction sign on the last row.
		container.find('table.division tr:last td:first').html('<span class=operationSymbol>-</span>');
		
		html = [];
		html.push('<tr class=body><td></td><td class=subtraction>');
		// Pad the line with any necessary empty spacers.
		ii = container.find('table.division tr:last td:last .numberUnit:not(.inactive)').length - answerArray.length;
		for (; ii > 0; ii--) {
			html.push('<span class=numberUnit></span>');
		}
		for (ii = 0, len = numberOfInputs; ii < len; ii++) {
			if (leadingZeros > 0) {
				html.push('<span class=numberUnit><input class=leadingZero data-answer='+answerArray[ii]+' type=text></span>');
				leadingZeros--;
			} else {
				html.push('<span class=numberUnit><input data-answer='+answerArray[ii]+' type=text></span>');
			}
		}
		html.push('</td></tr>');
		container.find('table.division').append(html.join(''));
		
		container.find('table.division input:last').focus();
		
		mathSkills.utils.animation.scrollToBottom();
		
		container.data('step', 'subtraction');
	} else if (step === 'subtraction') {
		// Increment current step.
		mathSkills.workbookStepPieces.currentStep++;
		currentStep = mathSkills.workbookStepPieces[mathSkills.workbookStepPieces.currentStep];
		
		// Convert correct answer inputs to non-interactive unit values.
		container.find('table.division .numberUnit input').each(function() {
			var value = $(this).val();
			if ($(this).hasClass('leadingZero')) {
				$(this).parent().html('');
			} else {
				$(this).parent().html(value);
			}
		});
		
		// If there is a next step set it up.
		if (currentStep !== undefined) {
			container.find('h2.label').text('Divide '+currentStep.divisor+' into '+currentStep.dividend+'.');
			container.find('.helpMessage').text('');
			
			// Activate the next part of the dividend and append it to the last remainder.
			container.find('table.division .dividend .inactive:first')
				.removeClass('inactive')
				.addClass('active')
				.clone()
				.appendTo('table.division tr:last td:last');
			
			// Animate the next part of the dividend dropping down.
			var movingEl = container.find('table.division .dividend .active:last');
			var moveTarget = container.find('table.division tr:last td:last .numberUnit:last');
			
			mathSkills.utils.animation.move(movingEl, moveTarget, { 
				cloneMove: true
			});
			
			$('table.division tr.body').slice(0, -1).find('td:last').each(function() {
				$(this).append('<span class="numberUnit arrow">&darr;</span>');
			});
			
			html = [];
			html.push('<span class=numberUnit><input type=text data-answer=');
			html.push(currentStep.quotient);
			html.push('></span>');
			$(html.join('')).appendTo(container.find('table.division .quotient'));
			
			mathSkills.utils.animation.scrollToBottom();
				
			container.find('table.division input:first').focus();
			
			container.data('step', 'division');
		} else {			
			var divisionTable = $('#workbook .current table.division').clone();
			
			html = [];
			html.push('<h2><span class=label>You worked out the problem</span>');
			html.push('<span class=measurement></span></h2>');
			
			$('#workbook .current').removeClass('current').addClass('complete').html(html.join(''));
			
			$('#workbookContainer > section:last .measurement').append(divisionTable);
			
			$('#answer input.incorrect:first').focus().css('background-color', 'yellow')
					.animate({'background-color': 'white'}, 1000);
			
			$('#workbook').off('focusin click').addClass('complete');
			$('#overlay').click();
		}
	}
};

mathSkills.problems.LongDivision.validateWorkbookStep = function() {
	var $container = $(mathSkills.workbook.getCurrentProblem().getDomElement()),
		step = $container.data('step'),
		wbStep = mathSkills.workbookStepPieces[mathSkills.workbookStepPieces.currentStep],
		correct = true,
		value,
		answer = '',
		quotientAnswer = '',
		description = $container.find('h2.label').text(),
		correctAnswer = 0;
		
	$container.find('table.division input').not('.helper').each(function() {
		// Assume an empty input field is equal to 0.
		value = parseInt($(this).val() || 0, 10);
		if (value !== parseInt($(this).data('answer'), 10)) { 
			correct = false; 
			mathSkills.utils.animation.incorrectFeedback($(this));
		} else { 
			mathSkills.utils.animation.correctFeedback($(this));
		}
		
		if ($(this).parent().parent().hasClass('quotient')) {
			quotientAnswer += ''+value;
		} else {
			answer += ''+value;
		}
	});
	 
	
	if (!correct) {
		// Save incorrect details.
		if (quotientAnswer !== '' && parseInt(quotientAnswer, 10) !== wbStep.quotient) {
			answer = quotientAnswer;
			correctAnswer = wbStep.quotient;
			description = 'Divide '+wbStep.divisor+' into '+wbStep.dividend;
		} else if (step === 'multiplication') {
			correctAnswer = wbStep.product;
			description = 'Multiply '+wbStep.quotient+' times '+wbStep.divisor;
		} else if (step === 'subtraction') {
			correctAnswer = wbStep.remainder;
		}
		
		var page = mathSkills.nav.getCurrentPage();
		
		mathSkills.utils.navigation.Page.addIncorrectAnswer(page, {
			description: description,
			answer: parseInt(answer, 10),
			correct: correctAnswer
		});
		
		// Move focus.
		if ($('table.division .quotient .incorrect').length > 0) {
			mathSkills.utils.animation.focusFeedback($('table.division .quotient .incorrect:first'));
		} else {
			mathSkills.utils.animation.focusFeedback($('table.division tr:last .incorrect:last'));
		}
	}
	
	return correct;
};
