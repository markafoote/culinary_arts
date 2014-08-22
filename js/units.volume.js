/**
 * @fileOverview Contains all objects and functions for mathSkills.units.Volume
 * and mathSkills.units.volume.
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
 * @namespace Namespace for all volume measurements.
 */
mathSkills.units.volume = mathSkills.units.volume || {};

/**
 * @class <h2>Volume unit class.</h2>
 * The constructor builds a new Volume object with the variable parameter init object passed in.
 * It stores the original value of the init parameter and stores the correctly simplified version.<br>
 * <br>
 * @property {Number} tsp The number of simplified teaspoons.
 * @property {Number} tbs The number of simplified tablespoons.
 * @property {Number} oz The number of simplified ounces.
 * @property {Number} c The number of simplified cups.
 * @property {Number} pt The number of simplified pints.
 * @property {Number} qt The number of simplified quarts.
 * @property {Number} gal The number of simplified gallons.
 * 
 * @param {Object} [initObject] Volume initialization object.  Should contain unit names (plural 
 * 		form) as keys and the quantity of each unit as values.  If this is not specified, a 
 * 		<strong>problemObject</strong> should be so that a random Volume can be generated.
 * @param {Object} problemObject An object with properties describing how a random Volume should
 * 		be created.
 * 
 * @augments mathSkills.Units
 */
mathSkills.units.Volume = function(initObject, problemObject) {
	mathSkills.Units.apply(this, initObject);
	this.initializeObject(initObject, problemObject);
	return this;
};

// Inherit mathSkills.Units functionality.
mathSkills.units.Volume.prototype = new mathSkills.Units();

// Save a reference to the superclass at this.superclass.
mathSkills.units.Volume.prototype.superclass = mathSkills.Units;

// Set the constructor so that this object identifies itself as an instance of mathSkills.units.Volume.
mathSkills.units.Volume.prototype.constructor = mathSkills.units.Volume;

/**
 * The Volume units array.  It holds an object describing each unit piece.
 * @constant
 * @fieldOf mathSkills.units.Volume
 */
mathSkills.units.Volume.prototype.UNITS = [
	{name: 'teaspoon', plural: 'tsp', toNext: 3},
	{name: 'tablespoon', plural: 'tbs', toNext: 2},
	{name: 'ounce', plural: 'oz', toNext: 8},
	{name: 'cup', plural: 'c', toNext: 2},
	{name: 'pint', plural: 'pt', toNext: 2},
	{name: 'quart', plural: 'qt', toNext: 4},
	{name: 'gallon', plural: 'gal'}
];