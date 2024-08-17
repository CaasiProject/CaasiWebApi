import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        refreshToken: {
            type: String,
        },
        clientId: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        createdDate: {
            type: Date,
            default: Date.now
        },
        updatedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Encrypt password and save in database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Update the updatedDate field before each save
userSchema.pre("save", function (next) {
    this.updatedDate = Date.now();
    next();
});

// Check password 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access and Refresh Token through JWT
// Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
            clientId: this.clientId,
            department: this.department,
            role: this.role,
            status: this.status,
            phoneNumber: this.phoneNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);
