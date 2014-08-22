/**
 * @fileOverview Contains all objects and functions for mathskills.events.Behavior
 * @author Noah Freitas
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for event related classes
 */
mathSkills.events = mathSkills.events || {};

/**
 * @namespace Namespace for Behavior class.
 */
mathSkills.events.behavior = mathSkills.events.behavior || {};

/**
 * @class <h2>Behavior Class</h2>
 * Provides a structure to the behavior behind an event.
 * 
 * @param {Object} initObject
 */
mathSkills.events.Behavior = function(initObject) {
	/**
	 * The behavior name.
	 * @type String
	 * @private
	 */
	var name = initObject.name || '';
	/**
	 * The event type to bind the behavior to.
	 * 
	 * @type String
	 * @private
	 */
	var eventType = initObject.eventType || null;
	/**
	 * A function that will return true or false depending on whether or not the callback should
	 * execute.
	 * 
	 * @type Function[]||Function
	 * @param {Event} event Event object.
	 * @private
	 */
	var condition = initObject.condition || null;
	/**
	 * A second callback that will execute if a particular condition fails.
	 * 
	 * @type Function[]||Function
	 * @param {Event} event Event object.
	 * @private
	 */
	var conditionFailure = initObject.conditionFailure || null;
	/**
	 * The function that will execute if the condition evaluates to true.
	 * 
	 * @type Function
	 * @private
	 */
	var callback = initObject.callback || null;
	/**
	 * The jQuery selector for the event.target.
	 * 
	 * @type String
	 * @private
	 */
	var selector = initObject.selector || null;
	
	/**
	 * Returns the behavior name.
	 * 
	 * @return {String} Behavior name.
	 */
	this.getName = function() {
		return name;
	};
	
	/**
	 * Returns the even type.
	 * 
	 * @return {String} Event type.
	 */
	this.getEventType = function() {
		return eventType;
	};
	
	/**
	 * Returns the callback execution condition.
	 * 
	 * @return {Function||Function[]} Condition function.
	 */
	this.getCondition = function() {
		return condition;
	};
	
	/**
	 * Returns the condition failure callbacks.
	 * 
	 * @return {Function||Function[]} Condition function.
	 */
	this.getConditionFailure = function() {
		return conditionFailure;
	};
	
	/**
	 * Returns the callback function.
	 * 
	 * @return {Function} Callback function.
	 */
	this.getCallback = function() {
		return callback;
	};
	
	/**
	 * Returns the selector string.
	 * 
	 * @return {String} jQuery selector string.
	 */
	this.getSelector = function() {
		return selector;
	};
};

/**
 * Determines whether a particular behavior applies to a fired event.
 * 
 * @param {Event} event Event object.
 * 
 * @return {Boolean} true if it applies, false otherwise.
 */
mathSkills.events.Behavior.prototype.applies = function(event) {
	var condition = this.getCondition(),
		selector = this.getSelector(),
		conditionFailure = this.getConditionFailure();
	
	// Test selector
	if (selector !== null && !$(selector).is($(event.target))) {
		return false;
	}
	
	// Test the conditions
	if (condition !== null) {
		// Check for a single condition function.
		if (typeof condition === 'function') {
			if (!condition(event)) {
				if (conditionFailure && typeof conditionFailure === 'function') {
					conditionFailure(event);
				}
				return false;
			}
		// Check for an array of condition functions.
		} else if (typeof condition.sort !== 'undefined') {
			for (var ii = 0, len = condition.length; ii < len; ii++) {
				if (!condition[ii](event)) {
					if (conditionFailure && typeof conditionFailure[ii] === 'function') {
						conditionFailure[ii](event);
					}
					return false;
				}
			}
		}
	}
	
	return true;
};

/**
 * Determines whether two Behavior objects are equal to each other.
 * 
 * @param {mathSkills.events.Behavior} behavior2 The second behavior object.
 * 
 * @return {Boolean} true if they are equal, false otherwise.
 */
mathSkills.events.Behavior.prototype.equals = function(behavior2) {
	return this.getEventType() === behavior2.getEventType()
		&& this.getSelector() === behavior2.getSelector()
		&& this.getCondition() === behavior2.getCondition()
		&& this.getCallback() === behavior2.getCallback();
};

/**
 * Built in Behavior condition functions.
 * 
 * @constant
 * @fieldOf mathSkills.events.Behavior
 */
mathSkills.events.behavior.CONDITIONS = {
	/** @ignore */
	enterKey: function(event) {
		if (event.keyCode === 13 || event.keyCode === 10) {
			return true;
		} else {
			return false;
		}
	},
	// Returns true if the key pressed was a number key.
	// This must be bound to the keypress event to work properly.
	numberKey: function(event) {
		return (/[0-9]/).test(String.fromCharCode(event.which));
	}
};
