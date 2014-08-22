/**
 * @fileOverview Contains all objects and functions for mathSkills.widgets.Problem
 * and mathSkills.widgets.problem.
 * @author Noah Freitas
 * @version 1.0
 */

/**
 * @namespace Namespace for entire application.
 */
var mathSkills = mathSkills || {};

/**
 * @namespace Namespace for widgets.
 */
mathSkills.widgets = mathSkills.widgets || {};

/**
 * @namespace Namespace for problem widgets.
 */
mathSkills.widgets.problem = mathSkills.widgets.problem || {};

/**
 * Holds all the constant information for the different types of problems.
 * @constant
 */
mathSkills.widgets.problem.types = {
	ADDITION: {
		name: 'addition', 
		action: 'add', 
		symbol: '+', 
		operands: 2
	},
	SUBTRACTION: {
		name: 'subtraction', 
		action: 'subtract', 
		symbol: '-', 
		operands: 2
	},
	DIVISION: {
		name: 'division', 
		action: 'divide', 
		symbol: '/', 
		operands: 2
	},
	MULTIPLICATION: {
		name: 'multiplication', 
		action: 'multiply', 
		symbol: '*', 
		operands: 2
	},
	SELECTION: {
		name: 'selection', 
		action: 'select', 
		symbol: '', 
		operands: 0
	},
	DRAG_AND_DROP: {
		name: 'drag and drop', 
		action: 'drag and drop', 
		symbol: '', 
		operands: 0
	},
	LONG_DIVISION: {
		name: 'long division', 
		action: 'divide', 
		symbol: '', 
		operands: 2
	},
	LONG_DIVISION_ANSWER: {
		name: 'long division answer', 
		action: 'divide', 
		symbol: '', 
		operands: 2
	},
	SIMPLIFICATION: {
		name: 'simplification',
		action: 'simplify',
		symbol: '',
		operands: 0
	},
	DIMENSION_ANALYSIS: {
		name: 'dimensional analysis',
		action: 'convert',
		symbol: '',
		operands: 0
	},
	EQUIV_FRACTION: {
		name: 'equivalency fraction',
		action: 'choose fraction',
		symbol: '',
		operands: 2
	},
	YES_NO_QUESTION: {
		name: 'yes/no',
		action: 'choose yes or no',
		symbol: '',
		operands: 0
	},
	CANCEL_UNITS: {
		name: 'cancel units',
		action: 'cancel units',
		symbol: '',
		operands: 0
	},
	EQUIV_FRACTION_SUMMARY: {
		name: 'equivalency fraction summary',
		action: 'enter answer',
		symbol: '',
		operands: 2
	}
};

mathSkills.widgets.Problem = function() {
	var domId,
		type,
		instructions,
		summary,
		incorrect,
		help,
		leadingSpaces,
		answer = [],
		operands = [],
		behaviors = [];
	
	this.getDomId = function() {
		return domId;
	};
	
	this.setDomId = function(id) {
		domId = id;
		return this;
	};
	
	this.getType = function() {
		return type;
	};
	
	this.setType = function(ty) {
		var valid = false,
			types = mathSkills.widgets.problem.types,
			problemType;
			
		for (problemType in types) {
			if (ty === types[problemType]) {
				valid = true;
			}
		}
		
		if (valid) {
			type = ty;
			return this;
		} else {
			throw {
				name: 'TypeError',
				message: 'setType() expects a parameter from mathSkills.widgets.problem.types'
			};
		}
	};
	
	this.getInstructions = function() {
		return instructions;
	};
	
	this.setInstructions = function(instruct) {
		instructions = instruct;
		return this;
	};
	
	this.getSummary = function() {
		return summary;
	};
	
	this.setSummary = function(sum) {
		summary = sum;
		return this;
	};
	
	this.getIncorrect = function() {
		return incorrect;
	};
	
	this.setIncorrect = function(incor) {
		incorrect = incor;
		return this;
	};
	
	this.getHelp = function() {
		return help;
	};
	
	this.setHelp = function(he) {
		help = he;
		return this;
	};
	
	this.getLeadingSpaces = function() {
		return leadingSpaces;
	};
	
	this.setLeadingSpaces = function(spaces) {
		leadingSpaces = spaces;
		return this;
	};
	
	this.getAnswer = function() {
		return answer;
	};
	
	this.setAnswer = function(ans) {
		if (mathSkills.utils.isArray(ans)) {
			answer = ans;
			return this;
		} else {
			throw {
				name: 'TypeError',
				message: 'Problem.setAnswer() expects an array'
			};
		}
	};
	
	this.setAnswerDomId = function(index, id) {
		if (typeof id !== 'string') {
			throw {
				name: 'TypeError',
				message: 'Problem.setAnswerDomId() expects a string for the "id" parameter'
			};
		}
		if (answer[index] === undefined) {
			throw {
				name: 'IndexOutOfBoundsError',
				message: 'You are attempting to set the domId for an answer that does not exist in the answer array.'
			};
		}
		answer[index].domId = id;
		return this;
	};
	
	this.getAnswerDomElement = function(index) {
		return document.getElementById(answer[index].domId);
	};
	
	this.getOperands = function() {
		return operands;
	};
	
	this.setOperands = function(ops) {
		if (mathSkills.utils.isArray(ops)) {
			operands = ops;
			this.solve();
			return this;
		} else {
			throw {
				name: 'TypeError',
				message: 'Problem.setOperands() expects to be passed an array'
			};
		}
	};
	
	this.addBehavior = function(behavior) {
		if (behavior.constructor === mathSkills.events.Behavior) {
			behaviors.push(behavior);
			return this;
		} else {
			throw {
				name: 'TypeError',
				message: 'Problem.addBehavior() expects a parameter of type mathSkills.events.Behavior'
			};
		}
	};
	
	this.getBehaviors = function() {
		return behaviors;
	};
};

mathSkills.widgets.Problem.prototype.activate = function() {
	var behaviors = this.getBehaviors(),
		controller = mathSkills.eventController;
	
	for (var ii = behaviors.length - 1; ii >= 0; ii--) {
		controller.addBehavior(behaviors[ii]);
	}
};

mathSkills.widgets.Problem.prototype.deActivate = function() {
	var behaviors = this.getBehaviors(),
		controller = mathSkills.eventController;
	
	for (var ii = behaviors.length - 1; ii >= 0; ii--) {
		controller.removeExactBehavior(behaviors[ii]);
	}
};

mathSkills.widgets.Problem.prototype.queueBehaviors = function() {
	var typeName = this.getType().name;
	
	switch(typeName) {
		case 'addition' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Help Button Click',
				eventType: 'click',
				selector: '#workbook .helpButton',
				callback: mathSkills.widgets.Problem.workBookHelpButtonHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Enter Key Behavior',
				eventType: 'keyup',
				selector: '#workbook input',
				condition: [
					mathSkills.events.behavior.CONDITIONS.enterKey,
					mathSkills.widgets.workbook.validateCurrentProblem
				],
				conditionFailure: [
					null,
					mathSkills.widgets.Problem.doIncorrectWorkbookAnswer
				],
				callback: mathSkills.widgets.Workbook.nextStepHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Answer Button Click',
				eventType: 'click',
				selector: '#workbook .answerButton',
				condition: mathSkills.widgets.workbook.validateCurrentProblem,
				conditionFailure: mathSkills.widgets.Problem.doIncorrectWorkbookAnswer,
				callback: mathSkills.widgets.Workbook.nextStepHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Addition Problem, Work It Out, Any Input Any Key',
				eventType: 'keyup',
				selector: '#workbook table.addition.problemWidget input',
				callback: mathSkills.widgets.Problem.triggerAnswerWidgetUpdate
			}));
			break;
		
		case 'subtraction' :
			break;
		
		case 'multiplication' :
			break;
		
		case 'division' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Help Button Click',
				eventType: 'click',
				selector: '#workbook .helpButton',
				callback: mathSkills.widgets.Problem.workBookHelpButtonHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Enter Key Behavior',
				eventType: 'keyup',
				selector: '#workbook input',
				condition: [
					mathSkills.events.behavior.CONDITIONS.enterKey,
					mathSkills.widgets.workbook.validateCurrentProblem
				],
				conditionFailure: [
					null,
					mathSkills.widgets.Problem.doIncorrectWorkbookAnswer
				],
				callback: mathSkills.widgets.Workbook.nextStepHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Answer Button Click',
				eventType: 'click',
				selector: '#workbook .answerButton',
				condition: mathSkills.widgets.workbook.validateCurrentProblem,
				conditionFailure: mathSkills.widgets.Problem.doIncorrectWorkbookAnswer,
				callback: mathSkills.widgets.Workbook.nextStepHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Division Problem, Work It Out, Quotient Any Key',
				eventType: 'keyup',
				selector: '#workbook table.division.problemWidget input.quotient',
				callback: mathSkills.widgets.Problem.updateProblemWidget
			}));
			break;
		
		case 'selection' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Show Me Button Click - Selection',
				eventType: 'click',
				selector: '#workbook .showMeButton.selection',
				callback: mathSkills.widgets.Problem.showSelection
			}));
			break;
		
		case 'drag and drop' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Show Me Button Click - Draggable',
				eventType: 'click',
				selector: '#workbook .showMeButton.drag',
				callback: mathSkills.widgets.Problem.moveDraggable
			}));
			break;
		
		case 'long division' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Any Key Behavior',
				eventType: 'keyup',
				selector: '#workbook table.division .quotient input',
				condition: mathSkills.problems.LongDivision.quotientCondition,
				callback: mathSkills.problems.LongDivision.workbookDivisionInputHandler
			}));

			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Enter Key Behavior',
				eventType: 'keyup',
				selector: '#workbook table.division tr.body input',
				condition: [
					mathSkills.events.behavior.CONDITIONS.enterKey,
					mathSkills.problems.LongDivision.validateWorkbookStep
				],
				callback: mathSkills.problems.LongDivision.workbookDivisionInputHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Number key entered',
				eventType: 'keypress',
				selector: '#workbook table.division tr.body input',
				condition: mathSkills.events.behavior.CONDITIONS.numberKey,
				callback: mathSkills.problems.LongDivision.moveToNextDivisionInput
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Help Button Click',
				eventType: 'click',
				selector: '#workbook .helpButton',
				callback: mathSkills.problems.LongDivision.fillInDivisionInputs
			}));
			break;
		
		case 'equivalency fraction' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Answer Button Click',
				eventType: 'click',
				selector: '#workbook .answerButton',
				condition: mathSkills.widgets.workbook.validateCurrentProblem,
				conditionFailure: mathSkills.widgets.Problem.doIncorrectWorkbookAnswer,
				callback: mathSkills.widgets.Workbook.nextStepHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Workbook Help Button Click',
				eventType: 'click',
				selector: '#workbook .helpButton',
				callback: mathSkills.widgets.Problem.workBookHelpButtonHandler
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Equivalency Fraction Help Widget Select Change',
				eventType: 'change',
				selector: '#workbook .help select',
				callback: mathSkills.widgets.Problem.eqFractionSelectChange
			}));
			break;
		
		case 'yes/no' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Yes/No Choice',
				eventType: 'click',
				selector: '#workbook button.yes, #workbook button.no',
				callback: mathSkills.widgets.Problem.yesNoButtonClick
			}));
			break;
			
		case 'cancel units' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Cancel DA Units',
				eventType: 'click',
				selector: '#workbook .clickableUnit',
				callback: mathSkills.widgets.Problem.cancelUnitClick
			}));
			break;
		
		// Some final answer cases.
		case 'long division answer' :
		case 'simplification' :
		case 'dimensional analysis' :
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Final Answer Help Button Click',
				eventType: 'click',
				selector: '#answer .helpButton',
				condition: mathSkills.widgets.Problem.validateFinalAnswer,
				conditionFailure: mathSkills.workbook.open,
				callback: mathSkills.workbook.open
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Final Answer Button Click',
				eventType: 'click',
				selector: '#answer .answerButton',
				condition: mathSkills.widgets.Problem.validateFinalAnswer,
				conditionFailure: mathSkills.widgets.Problem.doIncorrectFinalAnswer,
				callback: mathSkills.widgets.Problem.doCorrectFinalAnswer
			}));
			
			this.addBehavior(new mathSkills.events.Behavior({
				name: 'Final Answer Inputs Enter Key Pressed',
				eventType: 'keyup',
				selector: '#answer input[type=text]',
				condition: [
					mathSkills.events.behavior.CONDITIONS.enterKey,
					mathSkills.widgets.Problem.validateFinalAnswer
				],
				conditionFailure: [
					null,
					mathSkills.widgets.Problem.doIncorrectFinalAnswer
				],
				callback: mathSkills.widgets.Problem.doCorrectFinalAnswer
			}));
			break;
	}
	
	return this;
};

mathSkills.widgets.Problem.prototype.getHtml = function() {
	var html = ['<h2 class=label>'+this.getInstructions()+'</h2>'], 
		type = this.getType(),
		operands = this.getOperands(),
		leadingSpaces = this.getLeadingSpaces(),
		elId, ii, len;
		
	switch (type.name) {
		case 'addition' :
			html.push('<div style="display: none;" class=help><h1>Work It Out</h1>');
			html.push('<h2>'+this.getHelp()+'</h2>'+this.getProblemWidget()+'</div>');			
			html.push('<br><span class=label>'+operands[0].value+' '+operands[0].unit);
			html.push(' '+type.symbol+' '+operands[1].value);
			html.push(' '+operands[1].unit);
			html.push('</span>');
			html.push('<span class="measurement answerWidget"><span style="font-size: 250%">=</span> ');
			for (ii = 0, len = leadingSpaces; ii < len; ii++) {
				html.push('<span class=value></span> <span class=unit></span>');
			}			
			elId = 'addition_' + mathSkills.utils.randomId();
			this.setAnswerDomId(0, elId);
			html.push('<input class=value type=text id='+elId+'>');
			html.push('<label class=unit>'+operands[1].plural+'</label></span>');
			html.push('<button class=helpButton>Help</button>');
			html.push('<button class=answerButton>Check Answer</button>');			
			break;
		
		case 'subtraction' :
			
			break;
		
		case 'multiplication' :
			
			break;
		
		case 'division' :
			html.push('<div style="display: none;" class=help><h1>Work It Out</h1><h2>'+this.getHelp()+'</h2>'+this.getProblemWidget()+'</div>');
			html.push('<br><span class=label>'+operands[0].value+' '+operands[0].unit);
			html.push('</span>');
			html.push('<span class="measurement answerWidget"><span style="font-size: 250%">=</span> ');
			for (ii = 0, len = leadingSpaces; ii < len; ii++) {
				html.push('<span class=value></span> <span class=unit></span>');
			}			
			elId = 'division_' + mathSkills.utils.randomId();
			html.push('<input class=value type=text id='+elId+'>');
			this.setAnswerDomId(0, elId);
			html.push('<label class=unit>'+operands[1].unit+'</label>');
			elId = 'division_' + mathSkills.utils.randomId();
			html.push('<input class=value type=text id='+elId+'>');
			this.setAnswerDomId(1, elId);
			html.push('<label class=unit>'+operands[0].unit+'</label></span>');
			html.push('<button class=helpButton>Help</button>');
			html.push('<button class=answerButton>Check Answer</button>');
			break;
		
		case 'drag and drop' :
			html.push('<br><span class=label><span class="draggable '+operands[1].unit+'">'+operands[1].value+'</span>');
			html.push('<span class="draggable '+operands[0].unit+'">'+operands[0].value+'</span></span>');
			html.push('<span class="measurement answerWidget">');
			html.push('<table><tr><td class="droppable empty">'+operands[0].unit+'</td>');
			html.push('<td class="droppable empty divisionBox">'+operands[1].unit+'</td></tr></table>');
			html.push('</span>');
			html.push('<button class="showMeButton drag">Show Me</button>');
			
			// Refactor this and integrate it with the event system.
			
			// Also figure out how to log "incorrect" drops for the points system.
			window.setTimeout(function() {
				$('.draggable').draggable({ 
					revert: 'invalid', 
					snap: '.droppable', 
					snapMode: 'inner', 
					containment: '#workbook'
				}); 
				$('.droppable').each(function() { 
					var acceptable = '.'+$(this).text();
					$(this).droppable({ 
						accept: acceptable, 
						drop: function(event, ui) { 
							$(this).html("<span>"+ui.draggable.text()+"</span>").removeClass('empty');
							ui.draggable.remove(); 
							if ($('.draggable').length === 0) { 
								mathSkills.workbook.nextStep(); 
							}
						} 
					}); 
				});
			}, 1000);
			
			break;
			
		case 'selection' :
			html.push('<span class="measurement answerWidget">');
			html.push('<table class=division><tr><td>'+operands[0].value+'</td>');
			html.push('<td class=divisionBox>'+operands[1].value+'</td></tr></table>');
			html.push('</span>');
			html.push('<button class="showMeButton selection">Show Me</button>');
			
			// Refactor and integrate with event system.
			window.setTimeout(function() {
				$('.selectable').selectable({ 
					stop: mathSkills.widgets.Problem.workBookSelectHandler 
				});
			}, 1000);
			
			break;
		
		case 'long division' :
			// Build HTML.
			var firstQuotient = this.getAnswer()[0].quotient;
			html.push('<span class="measurement answerWidget">');
			html.push('<table class=division><tr><td></td><td class=quotient>');
			for (ii = leadingSpaces; ii > 0; ii--) {
				html.push('<span class=numberUnit></span>');
			}
			html.push('<span class=numberUnit>');
			html.push('<input class=value type=text data-answer='+firstQuotient+'>');
			html.push('</span></td></tr>');
			html.push('<tr><td class=divisor>'+operands[0].value+'</td>');
			html.push('<td class="divisionBox dividend">'+operands[1].value+'</td></tr></table>');
			html.push('</span>');
			html.push('<span class=helpMessage></span>');
			html.push('<button class=helpButton>Help</button>');
			
			// Store the workbookStepPieces
			mathSkills.workbookStepPieces = this.getAnswer();
			break;
		
		case 'equivalency fraction' :
			html.push('<div style="display: none;" class=help><h1>Work It Out</h1>');
			html.push('<h2>'+this.getHelp()+'</h2>'+this.getProblemWidget()+'</div>');
			html.push('<br>');
			for (ii = 0, len = operands.length; ii < len; ii++) {
				if (ii !== 0) {
					html.push('<span class=symbol>*</span>');
				}
				// If this operand has a value property within the first array, assume it's static.
				if (operands[ii][0].value !== undefined) {
					html.push('<span class=eqFraction>');
						html.push('<span class=numerator>');
							html.push(operands[ii][0].value+' '+operands[ii][0].unit);
						html.push('</span>');
						html.push('<span class=denominator>');
							html.push(operands[ii][1].value+' '+operands[ii][1].unit);
						html.push('</span>');
					html.push('</span>');
				// Otherwise assume it requires user input.
				} else {
					html.push('<span class=eqFraction>');
						html.push('<span class="numerator select">');
							elId = 'eqFraction_' + mathSkills.utils.randomId();
							this.setAnswerDomId(0, elId);
							html.push('<select id='+elId+'>');
								html.push('<option>??</option>');
							for (var jj = 0, jLen = operands[ii][0].length; jj < jLen; jj++) {
								html.push('<option>');
									html.push(operands[ii][0][jj].value+' '+operands[ii][0][jj].unit);
								html.push('</option>');
							}
							html.push('</select>');
						html.push('</span>');
						html.push('<span class="denominator select">');
							elId = 'eqFraction_' + mathSkills.utils.randomId();
							this.setAnswerDomId(1, elId);
							html.push('<select id='+elId+'>');
								html.push('<option>??</option>');
							for (jj = 0, jLen = operands[ii][1].length; jj < jLen; jj++) {
								html.push('<option>');
									html.push('1 '+operands[ii][1][jj].unit);
								html.push('</option>');
							}
							html.push('</select>');
						html.push('</span>');
					html.push('</span>');
				}
			}
			html.push('<button class=helpButton>Help</button>');
			html.push('<button class=answerButton>Check Answer</button>');
			break;
			
		case 'yes/no' :
			html.push('<button class=yes>Yes</button>');
			html.push('<button class=no>No</button>');
			html.push('<div style="display: none;" class=incorrect>'+this.getIncorrect()+'</div>');
			break;
			
		case 'cancel units' :
			html.push('<br>');
			for (ii = 0, len = operands.length; ii < len; ii++) {
				if (ii !== 0) {
					html.push('<span class=symbol>*</span>');
				}
				html.push('<span class=eqFraction>');
					html.push('<span class=numerator>');
						html.push(operands[ii][0].value+' ');
						if (operands[ii][0].className) {
							html.push('<span class=clickableUnit data-unit="'+operands[ii][0].className+'">');
							html.push(operands[ii][0].unit+'</span>');
						} else {
							html.push(operands[ii][0].unit);
						}
					html.push('</span>');
					html.push('<span class=denominator>');
						html.push(operands[ii][1].value+' ');
						if (operands[ii][1].className) {
							html.push('<span class=clickableUnit data-unit="'+operands[ii][1].className+'">');
							html.push(operands[ii][1].unit+'</span>');
						} else {
							html.push(operands[ii][1].unit);
						}
					html.push('</span>');
				html.push('</span>');
			}
			html.push('<button class=helpButton>Help</button>');
			break;
			
		case 'equivalency fraction summary' :
			html.push('<br>');
			for (ii = 0, len = operands.length; ii < len; ii++) {
				if (ii + 1 === len) {
					html.push('<span class=symbol>=</span>');
				} else if (ii !== 0) {
					html.push('<span class=symbol>*</span>');
				}
				html.push('<span class=eqFraction>');
					html.push('<span class=numerator>');
						html.push(operands[ii][0].value);
						if (operands[ii][0].unit) {
							html.push(' '+operands[ii][0].unit);	
						}
					html.push('</span>');
					html.push('<span class=denominator>');
						html.push(operands[ii][1].value);
						if (operands[ii][1].unit) {
							html.push(' '+operands[ii][1].unit);
						}
					html.push('</span>');
				html.push('</span>');
			}
			break;
			
		default : break;
	}
	
	return html.join('');
};

/**
 * Generates a "Work It Out" widget for the current problem.
 * 
 * @return {String} The HTML representation of the widget.
 * 
 * @example
 * var problem = new mathSkills.widgets.Problem({
 * 	// init object goodies.
 * });
 * var workItOutHtml = problem.getProblemWidget();
 */
mathSkills.widgets.Problem.prototype.getProblemWidget = function() {
	var html, answer,
		type = this.getType(),
		operands = this.getOperands();
	
	switch(type.name) {
		
		case 'division' :
			answer = Math.floor(operands[0].value / operands[1].value);
			var remainder = operands[0].value % operands[1].value;
			html = ['<table class="division problemWidget"><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>'];
			html.push('<input type=text class="helper quotient" data-value="'+answer+'" placeholder=?></td>');
			html.push('</tr><tr><td class=division1><span class="value divisor">'+operands[1].value+'</span> ');
			html.push('<span class=unit>'+operands[0].plural+'</span></td><td class=spacer>&nbsp;</td>');
			html.push('<td class=division2><span class="value dividend">'+operands[0].value+' </span>');
			html.push(operands[0].plural+'</td>');
			html.push('<tr class=subtrahendRow></tr>');
			html.push('</tr><tr class=remainderRow><td>&nbsp;</td><td>&nbsp;</td>');
			html.push('<td class=remainder><input type=text class=helper data-value="'+remainder+'" placeholder=?></td>');
			html.push('</tr></tbody></table>');			
			return html.join('');
			
		case 'addition' :
			answer = operands[0].value + operands[1].value;
			html = ['<table class="addition problemWidget"><tr><td>&nbsp;</td>'];
			html.push('<td><span class=value>'+operands[0].value+'</span> ');
			html.push(operands[0].plural+'</td></tr>');
			html.push('<tr><td><span style="font-size: 200%;">+</span></td>');
			html.push('<td><span class=value>'+operands[1].value+'</span> ');
			html.push(operands[1].plural+'</td></tr>');
			html.push('<tr class=answer><td>&nbsp;</td><td>');
			html.push('<input type=text class=helper data-value="'+answer+'" placeholder=?>');
			html.push(' '+operands[0].plural+'</td></tr></table>');			
			return html.join('');
		
		case 'equivalency fraction' :
			var lastOperand = operands.pop();
			operands.push(lastOperand);
			html = ['<select>'];
				html.push('<option>??</option>');
				for (var ii = 0, len = lastOperand.length; ii < len; ii++) {
					var val = lastOperand[0][ii].value+' '+lastOperand[0][ii].unit;
					html.push('<option value="'+val+'">');
						html.push(val+' = ');
						html.push(lastOperand[1][ii + 1].value+' '+lastOperand[1][ii + 1].unit);
					html.push('</option>');
				}
			html.push('</select>');
			return html.join('');
					
		default :
			throw {
				name: 'ProblemTypeError',
				message: type.name + ' does not have a problem widget'
			};
	}
};

mathSkills.widgets.Problem.prototype.getAnswerWidget = function() {
	var html = ['<span class=measurement><span style="font-size: 250%">=</span> '],
		operands = this.getOperands(),
		elId;
		
	for (var ii = 0, len = operands.length; ii < len; ii++) {
		elId = 'final_' + mathSkills.utils.randomId();
		this.setAnswerDomId(ii, elId);
		html.push('<input size=2 class="value pojo" type=text id='+elId);
		html.push(ii === 0 ? ' autofocus' : '');
		html.push('>');
		html.push('<label class=unit>');
		html.push(operands[ii].plural || operands[ii].unit);
		html.push('</label>');
	}
	html.push('</span>');
	html.push('<button class=answerButton>Check Answer</button>');
	html.push('<button class=helpButton>Open Workbook</button>');
	
	$('#answer').addClass('pojo')[0].pojo = this;
	this.setDomId('answer');

	return html.join('');
};

mathSkills.widgets.Problem.prototype.getDomElement = function() {
	return $('#'+this.getDomId())[0];
};

mathSkills.widgets.Problem.prototype.validate = function() {
	var $container = $(this.getDomElement()),
		correct = true,
		inWorkbook = $container.parents('#workbook').length > 0 ? true : false,
		answer = this.getAnswer(),
		userAnswer = '',
		correctAnswer = '';
	
	if (mathSkills.workBookAnswer === undefined) {
		mathSkills.workBookAnswer = {};
	}
	
	for (var ii = 0, len = answer.length; ii < len; ii++) {
		var $answerEl = $(this.getAnswerDomElement(ii)),
			elValue = $answerEl.val() || 0,
			value = answer[ii].value,
			unit = answer[ii].unit;
		
		if (typeof value === 'number') {
			elValue = parseInt(elValue, 10);
		}
		
		if (elValue !== value) {
			correct = false;
			mathSkills.utils.animation.incorrectFeedback($answerEl);
		} else {
			mathSkills.utils.animation.correctFeedback($answerEl);
			
			if (inWorkbook) {
				mathSkills.workBookAnswer[unit] = value;
			}
		}
		
		correctAnswer += value+' '+unit+' ';
		userAnswer += elValue+' '+unit+' ';
	}
	
	if (inWorkbook && !correct) {
		// Lower the score if we're in the workbook.  The final answer widget handles
		// it's own score management for wrong answers.
		var page = mathSkills.nav.getCurrentPage();
		mathSkills.utils.navigation.Page.addIncorrectAnswer(page, {
			description: this.getInstructions(),
			correct: correctAnswer,
			answer: userAnswer
		});
	}
	
	this.userAnswer = userAnswer;
	
	return correct;
};

mathSkills.widgets.Problem.prototype.solve = function() {
	var operands = this.getOperands(),
		type = this.getType(),
		answer = [];
	
	switch(type.name) {
		case 'addition' :
			answer.push({
				value: operands[0].value + operands[1].value,
				unit: operands[0].unit
			});
			break;
		
		case 'subtraction' :
			answer.push({
				value: operands[0].value - operands[1].value,
				unit: operands[0].unit
			});
			break;
		
		case 'multiplication' :
			answer.push({
				value: operands[0].value * operands[1].value,
				unit: operands[0].unit
			});
			break;
		
		case 'division' :
			answer.push({
				value: Math.floor(operands[0].value / operands[1].value),
				unit: operands[1].unit,
				role: 'quotient'
			});
			answer.push({
				value: operands[0].value % operands[1].value,
				unit: operands[0].unit,
				role: 'remainder'
			});
			break;
			
		case 'long division answer' :
			answer.push({
				value: operands[0].value,
				unit: operands[0].unit,
				role: 'quotient'
			});
			answer.push({
				value: operands[1].value,
				unit: operands[1].unit,
				role: 'remainder'
			});
			break;
		
		default : break;
	}
	
	if (answer.length !== 0) {
		this.setAnswer(answer);
	}
};

mathSkills.widgets.Problem.prototype.giveHint = function() {
	var answers = this.getAnswer(),
		answer,
		el,
		userValue;
	
	for (var ii = 0, len = answers.length; ii < len; ii++) {
		answer = answers[ii];
		el = $(this.getAnswerDomElement(ii));
		userValue = el.val();
		
		if (typeof answer.value === 'number') {
			userValue = parseInt(userValue, 10);
		}
		
		if (answer.value !== userValue) {
			el.val(answer.value);
			mathSkills.utils.animation.helpFeedback(el);
			return true;
		}
	}
	
	return false;
};

/**
 * @event
 * @description Event handler for updating a "Work It Out" widget from user input.
 * 
 * @param {HTMLElement} that The HTML element that triggered the update.
 * 
 * @example
 * // Use this handler for a keyup event in the problemWidget of the current
 * // workbook step.
 * 
 * $('#workbook .current .problemWidget input').keyup(function() {
 * 	mathSkills.widgets.Problem.updateProblemWidget(this);
 * });
 */
mathSkills.widgets.Problem.updateProblemWidget = function(event) {
	// Get the containing widget.
	var container = $(event.target).closest('table.division');
	// Extract the user entered value
	var value = parseInt($(event.target).val(), 10);
	// Compute the subtrahend for the intermediate subtraction problem.
	var subtrahend = value * parseInt(container.find('.divisor').text(), 10);
	// Get the units for the subtrahend.
	var units = container.find('.divisor').siblings('.unit:first').text();
	
	// Build the HTML.
	var html = ['<td>&nbsp;</td><td><span class=operator>-</span></td>'];
	html.push('<td><span class="value subtrahend">'+subtrahend+'</span> ');
	html.push(units+'</td>');
	
	// Add the subtrahend row and show the remainder row.
	container.find('.subtrahendRow').html(html.join(''));
	container.find('.remainderRow').show();
};

mathSkills.widgets.Problem.eqFractionSelectChange = function(event) {
	var selectVal = $(event.target).val(),
		answer = mathSkills.workbook.getCurrentProblem().getAnswer()[0].value;
	
	if (selectVal === answer) {
		mathSkills.utils.animation.correctFeedback(event.target);
	} else {
		mathSkills.utils.animation.incorrectFeedback(event.target);
	}
};

/**
 * @event
 * @description Event handler for updating a workbook step's answer widget with data
 * from the "Work It Out" widget.<br>
 * <br>
 * <em>This function fires off an 'updateAnswer' event at the '.answerWidget' element
 * within its containing workbook step container.</em>
 * 
 * @param {HTMLElement} that The HTML element that initiated the event.
 * 
 * @example
 * // Use this handler for a keyup event in the last input element of the problemWidget 
 * // of the current workbook step.
 * 
 * $('#workbook .current .problemWidget input:last').keyup(function() {
 * 	mathSkills.widgets.Problem.triggerAnswerWidgetUpdate(this);
 * });
 */
mathSkills.widgets.Problem.triggerAnswerWidgetUpdate = function(event) {
	// Trigger an update event for the answer widget.
	var container = $(event.target).closest('table.problemWidget');
	var answerWidget = container.parents('section:first').find('.answerWidget');
	var values = [];
	container.find('input').each(function() {
		values.push($(this).val() || null);
	});
	answerWidget.trigger('updateAnswer', values);
};

/**
 * @event
 * @description Event handler for taking in a variable number of arguments and transferring
 * their value to the contained input elements.<br>
 * <br>
 * <em>This function expects to be passed directly as an event handler for the 
 * container of the &lt;input> elements.  <strong>this</strong> should be bound
 * to the container.</em>  
 * 
 * @param {Event} e The event object.  Not currently used.
 * @param {Number[]} arguments Default arguments array, which is read starting
 * 		after the first index.  The values from the array are used to populate the
 * 		input elements.
 * 
 * @example
 * // Pass the function reference directly in the event binding.
 * 
 * $('.answerWidget').on('updateAnswer', mathSkills.widgets.Problem.updateAnswerWidget);
 */
mathSkills.widgets.Problem.updateAnswerWidget = function(e) {
	var counter = 0;
	var args = arguments;
	$(this).find('input').each(function() {
		var value = args[counter + 1];
		$(this).val(value);
		if (value !== null) {
			$(this)
				.css('background-color', 'yellow')
				.animate({'background-color': 'white'}, 1000);
		}
		counter++;
	});
};

/**
 * @event
 * @description Event handler for taking the first '.draggable' element and
 * programmatically "dropping" it in its appropriate container.
 * 
 * @param {HTMLElement} that The HTML element that initiated the event.  Used to find
 * 		the container context.
 * 
 * @example
 * // Bind this event to a help button click.
 * 
 * $('.helpButton').click(function() {
 * 	mathSkills.widgets.Problem.workBookShowMeButtonHandler(this);
 * });
 */
mathSkills.widgets.Problem.moveDraggable = function(event) {
	var container = $(event.target).closest('.panel'),
		draggable = container.find('.draggable:first'),
		droppable;
	
	var page = mathSkills.nav.getCurrentPage();
	mathSkills.utils.navigation.Page.addHelp(page, mathSkills.workbook.getCurrentProblem().getInstructions());
	
	// Find the right droppable container for this draggable.
	container.find('.droppable').each(function() {
		if (draggable.hasClass($(this).text())) {
			droppable = $(this);
		}
	});
	
	// Setup a callback function in a closure with access to local variables.
	var callback = (function() {
		return function() {
			droppable.html('<span>'+draggable.text()+'</span>').removeClass('empty');
			draggable.remove();
			if ($('.draggable').length === 0) {
				// Remove this behavior.
				mathSkills.eventController.removeBehavior({
					type: 'click',
					selector: '#workbook .showMeButton.drag'
				});
				
				mathSkills.workbook.nextStep();
			}
		};
	})();
	
	// Move the element.
	mathSkills.utils.animation.move(draggable, droppable, { 
		removeElement: false, 
		callback: callback 
	});
};

/**
 * @event
 * @description Validates a jQuery UI selectable selection.  An element is considered
 * valid if it is selected (has class 'ui-selected') and its data-select element is set
 * to true.
 * 
 * @example
 * // Bind it to the stop event of a jQuery UI selectable
 * // Notice that the function is being bound directly and not being called from within
 * // an anonymous function.
 * $('.selectable').selectable({ 
 * 	stop: mathSkills.widgets.Problem.workBookSelectHandler 
 * });
 */
mathSkills.widgets.Problem.workBookSelectHandler = function(event, ui) {
	var correct = true,
		problem = mathSkills.workbook.getCurrentProblem(),
		answer = '',
		correctAnswer = '';
		
	$('.selectable li').each(function() {
		if ($(this).hasClass('ui-selected')) {
			answer += $(this).text();
		}
		
		if ($(this).data('select') === true) {
			correctAnswer += $(this).text();
		}
		
		if (($(this).hasClass('ui-selected') && $(this).data('select') === false) || 
			($(this).data('select') === true && ! $(this).hasClass('ui-selected'))) {
			correct = false;
			mathSkills.utils.animation.incorrectFeedback($(this).removeClass('ui-selected'));
		} else if ($(this).hasClass('ui-selected') && $(this).data('select') === true) {
			mathSkills.utils.animation.correctFeedback($(this));
		}
	});
	if (correct) {
		mathSkills.eventController.removeBehavior({
			type: 'click',
			selector: '#workbook .showMeButton.selection'
		});
		mathSkills.workbook.nextStep();
	} else {
		var page = mathSkills.nav.getCurrentPage();
		mathSkills.utils.navigation.Page.addIncorrectAnswer(page, {
			description: problem.getInstructions(),
			answer: answer,
			correct: correctAnswer
		});
	}
};

/**
 * @event
 * @description Shows the elements that should be selected and calls the selection
 * handler.
 * 
 * @param {Event} event Event object.
 * @param {Object} ui jQuery UI object.
 */
mathSkills.widgets.Problem.showSelection = function(event, ui) {
	var page = mathSkills.nav.getCurrentPage();
	mathSkills.utils.navigation.Page.addHelp(page, mathSkills.workbook.getCurrentProblem().getInstructions());
	
	$('.ui-selectee').each(function() { 
		if ($(this).data('select') === true) { 
			$(this).addClass('ui-selected'); 
		} 
	});
	window.setTimeout((function(event) {
		mathSkills.eventController.removeBehavior({
			type: 'click',
			selector: '#workbook .showMeButton.selection'
		});
		mathSkills.widgets.Problem.workBookSelectHandler(event);
	})(event), 1000);
};

/**
 * @event
 * @description Handles incorrect answers to the workbook.
 * 
 * @param {Event} event Event object
 */
mathSkills.widgets.Problem.doIncorrectWorkbookAnswer = function(event) {
	var container = $(event.target).closest('.panel');
	
	container.find('.answerButton').html('Try Again');
	// Return focus to the first incorrect answer.
	mathSkills.utils.animation.focusFeedback(container.find('input.incorrect:first'));
};

mathSkills.widgets.Problem.cancelUnitClick = function(event) {
	var el = $(event.target).addClass('selected'),
		unit = el.data('unit'),
		selectedUnits = $('span.clickableUnit.selected');
		
	if (selectedUnits.length > 1) {
		selectedUnits.each(function() {
			// Skip the triggering element.
			if (this !== el[0]) {
				if ($(this).data('unit') !== unit) {
					mathSkills.utils.animation.incorrectFeedback($(this).removeClass('selected'), true);
					mathSkills.utils.animation.incorrectFeedback(el.removeClass('selected'), true);
				} else {
					$(this).hide(1000, function() {
						$(this).remove();
					});
					el.hide(1000, function() {
						el.remove();
						if ($('span.clickableUnit').length < 2) {
							mathSkills.workbook.nextStep();
						}
					});
				}
			}
		});
	}
};

mathSkills.widgets.Problem.yesNoButtonClick = function(event) {
	var userAnswer = $(event.target).text(),
		problem = mathSkills.workbook.getCurrentProblem(),
		answer = problem.getAnswer()[0];
	
	if (userAnswer === answer) {
		mathSkills.workbook.nextStep();
	} else {
		$(event.target).attr('disabled', 'disabled').siblings('.incorrect').slideDown();
	}
};

/**
 * @event
 * @description Opens up the "Work It Out" help section for a particular workbook step
 * or fills in the next empty or incorrect answer for the step or closes this step and
 * moves on to the next.
 * 
 * @example
 * // Bind it to a workbook help button
 * $('.helpButton').click(mathSkills.widgets.Problem.workBookHelpButtonHandler);
 */
mathSkills.widgets.Problem.workBookHelpButtonHandler = function(event) {
	var container = $(event.target).closest('.panel');
	
	if (! container.find('.help').is(':visible')) {
		container.find('.help').slideDown(500, function() {
			// Scroll to button of screen.
			mathSkills.utils.animation.scrollToBottom();
			
			// Focus on the first input of the work it out section.
			mathSkills.utils.animation.focusFeedback(container.find('.help input:first'));
		});
	} else {
		var madeUpdate = false;
		var hasFocus = false;
		
		if (container.find('input').length === 0) {
			var problem = mathSkills.workbook.getCurrentProblem();
			// Trigger a hint.  If there is none to give, go to the next step.
			if (!problem.giveHint()) {
				mathSkills.workbook.nextStep();
			}
		} else {
			container.find('input').each(function() {
				var value = $(this).val() === "" ? 0 : $(this).val();
				var correct = $(this).data('answer') === undefined ? $(this).data('value') : $(this).data('answer');
				// Check for a zero value that is not filled in first.
				if (!madeUpdate && $(this).val() === "" && correct === 0) {
					$(this).val('0').keyup();
					madeUpdate = true;
				// Update the first incorrect answer.
				} else if (value != correct && !madeUpdate) {
					$(this).val(correct).keyup();
					madeUpdate = true;
				// Clear any remaining incorrect answers.
				} else if (value != correct) {
					$(this).val('');
					
					// Place focus on first incorrect answer.
					if (!hasFocus) {
						mathSkills.utils.animation.focusFeedback($(this));
						hasFocus = true;
					}
				}
			});
			if (!madeUpdate) {
				container.find('.answerButton').click();
			}
		}
		// Scroll to button of screen.
		mathSkills.utils.animation.scrollToBottom();
	}
};

/**
 * @event
 * @description Opens a modal dialog box with the incorrect problem text.
 * 
 * @param {Event} event Event object.
 */
mathSkills.widgets.Problem.doIncorrectFinalAnswer = function(event) {
	var finalAnswer = $('#answer')[0].pojo,
		answer = finalAnswer.getAnswer(),
		container = $(event.target).closest('.panel'),
		answerButton = container.find('.answerButton'),
		incorrect = finalAnswer.getIncorrect(),
		correctAnswer = '';
		
	for (var ii = 0, len = answer.length; ii < len; ii++) {
		correctAnswer += answer[ii].value+' '+answer[ii].unit+' ';
	}
	mathSkills.utils.navigation.Page.addIncorrectAnswer(mathSkills.nav.getCurrentPage(), {
		description: $('#problem').text(),
		answer: finalAnswer.userAnswer,
		correct: correctAnswer
	});
		
	$('<div></div>').html(incorrect).appendTo('body').dialog({
		buttons: { 
			'Try Again' : function(e) {
				e.stopPropagation();
				// Close the dialog box.
				$(this).dialog('close').remove();
				// Focus on the first incorrect input box in the answer area.
				// Wrapped inside a time out so that pressing enter on the modal dialog
				// does not resubmit the answer inputs.
				window.setTimeout(function() {
					mathSkills.utils.animation.focusFeedback($('#answer').find('input.incorrect:first'));
				}, 100);
			}, 
			'Help' : function(e) {
				e.stopPropagation();
				// Close the dialog box.
				$(this).dialog('close').remove();
				// Show the workbook.
				$('#answer .helpButton').click();
			} 
		},
		modal: true
	});
	
	// Change the button text.
	$(answerButton).val('Try Again'); 
};

/**
 * @event
 * @description Opens the modal dialog box, closes the workbook and fires the updateVisual
 * event.
 * 
 * @param {Event} event Event object.
 */
mathSkills.widgets.Problem.doCorrectFinalAnswer = function(event) {
	var page = mathSkills.nav.getCurrentPage();
	mathSkills.utils.navigation.Page.stopTimer(page);
	mathSkills.utils.navigation.Page.completed(page);
	
	var time = mathSkills.utils.navigation.Page.getTotalTime(page),
		score = mathSkills.utils.navigation.Page.getScore(page),
		buttons = {};
	
	// Show modal dialog.
	if (mathSkills.nav && mathSkills.nav.hasNext()) { 
		buttons['Next Problem'] = function(e) { 
			mathSkills.nav.goToNextPage();
			e.stopPropagation();
		};
	} else {
		buttons['Show Summary'] = function() {
			mathSkills.nav.goToSummaryPage();
		};
	}
	$('<div></div>').html('Correct.<br><br> You completed the problem in:<br>'+time+'<br><br>With a total score of:<br>'+score).appendTo('body').dialog({buttons: buttons, modal: true });
	
	// Close the workbook.
	$('#workbook').hide(500); 
		
	// Fire off the update visual event.
	$('#visual').trigger('updateVisual');
};

mathSkills.widgets.Problem.validateFinalAnswer = function() {
	var finalAnswer = $('#answer')[0].pojo;
	
	return finalAnswer.validate();
};
