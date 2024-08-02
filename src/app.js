import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//Import Router

import userRouter from "./routes/user.routes.js";
import expenseRoutes from './routes/expense.routes.js';
import activityRoutes from './routes/activity.routes.js';
import absenceRoutes from './routes/absence.routes.js';
import advancedSettingsRoutes from './routes/advancedSettings.routes.js'; 

//Route Deceleration
app.use('/api/v1/users', userRouter)
app.use(expenseRoutes);
app.use('/api/v1/activities', activityRoutes); 
app.use('/api/v1/absences', absenceRoutes); 
app.use('/api/v1/advanced-settings', advancedSettingsRoutes);




export { app }