import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Absence } from "../models/absence.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Absence
const createAbsence = asyncHandler(async (req, res) => {
    const absence = await Absence.create(req.body);
    res.status(201).json(new ApiResponse(201, absence, "Absence created successfully"));
});

// Update Absence
const updateAbsence = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const absence = await Absence.findByIdAndUpdate(id, req.body, { new: true });
    if (!absence) {
        throw new ApiError(404, "Absence not found");
    }
    res.status(200).json(new ApiResponse(200, absence, "Absence updated successfully"));
});

// List Absences with Filters
const listAbsences = asyncHandler(async (req, res) => {
    const { name, status, userName, startDate, endDate, clientId, userId } = req.query;
    const filter = {};

    if (name) filter.name = new RegExp(name, 'i');
    if (status) filter.status = status;
    if (userName) filter.userName = new RegExp(userName, 'i');
    if (startDate && endDate) {
        filter.dayOfAbsence = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (clientId) filter.clientId = clientId;
    if (userId) filter.userId = userId;

    const absences = await Absence.find(filter);
    res.status(200).json(new ApiResponse(200, absences, "Absences retrieved successfully"));
});


// Get Absence Detail
const getAbsenceDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const absence = await Absence.findById(id);
    if (!absence) {
        throw new ApiError(404, "Absence not found");
    }
    res.status(200).json(new ApiResponse(200, absence, "Absence retrieved successfully"));
});

// Delete Absence
const deleteAbsence = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const absence = await Absence.findByIdAndDelete(id);
    if (!absence) {
        throw new ApiError(404, "Absence not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Absence deleted successfully"));
});

export { createAbsence, updateAbsence, listAbsences, getAbsenceDetail, deleteAbsence };
