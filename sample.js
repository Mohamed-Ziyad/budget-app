//module pattern
//to organise the code
//no data override
//data encapsulation hide the implementation

//budjet module
//function are object
const budgetController = (function() {
	const x = 23;

	const add = function(a) {
		//this is private can't access by outer scope
		return x + a;
	};

	return {
		//this is public can access by out scope
		publicTest: function(b) {
			return add(b); //closure can access the variaple and functions after they exicuted
		},
	};
})(); //IIFE it's create a new scope separate from other scope

const UIController = (function() {
	//some code
})();

const controller = (function(budgetCtrl, UICtrl) {
	//some code
	const x = budgetCtrl.publicTest(5); //budget controller module from controller module

	return {
		anotherPublic: function() {
			console.log(x); //so access by global scope we use this function
		},
	};
})(budgetController, UIController); //this are the args of contorller()
