import mongoose, { Schema } from "mongoose";

const advancedSettingsSchema = new Schema(
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
        reportName: {
            type: String,
            required: true,
            trim: true
        },
        reportValidationDate: {
            type: Date,
            required: true
        },
        reportType: {
            type: String,
            enum: ['monthly', 'quarterly', 'yearly'],
            required: true
        },
        createTeam: {
            type: Boolean,
            default: false
        },
        createDepartment: {
            type: Boolean,
            default: false
        },
        createRole: {
            type: Boolean,
            default: false
        },
        activityReport: {
            type: Boolean,
            default: false
        },
        expenseReport: {
            type: Boolean,
            default: false
        },
        configureAllCategoryForActivityReport: {
            type: Boolean,
            default: false
        },
        logo: {
            type: String,
            trim: true
        },
        loginLogoScreen: {
            type: String,
            trim: true
        },
        backgroundColor: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const AdvancedSettings = mongoose.model("AdvancedSettings", advancedSettingsSchema);

export { AdvancedSettings };
