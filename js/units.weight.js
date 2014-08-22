/**
 * @fileOverview Contains all objects and functions for mathSkills.units.Weight
 * and mathSkills.units.weight.
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
 * @namespace Namespace for all weight measurements.
 */
mathSkills.units.weight = mathSkills.units.weight || {};

/**
 * @class <h2>Weight unit class.</h2>
 * The constructor builds a new Weight object with the variable parameter weight object passed in.
 * It stores the original value of the weight parameter and stores the correctly simplified version.<br>
 * <br>
 * @property {Number} ounces The number of simplified ounces.
 * @property {Number} pounds The number of simplified pounds.
 * @property {Number} tons The number of simplified tons.
 * @property {Number} grams The full weight in metric grams, approximated to 3 decimal places.
 * 
 * @param {Object} [initObject] Weight initialization object.  Should contain unit names (plural 
 * 		form) as keys and the quantity of each unit as values.  If this is not specified, a 
 * 		<strong>problemObject</strong> should be so that a random Weight can be generated.
 * @param {Object} problemObject An object with properties describing how a random Weight should
 * 		be created.
 * 
 * @augments mathSkills.Units
 */
mathSkills.units.Weight = function(initObject, problemObject) {
	mathSkills.Units.apply(this, initObject);
	this.initializeObject(initObject, problemObject);
	return this;
};

// Inherit mathSkills.Units functionality.
mathSkills.units.Weight.prototype = new mathSkills.Units();

// Save a reference to the superclass at this.superclass.
mathSkills.units.Weight.prototype.superclass = mathSkills.Units;

// Set the constructor so that this object identifies itself as an instance of mathSkills.units.Weight.
mathSkills.units.Weight.prototype.constructor = mathSkills.units.Weight;

/**
 * The Weight units array.  It holds an object describing each unit piece.
 * @constant
 * @fieldOf mathSkills.units.Weight
 */
mathSkills.units.Weight.prototype.UNITS = [
	{name: 'ounce', plural: 'ounces', toNext: 16},
	{name: 'pound', plural: 'pounds', toNext: 2000},
	{name: 'ton', plural: 'tons'}
];

/**
 * Returns the grams measurement of the weight.
 * 
 * @return {Number} The weight of this object in grams.
 */
mathSkills.units.Weight.prototype.valueOf = function() {
	if (this.grams === undefined || this.grams === null) {
		this.convertToGrams();
	}
	return this.grams;
};

/**
 * Sets the grams property with the converted English units.
 */
mathSkills.units.Weight.prototype.convertToGrams = function() {
	var ounces = this.ounces || 0;
	var pounds = this.pounds || 0;
	var tons = this.tons || 0;
	ounces += pounds * 16;
	ounces += tons * 2000 * 16;
	
	this.grams = (ounces * 28.3495231).toFixed(3);
};