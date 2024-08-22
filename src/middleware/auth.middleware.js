import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js"; // Ensure this path is correct
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const jwtVerify = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let userOrClient = await User.findById(decodedToken?._id).select("-password");

        if (!userOrClient) {
            userOrClient = await Client.findById(decodedToken?._id).select("-password");
        }

        if (!userOrClient) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = userOrClient;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
