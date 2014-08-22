/**
 * @fileOverview Contains all objects and functions for mathSkills.widgets.workbook
 * and mathSkills.widgets.Workbook.
 * @author <a href="mailto:noah@threepiecedesign.com">Noah Freitas</a>
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for visual widgets.
 */
mathSkills.widgets = mathSkills.widgets || {};

/**
 * @namespace Namespace for workbook visual widget.
 */
mathSkills.widgets.workbook = mathSkills.widgets.workbook || {};

/**
 * @class <h2>Workbook Visual Class</h2>
 * Creates a workbook widget composed of {@link mathSkills.widgets.Problem}s.
 */
mathSkills.widgets.Workbook = function(con, problemArgs) {
	var problems = [],
		container,
		currentProblem = 0;
	
	// Defined here so that it can be called from within the constructor.
	// It is added to the public interface below.
	var addProblem = function(problem) {
		if (problem.constructor === mathSkills.widgets.Problem) {
			problems.push(problem);
		} else {
			throw {
				name: 'TypeError',
				message: 'addProblem() expects an argument of type mathSkills.widgets.Problem'
			};
		}
	};
	
	if ($(con).length === 1) {
		container = $(con);
		$(con).addClass('pojo').get(0).pojo = this;
	} else {
		throw {
			name: 'WorkbookContainerError',
			message: 'The container specifier "' + con + '" matches ' + $(con).length + ' DOM elements.'
		};
	}
	
	if (problemArgs !== undefined) {
		if (mathSkills.utils.isArray(problemArgs)) {
			for (var ii = 0, len = problemArgs.length; ii < len; ii++) {
				addProblem(problemArgs[ii]);
			}
		} else {
			throw {
				name: 'TypeError',
				message: 'The workbook expects a second argument that is an array of Problem objects.'
			};
		}
	}
	
	this.getContainer = function() {
		return container;
	};
	
	this.addProblem = addProblem;
	
	this.addProblems = function(problems) {
		if (mathSkills.utils.isArray(problems)) {
			for (var ii = 0, len = problems.length; ii < len; ii++) {
				addProblem(problems[ii]);
			}
		} else {
			throw {
				name: 'TypeError',
				message: 'addProblems() expects an argument that is an array of Problem objects.'
			};
		}
		this.initialize();
	};
	
	this.getCurrentProblem = function() {
		return problems[currentProblem];
	};
	
	this.getNextProblem = function() {
		if (this.hasNextProblem()) {
			return problems[++currentProblem];
		} else {
			return false;
		}
	};
	
	this.getPreviousProblem = function() {
		if (problems[currentProblem - 1] !== undefined) {
			return problems[currentProblem - 1];
		} else {
			return false;
		}
	};
	
	this.hasNextProblem = function() {
		return problems[currentProblem + 1] !== undefined;
	};
	
	this.numberOfProblems = function() {
		return problems.length;
	};
	
	this.resetProblems = function() {
		currentProblem = 0;
	};
	
	this.initialize();
	
	mathSkills.workbook = this;
};

mathSkills.widgets.Workbook.nextStepHandler = function() {
	mathSkills.workbook.nextStep();
};

mathSkills.widgets.Workbook.prototype.nextStep = function() {
	var currentProblem = this.getCurrentProblem(),
		$currentProblemEl = $(currentProblem.getDomElement()),
		nextProblem,
		previousProblem = this.getPreviousProblem();
		
	// Fire off update event.
	$('#visual').trigger('updateVisual', mathSkills.workBookAnswer);
	
	// Cross out any previous workbook steps whose answers don't carry through.
	if (previousProblem) {
		$(previousProblem.getDomElement()).find('.measurement span').each(function() {
			var jThis = $(this);
			if (jThis.data('strikethrough') === true) {
				jThis.html('<del>'+jThis.text()+'</del>');
			}
		});
	}
	
	// Deactivate events for the current problem.
	currentProblem.deActivate();
	
	// Clean up this step.
	$currentProblemEl
		.addClass('complete')
		.removeClass('current');
	
	if (currentProblem.getSummary()) {
		$currentProblemEl.html('<h2>'+currentProblem.getSummary()+'</h2>');
	} else {
		$currentProblemEl.html('').addClass('empty');
	}
	
	if (this.hasNextProblem()) {			
		nextProblem = this.getNextProblem();
		
		// Open the next step.
		$(nextProblem.getDomElement()).addClass('current').delay(300).show(500, function() {
			mathSkills.utils.animation.scrollToBottom();
			mathSkills.utils.animation.focusFeedback(mathSkills.workbook.getNextFocus());
			mathSkills.widgets.workbook.addOverlayMessage();
		});
		
		// Activate events for the next problem.
		nextProblem.activate();
	} else {
		this.close();
	}
};

mathSkills.widgets.Workbook.prototype.close = function() {
	// Focus on the first incorrect answer if any, otherwise focus on the first answer.
	if ($('#answer input.incorrect').length === 0) {
		mathSkills.utils.animation.focusFeedback($('#answer input:first'));
	} else {
		mathSkills.utils.animation.focusFeedback($('#answer input.incorrect:first'));
	}

	// Remove the overlay and the event handler that creates it.
	$('#workbook').off('focusin click').addClass('complete');
	$('#overlay').click();
};

mathSkills.widgets.Workbook.prototype.open = function() {
	// Show the workbook.
	$('#workbook').delay(300).show(500, function() {
		// Make sure the page scrolls down if necessary.
		mathSkills.utils.animation.scrollToBottom();
		
		// Click on the workbook so that it gains focus.
		$('#workbook').click();
		
		// Focus on the first input box in the workbook.
		mathSkills.utils.animation.focusFeedback(mathSkills.workbook.getNextFocus());
	});
	
	// Activate events for the current problem.
	mathSkills.workbook.getCurrentProblem().activate();
	
	// Hide the final answer area help button.
	$('#answer .helpButton').hide()
		// Animate the final answer button into a more central position.
		.siblings('.answerButton:first').html('Check Final Answer').animate({ 
			top: '60px', 
			marginRight: '0' 
		});
};

mathSkills.widgets.Workbook.prototype.initialize = function() {
	var problem = this.getCurrentProblem();
	
	if (this.numberOfProblems() > 0) {
		this.render();
		
		// Queue up the behaviors for all the problems.
		do {
			problem.queueBehaviors();
			problem = this.getNextProblem();
		} while (problem);
		
		// Reset the problem iterator.
		this.resetProblems();
	}
};

mathSkills.widgets.Workbook.prototype.getNextFocus = function() {
	var problemElement = $(this.getCurrentProblem().getDomElement());
	
	if (problemElement.find('input.incorrect:visible').length > 0) {
		return problemElement.find('input.incorrect:visible:first');
	} else {
		return problemElement.find('input:visible:first');
	}
};

mathSkills.widgets.Workbook.prototype.render = function() {
	// Make sure we start at problem 1.
	this.resetProblems();
	
	var problem = this.getCurrentProblem(),
		sectionEl, 
		frag = document.createDocumentFragment(),
		counter = 1,
		domId;
	
	// Iterate over all the workbook problems, for each:
	//   - Create a containing section element.
	//   - Store a reference to the problem object in the 'pojo' property of that DOM element.
	//   - Create an ID for the step.
	//   - Store that ID in the problem object.
	//   - Set the ID on the DOM element.
	//   - Append the section element to our document fragment.
	do {
		sectionEl = document.createElement('section');
		sectionEl.pojo = problem;
		domId = 'workbookStep_'+counter;
		problem.setDomId(domId);
		$(sectionEl).addClass('pojo panel').attr('id', domId).append(problem.getHtml());
		if (counter === 1) {
			$(sectionEl).addClass('current');
		} else {
			$(sectionEl).css('display', 'none');
		}
		frag.appendChild(sectionEl);
		
		// Setup next problem
		problem = this.getNextProblem();
		counter++;
	} while (problem);
	
	// Reset the problem iterator.
	this.resetProblems();
	
	// Append our document fragment to the workbook container.
	this.getContainer().append(frag);
	
	// Refactor and integrate with event system.
	$('.answerWidget').on('updateAnswer', null, null, mathSkills.widgets.Problem.updateAnswerWidget);
	$('#workbook').on('focusin click', null, null, mathSkills.widgets.workbook.focusInHandler);
};

// Event Handlers

mathSkills.widgets.workbook.focusInHandler = function() {
	var wb = mathSkills.workbook;
	
	// If we don't already have an overlay, add one.
	if ($('#overlay').length === 0) {
		// Add the overlay to the DOM.
		$('<div id=overlay></div>').appendTo('body');
		
		// Add the overlay message.
		mathSkills.widgets.workbook.addOverlayMessage();
		
		// Add an overlay class to the workbook and visual.
		$(wb.getContainer().parent()).addClass('overlay');
		$('#visual').addClass('overlay');
		
		// Add the event listener to remove the overlay.
		$('#overlay').click(function() {
			$(this).remove();
			$(wb.getContainer().parent()).removeClass('overlay');
			$('#visual').removeClass('overlay');
			
			// Focus on the first appropriate input of the final answer.
			if ($('#answer input.incorrect').length === 0) {
				$('#answer input:first').focus();
			} else {
				$('#answer input.incorrect:first').focus();
			}
		});
		
		// Focus on the first appropriate input of the workbook.
		mathSkills.utils.animation.focusFeedback(wb.getNextFocus());
	}
};

mathSkills.widgets.workbook.addOverlayMessage = function() {
	$('#overlay').html('<div>Click on the answer box at any time to enter your final answer.<span class=arrow>&rarr;</span></div>');
	
	// Position the message appropriately.
	var bottomOffset = $(document).height() - (($('#problemContainer').offset()).top + $('#problemContainer').height()) - 50;
	$('#overlay div').css('bottom', bottomOffset+'px');
	
	// After 3 seconds fade out the message.
	window.setTimeout(function() {
		$('#overlay div')
			.css('textShadow', 'none')
			.animate({ color: '#333' }, 1000, function() { 
				$(this).remove(); 
			});
	}, 3000);
};

mathSkills.widgets.workbook.validateCurrentProblem = function(event) {
	var problem = mathSkills.workbook.getCurrentProblem(),
		correct = problem.validate();
	
	return correct;
};
