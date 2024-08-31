import mongoose, { Schema } from "mongoose";

const absenceSchema = new Schema(
    {
        clientId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            // required: true,
            trim: true
        },
        contact: {
            type: String,
            // required: true,
            trim: true
        },
        email: {
            type: String,
            // required: true,
            trim: true
        },
        phone: {
            type: String,
            // required: true,
            trim: true
        },
        dayOfAbsence: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            default: 'pending'
        },
        userName: {
            type: String,
            // required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalDays: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        attachment: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Absence = mongoose.model("Absence", absenceSchema);

export { Absence };
