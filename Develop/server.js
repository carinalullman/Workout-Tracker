const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3003;

const db = require(".models");

const app = express();

app.use(logger("dev"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
    useNewUrlParser: true,
    useFindAndModify: false
});

// need routes here
db.workout.create({ name: "Workout Tracker" })
    .then(dbworkout => {
        console.log(dbworkout);
    })
    .catch(({ message }) => {
        console.log(message);
    });

app.post("/submit", ({ body }, res) => {
    db.workout.create(body)
        .then(({ _id }) => db.workout.findOneAndUpdate({}, { $push: { exercise: _id } }, { new: true }))
        .then(dbworkout => {
            res.json(dbworkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/exercise", (req, res) => {
    db.exercise.find({})
        .then(dbexercise => {
            res.json(dbexercise);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/stats", (req, res) => {
    db.workout.find({})
        .then(dbworkout => {
            res.json(dbworkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/index", (req, res) => {
    db.workout.find({})
        // .populate("books")
        .then(dbworkout => {
            res.json(dbworkout);
        })
        .catch(err => {
            res.json(err);
        });

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});