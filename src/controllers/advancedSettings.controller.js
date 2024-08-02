import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { AdvancedSettings } from "../models/advancedSettings.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Advanced Settings
const createAdvancedSettings = asyncHandler(async (req, res) => {
    const settings = await AdvancedSettings.create(req.body);
    res.status(201).json(new ApiResponse(201, settings, "Advanced settings created successfully"));
});

// Update Advanced Settings
const updateAdvancedSettings = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const settings = await AdvancedSettings.findByIdAndUpdate(id, req.body, { new: true });
    if (!settings) {
        throw new ApiError(404, "Settings not found");
    }
    res.status(200).json(new ApiResponse(200, settings, "Advanced settings updated successfully"));
});

// List Advanced Settings
const listAdvancedSettings = asyncHandler(async (req, res) => {
    const settings = await AdvancedSettings.find();
    res.status(200).json(new ApiResponse(200, settings, "Advanced settings retrieved successfully"));
});

// Get Advanced Settings Detail
const getAdvancedSettingsDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const settings = await AdvancedSettings.findById(id);
    if (!settings) {
        throw new ApiError(404, "Settings not found");
    }
    res.status(200).json(new ApiResponse(200, settings, "Advanced settings retrieved successfully"));
});

// Delete Advanced Settings
const deleteAdvancedSettings = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const settings = await AdvancedSettings.findByIdAndDelete(id);
    if (!settings) {
        throw new ApiError(404, "Settings not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Advanced settings deleted successfully"));
});

export { createAdvancedSettings, updateAdvancedSettings, listAdvancedSettings, getAdvancedSettingsDetail, deleteAdvancedSettings };
