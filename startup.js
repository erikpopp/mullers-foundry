//startup.js
//calls functions from other script files, and initializes the simulator

$(document).ready(function(){
//	var debug = Vatican.debugLog("");
	window.soup = new Array();	//create the array [soup]

	Simulator.blankCreature = Simulator.Creature("","rgb(255,255,255)", 0);
	window.ancestor = Simulator.Creature("this.food++; soup.push( {source: this.source, food: 1, color: 'rgb(200,200,200)' } )", "rgb(200,200,200)", 1);
	soup.push( Simulator.Creature(ancestor.source, ancestor.color, ancestor.food) );
	document.getElementById('starter').focus();
	Interface.showSoup();
});
