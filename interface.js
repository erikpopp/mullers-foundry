//interface.js
//code that is specific to the UI

Interface = {
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
