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

Vatican.switchTab = function switchTab(nodeEventOrId)
{
//function switchTab() changes the visible tab to the one the given DOM node as a tab top
//if no node is given, switchTab() will switch to whichever one is clicked
//it's meant to be assigned to the container of a group of tabs
	var allTabTops = document.getElementById("tabTops");
	var allTabBodies = document.getElementById("tabContainer");
	var debug = Vatican.debugLog('function switchTab("' + nodeEventOrId + '")', Simulator.debug);
	var newTabBody;
	var newTabNumber;	//used to associate tab bodies with tab tops, even though they're in different containers
										//I assume that a tab tops will be in the same order as the tab bodies
	var newTabTop;		//stores a reference to the top part of a tab
	var oldTabBody;
	var oldTabNumber;
	var oldTabTop;		//holds a reference to the currently selected tab top
	debug.log("node/event is a " + typeof nodeEventOrId);

//get the element that represents the top of the tab to switch to
//this will either be the element clicked, or the element with the given ID
//don't pass it the ID of the tab's body
	if(nodeEventOrId.nodeName)
	{
		debug.log('a DOM node was passed, switching to tab with outerHTML = \n' + nodeEventOrId.outerHTML);
		newTabTop = nodeEventOrId;
	}

	else if(nodeEventOrId.target)
	{
		debug.log("using the industry-standard way of accessing the element clicked");
		newTabTop = nodeEventOrId.target;
	}

	else if(nodeEventOrId.srcElement)
	{
		debug.log("this is Internet Explorer, so I have to call the element clicked by a different name");
		newTabTop = nodeEventOrId.srcElement;
	}

	else if(typeof nodeEventOrId === "string")
	{
		debug.log('I was given the string of text "' + nodeEventOrId + '", assuming that this is the ID of a DOM element');
		newTabTop = document.getElementById(nodeEventOrId);
	}

	else
	{
		debug.log("I don't know what to do, so I'll give you this message and quit");
		debug.log("here's what was passed to me:\n" + nodeEventOrId);
		debug.show();
		return;
	}

	debug.log("newTabTop.outerHTML = \n" + newTabTop.outerHTML);

//verify that the element given is a radio button
	if(newTabTop && newTabTop.type === "radio")
	{
		debug.log("I was given a radio button, checking it programmatically so the editor looks right when this function is called by another function");
		newTabTop.checked = true;
	}

	else
	{
		debug.log("I wasn't given a radio button, so I'll show you this error and quit");
		debug.log("newTabTop.type = " + newTabTop.type);
		debug.show();
		return;
	}

//find the body of the new tab by assuming that tab tops and tab bodies are in the same order, and treating child element collections like arrays
	newTabNumber = Array.prototype.indexOf.call(newTabTop.parentElement.children, newTabTop);	//treat the collection of children of an element as an array, and get the index of the top of the tab.  As long as the tab tops are in the same order as the tab bodies, I can show the tab body that's at the same position, and I don't need any hard-coded reference to it
	debug.log("selecting tab #" + newTabNumber);

//find the body of the new tab
	newTabBody = allTabBodies.children[newTabNumber];
	debug.log("newTabBody.outerHTML = \n" + newTabBody.outerHTML);

//find the old tab top and body
//easily handle the case where no tab has yet been selected
	if(typeof Vatican.currentTab === "number")
	{
		debug.log("Vatican.currentTab.outerHTML = \n" + Vatican.currentTab.outerHTML);
		oldTabTop = Vatican.currentTab;
		oldTabNumber = Array.prototype.indexOf.call(oldTabTop.parentElement.children, oldTabTop);
		oldTabBody = allTabBodies.children[oldTabNumber];
	}

	else
	{
		debug.log("no current tab on file, it looks like this is the first time that a tab has been clicked");
		debug.log("finding currently opened tab by finding which tab is visible");
		oldTabBody = newTabBody.parentElement.querySelector(".visible");
		oldTabNumber = Array.prototype.indexOf.call(oldTabBody.parentElement.children, oldTabBody);
		oldTabTop = allTabTops.children[oldTabNumber];
	}

	debug.log("oldTabTop.outerHTML = \n" + oldTabTop.outerHTML);
	debug.log("oldTabNumber = " + oldTabNumber);
	debug.log("oldTabBody.outerHTML = \n" + oldTabBody.outerHTML);

//if the editor is selected, deselect it
	if(newTabTop.id !== "tabTopEditor")
	{
		editor.deSelectCreature(editor.creatureNumber);
	}
//show the current tab
	oldTabBody.className = "hidden";
	Vatican.currentTabTop = newTabTop;
	newTabBody.className = "visible";

	debug.show();
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
