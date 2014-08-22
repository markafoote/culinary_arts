/**
 * @fileOverview Contains all objects and functions for mathSkills.types.Fraction
 * and mathSkills.types.fraction.
 * @author Noah Freitas
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace of number types.
 */
mathSkills.types = mathSkills.types || {};

/**
 * @namespace Namespace for fraction number type.
 */
mathSkills.types.fraction = mathSkills.types.fraction || {};

/**
 * @class <h2>Fraction Class</h2>
 * Constructs a fraction object with numerator and denominator and simplification capabilities.<br>
 * <br>
 * 
 * @throws {DivideByZero} If the initializing denominator === 0.
 * 
 * @param {Object} init The initialization object, possibly containing unsimplified fractional
 * 		components.
 * @param {Number} [init.numerator=0] Fraction's numerator.
 * @param {Number} [init.denominator=1] Fraction's denominator.
 * 
 * @requires mathSkills.utils.objectClone
 */
mathSkills.types.Fraction = function(init) {
	// Throw an error if we're dividing by zero.
	if (parseInt(init.denominator, 10) === 0) {
		throw { name: 'DivideByZero', message: 'Your fraction has a zero for its denomiator.' };
	}
	
	// Save a clone of the initialization object.
	/**
	 * The initialization object.
	 * @type Object
	 * @private
	 */
	var initObject = mathSkills.utils.objectClone(init);
	
	// Simplify the initialization object.
	this.simplify(init);
	
	/**
	 * Simplified fraction numerator.
	 * @type Number
	 * @private
	 */
	var numerator = init.numerator || 0;
	
	/**
	 * Simplified fraction denominator.
	 * @type Number
	 * @private
	 */
	var denominator = init.denominator || 1;
	
	// Set up getter functions.
	
	/**
	 * Returns a clone of the private initObject used to create the Fraction.
	 * 
	 * @return {Object} The initialization object.
	 */
	this.getInitObject = function() {
		return mathSkills.utils.objectClone(initObject);
	};
	
	/**
	 * Returns the simplified numerator value.
	 * 
	 * @return {Number} The numerator.
	 */
	this.getNumerator = function() {
		return numerator;
	};
	
	/**
	 * Returns the simplified denominator value.
	 * 
	 * @return {Number} The denominator.
	 */
	this.getDenominator = function() {
		return denominator;
	};
};

/**
 * Reduces (simplifies) the fraction initialization object.  It alters the passed in init object.
 * 
 * @param {Object} init Fraction initialization object.
 * 
 * @return {Object} Simplified fraction initialization object.
 */
mathSkills.types.Fraction.prototype.simplify = function(init) {
	var leastPart = init.numerator > init.denominator ? init.denominator : init.numerator;
	for (var ii = 2; ii <= leastPart; ii++) {
		if (init.numerator % ii === 0 && init.denominator % ii === 0) {
			init.numerator = init.numerator / ii;
			init.denominator = init.denominator / ii;
			leastPart = leastPart / ii;
		}
	}
	return init;
};

/**
 * Returns a MathML string representing the fraction in either its simplified or original
 * form.
 * 
 * @param {Boolean} [useInit] Flag to indicate whether simplified or original fractional
 * 		components should be used.  The presence of any parameter triggers the use of the
 * 		original initialization values.
 * @return {String} MathML string.
 */
mathSkills.types.Fraction.prototype.getMathML = function(useInit) {
	var num, den, init;
	
	if (useInit) {
		init = this.getInitObject();
		num = init.numerator;
		den = init.denominator;
	} else {
		num = this.getNumerator();
		den = this.getDenominator();
	}
	var html = '<math xmlns="http://www.w3.org/1998/Math/MathML">';
	html += '<mfrac><mn>'+num+'</mn><mn>'+den+'</mn></mfrac>';
	html += '</math>';
	return html;
};