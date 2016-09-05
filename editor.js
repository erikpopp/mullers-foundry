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

editor.clearSelection = function clearSelection(index)
{
//function clearSelection() deselects the selected creature
	var debug = Vatican.debugLog("function clearSelection() ran", Simulator.debug);

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

//if a number was passed to function clearSelection(), try to deselect the creature at that index
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

//make sure that the simulation is stopped
	Simulator.stop();

//if [index] is valid, delete the creature at that index, and update the GUI
	if( (typeof index === "number") && (index >= 0) && (index < soup.length) )
	{
		debug.log("the creature number given (" + index + ") is a valid creature index; removing it now");
		editor.clearSelection(index);
		soup.splice(index, 1);
	}

//if a creature is selected, delete it
	else if( (editor.creatureNumber >= 0) && (editor.creatureNumber < soup.length) )
	{
		debug.log("the creature number given (" + index + ") is not valid, checking if a creature is selected");
		debug.log("A creature (#" + editor.creatureNumber + ") is selected, removing and deselecting creature");

		soup.splice(editor.creatureNumber, 1);
		editor.creatureNumber = -1;
	}

	else
	{
		debug.log("Function removeCreature() don't know which creature to delete, so no creature was deleted");
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

editor.selectCreature = function selectCreature(e)
{
//function selectCreature() marks the <span> element clicked as selected,
//finds the creature that it represents, and puts its contents in the creature editor for editing

//some code will only run when Simulator is in debug mode
	var debug = Vatican.debugLog("function selectCreature() ran", Simulator.debug);

	var element = e.target || window.event.srcElement;	//gets the element clicked in IE or W3C-compliant browsers

	document.getElementById("visibleSoup").className = "editMode";

	debug.log("e = " + e);
	debug.log("element.nodeName = " + element.nodeName);
	debug.log("element.innerHTML = " + element.innerHTML);
	debug.log("element.style.backgroundColor = " + element.style.backgroundColor);

//if the element clicked represents a creature, stop the simulation and selected the creature
	if(element.nodeName == "SPAN")
	{
		Simulator.stop();

		var visibleSoup = document.getElementById("visibleSoup");

//make sure that the visual representation of the soup is valid
		if(!visibleSoup.firstChild || visibleSoup.firstChild.nodeName.toLowerCase() != "div")
		{
			Simulator.display.call(null);
		}

		visibleSoup = visibleSoup.firstChild;
		
		debug.log("visibleSoup.id = " + visibleSoup.id);
		debug.log("visibleSoup.nodeName = " + visibleSoup.nodeName);

		var size = soup.length;

		var loopCounter = 0;
		while((loopCounter < size) && (visibleSoup.childNodes[loopCounter] != element) )
		{
			loopCounter++;
		}

		debug.log("loopCounter = " + loopCounter);
		debug.log("soup[loopCounter].source = \n\n" + ( (soup[loopCounter]) ? soup[loopCounter].source : null) + "\n");
	}

//otherwise, deselect the creature
	else
	{
		editor.clearSelection();
		debug.log("element.nodeName = " + element.nodeName);
	}

//if the right kind of element was clicked, switch to the creature editor tab, show the 
//source code of the creature selected, show the color of the creature selected, and remember the number of that creature
	if(loopCounter < size)
	{
		if(editor.creatureNumber != -1)
		{
			visibleSoup.childNodes[editor.creatureNumber].className = "";	//deselect the visible element that was selected before
		}

		if(editor.creatureNumber == loopCounter)
		{
			editor.clearSelection();
		}

		else
		{
			editor.creatureNumber = loopCounter;					//remember which creature is selected
			visibleSoup.childNodes[loopCounter].className = "selected";		//show which creature is selected
			var creature = soup[loopCounter];

			if(typeof creature.source == "string")
			{
				document.getElementById("codeBox").value = creature.source;	//show the source code of the currently selected creature
			}

//if creature.color is a string, check if it's a valid rgb color
			if(typeof creature.color == "string")
			{
//if so, extract the red, green, and blue parts of an rgb color from it, and show them on the color picker
				if(Simulator.validColor.test(creature.color) || true)
				{
					debug.log("" + creature.color + " is a valid rgb color");

					var regx_number = /\d{1,3}/g;
					var colorsFound = creature.color.match(regx_number);

					debug.log("colors found in the rgb color " + creature.color + ": " + colorsFound);

					document.getElementById("red").value = colorsFound[0];
					document.getElementById("green").value = colorsFound[1];
					document.getElementById("blue").value = colorsFound[2];

					editor.colorPreview();
				}

				else
				{
					debug.log(creature.color + " is not a valid rgb color");
				}
			}

//if the creature has food, copy it to the food box
			if(typeof creature.food == "number")
			{
				debug.log("creature.food (" + creature.food + ") is a number");
				document.getElementById("food").value = creature.food.toString();
			}

			Vatican.switchTab("editTab");							//switch to the creature editor tab
		}

		debug.log("function selectCreature() found the creature that the element clicked represented");
		debug.log("editor.creatureNumber = " + editor.creatureNumber.toString() );
	}

	else
	{
		debug.log("function selectCreature() could not find the creature that the element clicked represented");
	}

//end of function
	debug.log("\nfunction ended");
	debug.show();

Simulator.display();

//end of function
	debug.show();
}
