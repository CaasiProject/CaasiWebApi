import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
    {
        clientId: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surname: {
            type: String,
            required: true,
            trim: true,
        },
        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
        updatedDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        selectMonthDropdowns: {
            type: [String], // Assuming this is a list of month selections
        },
        comments: {
            type: String,
            trim: true,
        },
        attachments: {
            type: [String], // Assuming these are file paths or URLs to attachments
        },
        dateOfSubmitted: {
            type: Date,
        },
        abcent: {
            type: Boolean,
            default: false,
        },
        halfDay: {
            type: Boolean,
            default: false,
        },
        leave: {
            type: Boolean,
            default: false,
        },
        travel: {
            type: Boolean,
            default: false,
        },
        atOffice: {
            type: Boolean,
            default: false,
        },
        remoteWork: {
            type: Boolean,
            default: false,
        },
        workTypes: {
            type: String,
            enum: ['abcent', 'halfDay', 'leave', 'travel', 'atOffice', 'remoteWork'],
        },
    },
    {
        timestamps: true,
    }
);

export const Activity = mongoose.model('Activity', activitySchema);
