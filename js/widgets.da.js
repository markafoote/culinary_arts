/**
 * @fileOverview Contains all objects and functions for mathSkills.widgets.da
 * and mathSkills.widgets.Da.
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
 * @namespace Namespace for dimensional analysis visual widget.
 */
mathSkills.widgets.da = mathSkills.widgets.da || {};

mathSkills.widgets.da.IMAGES = {
	basePath: 'images/',
	units: {
		length: {
			yards: 'Yard_01_V2_48x67.png',
			feet: 'Foot_01_V2_48x67.png',
			inches: 'Inches_01_V2_48x67.png'
		},
		volume: {
			gal: 'gallon-01-56x70.png',
			qt: 'quart-02-40x70.png',
			pt: 'pint-01_50x70.png',
			cp: 'cup-02-50x60.png',
			oz: 'OZ_Shot_01-44x65.png',
			tbs: 'Tablepoon_TeaSpoon_01_46x65.png',
			tsp: 'TeaSpoon_01_46x65.png'
		},
		weight: {
			tons: 'Ton_01_40x50.png',
			pounds: 'Pound_02_40x60.png',
			ounces: 'Ounce_01_V2_Large_40x60.png'
		}
	}
};

/**
 */
mathSkills.widgets.Da = function(unit) {
	this.images = {};
	this.unit = unit;
	this.view = [];
	this.el = null;
	
	// Find out which image set to used based on the constructor of 'unit'
	if (unit instanceof mathSkills.units.Length) {
		this.images = mathSkills.widgets.da.IMAGES.units.length;
	} else if (unit instanceof mathSkills.units.Volume) {
		this.images = mathSkills.widgets.da.IMAGES.units.volume;
	} else if (unit instanceof mathSkills.units.Weight) {
		this.images = mathSkills.widgets.da.IMAGES.units.weight;
	} else {
		throw {
			name: 'TypeError',
			message: 'Unknown unit type passed to Da() widget constructor.'
		};
	}
	
	this.init();
};



mathSkills.widgets.Da.prototype.init = function() {
	var init = this.unit.initObject,
		units = this.unit.UNITS,
		ii = init.startUnitIndex - 1,
		len = ii - init.unitDistance;
	
	// First fraction.
	this.view.push({
		numerator: {
			val: init[init.fromUnit],
			img: this.images[init.fromUnit]
		},
		denominator: {
			val: 1,
			img: null
		},
		display: true,
		unit: init.fromUnit
	});
	
	// Middle fractions.
	for (; ii > len; ii--) {
		this.view.push({
			numerator: {
				val: units[ii].toNext,
				img: this.images[units[ii].plural]
			},
			denominator: {
				val: 1,
				img: this.images[units[ii + 1].plural]
			},
			display: false,
			unit: units[ii].plural
		});
	}
	
	// Last fraction
	this.view.push({
		numerator: {
			val: '?',
			img: this.images[init.toUnit]
		},
		denominator: {
			val: 1,
			img: null
		},
		display: true,
		unit: 'answer'
	});
};

mathSkills.widgets.Da.prototype.bind = function(sel) {
	this.el = $(sel);
	this.el.html(this.getHtml());
	this.el.on('updateVisual', null, {that: this}, this.update);
}; 

/**
 * Returns an HTML representation of the DA equivalence fractions.
 * 
 * @return {String} The HTML string.
 */
mathSkills.widgets.Da.prototype.getHtml = function() {
	var html = [],
		view = this.view;
	
	for (var ii = 0, len = view.length; ii < len; ii++) {
		if (view[ii].display === true) {
			if (ii + 1 === len) {
				html.push('<span class="symbol equals">=</span>');
			} else if (ii !== 0) {
				html.push('<span class=symbol>*</span>');
			}
			html.push('<span class=eqFraction>');
				html.push('<span class=numerator>');
					html.push('<span class=val>'+view[ii].numerator.val+'</span>');
					if (view[ii].numerator.img) {
						html.push('<img src='+mathSkills.widgets.da.IMAGES.basePath);
						html.push(view[ii].numerator.img+'>');
					}
				html.push('</span>');
				html.push('<span class=denominator>');
					html.push('<span class=val>'+view[ii].denominator.val+'</span>');
					if (view[ii].denominator.img) {
						html.push('<img src='+mathSkills.widgets.da.IMAGES.basePath);
						html.push(view[ii].denominator.img+'>');
					}
				html.push('</span>');
			html.push('</span>');
		}
	}
	
	return html.join('');
};

/**
 * @event
 * @description Updates the dimensional analysis widget.
 */
mathSkills.widgets.Da.prototype.update = function(event, updateValues) {
	var unit = updateValues.numerator.split(' ')[1],
		self = event.data.that,
		view = self.view;
		
	for (var ii = 0, len = view.length; ii < len; ii++) {
		if (view[ii].unit === unit) {
			view[ii].display = true;
			self.el.html(self.getHtml());
			return;
		}
	}
	
	throw {
		type: 'UnknownUpdate',
		message: 'The dimensional analysis widget received an update that it did not know how to process'
	};
};