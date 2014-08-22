/**
 * @fileOverview Contains all objects and functions for mathSkills.units.Length
 * and mathSkills.units.length.
 * @author Noah Freitas
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
 * @namespace Namespace for all length measurements.
 */
mathSkills.units.length = mathSkills.units.length || {};

/**
 * @class <h2>Length unit class.</h2>
 * The constructor builds a new Length object with the variable parameter length object passed in.
 * It stores the original value of the length parameter and stores the correctly simplified version.<br>
 * <br>
 * @property {Number} inches The number of simplified inches.
 * @property {Number} feet The number of simplified feet.
 * @property {Number} yards The number of simplified yards.
 * 
 * @param {Object} [initObject] Length initialization object.  Should contain unit names (plural 
 * 		form) as keys and the quantity of each unit as values.  If this is not specified, a 
 * 		<strong>problemObject</strong> should be so that a random Length can be generated.
 * @param {Object} problemObject An object with properties describing how a random Length should
 * 		be created.
 * 
 * @augments mathSkills.Units
 */
mathSkills.units.Length = function(initObject, problemObject) {
	mathSkills.Units.apply(this, initObject);
	this.initializeObject(initObject, problemObject);
	return this;
};

// Inherit mathSkills.Units functionality.
mathSkills.units.Length.prototype = new mathSkills.Units();

// Save a reference to the superclass at this.superclass.
mathSkills.units.Length.prototype.superclass = mathSkills.Units;

// Set the constructor so that this object identifies itself as an instance of mathSkills.units.Length.
mathSkills.units.Length.prototype.constructor = mathSkills.units.Length;

/**
 * The Length units array.  It holds an object describing each unit piece.
 * @constant
 * @fieldOf mathSkills.units.Length
 */
mathSkills.units.Length.prototype.UNITS = [
	{name: 'inch', plural: 'inches', toNext: 12},
	{name: 'foot', plural: 'feet', toNext: 3},
	{name: 'yard', plural: 'yards'}
];