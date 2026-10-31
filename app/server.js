const express = require("express");
const os = require("os");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8080;

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "devopsdb",
    user: process.env.DB_USER || "devopsuser",
    password: process.env.DB_PASSWORD || "devopspassword"
});

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
    res.json({
        application: "DevOps Application",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        hostname: os.hostname(),
        timestamp: new Date().toISOString()
    });
});

// PostgreSQL database test API
app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        console.log("PostgreSQL database connection successful");

        res.json({
            application: "DevOps Application",
            database: "PostgreSQL",
            status: "CONNECTED",
            time: result.rows[0].current_time
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);

        res.status(500).json({
            database: "PostgreSQL",
            status: "ERROR",
            message: "Database connection failed"
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevOps Application running on port ${PORT}`);
});
