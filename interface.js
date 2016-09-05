//interface.js
//code that is specific to the UI

Interface = {
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
	}
}
