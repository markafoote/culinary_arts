/**
 * @fileOverview Contains all objects and functions for mathSkills.widgets.scale
 * and mathSkills.widgets.Scale.
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
 * @namespace Namespace for Scale visual widget.
 */
mathSkills.widgets.scale = mathSkills.widgets.scale || {};

/**
 * Maximum times bigger the right hand weight can be than the left hand weight.
 * @constant
 * @deprecated
 */
mathSkills.widgets.scale.MAX_RATIO = 2;

/**
 * Maximum angle which the scale can be tipped to.
 * @constant
 */
mathSkills.widgets.scale.MAX_ANGLE = 12;

/**
 * @class <h2>Scale Visual Class</h2>
 * Creates a visual scale widget, resembling a kitchen baker's scale, which can represent
 * a {@link mathSkills.units.Weight}.<br>
 * <br>
 * @property {mathSkills.units.Weight} leftWeight The weight object to be represented on the
 * left-side.  It is represented as a constant sized ball.
 * @property {mathSkills.units.Weight} rightWeight The Weight object to be represented on the
 * right-side.  It is represented through a series of individual weights and movements on the
 * ounces bar.
 * @property {HTMLCanvasElement} canvas The HTML canvas element used to represent the two weights.
 * 
 * @param {mathSkills.units.Weight} startWeight The left-side Weight object.
 * 
 * @example
 * // Create a new weight object and a scale from it.
 * var weight = new mathSkills.units.Weight({
 * 	// Weight object init.
 * });
 * var scale = new mathSkills.widgets.Scale(weight);
 */
mathSkills.widgets.Scale = function(startWeight) {
	this.leftWeight = startWeight;
	this.rightWeight = null;
	this.canvas = null;
};

/**
 * Sets the weight on the right hand side of the scale.
 * 
 * @param {mathSkills.units.Weight} weight The weight to set the right-side
 * to.
 * 
 * @example
 * var scale = // Create scale object.
 * var rightWeight = // Create weight object.
 * 
 * scale.setWeight(rightWeight);
 */
mathSkills.widgets.Scale.prototype.setWeight = function(weight) {
	this.rightWeight = weight;
};

/**
 * Returns a boolean indicating whether the two weight values match.
 * 
 * @return {Boolean} True if the two weights are equal, false otherwise.
 * 
 * @example
 * var scale = // Create scale object.
 * var rightWeight = // Create weight object.
 * 
 * scale.setWeight(rightWeight);
 * if (scale.isBalanced()) {
 * 	// Do something.
 * }
 */
mathSkills.widgets.Scale.prototype.isBalanced = function() {
	return this.leftWeight.valueOf() === this.rightWeight.valueOf();
};

/**
 * Returns the current angle of the scale determined by the ratio of the two weights.
 * A positive angle indicates that the left hand side is heavier; while, a negative angle means
 * the right hand side is.
 * 
 * @return {Number} Scale angle to two decimal places.
 * 
 * @example
 * var scale = // create scale.
 * var rightWeight = // create weight.
 * 
 * scale.setWeight(rightWeight);
 * 
 * scale.getAngle();
 */
mathSkills.widgets.Scale.prototype.getAngle = function() {
	var rightWeightValue = (this.rightWeight) ? this.rightWeight.valueOf() : 0; // Allows for absent right weight.
	var ratio = (rightWeightValue - this.leftWeight.valueOf()) / this.leftWeight.valueOf();
	// Keep the ratio within the MAX_RATIO bounds.
	if (ratio < -mathSkills.widgets.scale.MAX_RATIO) {
		ratio = -mathSkills.widgets.scale.MAX_RATIO;
	} else if (ratio > mathSkills.widgets.scale.MAX_RATIO) {
		ratio = mathSkills.widgets.scale.MAX_RATIO;
	}
	return (mathSkills.widgets.scale.MAX_ANGLE / mathSkills.widgets.scale.MAX_RATIO * ratio).toFixed(2);
};

/**
 * Returns a canvas representation of the scale.
 * 
 * @param {Number} width Canvas width in pixels.
 * @param {Number} height Canvas height in pixels.
 * 
 * @return {HTMLCanvasElement} HTML canvas representation of the scale.
 * 
 * @example
 * var scale = // create scale
 * 
 * // Place scale canvas in #visual container.
 * $('#visual').html(scale.getCanvas());
 */
mathSkills.widgets.Scale.prototype.getCanvas = function(width, height) {
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	canvas.height = height;
	canvas.width = width;
	this.updateCanvas();
	return canvas;
};

/**
 * @event
 * @description Updates the scale widget using the values in the final answer widget or the passed
 * in values.
 * 
 * @param {Event} event Standard DOM event.
 * @param {Object} [workBookVisual] Object containing weight unit piece names (plural form) as keys.
 * 		If this object is not passed in, the values in the final answer input fields are used.
 * 
 * @example
 * // Create the objects
 * var weight = new mathSkills.units.Weight(
 * 	// Weight init
 * ); 
 * var visual = new mathSkills.widgets.Scale(weight);
 * var canvas = visual.getCanvas(700, 300);
 * 
 * // Wire in the event.
 * $('#visual').html(canvas).on('updateVisual', null, {that: visual}, visual.update);
 */
mathSkills.widgets.Scale.prototype.update = function(event, workBookVisual) {
	var that = event.data.that;
	var weightInit = {};
	if (workBookVisual === undefined) {
		$('#answer input[type=text]').each(function() {
			weightInit[$(this).next().text()] = parseInt($(this).val(), 10);
		});
	} else {
		for (var unit in workBookVisual) {
			if (workBookVisual.hasOwnProperty(unit)) {
				weightInit[unit] = parseInt(workBookVisual[unit], 10);
			}
		}
	}
	var weight = new mathSkills.units.Weight(weightInit);
	that.setWeight(weight);
	that.updateCanvas();
};

/**
 * Redraws the canvas with the current weight values.
 *
 * @example
 * // Create scale and two weights.
 * var weight = // create weight 1.
 * var scale = new mathSkills.widgets.Scale(weight);
 * var weight2 = // create weight 2.
 * 
 * scale.setWeight(weight2);
 * 
 * // Update the representation with the new value.
 * scale.updateCanvas();
 */
mathSkills.widgets.Scale.prototype.updateCanvas = function() {
	this.clearCanvas();
	var ctx = this.canvas.getContext("2d");
	ctx.save();
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height - 10);
	
	var baseWidth = ctx.canvas.width * 0.4;
	var baseHeight = ctx.canvas.height * 0.2;
	var baseCoordinates = {};
	ctx.fillStyle = 'rgb(200,200,200)';
	
	// Draw the scale base.
	
	// Base front.
	ctx.beginPath();
	var baseGradient = ctx.createLinearGradient(-baseWidth / 2, -baseHeight, baseWidth / 2, 0);
	baseGradient.addColorStop(0,'rgb(200,200,200)');
	baseGradient.addColorStop(0.3,'rgb(180,180,180)');
	baseGradient.addColorStop(0.7,'rgb(220,220,220)');
	baseGradient.addColorStop(1,'rgb(200,200,200)');
	ctx.fillStyle = baseGradient;
	
	baseCoordinates.bottomLeft = { x: -(baseWidth / 2), y: 0 };
	ctx.lineTo(baseCoordinates.bottomLeft.x, baseCoordinates.bottomLeft.y);
	
	baseCoordinates.left = { x: -(baseWidth / 2) + (baseWidth * 0.05), y: -baseHeight };
	ctx.lineTo(baseCoordinates.left.x, baseCoordinates.left.y);
	
	baseCoordinates.right = { x: (baseWidth / 2) - (baseWidth * 0.05), y: -baseHeight };
	ctx.lineTo(baseCoordinates.right.x, baseCoordinates.right.y);
	
	baseCoordinates.bottomRight = { x: (baseWidth / 2), y: 0 };
	ctx.lineTo(baseCoordinates.bottomRight.x, baseCoordinates.bottomRight.y);
	
	ctx.lineTo(0, 0);
	ctx.closePath();
	
	ctx.fill();
	
	// Base top.
	var baseTopGradient = ctx.createLinearGradient(-baseWidth / 2, -baseHeight - (baseHeight * 0.15), baseWidth / 2, -baseHeight);
	baseTopGradient.addColorStop(0,'rgb(220,220,220)');
	baseTopGradient.addColorStop(0.3,'rgb(230,230,230)');
	baseTopGradient.addColorStop(1,'rgb(220,220,220)');
	ctx.fillStyle = baseTopGradient;
	ctx.beginPath();
	ctx.moveTo(baseCoordinates.left.x, baseCoordinates.left.y);
	
	baseCoordinates.topLeft = { x: -(baseWidth / 2) + (baseWidth * 0.15), y: -baseHeight - (baseHeight * 0.15) };
	ctx.lineTo(baseCoordinates.topLeft.x, baseCoordinates.topLeft.y);
	
	baseCoordinates.topRight = { x: (baseWidth / 2) - (baseWidth * 0.15), y: -baseHeight - (baseHeight * 0.15) };
	ctx.lineTo(baseCoordinates.topRight.x, baseCoordinates.topRight.y);
	
	ctx.lineTo(baseCoordinates.right.x, baseCoordinates.right.y);
	ctx.closePath();
	ctx.fill();
	
	// Base outline
	ctx.strokeStyle = 'rgba(0,0,0,.7)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(baseCoordinates.bottomLeft.x, baseCoordinates.bottomLeft.y);
	ctx.lineTo(baseCoordinates.left.x, baseCoordinates.left.y);
	ctx.lineTo(baseCoordinates.topLeft.x, baseCoordinates.topLeft.y);
	ctx.lineTo(baseCoordinates.topRight.x, baseCoordinates.topRight.y);
	ctx.lineTo(baseCoordinates.right.x, baseCoordinates.right.y);
	ctx.lineTo(baseCoordinates.bottomRight.x, baseCoordinates.bottomRight.y);
	ctx.lineTo(baseCoordinates.bottomLeft.x, baseCoordinates.bottomLeft.y);
	ctx.closePath();
	ctx.stroke();

	// Base details
	
	// Top line
	ctx.strokeStyle = 'rgb(255,255,255)';
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(baseCoordinates.left.x + 1, baseCoordinates.left.y + 2);
	ctx.lineTo(baseCoordinates.right.x - 1, baseCoordinates.right.y + 2);
	ctx.closePath();
	ctx.stroke();
	
	// Bottom line
	ctx.strokeStyle = 'rgb(100,100,100)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(baseCoordinates.bottomLeft.x + 2, baseCoordinates.bottomLeft.y - 2);
	ctx.lineTo(baseCoordinates.bottomRight.x - 2, baseCoordinates.bottomRight.y - 2);
	ctx.closePath();
	ctx.stroke();
	
	// Face Plate
	var plateWidth = baseWidth * 0.3;
	var plateHeight = baseHeight * 0.3;
	var plateCoordinates = {};
	ctx.fillStyle = 'rgb(150,150,150)';
	ctx.stokeStyle = 'rgb(150,150,150)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	plateCoordinates.bottomLeft = { x: -plateWidth / 2, y: -(baseHeight / 2) + (plateHeight / 2) };
	ctx.moveTo(plateCoordinates.bottomLeft.x, plateCoordinates.bottomLeft.y);
	plateCoordinates.topLeft = { x: -plateWidth / 2, y: -(baseHeight / 2) - (plateHeight / 2) };
	ctx.lineTo(plateCoordinates.topLeft.x, plateCoordinates.topLeft.y);
	plateCoordinates.topRight = { x: plateWidth / 2, y: -(baseHeight / 2) - (plateHeight / 2) };
	ctx.lineTo(plateCoordinates.topRight.x, plateCoordinates.topRight.y);
	plateCoordinates.bottomRight = { x: plateWidth / 2, y: -(baseHeight / 2) + (plateHeight / 2) };
	ctx.lineTo(plateCoordinates.bottomRight.x, plateCoordinates.bottomRight.y);
	ctx.closePath();
	ctx.fill();
	
	// Face Plate border
	ctx.beginPath();
	ctx.moveTo(plateCoordinates.bottomLeft.x - 2, plateCoordinates.bottomLeft.y + 2);
	ctx.lineTo(plateCoordinates.topLeft.x - 2, plateCoordinates.topLeft.y - 2);
	ctx.lineTo(plateCoordinates.topRight.x + 2, plateCoordinates.topRight.y - 2);
	ctx.lineTo(plateCoordinates.bottomRight.x + 2, plateCoordinates.bottomRight.y + 2);
	ctx.closePath();
	ctx.stroke();
	
	// Draw the scale shaft.
	var shaftBaseWidth = baseWidth * 0.2;
	var shaftBaseHeight = baseHeight * 0.2;
	var gradient = ctx.createLinearGradient(-shaftBaseWidth / 2, -baseHeight - shaftBaseHeight, shaftBaseWidth / 2, -baseHeight);
	gradient.addColorStop(0,'rgb(180,180,180)');
	gradient.addColorStop(0.1,'rgb(160,160,160)');
	gradient.addColorStop(0.3,'rgb(190,190,190)');
	gradient.addColorStop(0.5,'rgb(150,150,150)');
	gradient.addColorStop(0.7,'rgb(220,220,220)');
	gradient.addColorStop(1,'rgb(180,180,180)');
	ctx.fillStyle = gradient;
	ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(-shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 0.3));
	ctx.lineTo(-shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 1.3));
	ctx.quadraticCurveTo(0, -baseHeight - (2 * shaftBaseHeight),
			shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 1.3));
	ctx.lineTo(shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 0.3));
	ctx.quadraticCurveTo(0, -baseHeight + (shaftBaseHeight * 0.5),
			-shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 0.3));
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = 'rgb(210,210,210)';
	ctx.beginPath();
	ctx.moveTo(-shaftBaseWidth / 2 + 2, -baseHeight - (shaftBaseHeight * 1.3));
	ctx.quadraticCurveTo(0, -baseHeight - (2 * shaftBaseHeight) + 2,
			shaftBaseWidth / 2 - 2, -baseHeight - (shaftBaseHeight * 1.3));
	ctx.quadraticCurveTo(0, -baseHeight - (shaftBaseHeight * 0.5),
			-shaftBaseWidth / 2 + 2, -baseHeight - (shaftBaseHeight * 1.3));
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = 'rgb(180,180,180)';
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(0,0,0,.6)';
	ctx.fillRect(-shaftBaseWidth * 0.6 / 2, -baseHeight - shaftBaseHeight * 2 , shaftBaseWidth * 0.6, shaftBaseHeight * 0.8); 
	ctx.strokeRect(-shaftBaseWidth * 0.6 / 2, -baseHeight - shaftBaseHeight * 2 , shaftBaseWidth * 0.6, shaftBaseHeight * 0.8);
	ctx.fillStyle = 'rgb(200,200,200)';
	ctx.fillRect(-shaftBaseWidth * 0.6 / 2, -baseHeight - shaftBaseHeight * 2 , shaftBaseWidth * 0.6, shaftBaseHeight * 0.8);
	ctx.closePath();
	
	var scaleShaftHeight = ctx.canvas.height / 4;
	var scaleShaftTop = -baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight;
	ctx.beginPath();
	gradient = ctx.createRadialGradient(-shaftBaseWidth * 0.3 / 2, (-baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight) / 2, 0, -shaftBaseWidth * 0.8 / 2, (-baseHeight - (shaftBaseHeight * 1.5) - scaleShaftHeight) / 2, ctx.canvas.height / 3);
	gradient.addColorStop(0,'rgb(180,180,180)');
	gradient.addColorStop(0.1,'rgb(160,160,160)');
	gradient.addColorStop(0.3,'rgb(190,190,190)');
	gradient.addColorStop(0.5,'rgb(150,150,150)');
	gradient.addColorStop(0.7,'rgb(220,220,220)');
	gradient.addColorStop(1,'rgb(180,180,180)');
	ctx.fillStyle = gradient;
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(0,0,0,.6)';
	ctx.fillRect(-shaftBaseWidth * 0.3 / 2, -baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight, shaftBaseWidth * 0.3, scaleShaftHeight);
	ctx.strokeRect(-shaftBaseWidth * 0.3 / 2, -baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight, shaftBaseWidth * 0.3, scaleShaftHeight);
	ctx.closePath();
	
	var radianAngle = this.getAngle() * (Math.PI / 180);
	ctx.lineWidth = ctx.canvas.height / 20;
	gradient = ctx.createLinearGradient(-shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight - (ctx.canvas.height / 20), shaftBaseWidth / 2, -baseHeight - (shaftBaseHeight * 2) - scaleShaftHeight);
	gradient.addColorStop(0,'rgb(180,180,180)');
	gradient.addColorStop(0.1,'rgb(160,160,160)');
	gradient.addColorStop(0.3,'rgb(190,190,190)');
	gradient.addColorStop(0.5,'rgb(150,150,150)');
	gradient.addColorStop(0.7,'rgb(220,220,220)');
	gradient.addColorStop(1,'rgb(180,180,180)');
	ctx.strokeStyle = gradient;
	
	var armLength = baseWidth * 0.8 / 2;  
	// Draw the right hand side of the scale arm.
	ctx.beginPath();
	ctx.moveTo(0, scaleShaftTop);
	var rightX = armLength * Math.cos(radianAngle);
	var rightY = -(-scaleShaftTop - (armLength * Math.sin(radianAngle)));
	ctx.lineTo(rightX, rightY);
	ctx.stroke();
	ctx.closePath();
	
	// Draw the left hand side of the scale arm.
	ctx.beginPath();
	ctx.moveTo(0, scaleShaftTop);
	var leftX = -(armLength * Math.cos(-radianAngle));
	var leftY = scaleShaftTop + (armLength * Math.sin(-radianAngle));
	ctx.lineTo(leftX, leftY);
	ctx.stroke();
	ctx.closePath();
	
	// Draw the scale pivot.
	ctx.arc(0, scaleShaftTop, armLength / 5, 0, Math.PI * 2, true);
	ctx.fill();
	
	ctx.lineWidth = 3;
	ctx.lineCap = 'square';
	var plateRadius = baseWidth * 0.4 / 2;
	plateCoordinates = {};
	
	// Draw the right hand string.
	ctx.beginPath();
	ctx.moveTo(rightX - 1, rightY);
	ctx.lineTo(rightX - 1, rightY - plateRadius / 3);
	plateCoordinates.right = {};
	plateCoordinates.right.center = { x: rightX - 1, y: rightY - plateRadius / 3 };
	ctx.stroke();
	ctx.closePath();
	
	// Draw the left hand string.
	ctx.beginPath();
	ctx.moveTo(leftX + 1, leftY);
	ctx.lineTo(leftX + 1, leftY - plateRadius / 3);
	plateCoordinates.left = {};
	plateCoordinates.left.center = { x: leftX + 1, y: leftY - plateRadius / 3 };
	ctx.stroke();
	ctx.closePath();
	
	ctx.lineJoin = 'round';
	ctx.lineCap = 'butt';
	
	// Draw the right hand plate
	ctx.save();
	ctx.fillStyle = 'rgb(210,210,210)';
	ctx.scale(1,0.1);
	ctx.beginPath();
	ctx.arc(plateCoordinates.right.center.x, plateCoordinates.right.center.y * 10, plateRadius, 0, 2 * Math.PI, true);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	
	// Draw the left hand plate
	ctx.save();
	ctx.fillStyle = 'rgb(210,210,210)';
	ctx.scale(1,0.1);
	ctx.beginPath();
	ctx.arc(plateCoordinates.left.center.x, plateCoordinates.left.center.y * 10, plateRadius, 0, 2 * Math.PI, true);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	
	// Draw the left hand weight.
	ctx.beginPath();
	ctx.arc(plateCoordinates.left.center.x, plateCoordinates.left.center.y - plateRadius * 0.8, plateRadius * 0.7, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();
	
	// Draw the hopper
	gradient = ctx.createLinearGradient(plateCoordinates.left.center.x - plateRadius * 1.5, plateCoordinates.left.center.y - plateRadius, plateCoordinates.left.center.x + plateRadius * 1.5, plateCoordinates.left.center.y);
	gradient.addColorStop(0,'rgb(200,200,200)');
	gradient.addColorStop(0.1,'rgb(180,180,180)');
	gradient.addColorStop(0.3,'rgb(210,210,210)');
	gradient.addColorStop(0.5,'rgb(170,170,170)');
	gradient.addColorStop(0.7,'rgb(240,240,240)');
	gradient.addColorStop(1,'rgb(200,200,200)');
	
	// Draw the base
	ctx.save();
	ctx.fillStyle = gradient;
	ctx.strokeStyle = 'rgba(0,0,0,.6)';
	ctx.scale(1,0.1);
	ctx.beginPath();
	ctx.arc(plateCoordinates.left.center.x, plateCoordinates.left.center.y * 10, plateRadius / 3, 0, Math.PI, false);
	ctx.lineTo(plateCoordinates.left.center.x - plateRadius / 3, (plateCoordinates.left.center.y - plateRadius / 6) * 10);
	ctx.arc(plateCoordinates.left.center.x, (plateCoordinates.left.center.y - plateRadius / 6) * 10, plateRadius / 3, Math.PI, 0, true);
	ctx.lineTo(plateCoordinates.left.center.x + plateRadius / 3, plateCoordinates.left.center.y * 10);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
	// Draw the walls.
	ctx.beginPath();
	ctx.fillStyle = gradient;
	ctx.strokeStyle = 'rgba(0,0,0,.4)';
	ctx.moveTo(plateCoordinates.left.center.x - plateRadius / 3, plateCoordinates.left.center.y - plateRadius / 6);
	ctx.lineTo(plateCoordinates.left.center.x - plateRadius * 1.5, plateCoordinates.left.center.y - plateRadius);
	ctx.bezierCurveTo(plateCoordinates.left.center.x, plateCoordinates.left.center.y - plateRadius * 2, plateCoordinates.left.center.x - plateRadius * 0.5, plateCoordinates.left.center.y - plateRadius * 0.5, plateCoordinates.left.center.x + plateRadius * 1.5, plateCoordinates.left.center.y - plateRadius);
	ctx.lineTo(plateCoordinates.left.center.x + plateRadius / 3, plateCoordinates.left.center.y - plateRadius / 6);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	
	// Draw the ounce bar.
	var ounceBarLength = baseWidth * 0.8 / 2 / 1.8; 
	ctx.lineWidth = ctx.canvas.height / 30;
	ctx.strokeStyle = 'white';
	
	ctx.beginPath();
	var ounceRightX = ounceBarLength * Math.cos(radianAngle);
	var ounceRightY = -(-scaleShaftTop - (ounceBarLength * Math.sin(radianAngle)));
	ctx.moveTo(-ounceRightX, scaleShaftTop - ounceBarLength * Math.sin(radianAngle));
	ctx.lineTo(ounceRightX, ounceRightY);
	ctx.stroke();
	ctx.closePath();
	
	// Draw the ounce hashes.
	ctx.beginPath();
	ctx.strokeStyle = '#aaa';
	ctx.lineWidth = ctx.lineWidth * 0.8;
	var totalXMovement = ounceRightX * 2;
	var totalYMovement = ounceRightY - (scaleShaftTop - ounceBarLength * Math.sin(radianAngle));
	var startX = -ounceRightX + 2;
	var startY = scaleShaftTop - ounceBarLength * Math.sin(radianAngle);
	var xEnd = startX + totalXMovement / 32;
	var yEnd = startY + totalYMovement / 32;
	ctx.moveTo(startX, startY);
	for (var ii = 0; ii < 16; ii++) {
		xEnd = startX + totalXMovement / 32;
		yEnd = startY + totalYMovement / 32;
		ctx.lineTo(xEnd, yEnd);
		startX = xEnd + totalXMovement / 32;
		startY = yEnd + totalYMovement / 32;
		ctx.moveTo(startX, startY);
	}
	ctx.stroke();
	ctx.closePath();
	
	// Draw the ounce pendulum string.
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	totalXMovement = ounceRightX * 2;
	totalYMovement = ounceRightY - (scaleShaftTop - ounceBarLength * Math.sin(radianAngle));
	startX = -ounceRightX + 4;
	startY = scaleShaftTop - ounceBarLength * Math.sin(radianAngle) - 5;
	var ounces = this.rightWeight !== null ? this.rightWeight.ounces : 0;
	var pendulumXStart = startX + ((totalXMovement / 16) * ounces);
	var pendulumXEnd = startX + ((totalXMovement / 16) * ounces);
	var pendulumYStart = startY + ((totalYMovement / 16) * ounces);
	var pendulumYEnd = (startY + ((totalYMovement / 16) * ounces)) + ounceBarLength * 0.3;
	ctx.moveTo(pendulumXStart, pendulumYStart);
	ctx.lineTo(pendulumXEnd, pendulumYEnd);
	ctx.stroke();
	ctx.closePath();
	
	// Draw the ounce pendulum weight.
	var pendulumWeightWidth = ounceBarLength * 0.3;
	var pendulumWeightHeight = pendulumWeightWidth * 1.8;
	var pendulumWeightStartX = pendulumXEnd - pendulumWeightWidth / 2;
	var pendulumWeightStartY = pendulumYEnd;
	ctx.beginPath();
	ctx.fillStyle = '#333';
	ctx.fillRect(pendulumWeightStartX, pendulumWeightStartY, pendulumWeightWidth, pendulumWeightHeight);
	ctx.closePath();
	
	// Draw the weights.
	if (this.rightWeight !== null) {
		var remainingPounds = this.rightWeight.pounds;
		var eightLbWeights = Math.floor(remainingPounds / 8);
		remainingPounds = remainingPounds % 8;
		var fourLbWeights = Math.floor(remainingPounds / 4);
		remainingPounds = remainingPounds % 4;
		var twoLbWeights = Math.floor(remainingPounds / 2);
		remainingPounds = remainingPounds % 2;
		var oneLbWeights = Math.floor(remainingPounds / 1);
		remainingPounds = 0;
		
		var centerX = plateCoordinates.right.center.x;
		var centerY = plateCoordinates.right.center.y;
		
		for (ii = 0; ii < eightLbWeights; ii++) {
			centerY = this.drawWeight(8, centerX, centerY, plateRadius);
		}
		for (ii = 0; ii < fourLbWeights; ii++) {
			centerY = this.drawWeight(4, centerX, centerY, plateRadius);
		}
		for (ii = 0; ii < twoLbWeights; ii++) {
			centerY = this.drawWeight(2, centerX, centerY, plateRadius);
		}
		for (ii = 0; ii < oneLbWeights; ii++) {
			centerY = this.drawWeight(1, centerX, centerY, plateRadius);
		}
	}
	
	ctx.restore();
};

/**
 * Draws a 8, 4, 2, or 1 pound weight on the scale.
 * Returns the y coordinate of the top of the drawn weight.
 * 
 * @param {Number} weight The lb weight to be drawn (1, 2, 4, or 8)
 * @param {Number} centerX The x-coordinate of the weight's bottom center.
 * @param {Number} centerY The y-coordinate of the weight's bottom center.
 * @param {Number} centerRadius The radius of the weight's circular form in pixels.
 * 
 * @return {Number} The y-coordinate of the top of the drawn weight.
 * 
 * @example
 * // From inside of a function where <em>this</em> is bound to a Scale object.
 * centerY = this.drawWeight(1, centerX, centerY, plateRadius);
 */
mathSkills.widgets.Scale.prototype.drawWeight = function(weight, centerX, centerY, centerRadius) {
	var ctx = this.canvas.getContext("2d");
	var baseRadius;
	var fontSize;
	switch(weight) {
		case 8 : 
			baseRadius = centerRadius * 0.8;
			fontSize = 16;
			break;
		case 4 : 
			baseRadius = centerRadius * 0.7;
			fontSize = 14;
			break;
		case 2 : 
			baseRadius = centerRadius * 0.6;
			fontSize = 12;
			break;
		case 1 : 
			baseRadius = centerRadius * 0.5;
			fontSize = 10;
			break;
	}
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.strokeStyle = '#333';
	ctx.scale(1,0.1);
	ctx.beginPath();
	ctx.arc(centerX, centerY * 10, baseRadius, 0, Math.PI, false);
	ctx.lineTo(centerX - baseRadius, (centerY - baseRadius / 2) * 10);
	ctx.arc(centerX, (centerY - baseRadius / 2) * 10, baseRadius, 2 * Math.PI, 0, false);
	ctx.moveTo(centerX + baseRadius, (centerY - baseRadius / 2) * 10);
	ctx.lineTo(centerX + baseRadius, centerY * 10);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
	
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.font = fontSize+'pt Arial bold';
	ctx.textAlign = 'center';
	ctx.textBaseLine = 'center';
	ctx.fillText(weight+' lb', centerX, centerY);
	ctx.closePath();
	
	return centerY - baseRadius / 2;
};

/**
 * Clears the scale canvas
 */
mathSkills.widgets.Scale.prototype.clearCanvas = function() {
	var ctx = this.canvas.getContext("2d");
	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.restore();
};
