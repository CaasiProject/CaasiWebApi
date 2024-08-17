import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
    {
        clientId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true
        },
        createDate: {
            type: Date,
            default: Date.now
        },
        updateDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Approved', 'Pending', 'Rejected'],
            default: 'Pending'
        },
        description: {
            type: String,
            trim: true
        },
        dateOfSubmitted: {
            type: Date,
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        attachment: {
            type: String,
            trim: true
        },
        scan: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

expenseSchema.pre("save", function (next) {
    this.updateDate = Date.now();
    next();
});

export const Expense = mongoose.model("Expense", expenseSchema);
