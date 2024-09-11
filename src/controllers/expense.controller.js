import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Expense } from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from "../models/client.model.js";

// Create expense
const createExpense = asyncHandler(async (req, res) => {
    const { clientId, userId, userName, amount, description, dateOfSubmitted, status, category, attachment, scan, reason, reply } = req.body;

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
        scan,
        reason,
        reply
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
    const allowedUpdates = ['clientId', 'userId', 'userName', 'amount', 'description', 'status', 'dateOfSubmitted', 'category', 'attachment', 'scan', 'reason', 'reply'];
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

// Update expense status by ID
const updateExpenseStatus = asyncHandler(async (req, res) => {
    const { status, reason, reply } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    expense.status = status;
    expense.reason = reason;
    expense.reply = reply;

    await expense.save();

    res.status(200).json(new ApiResponse(200, expense, "Expense status updated successfully"));
});


const getUserExpenseDetails = asyncHandler(async (req, res) => {
    const { userId, month } = req.body;

    // Use the provided month or default to the current month
    const selectedMonth = month || new Date().getMonth() + 1;

    const expenses = await Expense.find({
        userId: userId,
        dateOfSubmitted: {
            $gte: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
            $lt: new Date(new Date().getFullYear(), selectedMonth, 1)
        }
    });

    if (!expenses || expenses.length === 0) {
        throw new ApiError(404, "No expenses found for the given user and month");
    }

    res.status(200).json(new ApiResponse(200, expenses, "Expense details retrieved successfully"));
});
const getExpenseListByMonth = asyncHandler(async (req, res) => {
    const { userId, month, year } = req.query;
    // Parse month and year as integers, or use the current month/year as default
    const selectedMonth = parseInt(month, 10) || new Date().getMonth() + 1;
    const selectedYear = parseInt(year, 10) || new Date().getFullYear();

    // Calculate the start date as the first day of the selected month
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);

    // Calculate the end date as the last day of the selected month
    const endDate = new Date(selectedYear, selectedMonth, 0);
    // Check if the requester is an admin
    const isAdmin = await Client.findById({ _id: userId });
    let expenses = []
    if (isAdmin) {
        // If the requester is an admin, return all absences
        expenses = await Expense.find({ status: "pending" }).select('_id userName createdAt');
        return res.status(200).json(new ApiResponse(200, expenses, "All expenses retrieved successfully"));
    } else {
        // Fetch activities for the user within the date range
        expenses = await Expense.find({
            _id: userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).select('_id name lastName createdAt');
        // Return the activities for the specific user
        res.status(200).json(new ApiResponse(200, expenses, "expenses details retrieved successfully"));
    }

    // Handle case where no activities are found for the user
    if (!expenses || expenses.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No expenses found for the given user and month"));
    }


});
export { createExpense, getExpenseDetails, getExpenses, updateExpense, deleteExpense, updateExpenseStatus, getUserExpenseDetails, getExpenseListByMonth };
