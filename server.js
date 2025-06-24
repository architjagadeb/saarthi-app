const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Routes
const murfRoute = require("./routes/murf");
app.use("/", murfRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Saarthi server running on http://localhost:${PORT}`);
});
