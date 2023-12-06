let balanceText = document.getElementById("balance-text");
let incomeText = document.getElementById("income-text");
let expenseText = document.getElementById("expense-text");
let titleEl = document.getElementById('title');
let amountEl = document.getElementById('amount');
let typeEl = document.getElementById('type');
let submitBtn = document.getElementById('submit-btn');
let historyContainer = document.getElementById('history-list');

submitBtn.addEventListener('click', async (event)=> {
    event.preventDefault();
    const formdata = {
        title: titleEl.value,
        amount: amountEl.value,
        type: typeEl.value,
    }

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
    }

    try {
        const response = await fetch("http://localhost:3000/submit", options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const {incomes, expenses, transactionArray} = await response.json();
        console.log(transactionArray);
        if (incomes) {
            incomeText.textContent = incomes[0].totalIncome;
        }

        if (expenses) {
            expenseText.textContent = expenses[0].totalExpense;
        }
        const balance = Number(incomes[0].totalIncome) - Number(expenses[0].totalExpense);
        balanceText.textContent = balance;

        historyContainer.textContent = "";
        transactionArray.map(transaction => {
            let divEl = document.createElement('div');
            historyContainer.appendChild(divEl);
            divEl.classList.add('history-sec');

            let titleEl = document.createElement('p');
            titleEl.textContent = transaction.title;
            divEl.appendChild(titleEl);

            let amountEl = document.createElement('p');
            amountEl.textContent = transaction.amount;
            divEl.appendChild(amountEl);
            
            let typeEl = document.createElement('p');
            typeEl.textContent = transaction.type;
            divEl.appendChild(typeEl);
        });
        window.alert("Transaction Saved!");
    } 
    catch(error) {
            console.error('Error:', error);
    }
});
    
// Function to fetch initial incomes and expenses


// Call fetchInitialData when the page is loaded
document.addEventListener("DOMContentLoaded", async function fetchInitialData() {
    console.log('DOMContentLoaded is fired');
    try {
        console.log('DOMContentLoaded try is fired');
        const response = await fetch("http://localhost:3000/initialData");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { incomes, expenses, transactionArray } = await response.json();

        if (incomes && incomes.length > 0) {
            incomeText.textContent = incomes[0].totalIncome || 0;
        }

        if (expenses && expenses.length > 0) {
            expenseText.textContent = expenses[0].totalExpense || 0;
        }

        const balance = (incomes[0]?.totalIncome || 0) - (expenses[0]?.totalExpense || 0);
        balanceText.textContent = balance;

        historyContainer.textContent = "";
        transactionArray.map(transaction => {
            let divEl = document.createElement('div');
            historyContainer.appendChild(divEl);
            divEl.classList.add('history-sec');

            let titleEl = document.createElement('p');
            titleEl.textContent = transaction.title;
            divEl.appendChild(titleEl);

            let amountEl = document.createElement('p');
            amountEl.textContent = transaction.amount;
            divEl.appendChild(amountEl);
            
            let typeEl = document.createElement('p');
            typeEl.textContent = transaction.type;
            divEl.appendChild(typeEl);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});


