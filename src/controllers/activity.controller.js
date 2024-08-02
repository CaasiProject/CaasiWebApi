import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    const { name, department, status, role, workType } = req.query;
    const filter = {};
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

export { createActivity, updateActivity, listActivities, getActivityDetail, deleteActivity };