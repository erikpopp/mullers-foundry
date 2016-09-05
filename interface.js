//interface.js
//code that is specific to the UI

Interface = {
	changeMutationRate: function changeMutationRate(){
//validates the textbox that stores the mutation rate
//if the textbox contains a valid number, pass to Simulator.changeMutationRate() to change the mutation rate
		var element = document.getElementById("mutationRate");
		var newRate = Vatican.validate(element, /^\d+$/, /\D+/g);

		if(newRate !== "")
		{
			Simulator.changeMutationRate(+newRate);
		}

		element.value = Simulator.mutationRate.toString();

	}
}
