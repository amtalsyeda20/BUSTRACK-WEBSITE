// server.js
import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- SQL Server Config ----------------
const dbConfig = {
    user: 'amtal',       // your SQL login
    password: 'meenu037',   // the password you set
    server: 'localhost',
    database: 'SmartBus',
    options: { trustServerCertificate: true }
};



// ---------------- ROUTES ----------------

// Add a driver
app.post("/api/drivers", async (req, res) => {
    const { name, phone, licenseNo } = req.body;
    if (!name) return res.status(400).json({ error: "Driver name is required" });
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("name", sql.NVarChar, name)
            .input("phone", sql.NVarChar, phone || null)
            .input("licenseNo", sql.NVarChar, licenseNo || null)
            .query(`INSERT INTO Drivers (Name, Phone, LicenseNo) VALUES (@name, @phone, @licenseNo)`);
        res.json({ message: "Driver added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get all drivers
app.get("/api/drivers", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT * FROM Drivers");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add a bus
app.post("/api/buses", async (req, res) => {
    const { name, driverId, route} = req.body;
    if (!name) return res.status(400).json({ error: "Bus name is required" });
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
  .input("name", sql.NVarChar, name)
  .input("route", sql.NVarChar, route)
  .input("driverId", sql.Int, driverId || null)
  .query("INSERT INTO Buses (Name, Route, DriverId) VALUES (@name, @route, @driverId)");

        res.json({ message: "Bus added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get all buses
app.get("/api/buses", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .query(`SELECT B.BusId, B.Name, B.Route, 
                           D.Name AS DriverName
                    FROM Buses B
                    LEFT JOIN Drivers D ON B.DriverId = D.DriverId`);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ---------------- START SERVER ----------------
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
