require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const searchRoutes = require("./routes/searchRoutes");
const syncRoutes = require("./routes/syncRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

app.use("/search", searchRoutes);
app.use("/sync", syncRoutes);
app.use("/webhook", webhookRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        application: "VFS Search Demo",
        version: "1.0"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});