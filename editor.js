//editor.js
//scripts for creature editor

var editor = new Object();	//holds data needed for the creature editor
editor.creatureNumber = -1;	//holds the array index number of the creature selected.  If nothing is selected, set to something less than 0

editor.addCreature = function addCreature()
{
//function addCreature() adds the creature being edited to the soup
	var debug  = Vatican.debugLog("function addCreature() started", Simulator.debug);

//make sure that the simulation is stopped
	Simulator.stop();

	var codeBox = document.getElementById("codeBox");

	if( (editor.creatureNumber >= 0) && (editor.creatureNumber < soup.length) && codeBox && codeBox.value && (codeBox.value.toString() != soup[editor.creatureNumber].source) )
	{
		debug.log("The text in the creature editor's code box is not the same as the source of the selected creature (creature #" + editor.creatureNumber + ").  Creating a new creature using the creature editor's contents as its source code.");

		var source = document.getElementById("codeBox").value.toString();

		var color = "rgb(";
		color += document.getElementById("red").value.toString() + ",";
		color += document.getElementById("green").value.toString() + ",";
		color += document.getElementById("blue").value.toString() + ")";

		var argumentList = [source];

		if(Simulator.validColor.test(color) )
		{
			argumentList.push(color);
		}

		soup.push(Simulator.Creature.apply(window, argumentList) );
	}

	else if((editor.creatureNumber >= 0) && (editor.creatureNumber < soup.length) )
	{
		debug.log("Copying selected creature.");

		soup.push(new Object() );
		editor.saveChanges(soup.length - 1);
	}

	else
	{
		debug.log("no creature was selected");
		soup.push(ancestor);
	}
}

editor.deSelectCreature = function deSelectCreature(index)
{
//function deSelectCreature() deselects the selected creature
	var debug = Vatican.debugLog("function deSelectCreature() ran", Simulator.debug);

	var visibleSoup = document.getElementById("visibleSoup");

	if(!visibleSoup.firstChild || visibleSoup.firstChild.nodeName.toLowerCase() != "div")
	{
		Simulator.display.call(null);
	}

	visibleSoup = visibleSoup.firstChild;

	if((editor.creatureNumber >= 0) && (editor.creatureNumber < soup.length))
	{
		debug.log("editor.creatureNumber is valid");

		visibleSoup.childNodes[editor.creatureNumber].className = "";
		editor.creatureNumber = -1;
		document.getElementById("codeBox").value = "";
	}

	else
	{
		debug.log("\neditor.creatureNumber is not valid");
	}

//if a number was passed to function deSelectCreature(), try to deselect the creature at that index
	if((typeof index == "number") && (index >= 0) && index < soup.length)
	{
		visibleSoup.childNodes[index].className = "";
		document.getElementById("codeBox").value = "";

		debug.log("index (" + index + ") is valid");
	}

	else
	{
		debug.log("index (" + index + ") is not valid");
	}

//clear the color picker and the food box
	document.getElementById("food").value = "";

	document.getElementById("colorPreview").setAttribute("style", "");
	document.getElementById("red").value = "";
	document.getElementById("green").value = "";
	document.getElementById("blue").value = "";

	debug.show();
}

editor.colorPreview = function colorPreview(color)
{
//function colorPreview() shows the color you're entering as you type it
	var debug = Vatican.debugLog("function colorPreview() started", Simulator.debug);
	debug.log("color passed to function: " + color);

	var validColor = Simulator.validColor;
	var colorPreview = document.getElementById("colorPreview");

//if an rgb color was passed to the function, use that
	if(typeof color == "string" && validColor.test(color) )
	{
		debug.log("the color passed to the function is a valid rgb color; setting the background color of the color previewer to " + color);

		var regx_number = /\d{1,3}/g;
		var colorList = color.match(regx_number);

		debug.log("color numbers found: " + colorList);

		document.getElementById("red").value = colorList[0];
		document.getElementById("green").value = colorList[1];
		document.getElementById("blue").value = colorList[2];
	}

//otherwise, try to extract a color from the color picker
	else
	{
		debug.log("no valid color passed to the function; trying to find a valid rgb color in the color picker");
		var boxes = [ document.getElementById("red"), document.getElementById("green"), document.getElementById("blue") ];
		var nonNumbers = /\D/i;
		var colorStrings = [ boxes[0].value.toString(), boxes[1].value.toString(), boxes[2].value.toString() ];
		var processedStrings = [];

		for(var counter = 0;counter < 3;counter++)
		{
			processedStrings[counter] = colorStrings[counter].replace(nonNumbers, "");

			if(processedStrings[counter] == "")
			{
				processedStrings[counter] = "0";
			}
		}

		var color = "rgb(" + processedStrings.join(",") + ")";

		debug.log("After erasing all non-numbers, the color is " + color);

		(validColor.test(color) ) ? debug.log(color + " is a valid rgb color") : debug.log(color + " is not a valid rgb color") ;	//record if the color is a valid rgb color

		for(counter = 0; counter < 3;counter++)
		{
			if(boxes[counter].value != processedStrings[counter])
			{
				boxes[counter].value = processedStrings[counter];
			}
		}
	}

//check one last time if the color is valid
	if(!validColor.test(color) )
	{
		color = "rgb(255,255,255)";
	}

	debug.log("setting the color sampler's background color to " + color);
	colorPreview.style.backgroundColor = color;

	debug.show();
}

editor.removeCreature = function removeCreature(index)
{
//function removeCreature() removes the creature with the index given to it
//if it was not given a valid creature index, it will check if a creature is selected
//if no creature is selected, it will do nothing
	var debug = Vatican.debugLog("function removeCreature()", Simulator.debug);
	var deleteEnabled = false;	//only enable deletion if the number passed is a valid creature number
	var creatureToDelete;

//make sure that the simulation is stopped
	Simulator.stop();

//if the creature index given is valid, queue it for deletion
	if( (typeof index === "number") && (index >= 0) && (index < soup.length) )
	{
		debug.log("the creature number given (" + index + ") is a valid creature index; removing it now");
		creatureToDelete = index;
		deleteEnabled = true;
	}

//if a creature is selected, queue it for deletion
	else if( (editor.creatureNumber >= 0) && (editor.creatureNumber < soup.length) )
	{
		debug.log("the creature number given (" + index + ") is not valid, checking if a creature is selected");
		debug.log("A creature (#" + editor.creatureNumber + ") is selected, removing and deselecting creature");

		creatureToDelete = editor.creatureNumber;
		editor.creatureNumber = -1;
		deleteEnabled = true;
	}

	else
	{
		debug.log("Function removeCreature() don't know which creature to delete, so no creature was deleted");
	}

//if a valid creature was found, delete it
	if(deleteEnabled)
	{
		debug.log("found a valid creature to delete; deleting creature #" + creatureToDelete);
		soup.splice(creatureToDelete, 1);
	}
	
//update the GUI
	Simulator.display();

//end of function
	debug.show();
}

editor.saveChanges = function saveChanges(index)
{
//function saveChanges() saves changes made to a creature
	var debug = Vatican.debugLog("function saveChanges() ran", Simulator.debug);

//make sure that the simulation is not running
	Simulator.stop();

	debug.log("index = " + index + "\neditor.creatureNumber = " + editor.creatureNumber);

//if a creature number has not been passed to to the function, or if the number passed is invalid, use editor.creatureNumber instead
	if((typeof index != "number") || (index < 0) || (index >= soup.length))
	{
		debug.log("no creature number or an invalid creature number was passed to function saveChanges(); copying editor.creatureNumber (" + editor.creatureNumber + ") to index");
		var index = editor.creatureNumber;
	}

//if the creature number is valid, get that creature
	if( (typeof index == "number") && (index >= 0) && (index < soup.length) )
	{
		debug.log("number passed to function (" + index + ") is a valid creature number; overwriting existing creature at soup[" + index + "]");

		var color = "rgb(";
		color += document.getElementById("red").value.toString() + ",";
		color += document.getElementById("green").value.toString() + ",";
		color += document.getElementById("blue").value.toString() + ")";

		debug.log("rgb color found in color picker: " + color);

		var source = document.getElementById("codeBox").value.toString();
		debug.log("source code found in the code box:\n" + soup[index].source);

		var food = +document.getElementById("food").value;
		debug.log("food found in the food box: " + food);

		soup[index] = Simulator.Creature(source, color, food);

		Simulator.display();
	}

	else
	{
		debug.log("function saveChanges() couldn't find a valid creature number");
		debug.log("editor.creatureNumber = " + editor.creatureNumber);
	}

//end of function
	debug.log("function ended");
	debug.show();
}

editor.selectCreature = function selectCreature(creatureNumber)
{
//function selectCreature() selects the creature with the given index number

	var debug = Vatican.debugLog("function selectCreature()", Simulator.debug);
	var creature;				//holds reference to actual creature
	var isValidCreatureNumber = false;	//reject by default
	var visibleSoup = document.getElementById("visibleSoup").firstChild;	//be careful when changing this

	debug.log("selected creature = \n" + creature);
	debug.log("visibleSoup.outerHTML = \n" + visibleSoup.outerHTML);

//sanity check: is this creature number valid?
	if(typeof creatureNumber !== "number")
	{
		debug.log("creature number isn't even a number, cancelling");
	}

	else if(creatureNumber < 0)
	{
		debug.log("negative creature selected: #" + creatureNumber + ", this means that no creature is selected.  clearing creature editor");
	}

	else if(creatureNumber >= soup.length)
	{
		debug.log("selected creature (#" + creatureNumber + ") is impossible - it's higher than the population limit.  How did this happen?");
	}

	else
	{
		debug.log("creature #" + creatureNumber + " is selected, updating editor");
		isValidCreatureNumber = true;
	}

	if(isValidCreatureNumber)
	{
		debug.log("creature #" + creatureNumber + " selected");
		creature = soup[creatureNumber];
		debug.log("selected creature = \n" + creature);

		visibleSoup.children[creatureNumber].className = "selected";
		document.getElementById("codeBox").value = creature.source;
		document.getElementById("food").value = creature.food;
	}

	else
	{
		debug.log("invalid creature number, cancelling");
	}

//switch to editor tab
		Vatican.switchTab("editor");

	debug.show();
}

editor.update = function update(event)
{
//editor.update()
//updates the creature editor, calls selectCreature() or deSelectCreature() to do the dirty work

	var debug = Vatican.debugLog("function editor.update()", Simulator.debug);

	var creatureNumber = editor.creatureNumber;
	var creature = soup[creatureNumber];
	var regex_number;

	var creatureNumber;	//holds array index of both creature and element that visually represents it
	var creatureElement = event.target || window.event.srcElement;	//gets the element clicked in IE or W3C-compliant browsers
	var visibleSoup = document.getElementById("visibleSoup").firstChild;	//be careful when changing this.  If creatureNumber becomes less than zero, you're asking for its array index in an element other than its immediate parent

//if triggered by a click, find element clicked and its index number in the soup
	if(event)
	{
		debug.log("was triggered by a click, figuring out which creature to select based on the element clicked");
		creatureElement = event.target || event.srcElement;	//for compatibility with IE

//get index of current element, working under the assumption that its only child elements are <span> elements (should hold true if Simulator.display() has run at least once
//credit goes to http://stackoverflow.com/questions/5913927/get-child-node-index
		debug.log("Array.prototype.indexOf.call(visibleSoup.children, creatureElement) = " + Array.prototype.indexOf.call(visibleSoup.children, creatureElement) );
		creatureNumber = Array.prototype.indexOf.call(visibleSoup.children, creatureElement);
		debug.log("creatureNumber = " + creatureNumber);

		if( (creatureNumber >= 0) && (creatureNumber < soup.length) )
		{
			debug.log("creature #" + creatureNumber + " selected, showing contents in editor");
			editor.selectCreature(creatureNumber);
		}

		else
		{
			debug.log("no valid creature selected, clearing editor");
			editor.deSelectCreature();
		}
	}

	else
	{
		debug.log("no event given, did you forget to pass the event to me?");
	}

	debug.show();
}
