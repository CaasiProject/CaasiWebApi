import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate Access and Refresh Tokens
const generateAccessAndRefereshToken = async (userId) => {

    try {
        const user = await Client.findById(userId);

        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Token");
    }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password, clientId, department, role, status, phoneNumber, createdDate, updatedDate } = req.body;

    if ([userName, email, fullName, password].some((field) => !field.trim())) {
        throw new ApiError(400, "All fields are required!");
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with the provided userName or email already exists");
    }

    // Handle file uploads if needed (commented out)
    // let coverImageLocalPath;
    // let avatarLocalPath;

    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length) {
    //     avatarLocalPath = req.files?.avatar[0]?.path;
    // }
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length) {
    //     coverImageLocalPath = req.files?.coverImage[0]?.path;
    // }

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required");
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required");
    // }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        fullName,
        clientId,
        department,
        role,
        status,
        phoneNumber,
        createdDate,
        updatedDate
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!email && !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await Client.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User does not exist"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid credentials"));
    }

    const { refreshToken, accessToken } = await generateAccessAndRefereshToken(user._id);
    const loggedInUser = await Client.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Logout User
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get User Details by ID
const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User details retrieved successfully"));
});

// Get All Users with Filters
const getUsers = asyncHandler(async (req, res) => {
    const { name, department, status, role } = req.query;
    const query = {};

    if (name) {
        query.fullName = { $regex: name, $options: 'i' }; // Case-insensitive match
    }
    if (department) {
        query.department = department;
    }
    if (status) {
        query.status = status;
    }
    if (role) {
        query.role = role;
    }

    const users = await User.find(query).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

// Update User by ID
const updateUser = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body);
    // const allowedUpdates = ['userName', 'email', 'department', 'status', 'phoneNumber'];
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    // if (!isValidOperation) {
    //     throw new ApiError(400, "Invalid updates!");
    // }

    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    updates.forEach((update) => user[update] = req.body[update]);

    if (req.body.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Delete User by ID
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

// Create User (alternative to register)
const createUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, firstName, lastName, password, clientId, department, status, phoneNumber, createdDate, updatedDate } = req.body;

    // Validate required fields
    if ([userName, email, fullName, password].some((field) => !field.trim())) {
        throw new ApiError(400, "All fields are required!");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ fullName }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with the provided fullName or email already exists");
    }

    // Create new user
    const user = await User.create({
        userName: fullName.toLowerCase(),
        email,
        password,
        firstName,
        fullName,
        lastName,
        clientId,
        department,
        status,
        phoneNumber,
        createdDate,
        updatedDate
    });

    // Fetch user details excluding sensitive information
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // Respond with success message and created user data
    res.status(201).json({
        status: 'success',
        data: {
            user: createdUser
        },
        message: 'User created successfully'
    });
});

const getUsersDropdown = asyncHandler(async (req, res) => {
    const users = await User.find().select('_id userName');
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});


export { registerUser, loginUser, logOutUser, getUserDetails, getUsers, updateUser, deleteUser, createUser, getUsersDropdown };
