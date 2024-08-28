import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Expense } from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create expense
const createExpense = asyncHandler(async (req, res) => {
    const { clientId, userId, userName, amount, description, dateOfSubmitted, status, category, attachment, scan } = req.body;

    if (
        [clientId, userId, userName, amount, description, dateOfSubmitted, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!");
    }

    const expense = await Expense.create({
        clientId,
        userId,
        userName,
        amount,
        description,
        dateOfSubmitted,
        status,
        category,
        attachment,
        scan
    });

    res.status(201).json(
        new ApiResponse(201, expense, "Expense created successfully")
    );
});

// Get expense details by ID
const getExpenseDetails = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }
    res.status(200).json(new ApiResponse(200, expense, "Expense details retrieved successfully"));
});

// Get all expenses with filters
const getExpenses = asyncHandler(async (req, res) => {
    const { clientId, userId, userName, status, dateOfSubmitted } = req.query;
    const query = {};

    if (clientId) {
        query.clientId = clientId;
    }
    if (userId) {
        query.userId = userId;
    }
    if (userName) {
        query.userName = { $regex: userName, $options: 'i' }; // Case-insensitive match
    }
    if (status) {
        query.status = status;
    }
    if (dateOfSubmitted) {
        query.dateOfSubmitted = dateOfSubmitted;
    }

    const expenses = await Expense.find(query);
    res.status(200).json(new ApiResponse(200, expenses, "Expenses retrieved successfully"));
});

// Update expense by ID
const updateExpense = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['clientId', 'userId', 'userName', 'amount', 'description', 'status', 'dateOfSubmitted', 'category', 'attachment', 'scan'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        throw new ApiError(400, "Invalid updates!");
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    updates.forEach((update) => expense[update] = req.body[update]);

    await expense.save();
    res.status(200).json(new ApiResponse(200, expense, "Expense updated successfully"));
});

// Delete expense by ID
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }
    res.status(200).json(new ApiResponse(200, expense, "Expense deleted successfully"));
});

const getUserExpenseDetails = asyncHandler(async (req, res) => {
    const { userId } = req.query;
    const currentMonth = new Date().getMonth() + 1;

    const expenses = await Expense.find({
        userId: userId,
        dateOfSubmitted: {
            $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
            $lt: new Date(new Date().getFullYear(), currentMonth, 1)
        }
    });

    if (!expenses || expenses.length === 0) {
        throw new ApiError(404, "No expenses found for the given user and month");
    }

    res.status(200).json(new ApiResponse(200, expenses, "Expense details retrieved successfully"));
});


export { createExpense, getExpenseDetails, getExpenses, updateExpense, deleteExpense, getUserExpenseDetails };
