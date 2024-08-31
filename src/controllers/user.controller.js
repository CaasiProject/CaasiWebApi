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
        const user = await Client.findById(userId) || await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

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

// Login User or Client
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find user or client with the given email
    let userOrClient = await User.findOne({ email });

    if (!userOrClient) {
        userOrClient = await Client.findOne({ email });
    }

    if (!userOrClient) {
        throw new ApiError(404, "User or Client with this email does not exist");
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userOrClient.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens and respond
    const { refreshToken, accessToken } = await generateAccessAndRefereshToken(userOrClient._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: userOrClient, accessToken, refreshToken }, "User logged in successfully"));
});


// Logout User or Client
const logOutUser = asyncHandler(async (req, res) => {
    // console.log('Logging out user:', req.user._id); // Debugging
    // let { id } = req.body
    // await User.findByIdAndUpdate(id, { $set: { refreshToken: undefined } }, { new: true });
    if (!req.user || !req.user._id) {
        return res.status(400).json(new ApiResponse(400, {}, "User not authenticated"));
    }

    const userId = req.user._id;

    // Attempt to find and update the refreshToken in both Client and User models
    let user = await Client.findByIdAndUpdate(userId, { $set: { refreshToken: undefined } }, { new: true });

    if (!user) {
        user = await User.findByIdAndUpdate(userId, { $set: { refreshToken: undefined } }, { new: true });
    }

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User or Client not found"));
    }

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
    const { userName, email, fullName, firstName, lastName, password, clientId, department, status, phoneNumber, createdDate, updatedDate, role } = req.body;

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
        role,
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

        success: true,
        data: {
            user: createdUser
        },
        message: 'User created successfully'
    });
});

const getUsersDropdown = asyncHandler(async (req, res) => {
    const users = await User.find().select('_id lastName firstName phoneNumber email');
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        throw new ApiError(400, "Email and new password are required");
    }

    // Find user or client with the given email
    let userOrClient = await User.findOne({ email });

    if (!userOrClient) {
        userOrClient = await Client.findOne({ email });
    }

    if (!userOrClient) {
        throw new ApiError(404, "User or Client with this email does not exist");
    }

    // Hash and update the new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    userOrClient.password = newPassword;
    userOrClient.resetPasswordToken = undefined; // Clear any existing reset token if necessary
    userOrClient.resetPasswordExpire = undefined; // Clear any existing reset expiry if necessary
    await userOrClient.save();

    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});
// const resetPassword = asyncHandler(async (req, res) => {
//     const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

//     // Attempt to find user or client with the reset token
//     let userOrClient = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!userOrClient) {
//         userOrClient = await Client.findOne({
//             resetPasswordToken,
//             resetPasswordExpire: { $gt: Date.now() },
//         });
//     }

//     if (!userOrClient) {
//         throw new ApiError(400, "Invalid or expired token");
//     }

//     // Update password
//     userOrClient.password = await bcrypt.hash(req.body.password, 10);
//     userOrClient.resetPasswordToken = undefined;
//     userOrClient.resetPasswordExpire = undefined;

//     await userOrClient.save();

//     res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
// });

// Forget Password
const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Attempt to find user or client with the given email
    let userOrClient = await User.findOne({ email });

    if (!userOrClient) {
        userOrClient = await Client.findOne({ email });
    }

    if (!userOrClient) {
        throw new ApiError(404, "User or Client with this email does not exist");
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    userOrClient.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    userOrClient.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await userOrClient.save({ validateBeforeSave: false });

    // Send the token via email
    const resetUrl = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;

    const message = `You requested a password reset. Please use the following link to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: userOrClient.email,
            subject: "Password Reset Request",
            text: message,
        });

        res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
    } catch (error) {
        userOrClient.resetPasswordToken = undefined;
        userOrClient.resetPasswordExpire = undefined;
        await userOrClient.save({ validateBeforeSave: false });

        throw new ApiError(500, "Email could not be sent");
    }
});

export { registerUser, loginUser, logOutUser, getUserDetails, getUsers, updateUser, deleteUser, createUser, getUsersDropdown, resetPassword, forgetPassword };
