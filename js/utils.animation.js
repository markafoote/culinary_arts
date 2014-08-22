/**
 * @fileOverview Provides helper functions for animating DOM elements..
 * @author <a href="mailto:noah.j.freitas@gmail.com">Noah Freitas</a>
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for utility classes and functions 
 */
mathSkills.utils = mathSkills.utils || {};

/**
 * @namespace Namespace for animation utility functions.
 */
mathSkills.utils.animation = mathSkills.utils.animation || {};

/**
 * Animates the movement of one DOM element to another.
 * 
 * @param {HTMLElement} element The element to be moved.
 * @param {HTMLElement} target The element to be moved to.
 * @param {Object} [options] Configuration options.
 * @param {Number} [options.speed=1000] Animation speed in milliseconds.
 * @param {Function} [options.callback] Function to call when animation
 * 		is complete.  Pass a reference to the function itself.
 * @param {Boolean} [options.removeElement=true] Flag indicating whether the
 * 		moved element should be removed from the DOM once the animation
 * 		is complete.
 * @param {Boolean} [options.cloneMove=false] Flag indicating whether the original
 * 		element should be cloned and the clone should be moved rather than the
 * 		original.
 * 
 * @example
 * // Get your moving element.
 * var draggable = $('.draggable:first');
 * // Get your target.
 * var droppable = $('.droppable:first');
 * 
 * // Define a callback function.  Notice the use of a closure to allow the callback
 * // to refer to variables within the current scope.
 * var callback = (function() {
 * 	return function() {
 * 		droppable.html('<span>'+draggable.text()+'</span>').removeClass('empty');
 * 		draggable.remove();
 * 		if ($('.draggable').length === 0) {
 * 			mathSkills.widgets.Problem.nextWorkbookStep();
 * 		}
 * 	};
 * })();
 * 
 * // Call the move function.  A reference to the callback function is passed in.
 * // removeElement is set to false since the callback handles the removal itself.
 * mathSkills.utils.animation.move(draggable, droppable, { 
 * 	removeElement: false, 
 * 	callback: callback 
 * });
 */
mathSkills.utils.animation.move = function(element, target, options) {
	// Setup some parameters
	var speed = options.speed || 1000;
	var removeEl = options.removeElement || true;
	var cloneMove = options.cloneMove || false;
	var moveEl = element;
	
	if (cloneMove) {
		moveEl = $(element).clone().appendTo($(element).parent());
	}
	
	// Move the element.
	$(moveEl).css({
		position: 'absolute',
		top: $(element).position().top,
		left: $(element).position().left
	}).animate({
		left : $(target).position().left,
		top : $(target).position().top
	}, speed, function() {
		// Call the passed in callback if it exists.
		if (typeof options.callback === 'function') {
			options.callback();
		}
		// Remove the moved element if appropriate.
		if (removeEl) {
			$(moveEl).remove();
		}
	});
};

/**
 * Scrolls the viewport to the bottom of the document.
 * 
 * @param {Number} [speed=1000] Animation speed in milliseconds.
 * 
 * @example
 * mathSkills.utils.animation.scrollToBottom();
 */
mathSkills.utils.animation.scrollToBottom = function(speed) {
	var animSpeed = speed || 1000;
	$("html, body").animate({ scrollTop: $(document).height() }, animSpeed);
};

/**
 * Provides visual feedback for an incorrect answer.
 * 
 * @param {DOMElement} el DOM element that requires feedback.
 * 
 * @example
 * mathSkills.utils.animation.incorrectFeedback($(this));
 */
mathSkills.utils.animation.incorrectFeedback = function(el, dontClear) {
	var element = $(el);
	element.addClass('incorrect').animate({ backgroundColor: '#ff3333' }, 500, function() {
		element.animate({ backgroundColor: 'white' }, 1000);
		if (dontClear !== true) {
			element.val('');
		}
	}); 
};

/**
 * Provides visual feedback for a correct answer.
 * 
 * @param {DOMElement} el DOM element that requires feedback.
 * 
 * @example
 * mathSkills.utils.animation.correctFeedback($(this));
 */
mathSkills.utils.animation.correctFeedback = function(el) {
	var element = $(el);
	element.removeClass('incorrect').css('backgroundColor', '#33ff33');
};

mathSkills.utils.animation.helpFeedback = function(el) {
	$(el).animate({'background-color': '#33ff33'}, 500, function() {
		$(el).animate({'background-color': 'white'}, 1500);
	});
};

/**
 * Focuses on an input and provides visual feedback.
 * 
 * @param {DOMElement} el DOM element that requires feedback.
 * 
 * @example
 * mathSkills.utils.animation.focusFeedback($(this));
 */
mathSkills.utils.animation.focusFeedback = function(el) {
	var element = $(el);
	element.focus().css('background-color', 'yellow').animate({'background-color': 'white'}, 1000);
};


mathSkills.utils.animation.bounceRight = function(el) {
	// Wrapped in a timeout to fix Firefox bug.
	window.setTimeout(function() {
		$(el).effect('bounce', {
			direction: 'right',
			distance: 30,
			times: 3
		});
	}, 0);
};
