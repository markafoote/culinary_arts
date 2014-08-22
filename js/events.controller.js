/**
 * @fileOverview Contains all objects and functions for mathskills.events.Controller
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
 * @namespace Namespace for event Controller class.
 */
mathSkills.events.controller = mathSkills.events.controller || {};

/**
 * @class <h2>Event Controller Class</h2>
 * Abstracts event registration.
 * 
 * @param {String} container ID of containing HTML element.
 */
mathSkills.events.Controller = function(con) {
	/**
	 * jQuery selector string identifying the containing element.
	 * 
	 * @type String
	 * @private
	 */
	var container = con || 'body';
	/**
	 * Collection of current event bindings organized by event type.
	 * 
	 * @type Object
	 * @private
	 */
	var eventBindings = {};
	
	/**
	 * Adds a new behavior to the eventBindings object.
	 * It also calls this.bind() if necessary.
	 * 
	 * @param {mathSkills.events.Behavior} behavior The behavior to add.
	 */
	this.addBehavior = function(behavior) {
		var type = behavior.getEventType();
		
		if (!this.hasBehavior(behavior)) {
			if (eventBindings[type] === undefined) {
				eventBindings[type] = [];
			}
			
			eventBindings[type].push(behavior);
			
			if (eventBindings[type].length === 1) {
				this.bind(type);
			}
		} else {
			return false;
		}
	};
	
	/**
	 * Removes an existing behavior from the eventBindings object.
	 * It also calls this.unbind() if necessary.
	 * 
	 * @param {Object} behaviorDescription Type and optional selector of behavior to remove.
	 * @param {String} behaviorDescription.type Event type to remove
	 * @param {String} [behaviorDescription.selector] DOM selector to remove
	 */
	this.removeBehavior = function(behaviorDescription) {
		var type = behaviorDescription.type,
			selector = behaviorDescription.selector,
			bindings = eventBindings[type];
		
		// If there is no selector to test, clear all events of type.
		if (!selector) {
			bindings = [];
		} else {
			for (var ii = bindings.length; ii > 0; ii--) {
				var thisBehavior = bindings[ii - 1];
				if (selector === thisBehavior.getSelector()) {
					bindings.splice(ii - 1, 1);
				}
			}
		}
		
		if (bindings.length === 0) {
			this.unbind(type);
		}
	};
	
	this.removeExactBehavior = function(behavior) {
		var type = behavior.getEventType(),
			bindings = eventBindings[type],
			index = bindings.indexOf(behavior);
		
		if (index !== -1) {
			bindings.splice(index, 1);
			
			if (bindings.length === 0) {
				this.unbind(type);
			}
			
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * Checks whether a behavior has already been added to the eventBindings object.
	 * 
	 * @param {mathSkills.events.Behavior} behavior The behavior to check.
	 * 
	 * @return {Boolean} true if the Behavior is already present, false otherwise.
	 */
	this.hasBehavior = function(behavior) {
		var type = behavior.getEventType(),
			bindings = this.getBindingsOfType(type),
			testBehavior;
		
		if (eventBindings[type] === undefined) {
			return false;
		}
		
		for (var ii = bindings.length; ii > 0; ii--) {
			testBehavior = bindings[ii - 1];
			if (behavior.equals(testBehavior)) {
				return true;
			}
		}
		
		return false;
	};
	
	/**
	 * Returns all the Behaviors bound to a particular event type.
	 * 
	 * @param {String} type The event type to check.
	 * 
	 * @return {mathSkills.events.Behavior[]} Array of Behaviors bound to the type.
	 */
	this.getBindingsOfType = function(type) {
		return eventBindings[type];
	};
	
	/**
	 * Returns all the names of all bound behaviors.
	 */
	this.getBehaviorNames = function() {
		var names = [];
		for (var key in eventBindings) {
			if (eventBindings.hasOwnProperty(key)) {
				var array = this.getBindingsOfType(key);
				for (var ii = array.length; ii > 0; ii--) {
					names.push(array[ii - 1].getName());
				}
			}
		}
		return names.join('\n');
	};
	
	/**
	 * Returns jQuery selector string for the container.
	 * 
	 * @return {String} jQuery selector for container.
	 */
	this.getContainer = function() {
		return container;
	};
};

/**
 * Sets the Controller to listen for a certain type of event on its container.
 * 
 * @param {String} type The event type to listen for.
 */
mathSkills.events.Controller.prototype.bind = function(type) {
	var self = this;
	$(self.getContainer()).on(type, { controller: self }, self.handler);
};

/**
 * Sets the Controller to stop listening for a certain type of event on its container.
 * 
 * @param {String} type The even type to stop listening for.
 */
mathSkills.events.Controller.prototype.unbind = function(type) {
	var self = this;
	$(self.getContainer()).off(type);
};

/**
 * Generic handler for all events delegated to the Controller.
 * It iterates over its bound Behaviors, evaluates their conditions, and calls
 * their callbacks if appropriate.
 * 
 * @param {Event} event Event object.
 */
mathSkills.events.Controller.prototype.handler = function(event) {
	var type = event.type;
	var controller = event.data.controller;
	var bindings = controller.getBindingsOfType(type);
	
	for (var ii = bindings.length; ii > 0; ii--) {
		var behavior = bindings[ii - 1];
		if (behavior.applies(event)) {
			(behavior.getCallback())(event);
		}
	}
};


// Instantiate a controller.
mathSkills.eventController = new mathSkills.events.Controller();