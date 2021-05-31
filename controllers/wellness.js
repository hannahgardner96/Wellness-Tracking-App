"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
const express = require("express"); // JS: const router = express.Router()
const methodOverride = require("method-override"); // JS: const methodOverride = require('method-override')
const bcrypt = require("bcrypt");
exports.router = express.Router();
// ========== //
exports.router.use(methodOverride('_method'));
// ===== VARIABLES ===== //
const emotional_wellness_1 = require("../models/emotional-wellness");
const nutritional_wellness_1 = require("../models/nutritional-wellness");
const physical_wellness_1 = require("../models/physical-wellness");
const social_wellness_1 = require("../models/social-wellness");
const total_wellness_1 = require("../models/total-wellness");
// ===== ROUTES ===== // 
// login
exports.router.get("/login", (req, res) => {
    res.render("login.ejs");
});
// login next
exports.router.post("/login", (req, res) => {
    total_wellness_1.TotalWellness.find({ username: req.body.username }, (error, user) => {
        if (error) {
            res.send(error);
        }
        else if (user.length === 0) { // want to check that find returns an array with a single element, not an empty array
            res.render("login-incorrect-username.ejs");
        }
        else if (!bcrypt.compareSync(req.body.password, user[0].password)) { //find will always return an array so we want to find at [0] bc it is a singleton array
            res.render("login-incorrect-password.ejs");
        }
        else {
            req.session.user = user[0]; // req.session.user attaches the variable user to the session information, express stores that for you
            res.redirect("/wellness");
        }
    });
});
// create account 
exports.router.get("/createaccount", (req, res) => {
    res.render("create-account.ejs");
});
// create account post 
exports.router.post("/createaccount", (req, res) => {
    total_wellness_1.TotalWellness.find({ username: req.body.username }, (error, user) => {
        if (error) {
            res.send(error);
        }
        else if (user.length === 0) {
            const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
            req.body.password = password;
            total_wellness_1.TotalWellness.create(req.body, (error, newUser) => {
                if (error) {
                    res.send(error);
                }
                else {
                    req.session.user = newUser; // this assigns the "newUser" to a session
                    console.log(newUser);
                    res.redirect("/login");
                }
            });
        }
        else if (user) {
            res.render("create-account-username-exists.ejs");
        }
    });
});
// home
exports.router.get("/wellness", (req, res) => {
    total_wellness_1.TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("home.ejs", {
                wellness: wellness
            });
        }
    });
});
// new emotional log
exports.router.get("/wellness/newemotional", (req, res) => {
    total_wellness_1.TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("new-emotional-log.ejs", {
                wellness: wellness
            });
        }
    });
});
// create
exports.router.post("/wellness/newemotional", (req, res) => {
    emotional_wellness_1.EmotionalWellness.create(req.body, (error, log) => {
        if (error) {
            res.send(error);
        }
        else {
            console.log(log);
            res.redirect("/wellness");
        }
    });
});
// new physical log
exports.router.get("/wellness/newphysical", (req, res) => {
    total_wellness_1.TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("new-physical-log.ejs", {
                wellness: wellness
            });
        }
    });
});
// create
exports.router.post("/wellness/newphysical", (req, res) => {
    physical_wellness_1.PhysicalWellness.create(req.body, (error, log) => {
        if (error) {
            res.send(error);
        }
        else {
            console.log(log);
            res.redirect("/wellness");
        }
    });
});
// new nutritional log
exports.router.get("/wellness/newnutritional", (req, res) => {
    total_wellness_1.TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("new-nutritional-log.ejs", {
                wellness: wellness
            });
        }
    });
});
// create
exports.router.post("/wellness/newnutritional", (req, res) => {
    nutritional_wellness_1.NutritionalWellness.create(req.body, (error, log) => {
        if (error) {
            res.send(error);
        }
        else {
            console.log(log);
            res.redirect("/wellness");
        }
    });
});
// new social log
exports.router.get("/wellness/newsocial", (req, res) => {
    total_wellness_1.TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("new-social-log.ejs", {
                wellness: wellness
            });
        }
    });
});
// create
exports.router.post("/wellness/newsocial", (req, res) => {
    social_wellness_1.SocialWellness.create(req.body, (error, log) => {
        if (error) {
            res.send(error);
        }
        else {
            console.log(log);
            res.redirect("/wellness");
        }
    });
});
// view emotional log trend
exports.router.get("/wellness/emotionaltrend", (req, res) => {
    total_wellness_1.TotalWellness.find({ username: req.session.user.username }, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else {
            res.render("view-emotional-trend.ejs", {
                wellnessData: wellnessData
            });
        }
    });
});
// view physical log trend
exports.router.get("/wellness/physicaltrend", (req, res) => {
    physical_wellness_1.PhysicalWellness.find({}, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else {
            res.render("view-physical-trend.ejs", {
                wellnessData: wellnessData
            });
        }
    });
});
// view nutritional log trend
exports.router.get("/wellness/nutritionaltrend", (req, res) => {
    nutritional_wellness_1.NutritionalWellness.find({}, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else {
            res.render("view-nutritional-trend.ejs", {
                wellnessData: wellnessData
            });
        }
    });
});
// view social log trend
exports.router.get("/wellness/socialtrend", (req, res) => {
    social_wellness_1.SocialWellness.find({}, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else {
            res.render("view-social-trend.ejs", {
                wellnessData: wellnessData
            });
        }
    });
});
// edit emotional wellness log
exports.router.get("/wellness/emotionaltrend/:id/edit", (req, res) => {
    emotional_wellness_1.EmotionalWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("edit-emotional-log.ejs", {
                data: data
            });
        }
    });
});
// update
exports.router.put("/wellness/emotionaltrend/:id", (req, res) => {
    emotional_wellness_1.EmotionalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/emotionaltrend");
    });
});
// edit physical wellness log
exports.router.get("/wellness/physicaltrend/:id/edit", (req, res) => {
    physical_wellness_1.PhysicalWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("edit-physical-log.ejs", {
                data: data
            });
        }
    });
});
// update
exports.router.put("/wellness/physicaltrend/:id", (req, res) => {
    physical_wellness_1.PhysicalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/physicaltrend");
    });
});
// edit nutritional wellness log
exports.router.get("/wellness/nutritionaltrend/:id/edit", (req, res) => {
    nutritional_wellness_1.NutritionalWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("edit-nutritional-log.ejs", {
                data: data
            });
        }
    });
});
// update
exports.router.put("/wellness/nutritionaltrend/:id", (req, res) => {
    nutritional_wellness_1.NutritionalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/nutritionaltrend");
    });
});
// edit social wellness log
exports.router.get("/wellness/socialtrend/:id/edit", (req, res) => {
    social_wellness_1.SocialWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error);
        }
        else {
            res.render("edit-social-log.ejs", {
                data: data
            });
        }
    });
});
// update
exports.router.put("/wellness/socialtrend/:id", (req, res) => {
    social_wellness_1.SocialWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/socialtrend");
    });
});
// delete emotional log
exports.router.delete("/wellness/emotionaltrend/:id", (req, res) => {
    emotional_wellness_1.EmotionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect("/wellness/emotionaltrend");
        }
    });
});
// delete physical log
exports.router.delete("/wellness/physicaltrend/:id", (req, res) => {
    physical_wellness_1.PhysicalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect("/wellness/physicaltrend");
        }
    });
});
// delete nutritional log
exports.router.delete("/wellness/nutritionaltrend/:id", (req, res) => {
    nutritional_wellness_1.NutritionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect("/wellness/nutritionaltrend");
        }
    });
});
// delete social log
exports.router.delete("/wellness/socialtrend/:id", (req, res) => {
    social_wellness_1.SocialWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect("/wellness/socialtrend");
        }
    });
});
