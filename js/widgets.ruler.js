/**
 * @fileOverview Contains all objects and functions for mathSkills.widgets.ruler
 * and mathSkills.widgets.Ruler.
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
 * @namespace Namespace for Ruler visual widget.
 */
mathSkills.widgets.ruler = mathSkills.widgets.ruler || {};

/**
 * Max width in pixels of the ruler.
 * @constant
 */
mathSkills.widgets.ruler.WIDGET_LENGTH = 900;

/**
 * @class <h2>Ruler Visual Class</h2>
 * Creates a visual ruler widget, which can represent a {@link mathSkills.units.Length}.<br>
 * <br>
 * @property {mathSkills.units.Length} lengthObject The Length object that is to be represented.
 * @property {Number} lengthinInches The total length of the lengthObject converted to inches.
 * @property {Number} pixelsperInch The number of pixels per inch to use for the Ruler.
 * 
 * @param {mathSkills.units.Length} startLength The Length object to be represented.
 * 
 * @example
 * // Create a new length object and a ruler from it.
 * var length = new mathSkills.units.Length({
 * 	// Length object init.
 * });
 * var ruler = new mathSkills.widgets.Ruler(length);
 */
mathSkills.widgets.Ruler = function(startLength) {
	this.lengthObject = startLength;
	if(startLength.initObject.yards) {
		this.lengthinInches = (startLength.initObject.yards * 36) + (startLength.initObject.feet * 12) + startLength.initObject.inches;
	} else {
		this.lengthinInches = (startLength.initObject.feet * 12) + startLength.initObject.inches;
	}
	this.pixelsperInch = Math.floor(mathSkills.widgets.ruler.WIDGET_LENGTH / this.lengthinInches);
};

/**
 * Returns an HTML representation of the Ruler.
 * 
 * @return {String} The HTML string.
 * 
 * @example
 * // Create a new length object and a ruler from it.
 * var length = new mathSkills.units.Length({
 * 	// Length object init.
 * });
 * var ruler = new mathSkills.widgets.Ruler(length);
 * 
 * // Put the ruler HTML in the #visual container.
 * $('#visual').html(ruler.getHtml());
 */
mathSkills.widgets.Ruler.prototype.getHtml = function() {
	var yardsinPixels, feetinPixels, inchesinPixels, markUp;
	
	if(this.lengthObject.initObject.yards !== undefined) {
		yardsinPixels = this.lengthObject.initObject.yards * 36 * this.pixelsperInch;
	} else {
		yardsinPixels = 0;
	}
	feetinPixels = this.lengthObject.initObject.feet * 12 * this.pixelsperInch;

	inchesinPixels = this.lengthObject.initObject.inches * this.pixelsperInch;
	markUp = ['<div id="ruler" style="width:'];
	markUp.push(mathSkills.widgets.ruler.WIDGET_LENGTH + 'px');
	markUp.push(';margin:0px;height:35px; background-size: '+(this.pixelsperInch * 12 * 3)+'px 35px;">');
	if(this.lengthObject.initObject.yards !== undefined) {
		markUp.push('<div id="ruler-yards" style="width:');
		markUp.push(yardsinPixels + 'px');
		markUp.push(';float:left;height:35px;margin:0px;padding:0px;background-color:rgba(159,248,159,.6);">');
		markUp.push('<div class="ruler-caption"><span id="yd">');
		markUp.push(this.lengthObject.initObject.yards);
		markUp.push('</span> Yd</div></div>');
	} else {
		markUp.push('<div id="ruler-yards" style="width:');
		markUp.push(yardsinPixels + 'px');
		markUp.push(';float:left;height:35px;margin:0px;padding:0px;background-color:rgba(159,248,159,.6);">');
		markUp.push('<div class="ruler-caption"><span id="yd">');
		markUp.push(this.lengthObject.initObject.yards);
		markUp.push('</span> Yd</div></div>');
	}
	markUp.push('<div id="ruler-feet" style="width:');
	markUp.push(feetinPixels + 'px');
	markUp.push(';float:left;height:35px;margin:0px;padding:0px;background-color:rgba(248,159,159,.6);">');
	markUp.push('<div class="ruler-caption"><span id="ft">');
	markUp.push(this.lengthObject.initObject.feet);
	markUp.push('</span> Ft</div></div>');
	markUp.push('<div id="ruler-inches"  style="width:');
	markUp.push(inchesinPixels + 'px');
	markUp.push(';float:left;height:35px;margin:0px;padding:0px;background-color:rgba(159,159,248,.6);">');
	markUp.push('<div class="ruler-caption"><span id="in">');
	markUp.push(this.lengthObject.initObject.inches);
	markUp.push('</span> In</div></div></div>');
	return markUp.join('');
};

/**
 * @event
 * @description Updates the ruler from the passed in updateValues.  This method chooses
 * only to update when the passed in values match the final simplified amounts.
 *
 * @param {Event} event The standard DOM event object.  If the binding is performed correctly
 * 		a reference to the actual Ruler object will be accessible from event.data.that;
 * @param {Object} updateValues An object of length values for the current update event.  The
 * 		keys of the object are length unit names in their plural form.
 * 
 * @example
 * // Create length and ruler objects
 * var length = new mathSkills.units.Length({
 * 	// Length init.
 * });
 * var ruler = new mathSkills.widgets.Ruler(length);
 * 
 * // Populate the #visual container
 * $('#visual').html(ruler.getHtml());
 * 
 * // Bind the #visual container to an updateVisual event.
 * // Notice how a reference to the ruler object is passed through the event
 * // data, and how a reference to the update function is passed to be called
 * // directly.
 * $('#visual').on('updateVisual', null, {that: ruler}, ruler.update);
 */
mathSkills.widgets.Ruler.prototype.update = function(event, updateValues) {
	var that = event.data.that, lengthinInches, pixelsperInch, width;
	
	if(that.lengthObject.initObject.yards) {
		lengthinInches = (that.lengthObject.initObject.yards * 36) + (that.lengthObject.initObject.feet * 12) + that.lengthObject.initObject.inches;
	} else {
		lengthinInches = (that.lengthObject.initObject.feet * 12) + that.lengthObject.initObject.inches;
	}
	pixelsperInch = Math.floor(mathSkills.widgets.ruler.WIDGET_LENGTH / lengthinInches);

	if(updateValues.inches === that.lengthObject.inches) {
		width = that.lengthObject.inches * pixelsperInch;
		$("#ruler-inches").animate({
			width: width + 'px'
		}, 500);
		$("#in").html(that.lengthObject.inches);
	}
	if(updateValues.feet === that.lengthObject.feet) {
		width = that.lengthObject.feet * 12 * pixelsperInch;
		$("#ruler-feet").animate({
			width: width + 'px'
		}, 500);
		$("#ft").html(that.lengthObject.feet);
	}
	if(updateValues.yards === that.lengthObject.yards) {
		width = that.lengthObject.yards * 36 * pixelsperInch;
		$("#ruler-yards").animate({
			width: width + 'px'
		}, 500);
		$("#yd").html(that.lengthObject.yards);
	}
};