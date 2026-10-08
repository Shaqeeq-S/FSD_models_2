const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const Student = require("./models/Student");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

mongoose.connect(process.env.MONGO_URI, {
    dbName: "exam_database"
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error.message);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/students", async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            course: req.body.course
        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding student",
            error: error.message
        });
    }
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});