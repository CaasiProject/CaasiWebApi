import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { ApiError } from './utils/ApiError.js';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
    }

    // Handle other types of errors (e.g., Mongoose validation errors)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors,
            stack: err.stack
        });
    }

    // Default to 500 for unhandled errors
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [],
        stack: err.stack
    });
});

//Import Router

import userRouter from "./routes/user.routes.js";
import expenseRoutes from './routes/expense.routes.js';
import activityRoutes from './routes/activity.routes.js';
import absenceRoutes from './routes/absence.routes.js';
import advancedSettingsRoutes from './routes/advancedSettings.routes.js';
import clientRoutes from './routes/client.routes.js';

//Route Deceleration
app.use('/api/v1/users', userRouter)
app.use(expenseRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/absences', absenceRoutes);
app.use('/api/v1/advanced-settings', advancedSettingsRoutes);
app.use('/api/v1/clients', clientRoutes);



export { app }