//////------------------------    Numbers    ---------------------- //////
//////------------------------   Section   ------------------------ //////

'use strict';

// Data

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 1500, 1000],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2022-07-13T14:11:59.604Z',
		'2022-07-14T14:11:59.604Z',
		'2022-07-15T14:11:59.604Z',
		'2022-07-17T17:01:17.194Z',
		'2022-07-18T23:36:17.929Z',
		'2022-07-19T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////

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




/// passin the locale to the function

const formatMovementDate = function (date, locale) {

	const calcDaysPassed = function (date1, date2) {

		let sum = Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

		return sum;

	};


	const daysPassed = calcDaysPassed(new Date(), date)



	if (daysPassed === 0) {
		return `Today`;
	}

	if (daysPassed === 1) {
		return `Yesterday`;
	}

	if (daysPassed <= 7) {

		return `${daysPassed} days ago`
	}

	else {

		// const day = `${date.getDate()}`.padStart(2, 0);

		// const month = `${date.getMonth() + 1}`.padStart(2, 0);

		// const year = date.getFullYear();

		// return `${day}/${month}/${year}`;


		/// use the internationalization INTL format method
		/// get the locale  and date from the arguments passed in

		return new Intl.DateTimeFormat(locale).format(date);

	}


}






const displayMovements = function (acc, sort = false) {

	document.querySelector('.movements').innerHTML = '';

	const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

	movs.forEach(function (mov, i) {

		const type = mov > 0 ? 'deposit' : 'withdrawal';


		const date = new Date(acc.movementsDates[i]);


		/// call the function with the locale included


		const displayDate = formatMovementDate(date, acc.locale);


		const html = `
		
		<div class="movements__row">				
				<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>	
				
				
				<div class="movements__date">${displayDate}</div>
				
								
				<div class="movements__value">${mov.toFixed(2)}€</div>													
		</div>`;

		document.querySelector('.movements').insertAdjacentHTML('afterbegin', html);

	});
};




function updateUI(acc) {


	displayBalance(acc);

	displayMovements(acc);

	displaySummary(acc);

}


const displayBalance = function (currAcc) {


	currAcc.balance = currAcc.movements.reduce((acc, mov) => acc + mov, 0);

	labelBalance.textContent = `${currAcc.balance}€ `;


};



const displaySummary = function (currAcc) {


	const incomes = currAcc.movements
		.filter(mov => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);


	labelSumIn.textContent = ` ${incomes.toFixed(2)}€`;



	const out = currAcc.movements
		.filter(mov => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);


	labelSumOut.textContent = ` ${Math.abs(out).toFixed(2)}€`;



	const interest = currAcc.movements

		.filter(mov => mov > 0)
		.map(deposit => (deposit * currAcc.interestRate) / 100)
		.filter(int => int >= 1)
		.reduce((acc, int) => acc + int, 0);


	labelSumInterest.textContent = `${interest.toFixed(2)}€`;


};



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


		/// adding the date and timeZone


		const now = new Date();



		const options = {

			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'numeric',
			year: 'numeric'

		}



		/// use the locale from each object using the currentAccount



		labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);



		/////////////////////////////////


		inputLoginUsername.value = inputLoginPin.value = '';

		inputLoginPin.blur();




		updateUI(currentAccount);


	}
});




btnTransfer.addEventListener('click', function (e) {


	e.preventDefault();


	const amount = +inputTransferAmount.value;



	const recieverAccount = accounts.find(

		acc => acc.username === inputTransferTo.value

	);

	console.log(recieverAccount, amount);


	if (

		amount > 0 &&

		recieverAccount &&

		currentAccount.balance >= amount &&

		recieverAccount?.username !== currentAccount.username) {



		currentAccount.movements.push(-amount);

		recieverAccount.movements.push(amount);

		inputTransferAmount.value = inputTransferTo.value = '';

		currentAccount.movementsDates.push(new Date());

		recieverAccount.movementsDates.push(new Date());



		updateUI(currentAccount)

	}

});




btnClose.addEventListener('click', function (e) {

	e.preventDefault();


	if (

		inputCloseUsername.value === currentAccount.username &&
		+inputClosePin.value === currentAccount.pin) {


		const index = accounts.findIndex(acc => acc.username === currentAccount.username);


		accounts.splice(index, 1);

		containerApp.style.opacity = 0;

	}

	inputCloseUsername.value = inputClosePin.value = '';


})




btnLoan.addEventListener('click', function (e) {


	e.preventDefault();



	const amount = Math.floor(inputLoanAmount.value);


	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {


		currentAccount.movements.push(amount);


		inputLoanAmount.value = '';

		currentAccount.movementsDates.push(new Date());



		updateUI(currentAccount);

	}


})



let sorted = false;


btnSort.addEventListener('click', function (e) {


	e.preventDefault;

	displayMovements(currentAccount, !sorted)

	sorted = !sorted;


});



