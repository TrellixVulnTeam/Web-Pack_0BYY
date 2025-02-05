//////------------------------  BANKIST APP ------------------------ //////
//////------------------------  ----------- ------------------------ //////

'use strict';

// Data

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};



const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};



const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};



const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};




// Array of the account objects


const accounts = [account1, account2, account3, account4];


// Elements


const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');


const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');


const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');


const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



////////////////////////////////////////////////////////////////////////////////////////




//--  display movements --//



const displayMovements = function (movements) {



	document.querySelector('.movements').innerHTML = '';

	movements.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
		
		<div class="movements__row">		
		<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>		
		<div class="movements__value">${mov}€</div>									
		</div>`;

		document.querySelector('.movements').insertAdjacentHTML('afterbegin', html);
	});
};



//-- display balance --//


/// now pass in the whole currentAccount object and create a balance property



const displayBalance = function (currAcc) {



	// const balance = currAcc.movements.reduce((acc, mov) => acc + mov, 0);

	// currAcc.balance = balance;

	// labelBalance.textContent = '€' + balance;




	/// instead of creating a variable and then a property,
	/// just create a property and use the object: value



	currAcc.balance = currAcc.movements.reduce((acc, mov) => acc + mov, 0);


	labelBalance.textContent = `${currAcc.balance}€ `;


};




//-  display summary --//



const displaySummary = function (currAcc) {


	const incomes = currAcc.movements
		.filter(mov => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);


	labelSumIn.textContent = ` ${incomes}€`;



	const out = currAcc.movements
		.filter(mov => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);


	labelSumOut.textContent = ` ${Math.abs(out)}€`;



	const interest = currAcc.movements

		.filter(mov => mov > 0)
		.map(deposit => (deposit * currAcc.interestRate) / 100)
		.filter(int => int >= 1)
		.reduce((acc, int) => acc + int, 0);


	labelSumInterest.textContent = `${interest}€`;


};




//-- create username --//



const createUserName = function (accs) {

	accs.forEach(function (acc) {

		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
};



createUserName(accounts);



// -- Create login -- //



let currentAccount;


btnLogin.addEventListener('click', function (e) {

	e.preventDefault();

	currentAccount = accounts.find(

		acc => acc.username === inputLoginUsername.value

	);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {

		labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]

			}`;


		containerApp.style.opacity = 100;


		inputLoginUsername.value = inputLoginPin.value = '';


		inputLoginPin.blur();




		/// Re-factor the 3 display functions(also in the money transfer) into 1 UI function


		// displayBalance(currentAccount);


		// displayMovements(currentAccount.movements);


		// displaySummary(currentAccount);


		updateUI(currentAccount);


	}
});



// ----------------------- 6. Money transfer ------------------------ //



btnTransfer.addEventListener('click', function (e) {


	/// form - prevent default


	e.preventDefault();



	/// create a variable for the amount to transfer from input field - AS a number


	const amount = Number(inputTransferAmount.value);



	/// create a variable for the reciever account, and use find with value from input field,
	/// to loop thru accounts array and match with the username 



	const recieverAccount = accounts.find(

		acc => acc.username === inputTransferTo.value

	);

	console.log(recieverAccount, amount);


	/// check if the current account balance is greater than the transfer amount
	/// and also greater than 0 


	//! The current account balance is not saved to a variable yet!
	//! Use the displayBalance function to create a property and value,
	//! to hold the balance in each account, then pass into the function the whole account,
	//! instead of just the movements


	if (
		amount > 0 &&

		// amount is over 0

		recieverAccount &&

		// reciever account exists

		currentAccount.balance >= amount &&

		// Theres enough money in the currentAccount

		recieverAccount?.username !== currentAccount.username) {

		// check again if reciever account exist, and is not the same as current account

		console.log('TRANSFERED');



		/// transfering the money from one account to another



		/// push the negative amount to the current account movements



		currentAccount.movements.push(-amount);



		/// push the amount to the reciever account movements



		recieverAccount.movements.push(amount);



		/// clear the input fields of any values left in them, by setting to empty string



		inputTransferAmount.value = inputTransferTo.value = '';



		//! And thats it!!



		/// now update the UI with the new balances / movements


		//! Re-factor the 3 display functions(also in the create login) into 1 UI function
		//! then call the UI function here and in create login


		updateUI(currentAccount)

	}



});



// --- UI Function Declaration -- //


/// set parameter to acc so any account can be passed in


function updateUI(acc) {

	displayBalance(acc);


	displayMovements(acc.movements);


	displaySummary(acc);



}



