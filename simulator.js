//The Simulator object holds all parts of the simulation except the array [soup]
//I hid all parts of the simulation inside of global objects to make it less likely that rogue code will break the simulation

var Simulator = {
	debug:						false,
	delay:						50,					//number of milliseconds to wait before the next generation
	displayOn:				true,				//says whether to show or hide a visual representation of the soup
	generations:			0,
	interval:					undefined,	//holds a reference to the interval created by setInterval()
	limit:						5,					//population limit
	mutationRate:			10,					//chance of mutation = 1 / [mutationRate]
	on:								false,
	populationLimit:	50,
	validColor:				new RegExp("^rgb\\(\\d{1,2}[0-5]?,\\d{1,2}[0-5]?,\\d{1,2}[0-5]?\\);?$","i"),	//yes, I know that invalid rgb colors will pass this test, but this is much easier to code, and uses less processing power
	version:					1.0
}

Simulator.changeMutationRate = function changeMutationRate(newRate)
{
//changes the mutation rate
	var debug = Vatican.debugLog("function changeMutationRate() ran", Simulator.debug);

//allow other parts of the program to change the mutation rate
	if(typeof newRate === "number")
	{
		debug.log("the number " + newRate + " was passed to function changeMutationRate()");
	}

	else
	{
		debug.log("the number typed in the text box (" + newRate + ") is not a number, aborting");
		throw new Error("Simulator.changeMutationRate(\"" + newRate + "\"): mutation rate must be a number, aborting");
	}

//if the number of mutations is set to 0 or less, no mutations will happen
	if(newRate <= 0)
	{
		debug.log("no mutations will happen");
		Simulator.mutationRate = 0;
	}

	else
	{
		Simulator.mutationRate = newRate;
	}

	debug.show();
}

Simulator.changePopulationLimit = function changePopulationLimit()
{
//function changePopulationLimit() changes the population limit and removes any non-number characters from the text box with ID=populationLimit

	var element = document.getElementById('populationLimit');
	var textEntered = element.value.toString();
	var nonNumbers = /\D/g;

	//only change the text box that shows the population limit if you need to
	if(nonNumbers.test(textEntered) )
	{
		textEntered = textEntered.replace(nonNumbers, "");
		element.value = textEntered.toString();
	}

	var number = parseInt(textEntered);

	if(number != NaN && number > 0)
	{
		Simulator.populationLimit = number;
	}
}

Simulator.changeSpeed = function changeSpeed()
{
//function changeSpeed() changes the speed that the simulation runs at
	var element = document.getElementById('simulationSpeed');
	var oldValue = element.value.toString();
	var nonNumbers = /\D/g;	//search for non-numbers
	var newValue = oldValue.replace(nonNumbers, "");
	element.value = newValue.toString();
	newValue = parseInt(newValue);

//check if the text typed in is a number
	if(newValue && (newValue != Simulator.delay) && (newValue != NaN) && (newValue >= 0) )
	{
		Simulator.delay = newValue;

		if(Simulator.on)
		{
			Simulator.stop();
			Simulator.startUp(true);
		}

		if(Simulator.debug)
		{
			alert('interval will now wait ' + Simulator.delay.toString() + ' milliseconds between runs');
		}
	}
}

Simulator.Creature = function Creature(source, color, food){
//function Creature() returns a new Creature for the simulation

//check if the source given is a valid
	if(typeof source != "string")
	{
		var source = "";
	}

//check if the color given is valid
	if(!Simulator.validColor.test(color) )
	{
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);

		var color = "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ");";
	}

//check if the food given is valid
	if(typeof food != "number")
	{
		var food = 1;
	}

	return {source: source, color: color, food: food};
}

Simulator.display = function display()
{
//function display() shows the contents of the array [soup] on screen

	var debug = Vatican.debugLog("Simulator.display()", Simulator.debug);

//show some statistics
	var list = soup;
	document.getElementById('currentPopulation').firstChild.nodeValue = list.length.toString();
	document.getElementById('generations').firstChild.nodeValue = Simulator.generations.toString();

//end this function if its not supposed to do its main job
	if(!Simulator.displayOn || Simulator.wasReset)
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

Simulator.mutate = function mutate(creatureNumber)
{
//function mutate() mutates the function of the creature with the index given to it
	var debug = Vatican.debugLog("Function Mutate() started", Simulator.debug);

	var localMutationRate = Simulator.mutationRate;

	if(!localMutationRate)
	{
		debug.log("no mutations will happen this time");
		debug.show();
		return;
	}

	var me = soup[creatureNumber];
	var text = me.source;

	if(!text)
	{
		debug.log("the source code of creature " + creatureNumber + " doesn't exist");
		debug.show();
		return;
	}

	var localMath = Math;
	var random = localMath.random;

//if a random number == 1, mutate the creature

	if( (random() * localMutationRate) < 1)
	{
//mutate the creature a random number of times
//if(){do...while} is intentional: I don't want to declare the variables "mutation",
//"character", newCharCode, and newChar if I don't need them

		debug.log("soup[" + creatureNumber.toString() + "] will mutate this time");

		var mutationTypes = 4;
		var mutation;
		var sourceLength = text.length;
		var index;
		var newCharCode;
		var newChar;
		var floor = localMath.floor;
		var ceil = localMath.ceil;

		do
		{
//decide which kind of mutation to make and which character to mutate
			mutation = ceil(random() * mutationTypes);
			index = floor(random() * sourceLength);

			debug.log("mutation type: " + mutation);
			debug.log("character changed: " + index);

//list of possible mutations
			switch(mutation)
			{
//mutation type 1: remove one character
				case 1:
				text = text.substring(0, index - 1) + text.substring(index);
				break;

//mutation type 2: add one random character
				case 2:
				newCharCode = floor(random() * 92) + 32;	//92 standard characters to choose from, starting at char code 32 (space character in unicode)
				newChar = String.fromCharCode(newCharCode);
				text = text.substring(0, index) + newChar + text.substring(index);
				break;

//mutation type 3: replace one character with a random character
				case 3:
				newCharCode = floor(random() * 92) + 32;	//92 standard characters to choose from, starting at char code 0 + 32
				newChar = String.fromCharCode(newCharCode);
				text = text.substring(0, index - 1) + newChar + text.substring(index + 1);
				break;

//mutation type 4: copy a random character and paste it in a random place
				case 4:
//required: 1 variable to hold the position of the character to be copied, 1 variable to hold the position where the character will be copied
				newCharCode = floor(random() * (sourceLength - 1) );	//character to be copied
				index = floor(random() * sourceLength);	//position to be copied to
				text = text.substring(0, index) + text.charAt(newCharCode) + text.substring(index);
				break;
			}
		}
		while( (random() * localMutationRate) < 1)

		soup[creatureNumber].source = text;

		debug.log("final creature source code:\n" + text);
		debug.log("function ended");
		debug.show();
	}
}

Simulator.run = function run()
{
//function run() is the simulation
//It "gives life" to the functions in the array "soup" by running each of them
//If array "soup" is longer than the value of the variable "limit", it removes the first element in the "soup" until the array is short enough, starting with the "creature" at Array index 0

//declare variables
	var list = soup;
	var length = +list.length;
	var r, g, b;
	var loopCounter = 0, runCounter = 0;
	var currentCreature = list[loopCounter];
	var mutate = Simulator.mutate;
	var validColor = Simulator.validColor;

	var _Math = Math;
	var _floor = _Math.floor;
	var _random = _Math.random;

	var backupPush = Array.prototype.push;
	var backupSoup = soup;

	var debug = Vatican.debugLog("function run()", Simulator.debug);
	debug.log("length = " + length);

//if the simulator shouldn't be on, stop it immediately
	if(!Simulator.on)
	{
		Simulator.stop();
		return;
	}

//is the soup empty? If so, stop the simulation.
	if(list.length == 0)
	{
		Simulator.stop();
		debug.log("the soup is empty, stopping the simulation");
		debug.show();
		return;
	}

//record the total number of generations
	Simulator.generations++;

//give each creature a chance to reproduce by running its source code
	while(loopCounter < length)
	{
		currentCreature = list[loopCounter];

//check if the current creature is valid
		if(typeof currentCreature === "object")
		{
			if(typeof currentCreature.source != "string")
			{
				currentCreature.source = "";
			}

			if(currentCreature.color && validColor.test(currentCreature.color) )
			{
				color = currentCreature.color;
			}

			else
			{
				r = _floor(_random() * 256).toString();
				g = _floor(_random() * 256).toString();
				b = _floor(_random() * 256).toString();

				color = "rgb(" + r + "," + g + "," + b + ");";
				currentCreature.color = color;
				currentCreature.food = 0;
			}
		}

		else
		{
			currentCreature = Simulator.blankCreature;
		}

		mutate(loopCounter);	//will it mutate this time?

//be prepared for an error...
		try
		{
			if(currentCreature.food > 0)
			{
				runCounter++;		//if every creature has run out of energy, runCounter will equal 0
				currentCreature.food--;	//the creature eats 1 food each time it runs
				(Function("i", currentCreature.source) ).call(list[loopCounter], loopCounter);	//compile the source code of currentCreature as a function, run the code, and run it in the context of itself
			}
		}

//if there's an error, give the user the option of ending the program
		catch(e)
		{
			if(Simulator.debug)
			{
				var noStop = confirm('soup[' + loopCounter.toString() + '] has an error\n\nsoup[' + loopCounter.toString() + '].source = \n\n' + list[loopCounter].source + '\n\nDo You Want to Continue the Simulation?');

				if(!noStop)
				{
					Simulator.stop();	//end the simulation
					break;	//break out of this loop
				}
			}
		}

//prevent random code from breaking the simulator by overwriting some common problem areas with known good references to them.
		soup = backupSoup;
		soup.push = backupPush;

//add one to the loop counter and set the current creature to the next one in the soup
		loopCounter++;
		currentCreature = list[loopCounter];
	}

	debug.log("processed " + loopCounter + " creatures out of " + length);

//if the list is bigger than the population limit, cut it back down to the population limit

	length = list.length;	//reset this variable
	var limit = Simulator.populationLimit;

	if(document.getElementById('randomLimit').checked)
	{
		limit = Math.ceil(Math.random() * limit);
	}

	var removals = length - limit;

	if(removals > 0)
	{
		list.splice(0,removals);	//deletes as many array items from soup as there are [removals], starting at position 0
	}

//if no creatures have any food, and thus have not run, stop the simulation
//if in run-1-creature mode, skip this step

	if(runCounter == 0)
	{
		Simulator.stop();
		var soupDump = document.getElementById("soupDump");
		var creatureSources = [];

		for(var soupDumpCounter = 0; soupDumpCounter < length; soupDumpCounter++)
		{
			creatureSources.push(Vatican.objectToString(soup[soupDumpCounter], ",\n" ) );
		}
		soupDump.value = creatureSources.join("\n\n");
		soupDump.className = "visible";
		soupDump.select();
		throw new Error("no creature in the soup was able to run");
	}

//shows the contents of the array "soup" on screen

	Simulator.display.call(null);	//Simulator.display() has a bug.  In the future, try...catch every call of Simulator.display to find and fix it
	debug.show();

//to prevent memory leaks, set all references to NULL
	list = null;
	currentCreature = null;
	mutate = null;
	validColor = null;
}

Simulator.startUp = function startUp(wasReset)
{
//function start() begins the simulation
//The parameter "wasReset" is a dummy variable: anything that reduces to "true" will do
//If "wasReset" reduces to "true", function startUp() will not run the function run() before using setInterval(run)
//This makes it much less annoying to change the speed of the simulation

	var button = document.getElementById('starter');
	button.onclick = Simulator.stop;
	button.value = "Stop";

//for debugging and convenience: if I want it to go slow enough that I can react, I don't want it to run immediately after I push a key.
//this gives me that option

	Simulator.on = true;
	editor.clearSelection();

	if(!wasReset)
	{
		Simulator.run.call(window);
	}

//make sure that the population limit is the same as what the visible page says it is
	Simulator.changePopulationLimit();
	Simulator.interval = setInterval(Simulator.run, Simulator.delay, null);
}

Simulator.stop = function stop()
{
//function stop() ends the simulation

	Simulator.on = false;
	var button = document.getElementById('starter');
	button.onclick = Simulator.startUp;
	button.value = "Start";
	clearInterval(Simulator.interval);
}
