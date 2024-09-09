import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Absence } from "../models/absence.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from "../models/client.model.js";

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
const getAbsenceListByMonth = asyncHandler(async (req, res) => {
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
    let absences = []
    if (isAdmin) {
        // If the requester is an admin, return all absences
        absences = await Absence.find({ status: "pending" }).select('_id name lastName createdAt reasonOfAbsence');
        return res.status(200).json(new ApiResponse(200, absences, "All absences retrieved successfully"));
    } else {
        // Fetch activities for the user within the date range
        absences = await Absence.find({
            _id: userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).select('_id name lastName createdAt reasonOfAbsence');
        // Return the activities for the specific user
        res.status(200).json(new ApiResponse(200, absences, "absences details retrieved successfully"));
    }

    // Handle case where no activities are found for the user
    if (!absences || absences.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No absences found for the given user and month"));
    }


});
export { createAbsence, updateAbsence, listAbsences, getAbsenceDetail, deleteAbsence, getAbsenceListByMonth };
