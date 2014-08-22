/**
 * @fileOverview Contains all objects and functions for mathSkills.problems.PartOfWhole
 * and mathSkills.problems.partOfWhole.
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
 * @namespace Namespace for part-of-whole problem class
 */
mathSkills.problems.partOfWhole = mathSkills.problems.partOfWhole || {};

/**
 * @class <h2>Part of Whole Problem Class</h2>
 * Constructs a new Part-of-Whole problem object.<br>
 * <br>
 * @property {Object} init The original initialization object.
 * @property {String} wording The wording of the problem.  It can contain two template
 * 		tags {{PART}} and {{WHOLE}} which will be replaced with the appropriate values.
 * @property {String} unit The answer units (i.e. if the problem calls for how
 * 		many chickens need to be roasted, the unit would be "roasted chickens").
 * @property {mathSkills.types.Fraction} part The part of the whole that is 
 * 		to be found.
 * @property {Number} whole The whole value for the problem.
 * @param {Object} init Initizization object.
 * @param {String} [init.wording=''] Value to set this.wording to.
 * @param {String} [init.unit=''] Value to set this.unit to.
 * @param {mathSkills.types.Fraction} [init.part=undefined] Value to set this.part to.
 * @param {Number} [init.whole=undefined] Value to set this.whole to.
 */
mathSkills.problems.PartOfWhole = function(init) {
	this.init = init;
	this.wording = init.wording || '';
	this.unit = init.unit || '';
	this.part = init.part || undefined;
	this.whole = init.whole || undefined;
};

/**
 * Returns an HTML (and MathML) representation of the problem.
 * @return {String} The HTML string containing the problem.
 */
mathSkills.problems.PartOfWhole.prototype.getProblem = function() {
	var string = this.wording;
	string = string.replace('{{PART}}', this.part.getMathML()).replace('{{WHOLE}}', this.whole);
	var ret = '<h1 class=label>Solve this problem</h1><br>';
	ret += '<span class="label wordproblem">'+string+'</span>';
	return ret;
};

/**
 * Returns a Problem object representing the final answer for the problem.
 * @return {mathSkills.widgets.Problem} Final answer problem object.
 */
mathSkills.problems.PartOfWhole.prototype.getProblemAnswer = function() { 
	var problemInit = {};
	problemInit.operands = [{
		value: this.computeAnswer(), 
		unit: this.unit
	}];
	problemInit.incorrect = 'Sorry, that is not correct.';
	return new mathSkills.widgets.Problem(problemInit);
};

/**
 * Returns the answer to the problem.
 * @return {Number} The answer.
 */
mathSkills.problems.PartOfWhole.prototype.computeAnswer = function() {
	return this.whole * this.part.numerator / this.part.denominator;
};

/**
 * Returns the steps required to solve the problem.
 * @return {mathSkills.widgets.Problem[]} Array of step problems to be used with a workbook.
 */
mathSkills.problems.PartOfWhole.prototype.getSteps = function() {
	var steps = [];
	// Step 1: Find numbers you are working with.
	// Step 2: Setup multiplication problem
	// Step 3: Cross cancel
	// Step 4: Multiply
};