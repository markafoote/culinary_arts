/**
 * @fileOverview Contains all objects and functions for mathSkills.Units.
 * @author <a href="mailto:noah@threepiecedesign.com">Noah Freitas</a>
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for all unit measurement code.
 */
mathSkills.units = mathSkills.units || {};

/**
 * @class <h2>Base Unit Class</h2>
 * Contains all the shared unit functionality used by {@link mathSkills.units.Length}, 
 * {@link mathSkills.units.Volume} & {@link mathSkills.units.Weight}.<br>
 * <br>
 * @property {Object} initObject The original initialization object used to create the unit.
 * 
 * @param {Object} initObject Unit initialization object.  Should contain unit names (plural form) as
 * 		keys and the quantity of each unit as values.
 */
mathSkills.Units = function(initObject) {
	return this;
};

/**
 * Returns a random unsimplified unit initObject
 * 
 * @param {Object} problemObject An object with properties describing how the random unit should
 * 		be created.
 * @param {String|Number} [problemObject.units=2] The number of distinct unit types of 
 * 		which the problem is to be composed.
 * @param {String|Number} [problemObject.level=2] A difficulty level for the problem.
 * @param {String|Number} [problemObject.offset=0] The offset at which to begin the unit count.
 * 
 * @return {Object} Unit initObject, which has unit names (plural forms) for keys for the
 * 		corresponding unit value.
 * 
 * @see mathSkills.utils.Navigation - The generated initObject will be stored in the 
 * 		proper index of the mathSkills.nav.pages array if navigation is being used.
 */
mathSkills.Units.prototype.randomUnsimplified = function(problemObject) {
	var initObject = {};
	var offset = problemObject.offset || 0;
	var units = problemObject.units || 2;
	var level = problemObject.level || 2;
	var len = parseInt(units, 10) + parseInt(offset, 10);
	var toNext;
	for (var ii = offset; ii < len; ii++) {
		if (ii + 1 == units) {
			toNext = 1;
		} else {
			toNext = this.UNITS[ii].toNext || 1;
		}
		var unitName = this.UNITS[ii].plural;
		initObject[unitName] = Math.round(Math.random() * (level * toNext) + toNext + level);
	}
	// Save the init object if navigation is being used.
	if (mathSkills.nav) {
		mathSkills.nav.pages[mathSkills.nav.currentPage].init = initObject;
	}
	return initObject;
};

mathSkills.Units.prototype.randomDimensionalAnalysis = function(problemObject) {
	var initObject = {},
		offset = problemObject.offset || 0,
		units = problemObject.units || 2,
		level = problemObject.level || 2,
		unitName = this.UNITS[this.UNITS.length - 1 - offset].plural;
		
	initObject[unitName] = Math.floor(Math.random() * level + level) + 1;
	initObject.toUnit = this.UNITS[this.UNITS.length - 1 - offset - units].plural;
	initObject.fromUnit = unitName;
	initObject.unitDistance = parseInt(units, 10);
	initObject.startUnitIndex = this.UNITS.length - 1 - offset;
	
	// Save the init object if navigation is being used.
	if (mathSkills.nav) {
		mathSkills.nav.pages[mathSkills.nav.currentPage].init = initObject;
	}
	return initObject;
};

/**
 * Initializes all possible unit values for the type to 0.
 * Stores object's initObject as the passed in value, a value stored in sessionStorage, 
 * or a randomly generated object.
 * 
 * @param {Object} [initObject] An object containing unit names as keys and integer values to
 * 		which the object is to be initialized.
 * @param {Object} [problemObject] An object containing randomization parameters to be passed on
 * 		to one of the random initObject maker functions if the initObject is null and
 * 		there is not an initObject in storage for this page.
 * 
 * @see mathSkills.utils.Navigation - The initObject will be retrieved from the navigation
 * 		system if the <strong>initObject</strong> parameter is null and navigation is in use.
 */
mathSkills.Units.prototype.initializeObject = function(initObject, problemObject) {
	var units = this.UNITS,
		page;
		
	for (var ii = units.length - 1; ii >= 0; ii--) {
		this[units[ii].plural] = 0;
	}
	if (initObject !== null) {
		this.initObject = initObject;
	} else if (mathSkills && mathSkills.nav && (mathSkills.nav.getCurrentPage()).init) {
		this.initObject = (mathSkills.nav.getCurrentPage()).init;
	} else if (problemObject.type === 'randomDimensionalAnalysis') {
		this.initObject = this.randomDimensionalAnalysis(problemObject);
		
		if (mathSkills.nav) {
			page = mathSkills.nav.pages[mathSkills.nav.currentPage];
			page.title = this.getDAProblemString();
		}
	} else {
		this.initObject = this.randomUnsimplified(problemObject);
		
		if (mathSkills.nav) {
			page = mathSkills.nav.pages[mathSkills.nav.currentPage];
			page.title = 'Simplify ' + this.getUnSimplifiedUnitString();
		}
	}
	
	switch (problemObject.type) {
		case 'randomDimensionalAnalysis' :
			this.solveDA();
			break;
		
		case 'randomUnsimplifed' :
			this.simplify();
			break;
	}
};

mathSkills.Units.prototype.getDAProblemMarkup = function() {
	return '<h1 class=label>'+this.getDAProblemString()+'</h1>';
}; 


mathSkills.Units.prototype.getDAProblemString = function() {
	var initObject = this.initObject,
		label = initObject[initObject.fromUnit] > 1 ? initObject.fromUnit : this.UNITS[initObject.startUnitIndex].name;
	
	return 'Convert '+initObject[initObject.fromUnit]+' '+label+' to '+initObject.toUnit;
};

mathSkills.Units.prototype.solveDA = function() {
	var units = this.UNITS,
		initObject = this.initObject,
		unitValue = initObject[initObject.fromUnit],
		end = initObject.startUnitIndex - initObject.unitDistance;
	
	for (var ii = initObject.startUnitIndex; ii > end; ii--) {
		unitValue *= units[ii - 1].toNext;
	}
	
	this[initObject.toUnit] = unitValue;
};

/**
 * Takes the object's initObject field and simplifies out its values. 
 */
mathSkills.Units.prototype.simplify = function() {
	var units = this.UNITS,
		initObject = this.initObject,
		simplifySteps = {},
		thisInit;
	
	for (var ii = 0, len = units.length; ii < len; ii++) {
		thisInit = (initObject[units[ii].plural] || 0) + this[units[ii].plural];
		simplifySteps[units[ii].plural] = thisInit;
		if (units[ii].toNext) {
			this[units[ii].plural] = thisInit % units[ii].toNext;
			this[units[ii + 1].plural] = Math.floor(thisInit / units[ii].toNext);
		} else {
			this[units[ii].plural] += initObject[units[ii].plural] || 0;
		}
	}
	this.simplifySteps = simplifySteps;
};

/**
 * Return the fully simplified unit as a string.  The string contains unit values followed
 * by unit names, with different unit types separated by commas.
 * 
 * @return {String} The plain string.
 * 
 * @see mathSkills.Units#getSimplifiedUnitWithMarkup - A similar function that wraps the 
 * 		unit pieces in HTML.
 */
mathSkills.Units.prototype.getSimplifiedUnit = function() {
	var string = [];
	var units = this.UNITS;
	var unit;
	for (var ii = units.length - 1; ii >= 0; ii--) {
		unit = units[ii];
		string.push(this[unit.plural]+' ');
		string.push((this[unit.plural] !== 1 ? unit.plural : unit.name));
		string.push(', ');
	}
	// Cut out the last comma and space.
	string.pop();
	return string.join('');
};

/**
 * Return the fully simplified unit as a string with HTML markup.  The format is each unit
 * value is wrapped in a &lt;span&gt; tag with a class of "value"; while, each unit name
 * is wrapped in a &lt;span&gt; tag with a class of "unit".
 * 
 * @return {String} The HTML string.
 * 
 * @see mathSkills.Units#getSimplifiedUnit - A similar function that returns the same information
 * 		as a simple string.
 */
mathSkills.Units.prototype.getSimplifiedUnitWithMarkup = function() {
	var string = [];
	var units = this.UNITS;
	var unit;
	for (var ii = units.length - 1; ii >= 0; ii--) {
		unit = units[ii];
		// Only print the unit if it doesn't equal 0 and there is no next unit or that also equals 0.
		if (
			this[unit.plural] === 0 && 
			(units[ii + 1] === undefined || 
			this[units[ii + 1].plural] === 0)
		) {
			continue;
		}
		string.push('<span class=value>'+this[unit.plural]+'</span> <span class=unit>');
		string.push((this[unit.plural] !== 1 ? unit.plural : unit.name));
		string.push('</span>');
	}
	return string.join('');
};

/**
 * Returns an array containing all the unit names of all the pieces of the simplified unit.
 * 
 * @return {String[]} An array of unit plural names contained in the simplified unit.
 */
mathSkills.Units.prototype.getSimplifiedUnitPieces = function() {
	var ret = [];
	var units = this.UNITS;
	for (var ii = units.length - 1; ii >= 0; ii--) {
		var unit = units[ii];
		// Only print the unit if it doesn't equal 0 and there is no next unit or that also equals 0.
		if (
			this[unit.plural] === 0 && 
			(units[ii + 1] === undefined || 
			this[units[ii + 1].plural] === 0)
		) {
			continue;
		}
		ret.push(unit.plural);
	}
	return ret;
};

/**
 * Returns the unsimplfied unit as an HTML string.  This function returns the string that is used
 * as the main problem wording.
 * 
 * @return {String} The HTML string.
 */
mathSkills.Units.prototype.getUnSimplifiedUnitProblem = function() {
	var string = ['<h1 class=label>Simplify this Measurement</h1> <br><span class=label>'];
	string.push(this.getUnSimplifiedUnitString());
	string.push('</span>');	
	
	return string.join('');
};

mathSkills.Units.prototype.getUnSimplifiedUnitString = function() {
	var string = [],
		units = this.UNITS,
		unit;
		
	for (var ii = units.length - 1; ii >= 0; ii--) {
		unit = units[ii];
		if (this.initObject[unit.plural]) {
			string.push(this.initObject[unit.plural]+' ');
			string.push((this.initObject[unit.plural] !== 1 ? unit.plural : unit.name));
			string.push(' ');
		}
	}
	
	string.pop();
	
	return string.join('');
};

/**
 * Returns the steps required to simplify the unit.  These steps are used by the workbook.
 * 
 * @return {mathSkills.widgets.Problem[]} An array of problem objects.
 */
mathSkills.Units.prototype.getSimplificationSteps = function() {
	var steps = [],
		units = this.UNITS,
		sumValue = this.getSumOfAllUnitValues(),
		startUnit = 0,
		ii, len, problem, unit, nextUnit, thisUnSimplifiedWeight, nextUnitValue, piecesArray, spacerCount, spacerString;
		
	// Find out where we need to start in case there's an offset.
	while (!(units[startUnit].plural in this.initObject)) {
		startUnit++;
	}
	for (ii = startUnit, len = units.length; ii < len; ii++) {
		unit = units[ii];
		nextUnit = units[ii + 1];
		sumValue -= this[unit.plural];
		// Only add a step if we have more unit values to deal with.
		if (sumValue > 0) {			
			// Make sure that previous simplification actions carry forward.
			thisUnSimplifiedWeight = this.simplifySteps[unit.plural];
			nextUnitValue = Math.floor(parseInt(thisUnSimplifiedWeight, 10) / parseInt(unit.toNext, 10));
			
			// Setup label spacers to properly align the units.
			piecesArray = this.getSimplifiedUnitPieces();
			spacerCount = 0;
			spacerString = '';
			while (
				nextUnit.plural !== piecesArray[spacerCount++] && 
				typeof piecesArray[spacerCount] !== "undefined"
			) {
				spacerString += '<span class=value></span> <span class=unit></span>';
			}
			
			problem = new mathSkills.widgets.Problem()
				.setLeadingSpaces(spacerCount - 1)
				.setInstructions('Express the '+unit.plural+' more simply in '+nextUnit.plural+' and '+unit.plural)
				.setHelp('Since '+unit.toNext+' '+unit.plural+' equals 1 '+nextUnit.name+' we must divide '+thisUnSimplifiedWeight+' by '+unit.toNext+'.')
				.setType(mathSkills.widgets.problem.types.DIVISION)
				.setOperands([ { 
					value: thisUnSimplifiedWeight, 
					unit: thisUnSimplifiedWeight !== 1 ? unit.plural : unit.name,
					singular: unit.name,
					plural: unit.plural
				}, { 
					value: unit.toNext, 
					unit: nextUnit.plural,
					singular: nextUnit.name,
					plural: nextUnit.plural 
				}])
				.setSummary('<span class=label>'+thisUnSimplifiedWeight+' '+unit.plural+' simplified to</span> <span class=measurement>'+spacerString+'<span class=value data-strikethrough=true>'+nextUnitValue+'</span> <span class=unit data-strikethrough=true>'+nextUnit.plural+'</span> <span class=value>'+this[unit.plural]+'</span> <span class=unit>'+unit.plural+'</span></span>');
				
			steps.push(problem);

			problem = new mathSkills.widgets.Problem()
				.setLeadingSpaces(spacerCount - 1)
				.setInstructions('Now add the original number of '+nextUnit.plural+' to the '+nextUnit.plural+' "pulled out" from simplifying the '+unit.plural)
				.setType(mathSkills.widgets.problem.types.ADDITION)
				.setOperands([ { 
					value: this.initObject[nextUnit.plural] || 0, 
					unit: this.initObject[nextUnit.plural] !== 1 ? nextUnit.plural : nextUnit.name,
					singular: nextUnit.name,
					plural: nextUnit.plural
				}, { 
					value: nextUnitValue, 
					unit: nextUnitValue !== 1 ? nextUnit.plural : nextUnit.name,
					singular: nextUnit.name,
					plural: nextUnit.plural
				}])
				.setHelp('You must now combine the '+nextUnit.plural+' simplified out of the smaller unit with the '+nextUnit.plural+' in the original problem.')
				.setSummary('<span class=label>'+nextUnitValue+' and '+(this.initObject[nextUnit.plural] || 0)+' '+nextUnit.plural+' combined to </span><span class=measurement>'+spacerString+'<span class=value data-strikethrough=true>'+(nextUnitValue + (this.initObject[nextUnit.plural] || 0))+'</span> <span class=unit data-strikethrough=true>'+nextUnit.plural+'</span>');
				
			steps.push(problem);
		}
	}
	steps.finalAnswer = '<span class=label>The simplified unit is </span><span class=measurement>'+this.getSimplifiedUnitWithMarkup()+'</span>';
	
	return steps;
};

mathSkills.Units.prototype.getDASteps = function() {
	var steps = [],
		units = this.UNITS,
		initObject = this.initObject,
		startIndex = initObject.startUnitIndex,
		lastIndex = initObject.startUnitIndex - initObject.unitDistance,
		endIndex = startIndex,
		problem,
		operands,
		ii,
		len,
		lastOperandsIndex,
		problemArray;
	
	for (; startIndex > lastIndex; startIndex--) {
		operands = [];
		problem = new mathSkills.widgets.Problem()
			.setType(mathSkills.widgets.problem.types.EQUIV_FRACTION)
			.setInstructions('Choose your next equivalence fraction.')
			.setHelp('Choose an equivalency from the dropdown and enter the numerator and denominator below.')
			.setAnswer([{
					value: units[startIndex - 1].toNext+' '+units[startIndex - 1].plural,
					unit: 'numerator'
				}, {
					value: '1 '+units[startIndex].name,
					unit: 'denominator'					
			}]);
		
		// Add first finished fraction.
		operands.push([ {
				value: initObject[initObject.fromUnit], 
				unit: initObject.fromUnit
			}, {
				value: 1,
				unit: ''
		} ]);
		
		// Add other finished fractions.
		for (ii = initObject.startUnitIndex - 1; ii >= endIndex; ii--) {
			operands.push([ {
					value: units[ii].toNext, 
					unit: units[ii].plural
				}, {
					value: 1,
					unit: units[ii + 1].name
			} ]);
		}
		
		
		// Setup the select operands.
		lastOperandsIndex = operands.length;
		operands[lastOperandsIndex] = [];
		operands[lastOperandsIndex][0] = [];
		operands[lastOperandsIndex][1] = [];
		for (ii = 0, len = units.length; ii < len; ii++) {
			operands[lastOperandsIndex][0].push({
				value: units[ii].toNext || 1,
				unit: units[ii].plural
			});
			operands[lastOperandsIndex][1].push({
				value: 1,
				unit: units[ii].name
			});
		}
		problem.setOperands(operands);			
		steps.push(problem);
		
		// Add "another equivalence fraction" question step.
		var lastFraction = startIndex - 1 === lastIndex;
		problem = new mathSkills.widgets.Problem()
			.setType(mathSkills.widgets.problem.types.YES_NO_QUESTION)
			.setInstructions('Do you need another equivalence fraction?')
			.setIncorrect('Incorrect &mdash; you do '+(lastFraction ? 'not ' : '')+'need another equivalence fraction, because your latest numerator units '+(lastFraction ? '' : 'do not ')+'match your answer units.')
			.setAnswer([
				lastFraction ? 'No' : 'Yes'
			]);
		
		steps.push(problem);
		
		endIndex--;
	}
	
	operands = [];
	// Add first finished fraction.
	operands.push([ {
			value: initObject[initObject.fromUnit], 
			unit: initObject.fromUnit,
			className: initObject.fromUnit
		}, {
			value: 1,
			unit: ''
	} ]);
	
	for (ii = initObject.startUnitIndex - 1; ii >= lastIndex; ii--) {
		problemArray = [ {
			value: units[ii].toNext, 
			unit: units[ii].plural,
			className: units[ii].plural
		}, {
			value: 1,
			unit: units[ii + 1].name,
			className: units[ii + 1].plural
		} ];
		if (ii === lastIndex) {
			delete problemArray[0].className;
		}
		operands.push(problemArray);
	}
	problem = new mathSkills.widgets.Problem()
			.setType(mathSkills.widgets.problem.types.CANCEL_UNITS)
			.setInstructions('Click on "like" units to cancel')
			.setOperands(operands);
	
	steps.push(problem);
	
	// Equivalency Fraction Summary Step
	/*operands = [];
	// Add first finished fraction.
	operands.push([ {
			value: initObject[initObject.fromUnit]
		}, {
			value: 1
	} ]);
	
	for (ii = initObject.startUnitIndex - 1; ii >= lastIndex; ii--) {
		problemArray = [ {
			value: units[ii].toNext
		}, {
			value: 1
		} ];
		operands.push(problemArray);
	}
	operands.push([{
			value: '?',
			unit: initObject.toUnit
		}, {
			value: 1
	}]);
	problem = new mathSkills.widgets.Problem()
			.setType(mathSkills.widgets.problem.types.EQUIV_FRACTION_SUMMARY)
			.setInstructions('Now multiply numerators, multiply denominators, simplify the result and enter the answer below')
			.setOperands(operands);
	
	steps.push(problem);*/
	
	return steps;
};

/**
 * Returns a Problem object that contains the simplification problem answer.
 * 
 * @return {mathSkills.widgets.Problem} The simplification answer.
 */
mathSkills.Units.prototype.getSimplicationAnswer = function() {
	var problem = new mathSkills.widgets.Problem(),
		operands = [],
		units = this.UNITS,
		unit;
	
	// Iterate backwards since we want the answer printed in descending order.
	for (var ii = units.length - 1; ii >= 0; ii--) {
		unit = units[ii];
		// Skip this unit if the initObject for it is null, and it is not a part of the final answer.
		if (!this.initObject[unit.plural] && this.simplifySteps[unit.plural] === 0) {
			continue;
		} else {
			operands.push({
				value: this[unit.plural], 
				unit: this[unit.plural] !== 1 ? unit.plural : unit.name,
				singular: unit.name,
				plural: unit.plural
			});
		}
	}
	
	problem.setHelp('First, we decide if the measurement needs to be simplified or not.<br><br>Always start with the smallest measurement label.<br><br>You can still try to solve the problem at the bottom of the page at any time.')
		.setType(mathSkills.widgets.problem.types.SIMPLIFICATION)
		.setIncorrect('Sorry, that is not correct.')
		.setOperands(operands)
		.setAnswer(operands);
		
	return problem;
};

mathSkills.Units.prototype.getDAAnswer = function() {
	var problem = new mathSkills.widgets.Problem(),
		initObject = this.initObject,
		unit = this.UNITS[initObject.startUnitIndex - initObject.unitDistance],
		operands = [{
			value: this[unit.plural], 
			unit: this[unit.plural] !== 1 ? unit.plural : unit.name,
			singular: unit.name,
			plural: unit.plural
		}];
	
	problem.setType(mathSkills.widgets.problem.types.DIMENSION_ANALYSIS)
		.setIncorrect('Sorry, that is not correct.')
		.setOperands(operands)
		.setAnswer(operands);
		
	return problem;
};

/**
 * Returns the sum of all unit values as a single value.
 * 
 * @return {Number} The sum of all unit piece values.
 */
mathSkills.Units.prototype.getSumOfAllUnitValues = function() {
	var sum = 0;
	for (var ii = this.UNITS.length - 1; ii >= 0; ii--) {
		sum += this[this.UNITS[ii].plural];
	}
	return sum;
};

/**
 * Returns HTML table mark-up for a table of equivalencies for the unit.
 * 
 * @return {String} The HTML string containing the table.
 */
mathSkills.Units.prototype.getEquivalencyTable = function() {
	var html = ['<h1>Table of Equivalency</h1><table>'];
	for (var ii = 0, len = this.UNITS.length - 1; ii < len; ii++) {
		html.push('<tr>');
		html.push('<td>'+this.UNITS[ii].toNext+' '+this.UNITS[ii].plural+'</td>');
		html.push('<td> = </td>');
		html.push('<td>1 '+this.UNITS[ii + 1].name+'</td>');
		html.push('</tr>');
	}
	html.push('</table>');
	return html.join('');
};