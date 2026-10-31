const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Health check API
app.get("/health", (req, res) => {
    console.log("DevOps Application health check requested");

    res.json({
        application: "DevOps Application",
        status: "UP",
        message: "DevOps Application is healthy"
    });
});

// Application information API
app.get("/api/info", (req, res) => {
    console.log("DevOps Application information requested");

    res.json({
        application: "DevOps Application",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        hostname: os.hostname(),
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevOps Application running on port ${PORT}`);
});
