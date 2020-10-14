//BUDGET CONTROLLER
const budgetController = (function() {
	//data model for expense and income
	//function construction
	const Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	const Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expense.prototype.calculatePercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};
	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	const calculateTotal = function(type) {
		//this a private function
		let sum = 0;
		//running a foreach to array for sun the total
		data.allItems[type].forEach(function(cur, ind, arr) {
			//this has 3 para
			//anonymus function
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	//data structure to store all the income and expense data
	let data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1, //means not existence -1
	};

	//public methodes or add mthodes to global scope or making the methode public
	return {
		addItem: function(type, des, value) {
			let newItem, ID;

			//id = last id +1
			//create new id
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//cteate new item based on inc or exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, value); //instance
			} else if (type === 'inc') {
				newItem = new Income(ID, des, value); //instance
			}
			//selection array from object.allItem[name]
			//push it to data structure
			data.allItems[type].push(newItem);
			return newItem;
		},
		deleteItem: function(type, id) {
			let ids, index;
			//id = 3
			ids = data.allItems[type].map(function(current, index, array) {
				//amp function take 3 para like foreach
				return current.id; //this give only the ids [1,2,3,4,4], nothe the other object props
			});
			index = ids.indexOf(id); //this return the index of the id's element [1,2,3,4,5] if id =2 this give the index 1
			if (index !== -1) {
				//splice remove elemnt from the array
				data.allItems[type].splice(index, 1); //this take two args one give  the element location  thats index
				//second one the how many items to remoave
			}
		},
		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate budget :income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of the income that we spent
			if (data.totals.inc > 0) {
				//to fix the presentage infinity
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		calculatePercentages: function() {
			data.allItems.exp.forEach(function(current) {
				//run cal percentages each element so forEach method is help full
				//it take 3 args current, index and array
				current.calculatePercentage(data.totals.inc); //here we accessing calculate method in prototype
			});
		},
		getPercentages: function() {
			//map give a new array
			//for each not
			let allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage(); //here are we accessing get percentage method
			});
			return allPerc;
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage,
			};
		}, //to return the data
		testing: function() {
			console.log(data);
		},
	};
})(); //IIFE it's create a new scope separate from other scope

//UI CONTROLLER
const UIController = (function() {
	const DOMStrings = {
		//html class names are store in this object
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensePercentageLabel: '.item__percentage',
		dateLablel: '.budget__title--month',
	};
	let formatNumber = function(num, type) {
		let numSplit, int, dec, sign;
		/**
		 * + or - nefore the number
		 * exactly 2 decimal points
		 * comma separating the thousand
		 * 2310.4567 -> 2,310.46
		 */
		num = Math.abs(num);
		num = num.toFixed(2); //its a number protype of number contructor
		//overriding to same number
		//js converts primitive object
		numSplit = num.split('.'); //this give array
		int = numSplit[0];

		if (int.length > 3) {
			//overide num
			//checking the number is thousand
			int =
				int.substr(0, int.length - 3) +
				',' +
				int.substr(int.length - 3, int.length); //input 21000 , out put 21,000
		}
		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};
	let nodeListForEach = function(list, callback) {
		//a list not an array
		for (let i = 0; i < list.length; i++) {
			callback(list[i], i); //each time call back fire it args are currrent eelement and index
		}
	};
	//get data from UI
	return {
		//by doingthis user controller become a global scope object
		getInput: function() {
			//selecting the element's value
			//return this value at once using object
			return {
				type: document.querySelector(DOMStrings.inputType).value, //will be + or -
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value), //input amount
			};
		},
		addListItem: function(obj, type) {
			let html, newHtml, element;

			//create html string with placehoder text
			//we can use template string insted place holder
			if (type === 'inc') {
				//if type inc select the inc class or select expense class
				element = DOMStrings.incomeContainer;
				html =
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expenseContainer;
				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//replace the placeholder text with some actual data
			//replace is method of string replacing the place holders
			newHtml = html.replace('%id%', obj.id); //override uisng newHtml
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			//Insert the html into the dom
			//appedning html element
			//it's inserted as a chiled of the container in the end
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		deleteListItem: function(selectorID) {
			//remove a child
			const el = document.getElementById(selectorID);
			//element
			//parent of the element
			//the the element again
			el.parentNode.removeChild(el);
		},
		clearFields: function() {
			let fields, fieldsArr;
			fields = document.querySelectorAll(
				//this returns a list so we need to convert this
				DOMStrings.inputDescription + ',' + DOMStrings.inputValue
			);
			//using call method on array protype slice metho to convert to list to array
			//slice retunr a new array
			//call nethod make a copy of the array to new array here its a lsit to ayya
			fieldsArr = Array.prototype.slice.call(fields); //this call the preperties of array or a object
			//for each loop methode same to for loop
			fieldsArr.forEach(function(current, index, array) {
				//index is the current tndex of the field array
				//array is the fields Array
				current.value = ''; //current elemet is the current html element here its input fields
				//then it's empty now
			});
			//select the input field in the array and add the focus
			//its the first item in the array
			fieldsArr[0].focus();
		},
		displayBudget: function(obj) {
			let type;
			obj.budget > 0 ? (type = 'inc') : (type = 'exp');
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
				obj.budget,
				type
			);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
				obj.totalInc,
				'inc'
			);
			document.querySelector(
				DOMStrings.expenseLabel
			).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent =
					obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},
		displayPersentages: function(percentages) {
			let fields;
			//query selector all gives a list
			fields = document.querySelectorAll(DOMStrings.expensePercentageLabel); //selecting the html elements

			nodeListForEach(fields, function(current, index) {
				//list and a callback
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = percentages[index] + '---';
				}
			});
		},
		displayMonth: function() {
			let now, year, month, day, months;
			months = [
				'jan',
				'feb',
				'mar',
				'apr',
				'may',
				'jun',
				'jul',
				'aug',
				'sep',
				'oct',
				'nov',
				'dec',
			];
			now = new Date(); //using date object constructor
			//let chrismas = new Date(2016,11,25)
			year = now.getFullYear();
			month = now.getMonth();
			day = now.getDay();
			document.querySelector(DOMStrings.dateLablel).textContent =
				day + ' ' + months[month].toLocaleUpperCase() + ' ' + year;
		},
		changeType: function() {
			let feilds;
			feilds = document.querySelectorAll(
				DOMStrings.inputType +
					',' +
					DOMStrings.inputDescription +
					',' +
					DOMStrings.inputValue
			);
			nodeListForEach(feilds, function(cur) {
				cur.classList.toggle('red-focus');
			});
			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
		},
		getDOMStrings: function() {
			return DOMStrings; //making it punlic
		},
	};
})();

//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {
	const setupEventListners = function() {
		const DOM = UICtrl.getDOMStrings();
		//event listner
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); //its a callback
		//kepress event
		//event refernce
		document.addEventListener('keypress', function(event) {
			//this is a anonymus function
			if (event.keyCode === 13 || event.which === 13) {
				//event.which for older browser
				ctrlAddItem();
			}
		});

		//event delegation for delete event listene
		document
			.querySelector(DOM.container) //event listner to the container so event target on child evement
			.addEventListener('click', ctrlDeleteItem); //its a callback

		//onchange event
		document
			.querySelector(DOM.inputType)
			.addEventListener('change', UICtrl.changeType);
	};

	const updateBudget = function() {
		let budget;
		//-1- calculate the budget
		budgetCtrl.calculateBudget();
		//-2- return the budget
		budget = budgetCtrl.getBudget(); //return budget data
		//-- display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	const updatePercentages = function() {
		let percentages;
		//1.calculate percentage
		budgetCtrl.calculatePercentages();
		//2. read percentages from the budget controller
		percentages = budgetCtrl.getPercentages(); //this gives an array
		//3.update the UI
		UICtrl.displayPersentages(percentages);
	};

	//DRY princliple
	const ctrlAddItem = function() {
		let input, newItem;
		//-1- get field input data
		//this has input object
		input = UICtrl.getInput(); //getInput is in global scope or public
		//validation
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// -2- add the item to the budget controller
			//this create using function constructor
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//-3- add the item to UI
			UICtrl.addListItem(newItem, input.type);

			//-4- clear the feilds
			UICtrl.clearFields();
			//-5- calculate and update budget
			updateBudget();
			//-6- calculate and update percentages
			updatePercentages();
		}
	};

	//2nd callback this is event delegation
	const ctrlDeleteItem = function(event) {
		let itemID, splitID, type, ID;
		//dom travasing secting a parent dom using a child dom
		//moving up child to parent
		//or using a child node to select the parent node calll dom travasing

		//event target is where it's clicked
		//where to fire the event using target
		//here it's hard coded
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //moving up in the dom tree
		//itemID = "inc-0" so its spliteted as type and ID
		if (itemID) {
			//if its true
			//inc-1 split method
			splitID = itemID.split('-'); //"inc-1" >>> "inc" "1" and retuns an array this give astrings in array
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1. delete the item from data structure
			budgetCtrl.deleteItem(type, ID); //delete from data
			//2. delete the item from the UI
			UICtrl.deleteListItem(itemID); //deleete from UI
			//3. update and show the new budget
			updateBudget();
			//-4- calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1,
			});
			setupEventListners();
			UICtrl.displayMonth();
		},
	};
})(budgetController, UIController); //this are the args of contorller() of this controller

controller.init(); //only line of code out side IIFE to initilize the function
