const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin")

const router = express.Router();

                                            //    signup for admin 
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({
         error: "All fields required"
         });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exixted" });

    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, passwordHash: hash });
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

                           // login
// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({
         error: "Invalid  Details" 
        });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid Details" });

  
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "esha12",
      { expiresIn: "1d" }
    );
    res.json({ token });  
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
