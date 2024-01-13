"user script";

// ? USER DATA -

const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		"2019-11-18T21:31:17.178Z",
		"2019-12-23T07:42:02.383Z",
		"2020-01-28T09:15:04.904Z",
		"2020-04-01T10:17:24.185Z",
		"2020-05-08T14:11:59.604Z",
		"2020-07-26T17:01:17.194Z",
		"2020-07-28T23:36:17.929Z",
		"2020-08-01T10:51:36.790Z",
	],
	currency: "EUR",
	locale: "pt-PT", // de-DE
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2019-12-25T06:04:23.907Z",
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-06-25T18:49:59.371Z",
		"2020-07-26T12:01:20.894Z",
	],
	currency: "USD",
	locale: "en-US",
};

const accounts = [account1, account2];

// ? ELEMENT SELECTIONS -

const userName = document.querySelector(".user_name");
const userPin = document.querySelector(".user_pin");
const app = document.querySelector(".app");
const welcomeLabel = document.querySelector(".welcome_heading");
const movementsContainer = document.querySelector(".movements");
const balance = document.querySelector(".bank_balance");
const cashIn = document.querySelector(".summary_in");
const cashOut = document.querySelector(".summary_out");
const cashInterest = document.querySelector(".summary_interest");
const transferTo = document.querySelector("#transfer");
const transferAmount = document.querySelector("#transfer_amount");
const loanAmount = document.querySelector("#loan");
const confirmUser = document.querySelector("#user_confirm");
const confirmPin = document.querySelector("#confirm_pin");

// * BUTTONS -

const loginBtn = document.querySelector(".login_btn");
const transferBtn = document.querySelector(".transfer--btn");
const loanBtn = document.querySelector(".loan--btn");
const closeBtn = document.querySelector(".close--btn");

// ? FUNCTIONS -

// * UPDATE USER ID -

const updateUser = function () {
	accounts.forEach((account) => {
		const username = account.owner
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toLowerCase();
		account.userId = username;
	});
};

updateUser();

// * UPDATE USER INTERFACE -

const updateUI = function (acc) {
	displayMovements(acc);
	currentBalance(acc);
	summaryUpdated(acc);
};

// * APP TIMER -

const mainTimer = function (minutes) {
	const timerFunction = {};
	let time = minutes;
	timerFunction();
	return setTimeout(timerFunction, 1000);
};

// * UPDATE MOVEMENTS -

const displayMovements = function ({ movements }) {
	movementsContainer.innerHTML = "";
	movements.forEach((mov, num) => {
		const type = mov > 0 ? "deposit" : "withdrawl";
		const movEl = `
          <div class="movement">
            <p class="movement_money type_${type}">${
			num + 1
		} ${type.toUpperCase()}</p>
            <p class="movement_date">12/03/2021</p>
            <p class="movement_amount">${mov}$</p>
          </div>`;
		movementsContainer.insertAdjacentHTML("afterbegin", movEl);
	});
};

// * UPDATE SUMMARY -

const summaryUpdated = function (account) {
	const moneyIn = account.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov);
	cashIn.textContent = Number(moneyIn).toFixed(2) + "$";

	const moneyOut = account.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov);
	cashOut.textContent = Number(moneyOut * -1).toFixed(2) + "$";

	const moneyInterest = account.movements
		.filter((mov) => mov > 0)
		.map((dep) => (dep * account.interestRate) / 100)
		.filter((int) => int >= 1)
		.reduce((acc, mov) => acc + mov, 0);
	cashInterest.textContent = Number(moneyInterest).toFixed(2) + "$";
};

// * UPDATE CURRENT BALANCE -

const currentBalance = function (account) {
	account.netBalance = account.movements.reduce((total, mov) => total + mov);
	balance.textContent = account.netBalance + "$";
};

// ? EVENT HANDLERS -

let currentAccount, appTimer;

loginBtn.addEventListener("click", function (e) {
	e.preventDefault();

	// * RETURNING THE CURRENT ACCOUNT -
	currentAccount = accounts.find(
		(account) => account.userId === userName.value
	);

	// * UPDATING THE WELCOME TEXT AND UI-
	if (currentAccount?.pin === +userPin.value) {
		welcomeLabel.textContent = `Welcome back, ${
			currentAccount?.owner.split(" ")[0]
		}`;
		app.style.opacity = 1;
	}

	userName.value = userPin.value = "";
	userPin.blur();

	updateUI(currentAccount);
});

app.style.opacity = 1;

transferBtn.addEventListener("click", function (e) {
	e.preventDefault();
	const transferMov = Number(transferAmount.value);
	const recipient = accounts.find(
		(account) => account.userId === transferTo.value
	);

	if (
		transferMov > 0 &&
		currentAccount.netBalance >= transferMov &&
		recipient?.userId !== currentAccount.userId &&
		recipient
	) {
		currentAccount.movements.push(-transferMov);
		recipient?.movements.push(transferMov);
	}

	transferAmount.value = transferTo.value = "";
	updateUI(currentAccount);
});

loanBtn.addEventListener("click", function (e) {
	e.preventDefault();
	const loanMov = Number(loanAmount.value);
	const validation = currentAccount.movements.some(
		(mov) => mov >= loanMov * 0.1
	);

	if (validation && loanMov > 0) {
		currentAccount.movements.push(loanMov);
	}

	loanAmount.value = "";
	loanAmount.blur();
	updateUI(currentAccount);
});

closeBtn.addEventListener("click", function (e) {
	e.preventDefault();
	if (
		currentAccount.userId === confirmUser.value &&
		currentAccount.pin === Number(confirmPin.value)
	) {
		app.style.opacity = 0;
		currentAccount = null;
	}
	confirmPin.value = confirmUser = "";
});


