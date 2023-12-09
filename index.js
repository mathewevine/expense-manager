const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
app.use(express.static('public'));


const userName = process.env.MONGO_USER;
const userPassword = process.env.MONGO_PASS;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const uri = `mongodb+srv://${userName}:${userPassword}@bharatintern.cy0iz3b.mongodb.net/?retryWrites=true&w=majority`;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error(error);
    }
}

connect();

// user schema
const expenseSchema = new mongoose.Schema({
    title: String,
    amount: String,
    type: String,
});

// user model
const ExpenseMgr = mongoose.model('ExpenseManage', expenseSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//APIs
app.post('/submit', async (req, res) => {
    // Accessing form data from req.body
    const { title, amount, type } = req.body;

    const newExpense = new ExpenseMgr({
        title,
        amount,
        type,
    });

    try {
        // Save the user document to the Expense collection
        await newExpense.save();
        // Send a response
        const incomes = await ExpenseMgr.aggregate([
            {
                $match: { type: "income" } // Filter documents with type "income"
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $toDouble: "$amount" }} // Calculate the sum of the "amount" field
                }
            }
        ]);

        const expenses = await ExpenseMgr.aggregate([
            {
                $match: { type: "expense" } // Filter documents with type "income"
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: { $toDouble: "$amount" }} // Calculate the sum of the "amount" field
                }
            }
        ]);

        const transactionArray = await ExpenseMgr.find({}).exec();
        res.json({incomes, expenses, transactionArray});        
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/initialData', async (req, res) => {
    try {        
        // Send a response
        const incomes = await ExpenseMgr.aggregate([
            {
                $match: { type: "income" } // Filter documents with type "income"
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $toDouble: "$amount" }} // Calculate the sum of the "amount" field
                }
            }
        ]);

        const expenses = await ExpenseMgr.aggregate([
            {
                $match: { type: "expense" } // Filter documents with type "income"
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: { $toDouble: "$amount" }} // Calculate the sum of the "amount" field
                }
            }
        ]);

        const transactionArray = await ExpenseMgr.find({}).exec();
        res.json({incomes, expenses, transactionArray});        
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, ()=> {
    console.log(`Server running in Port: ${port}`);
});