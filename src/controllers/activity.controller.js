import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from "../models/client.model.js";

// Create Activity
const createActivity = asyncHandler(async (req, res) => {
    const activity = await Activity.create(req.body);
    res.status(201).json(new ApiResponse(201, activity, "Activity created successfully"));
});

// Update Activity
const updateActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }
    res.status(200).json(new ApiResponse(200, activity, "Activity updated successfully"));
});

// List Activities with Filters
const listActivities = asyncHandler(async (req, res) => {
    const { name, department, status, role, workType, userId } = req.query;
    const filter = {};
    if (userId) {
        filter.userId = userId;
    }
    if (name) filter.name = new RegExp(name, 'i');
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (workType) filter.workTypes = workType;

    const activities = await Activity.find(filter);
    res.status(200).json(new ApiResponse(200, activities, "Activities retrieved successfully"));
});

// Get Activity Detail
const getActivityDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }
    res.status(200).json(new ApiResponse(200, activity, "Activity retrieved successfully"));
});

// Delete Activity
const deleteActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
        throw new ApiError(404, "Activity not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Activity deleted successfully"));
});

const getUserActivityDetails = asyncHandler(async (req, res) => {
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
    let activities = []
    if (isAdmin) {
        // If the requester is an admin, return all activities
        activities = await Activity.find({});
        return res.status(200).json(new ApiResponse(200, activities, "All activities retrieved successfully"));
    } else {
        // Fetch activities for the user within the date range
        activities = await Activity.find({
            _id: userId,
            createdDate: {
                $gte: startDate,
                $lt: endDate
            }
        });
        // Return the activities for the specific user
        res.status(200).json(new ApiResponse(200, activities, "Activity details retrieved successfully"));
    }

    // Handle case where no activities are found for the user
    if (!activities || activities.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No activities found for the given user and month"));
    }


});





export { createActivity, updateActivity, listActivities, getActivityDetail, deleteActivity, getUserActivityDetails };
