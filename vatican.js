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

Vatican.validate = function validate(arg, accept, erase)
{
//function validate() is meant to run as an event handler, but can be run as a string method or on its own
//it processes the string passed as its first argument, and returns the result

//it requires two argument, the last is optional:
//[arg]:	A string to validate according to the first two parameters, or a reference to a text box.  The text box can be either a textarea or an input type="text"
//[accept]:	a string or regular expression that the text must match after all characters matching the last parameter have been removed
//[erase]:	optional.  A string or regular expression. Any match will be deleted

	if(arg.nodeName && (typeof arg.value === "string") )
	{
		var element = arg;	//[arg] is an HTML text box
		var text = arg.value.toString();	//get the text to validate
	}

	else if(typeof arg === "string")
	{
		var text = arg;
	}

	else
	{
		throw new Error("function validate(" + arg + ", " + accept + ", " + erase + "): neither a string nor an HTML text box was passed as the first parameter");
	}

	if(erase)
	{
		text = text.replace(erase, "");	//filter the text through the regular expression(s) provided
	}

//if a second parameter was not given, throw an error
	if(!accept)
	{
		throw new Error("function validate(" + arg + ", " + accept + ", " + remove + "): a second parameter is required.  It can be a regular expression or a string.");
	}

	if(typeof accept === "string")
	{
		accept = new RegExp(accept);	//if the second parameter is a string, convert it to a regular expression
	}

	var valid = accept.test(text);

	if(element && (element.value != text) )
	{
		element.value = text;	//if the first parameter is an HTML text box, replace its value if needed
	}

	return (valid) ? text : "";
}

//add a proper Object.toString()
Object.prototype.toString = function(separator)
{
	var prop;
	var temp = ["{"];
	var length = 1;

	if(typeof separator != "string")
	{
		var separator = "\n";
	}

	for(prop in this)
	{
		if(this.hasOwnProperty(prop) )
		{
			temp[length] = prop + ": " + this[prop];
			length++;
		}
	}

	temp.push("}");

	return temp.join(separator);
}
