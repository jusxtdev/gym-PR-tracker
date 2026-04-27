import { config } from "dotenv";
import express from "express"
import cookieParser from "cookie-parser"

import { connectDB, disconnectDB } from "./config/db.js";
import rootRouter from "./routes/root.router.js";

config()
connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const PORT = process.env.PORT || 3000;

app.use('/api', rootRouter)


const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})


// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});