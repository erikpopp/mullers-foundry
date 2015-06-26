//startup.js
//calls functions from other script files, and initializes the simulator

var soup = new Array();	//create the array [soup]

Simulator.blankCreature = Simulator.Creature("","rgb(255,255,255)", 0);
var ancestor = Simulator.Creature("this.food++; soup.push( {source: this.source, food: 1, color: 'rgb(200,200,200)' } )", "rgb(200,200,200)", 1);
soup.push( Simulator.Creature(ancestor.source, ancestor.color, ancestor.food) );
