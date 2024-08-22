import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Expense } from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create expense
const createExpense = asyncHandler(async (req, res) => {
    const { clientId, userId, userName, amount, description, dateOfSubmitted, status, category, attachment, scan } = req.body;

    // Check if any of the required fields are missing or invalid
    if (
        [clientId, userId, userName, description, category].some((field) => typeof field === 'string' && field.trim() === "") ||
        [amount, dateOfSubmitted].some((field) => field === undefined || field === null)
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

// Get expenses with userId (POST method)
const getExpensesWithId = asyncHandler(async (req, res) => {
    const { clientId, userId, userName, status, dateOfSubmitted } = req.body;
    
    // Ensure the request is authenticated and userId is from req.user
    const authenticatedUserId = req.user._id; // Assume userId is part of the authenticated user object

    const query = {};

    if (clientId) {
        query.clientId = clientId;
    }
    if (userId) {
        // Only allow querying for the current user's expenses
        if (authenticatedUserId.toString() !== userId) {
            return res.status(403).json(new ApiResponse(403, {}, "Unauthorized to view these expenses"));
        }
        query.userId = userId;
    } else {
        // Default to the authenticated user's expenses if no userId is provided
        query.userId = authenticatedUserId;
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

export { createExpense, getExpenseDetails, getExpenses, updateExpense, deleteExpense,getExpensesWithId };
