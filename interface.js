//interface.js
//code that is specific to the UI

Interface = {
	soupVisible: true,
	changeSpeed: function(newSpeed)
	{
//validates the textbox that stores the minimum time between generations
//if the textbox contains a valid number, pass to Simulator.changeSpeed() to change the minimum time between generations
//regardless of whether the validation succeeds, it updates the value of the text box to match the current delay
		var element = document.getElementById("simulationSpeed");
		var newSpeed = Vatican.validate(element, /^\d+$/, /\D+/g);

		if(newSpeed !== "")
		{
			Simulator.changeSpeed(+newSpeed);
		}

		element.value = Simulator.delay;
	},
	changeMutationRate: function(){
//validates the textbox that stores the mutation rate
//if the textbox contains a valid number, pass to Simulator.changeMutationRate() to change the mutation rate
//regardless of whether the validation succeeds, it updates the value of the text box to match the current mutation rate
		var element = document.getElementById("mutationRate");
		var newRate = Vatican.validate(element, /^\d+$/, /\D+/g);

		if(newRate !== "")
		{
			Simulator.changeMutationRate(+newRate);
		}

		element.value = Simulator.mutationRate.toString();

	},
	changePopulationLimit: function()
	{
//validates the textbox that stores the population limit
//if the textbox contains a valid number, pass to Simulator.changePopulationLimit() to change the population limit
//regardless of whether the validation succeeds, it updates the value of the text box to match the current population limit
		var element = document.getElementById("populationLimit");
		var newLimit = Vatican.validate(element, /^\d+$/, /\D+/g);

		if(newLimit !== "")
		{
			Simulator.changePopulationLimit(+newLimit);
		}

		element.value = Simulator.populationLimit.toString();
	},
	showSoup: function()
	{
//shows the contents of the array [soup] on screen

		var debug = Vatican.debugLog("Interface.showSoup()", Simulator.debug);

//show some statistics
		var list = soup;
		document.getElementById('currentPopulation').firstChild.nodeValue = list.length.toString();
		document.getElementById('generations').firstChild.nodeValue = Simulator.generations.toString();

//end this function if its not supposed to do its main job
		if(!Interface.soupVisible || Simulator.wasReset)
		{
			return;
		}

//show the contents of the soup onscreen
		var listLength = list.length;
		var currentCreature;
		var color;
		var validColor = Simulator.validColor;
		var length;

		var doc = document;
		var visibleSoup = document.getElementById("visibleSoup");
		var parent = document.createElement("div");
		var child;

//for giving mutated creatures new colors
		var r = 0;
		var g = 0;
		var b = 0;

		debug.log("listLength = " + listLength);

		for(var counter=0; counter < listLength; counter++)
		{
			currentCreature = list[counter];
			debug.log("creature #" + counter + " = " + currentCreature);

			if(typeof currentCreature != "object")
			{
				debug.log("creature #" + counter + " isn't an object, using a generic blank creature as a placeholder");
				currentCreature = Simulator.blankCreature;
			}

			child = doc.createElement("span");

//check if the creature's attributes are valid, and punish the creature if they aren't
			if(typeof currentCreature.source === "string")
			{
				debug.log("source of current creature (#" + counter + ') is a string');
				length = currentCreature.source.length;
			}

			else
			{
				debug.log("currentCreature.source is not a string, but is instead a " + typeof currentCreature.source + ".  Defaulting to 1 (creature #" + counter + ')');
				length = 1;
			}

			if( (typeof currentCreature.color === "string") && validColor.test(currentCreature.color) )
			{
				debug.log('currentCreature.color ("' + currentCreature.color + '") is a valid rgb color');
				color = currentCreature.color;
			}

			else
			{
				debug.log('currentCreature.color ("' + currentCreature.color + '") is not a valid rgb color, setting color to black and killing it');
				currentCreature.color = "rgb(0,0,0)";
				currentCreature.food = 0;
			}

//add a <span> element that is as many pixels wide as the creature's source is long, with the color listed in the [color] attribute

//use conditional compilation to make this compatible with IE

			/*@cc_on
				@if(@_jscript)
					debug.log('browser is IE, setting style using IT's element.style.cssText to "' + length.toString() + 'px"');
					debug.log('also setting background color to "' + color + '"');
					child.style.cssText = "width: " + length.toString() + "px;background-color:" + color;
				@else @*/
					debug.log('browser is not IE, setting style using industry standard element.setAttribute("style", "width: ' + length.toString() + '; background-color: '+ color + ')');
					child.setAttribute("style", "width: " + length.toString() + "px; background-color: " + color);
				/*
				@end
			@*/

			parent.appendChild(child);
		}

//if a creature is selected, highlight it
		creatureSelected = editor.creatureNumber;
		if( (creatureSelected >= 0) && (creatureSelected < length) )
		{
				debug.log("creature #" + creatureSelected + " is selected, highlighting it on-screen");
				parent.getElementsByTagName("span")[creatureSelected].className = "selected";
		}

		if(!visibleSoup.firstChild || (visibleSoup.firstChild.nodeName != "div") || visibleSoup.childNodes[1])
		{
				debug.log("contents of visible representation of soup aren't quite correct.  This might happen if you put white space or comments inside of it.  Replacing with an empty <div>");
				visibleSoup.innerHTML = '<div></div>';
		}

		debug.log("updating visible representation of soup");
		visibleSoup.replaceChild(parent, visibleSoup.firstChild);	//replace the current visual representation of [soup] with an updated version

//to avoid memory leaks, all references will be set to NULL
		child = null;
		parent = null;
		currentCreature = null;
		visibleSoup = null;
		doc = null;

		debug.show();
	}
}
