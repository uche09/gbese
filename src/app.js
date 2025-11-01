import express from "express";
import config from "./config/index.js";
import sequelize, {connectDB} from "./config/db.js";
import errorHandler from "./middlewares/app_error_handler.js";
import authRoutes from "./routes/auth.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// routes
app.use("/api", authRoutes);


// route defaults
app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).json({
        success: false, 
        message: "Endpoint does not exist"
    });
    next();
});


// Connect to database & Start Server
await connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
