//vatican.js
//all the scripts that don't belong in any other script

var Vatican = new Object();
Vatican.showHide = function showHide(element)
{
	if(element && (typeof element.className == "string") )
	{
		var regX_visible = /\b\Qvisible\E\b/;
		var regX_hidden = /\b\Qhidden\E\b/;
		var CSS = element.className.toString();

		if(CSS.search(regX_visible) > -1)
		{
			CSS.replace(regX_visible, "hidden");
		}

		else if(CSS.search(regX_hidden) > -1)
		{
			CSS.replace(regX_hidden, "visible");
		}

		element.className = CSS;
	}
}

Vatican.switchTab = function switchTab(id)
{
//function switchTab() changes the visible tab to the one with ID=checked_radio_button.value

	var trackerText = "Function switchTab() ran\n";

//initialize variables
	var regX_visible = /\bvisible\b/;
	var regX_hidden = /\bhidden\b/;
	var CSS = "";
	var currentElement = document.getElementById("tabTops").firstChild;
	var currentTab = document.getElementById(currentElement.value);

//if text is passed to function switchTab() and that text is the ID of a valid element,
//id_given will be TRUE

	var id_given = (typeof id == "string" && document.getElementById(id) && document.getElementById(id).parentNode.id == "tabTops");

//loop through the tabs and make the right one visible
	while(currentElement)
	{
		if(currentElement.type == "radio")
		{
//get the DOM element with the ID stored in currentElement.value

			currentTab = document.getElementById(currentElement.value);
			CSS = currentTab.className.toString();

//if the id of a valid form element was passed to function switchTab(),
//and if currentElement.id == that id, check the current element

			if(id_given && currentElement.id == id)
			{
				currentElement.checked = true;
			}

//if the id of a valid form element was passed to function switchTab(),
//and if currentElement != that id, uncheck the current element

			else if(id_given)
			{
				currentElement.checked = false;
			}

//if the current element is checked, prepare to make it visible
			if(currentElement.checked == true)
			{
				CSS = CSS.replace(regX_hidden, "visible");
			}

//otherwise, prepare to hide that element
			else
			{
				CSS = CSS.replace(regX_visible, "hidden");
			}

			currentTab.className = CSS;	//show or hide currentElement
		}

		currentElement = currentElement.nextSibling;
	}
}

Vatican.isEnter = function isEnter(e)
{
	var debug = Vatican.debugLog("function isEnter() ran\ne = " + e, Simulator.debug);

	var e = e || window.event;

	debug.log("e.keyCode = " + e.keyCode);
	debug.show();

	if(e.keyCode == 13)
	{
		return true;
	}

	else
	{
		return false;
	}
}

Vatican.debugLog = function debugLog(text, on)
{
//function debugLog() returns a [debugLog] object
//a [debugLog] object has the following properties:
//on			if set to TRUE, methods of a [debugLog] object will work
//message	all text logged so far
//log			adds text to the message property and formats it for easy reading
//show		alert([debugLog].message)

	text = text + "\n";
	on = (on) ? true:false;

	return {
		message:	text,
		on:		on,
		show:		function()	{if(this.on){alert(this.message) } },
		log:		function(stuff)	{if(this.on){this.message += "\n" + stuff} }
		}
}

Vatican.validate = function validate(element, accept, erase)
{
//function validate() is meant for validating text input from a GUI.
//it removes any characters that match pattern [erase], then checks if the remaining string matches pattern [accept]
//if the match succeeds, it returns the string that matches
//if the match fails, it returns [false]

//it requires the first two arguments; the third is optional:
//[element]:	A reference to a DOM element with property [value], typically a textbox or an [input type="text"]
//[accept]:	a regular expression that the text must match after all characters matching the last parameter have been removed
//[erase]:	optional.  A regular expression. Any match will be deleted

	var text = element.value.toString();

	if(erase)
	{
		text = text.replace(erase, "");	//filter the text through the regular expression(s) provided
	}

//if a second parameter was not given, throw an error
	if(!accept)
	{
		throw new Error("function validate(" + arg + ", " + accept + ", " + remove + "): a second parameter is required.  It can be a regular expression or a string.");
	}

	element.value = text;
	
	if(accept.test(text) )
	{
		return text;
	}

	else
	{
		return false;
	}
}

//add a proper Object.toString()
Vatican.objectToString = function(obj,separator)
{
	var prop;
	var temp = [];
	var length = temp.length;

	if(typeof separator != "string")
	{
		var separator = "\n";
	}

	for(prop in obj)
	{
		if(obj.hasOwnProperty(prop) )
		{
			temp[length] = prop + ": " + obj[prop];
			length++;
		}
	}

	temp.push("}");

	return "{\n" + temp.join(separator);
}
