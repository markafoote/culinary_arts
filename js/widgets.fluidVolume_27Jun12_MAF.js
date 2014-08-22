

	//alert (JSON.stringify(this.quantityObject.initObject));
	//alert("caller is " + arguments.callee.caller.toString());

/**
 * Initalize the namespace.
 */
var mathSkills = mathSkills || {};
mathSkills.widgets = mathSkills.widgets || {};
mathSkills.widgets.fluidVolume = mathSkills.widgets.fluidVolume || {};

/**
 * fluidVolume constants for class.
 */
mathSkills.widgets.fluidVolume.WIDGET_LENGTH = 686,
mathSkills.widgets.fluidVolume.maxUnits = 0,
mathSkills.widgets.fluidVolume.maxUnits2 = 0,

mathSkills.widgets.fluidVolume.unitKeysReceived = [];
mathSkills.widgets.fluidVolume.unitValuesReceived = [];
mathSkills.widgets.fluidVolume.unitKeysReceived2 = [];
mathSkills.widgets.fluidVolume.unitValuesReceived2 = [];
mathSkills.widgets.fluidVolume.checkKeysArray =["tsp", "tbs", "oz", "c", "pt", "qt", "gal"];
mathSkills.widgets.fluidVolume.checkUnitsLength=mathSkills.widgets.fluidVolume.checkKeysArray.length;
mathSkills.widgets.fluidVolume.rcvdUnitsCounter = 0;
mathSkills.widgets.fluidVolume.rcvdUnitsCounter2 = 0;
mathSkills.widgets.fluidVolume.backColorArray = ["rgba(159,159,248,.6)", "rgba(159,248,159,.6)", "rgba(248,159,159,.6)", "rgba(159,248,159,.6)", "rgba(248,159,159,.6)", "rgba(159,159,248,.6)", "rgba(248,159,159,.6)"];
mathSkills.widgets.fluidVolume.unitImagesHtml = [
						  "<img src='images/TeaSpoon_01_46x65.png' />",
						  "<img src='images/Tablepoon_TeaSpoon_01_46x65.png' />",
						  "<img src='images/OZ_Shot_01-44x65.png' />",
						  "<img src='images/cup-02-50x60.png' />",
						  "<img src='images/pint-01_50x70.png' />",
						  "<img src='images/quart-02-40x70.png' />",
						  "<img src='images/gallon-01-56x70.png' />"		  
						  ];


/**
 * Constructor function.
 * @constructor
 */

mathSkills.widgets.FluidVolume = function(startVolume) {

	this.quantityObject = startVolume;
	//alert ("in FluidVolume  "+JSON.stringify(this.quantityObject.initObject));

	// errorToLog alerts whatever error message is passed to it with an appropriate prefix
	// currently the check is for nonconsecutive fluid measure units
	mathSkills.widgets.FluidVolume.errorToLog = function(errorMsg) {
		alert ("Please notify your site administrator.  There is an error in the receipt of variables by the method 'widgets.fluidVolume': \n"+errorMsg);
	}

	// put the keys and the values from the initObject into two separate arrays for processing
	for (var k in this.quantityObject.initObject) {
    // use hasOwnProperty to filter out keys from the Object.prototype
	    if (this.quantityObject.initObject.hasOwnProperty(k)) {
			mathSkills.widgets.fluidVolume.unitKeysReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter] = k;
			mathSkills.widgets.fluidVolume.unitValuesReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter] = this.quantityObject.initObject[k];
			mathSkills.widgets.fluidVolume.rcvdUnitsCounter += 1;
	        //alert('key is: ' + k + ', value is: ' + this.quantityObject.initObject[k]);
	    }
	}	

	// for testing nonconsecutive units:  mathSkills.widgets.fluidVolume.unitKeysReceived = ["oz", "c", "pt", "qt", "gal"];
	// for testing nonconsecutive units:  mathSkills.widgets.fluidVolume.rcvdUnitsCounter = 5;
	
	// routine to check for nonconsecutive units
	if (mathSkills.widgets.fluidVolume.rcvdUnitsCounter>1) {   // given that at least two units have been supplied
		for (i=	mathSkills.widgets.fluidVolume.checkUnitsLength; i>=1; i-=1) {  // for the number of units in the mathSkills.widgets.fluidVolume.checkKeysArray
			if (mathSkills.widgets.fluidVolume.unitKeysReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter-1]===mathSkills.widgets.fluidVolume.checkKeysArray[i-1]) { // if unit values match
				for (iii=2; iii<mathSkills.widgets.fluidVolume.rcvdUnitsCounter+1; iii+=1) { // for one less than units supplied
					if (mathSkills.widgets.fluidVolume.unitKeysReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter-iii]!==mathSkills.widgets.fluidVolume.checkKeysArray[i-iii]) { 
						mathSkills.widgets.FluidVolume.errorToLog("nonconsecutive units");
					}
				}
				i=0; // done when mathSkills.widgets.fluidVolume.unitKeysReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter-1]===mathSkills.widgets.fluidVolume.checkKeysArray[i-1]
			}						
		}
	}
	
	// routine determines unit measure with maximum units and divides by four to determine height of illustration 
	// also calls error alert for less than 2 or more than 7 unit measures
	if (mathSkills.widgets.fluidVolume.rcvdUnitsCounter == 0){		
					mathSkills.widgets.FluidVolume.errorToLog("no units");
	} else if (mathSkills.widgets.fluidVolume.rcvdUnitsCounter>7){
			mathSkills.widgets.FluidVolume.errorToLog("more than 7 units");
	}
	if (mathSkills.widgets.fluidVolume.rcvdUnitsCounter>0 && mathSkills.widgets.fluidVolume.rcvdUnitsCounter<=7){
		for (i=0; i<mathSkills.widgets.fluidVolume.rcvdUnitsCounter; i++) {
			    mathSkills.widgets.fluidVolume.maxUnits = Math.max(mathSkills.widgets.fluidVolume.maxUnits, mathSkills.widgets.fluidVolume.unitValuesReceived[i]);
		}
		mathSkills.widgets.fluidVolume.maxUnits = Math.ceil(mathSkills.widgets.fluidVolume.maxUnits/4);
		//alert ("mathSkills.widgets.fluidVolume.maxUnits: "+mathSkills.widgets.fluidVolume.maxUnits);
	} 
	
} // end mathSkills.widgets.FluidVolume

mathSkills.widgets.FluidVolume.prototype.getHtml = function() {
	var markUp = '<div id="fluidVolume" style=" width:';
	markUp += mathSkills.widgets.fluidVolume.WIDGET_LENGTH + 'px';
	markUp += ';margin:0px;">';
	for (k=mathSkills.widgets.fluidVolume.rcvdUnitsCounter-1;k>=0;k--) {
		var y = $.inArray(mathSkills.widgets.fluidVolume.unitKeysReceived[k], mathSkills.widgets.fluidVolume.checkKeysArray);
		if (y < 0) {mathSkills.widgets.FluidVolume.errorToLog("unknown unit");}
		markUp += '<div style="height:';
		markUp += ((mathSkills.widgets.fluidVolume.maxUnits*70)+24) + 'px';		
		markUp += ';width:228px;';
		markUp += 'float:left;margin:0px;padding-left:0px;background-color:'+mathSkills.widgets.fluidVolume.backColorArray[k%7] +';">';
		markUp += '<div><span>';
		markUp += mathSkills.widgets.fluidVolume.unitValuesReceived[k];
		markUp += '</span><span> '+mathSkills.widgets.fluidVolume.unitKeysReceived[k]+'</span></div>';
		markUp += '<div style="margin-left:22px;">';
		for (i = 0; i<mathSkills.widgets.fluidVolume.unitValuesReceived[k]; i++) {
				markUp += '<div style="float:left;">'+mathSkills.widgets.fluidVolume.unitImagesHtml[y]+'</div>';			
		}
		markUp += '</div>';
		markUp += '</div>';
	}
	markUp += '</div>';
	return markUp;
};


mathSkills.widgets.FluidVolume.prototype.update = function(event, updateValues) {
	var that = event.data.that;
	mathSkills.widgets.fluidVolume.unitKeysReceived2 = [];
	mathSkills.widgets.fluidVolume.unitValuesReceived2 = [];
	mathSkills.widgets.fluidVolume.maxUnits = 1;
	mathSkills.widgets.fluidVolume.rcvdUnitsCounter2 = 0;

	this.quantityObject = updateValues;

// put the keys and the values from the initObject into two separate arrays for processing
	for (var k in updateValues) {
    // use hasOwnProperty to filter out keys from the Object.prototype
	    if (updateValues.hasOwnProperty(k)) {
			mathSkills.widgets.fluidVolume.unitKeysReceived2[mathSkills.widgets.fluidVolume.rcvdUnitsCounter2] = k;
			mathSkills.widgets.fluidVolume.unitValuesReceived2[mathSkills.widgets.fluidVolume.rcvdUnitsCounter2] = updateValues[k];
			mathSkills.widgets.fluidVolume.rcvdUnitsCounter2 += 1;
	    }
	}
	
	// check to see if update key is present in mathSkills.widgets.fluidVolume.unitKeysReceived array, if so replace
	for (g = 0; g < mathSkills.widgets.fluidVolume.rcvdUnitsCounter2; g+=1) {
		// var x is set to the index of an update key in the array of keys created from the initial keys/values
		var x = $.inArray(mathSkills.widgets.fluidVolume.unitKeysReceived2[g],mathSkills.widgets.fluidVolume.unitKeysReceived);	
		// if x>=0 then the index was found 
		if (x>=0) {
			mathSkills.widgets.fluidVolume.unitKeysReceived[x] = mathSkills.widgets.fluidVolume.unitKeysReceived2[g];
			mathSkills.widgets.fluidVolume.unitValuesReceived[x] = mathSkills.widgets.fluidVolume.unitValuesReceived2[g];
	// if update key is not present in mathSkills.widgets.fluidVolume.unitKeysReceived array, add key & value
		} else {
			mathSkills.widgets.fluidVolume.unitKeysReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter] = mathSkills.widgets.fluidVolume.unitKeysReceived2[g];
			mathSkills.widgets.fluidVolume.unitValuesReceived[mathSkills.widgets.fluidVolume.rcvdUnitsCounter] = mathSkills.widgets.fluidVolume.unitValuesReceived2[g];
			mathSkills.widgets.fluidVolume.rcvdUnitsCounter += 1;
		}
	}
	
	//alert ("mathSkills.widgets.fluidVolume.unitKeysReceived:  "+JSON.stringify(mathSkills.widgets.fluidVolume.unitKeysReceived)+" mathSkills.widgets.fluidVolume.unitValuesReceived: "+JSON.stringify(mathSkills.widgets.fluidVolume.unitValuesReceived));
	
	// routine determines unit measure with maximum units and divides by four to determine height of illustration 
		for (i=0; i<mathSkills.widgets.fluidVolume.rcvdUnitsCounter; i++) {
			    mathSkills.widgets.fluidVolume.maxUnits = Math.max(mathSkills.widgets.fluidVolume.maxUnits, mathSkills.widgets.fluidVolume.unitValuesReceived[i]);
		}
		mathSkills.widgets.fluidVolume.maxUnits = Math.ceil(mathSkills.widgets.fluidVolume.maxUnits/4);

	// replace the html inside the div with id="fluidVolume"
	var markUp2 = '';
	for (k=mathSkills.widgets.fluidVolume.rcvdUnitsCounter-1;k>=0;k--) {
		var y = $.inArray(mathSkills.widgets.fluidVolume.unitKeysReceived[k], mathSkills.widgets.fluidVolume.checkKeysArray);
		if (y < 0) {mathSkills.widgets.FluidVolume.errorToLog("unknown unit");}
		markUp2 += '<div style="height:';
		markUp2 += ((mathSkills.widgets.fluidVolume.maxUnits*70)+24) + 'px';		
		markUp2 += ';width:228px;';
		markUp2 += 'float:left;margin:0px;padding-left:0px;background-color:'+mathSkills.widgets.fluidVolume.backColorArray[k%7] +';">';
		markUp2 += '<div><span>';
		markUp2 += mathSkills.widgets.fluidVolume.unitValuesReceived[k];
		markUp2 += '</span><span> '+mathSkills.widgets.fluidVolume.unitKeysReceived[k]+'</span></div>';
		markUp2 += '<div style="margin-left:22px;">';
		for (i = 0; i<mathSkills.widgets.fluidVolume.unitValuesReceived[k]; i++) {
				markUp2 += '<div style="float:left;">'+mathSkills.widgets.fluidVolume.unitImagesHtml[y]+'</div>';			
		}
		markUp2 += '</div>';
		markUp2 += '</div>';
	}
	$("#fluidVolume").html(markUp2);
}