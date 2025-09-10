require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/", express.static(path.join(__dirname, "..", "frontend")));

const adminAuth = require("./routes/adminAuth");
app.use("/api/admin", adminAuth);


const PORT = 5000;
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/task")
  .then(() => { console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server running on port", PORT));
  })
  .catch(err => console.error("Mongo error:", err));
