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
// ===== MIDDLEWARE ===== //
const protectLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
};
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
exports.router.get("/wellness", protectLogin, (req, res) => {
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
exports.router.get("/wellness/newemotional", protectLogin, (req, res) => {
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
exports.router.post("/wellness/newemotional", protectLogin, (req, res) => {
    emotional_wellness_1.EmotionalWellness.create(req.body, (error, newLog) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, totalWellness) => {
                totalWellness.emotionalWellness.push(newLog); // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save(); // saves the totalWellness document
                res.redirect("/wellness/emotionaltrend");
            });
        }
    });
});
// new physical log
exports.router.get("/wellness/newphysical", protectLogin, (req, res) => {
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
exports.router.post("/wellness/newphysical", protectLogin, (req, res) => {
    physical_wellness_1.PhysicalWellness.create(req.body, (error, newLog) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, totalWellness) => {
                totalWellness.physicalWellness.push(newLog); // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save(); // saves the totalWellness document
                res.redirect("/wellness/physicaltrend");
            });
        }
    });
});
// new nutritional log
exports.router.get("/wellness/newnutritional", protectLogin, (req, res) => {
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
exports.router.post("/wellness/newnutritional", protectLogin, (req, res) => {
    nutritional_wellness_1.NutritionalWellness.create(req.body, (error, newLog) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, totalWellness) => {
                totalWellness.nutritionalWellness.push(newLog); // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save(); // saves the totalWellness document
                console.log(totalWellness);
                res.redirect("/wellness/nutritionaltrend");
            });
        }
    });
});
// new social log
exports.router.get("/wellness/newsocial", protectLogin, (req, res) => {
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
exports.router.post("/wellness/newsocial", protectLogin, (req, res) => {
    social_wellness_1.SocialWellness.create(req.body, (error, newLog) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, totalWellness) => {
                totalWellness.socialWellness.push(newLog); // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save(); // saves the totalWellness document
                console.log(totalWellness);
                res.redirect("/wellness/socialtrend");
            });
        }
    });
});
// view emotional log trend
exports.router.get("/wellness/emotionaltrend", protectLogin, (req, res) => {
    total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.emotionalWellness.map(log => {
                return emotional_wellness_1.EmotionalWellness.findById(log).exec(); // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            });
            Promise.all(logObjects).then((objects) => {
                res.render("view-emotional-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                });
            });
        }
    });
});
// view physical log trend
exports.router.get("/wellness/physicaltrend", protectLogin, (req, res) => {
    total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.physicalWellness.map(log => {
                return physical_wellness_1.PhysicalWellness.findById(log).exec(); // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            });
            Promise.all(logObjects).then((objects) => {
                res.render("view-physical-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                });
            });
        }
    });
});
// view nutritional log trend
exports.router.get("/wellness/nutritionaltrend", protectLogin, (req, res) => {
    total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.nutritionalWellness.map(log => {
                return nutritional_wellness_1.NutritionalWellness.findById(log).exec(); // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            });
            Promise.all(logObjects).then((objects) => {
                res.render("view-nutritional-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                });
            });
        }
    });
});
// view social log trend
exports.router.get("/wellness/socialtrend", protectLogin, (req, res) => {
    total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => {
        if (error) {
            res.render(error);
        }
        else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.socialWellness.map(log => {
                return social_wellness_1.SocialWellness.findById(log).exec(); // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            });
            Promise.all(logObjects).then((objects) => {
                res.render("view-social-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                });
            });
        }
    });
});
// edit emotional wellness log
exports.router.get("/wellness/emotionaltrend/:id/edit", protectLogin, (req, res) => {
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
exports.router.put("/wellness/emotionaltrend/:id", protectLogin, (req, res) => {
    emotional_wellness_1.EmotionalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/emotionaltrend");
    });
});
// edit physical wellness log
exports.router.get("/wellness/physicaltrend/:id/edit", protectLogin, (req, res) => {
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
exports.router.put("/wellness/physicaltrend/:id", protectLogin, (req, res) => {
    physical_wellness_1.PhysicalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/physicaltrend");
    });
});
// edit nutritional wellness log
exports.router.get("/wellness/nutritionaltrend/:id/edit", protectLogin, (req, res) => {
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
exports.router.put("/wellness/nutritionaltrend/:id", protectLogin, (req, res) => {
    nutritional_wellness_1.NutritionalWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/nutritionaltrend");
    });
});
// edit social wellness log
exports.router.get("/wellness/socialtrend/:id/edit", protectLogin, (req, res) => {
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
exports.router.put("/wellness/socialtrend/:id", protectLogin, (req, res) => {
    social_wellness_1.SocialWellness.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, log) => {
        res.redirect("/wellness/socialtrend");
    });
});
// delete emotional log
exports.router.delete("/wellness/emotionaltrend/:id", protectLogin, (req, res) => {
    emotional_wellness_1.EmotionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellness) => {
                let index = wellness.emotionalWellness.indexOf(req.params.id);
                wellness.emotionalWellness.splice(index, 1);
                wellness.save();
                res.redirect("/wellness/emotionaltrend"); // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            });
        }
    });
});
// delete physical log
exports.router.delete("/wellness/physicaltrend/:id", protectLogin, (req, res) => {
    physical_wellness_1.PhysicalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellness) => {
                let index = wellness.physicalWellness.indexOf(req.params.id);
                wellness.physicalWellness.splice(index, 1);
                wellness.save();
                res.redirect("/wellness/physicaltrend"); // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            });
        }
    });
});
// delete nutritional log
exports.router.delete("/wellness/nutritionaltrend/:id", protectLogin, (req, res) => {
    nutritional_wellness_1.NutritionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellness) => {
                let index = wellness.nutritionalWellness.indexOf(req.params.id);
                wellness.nutritionalWellness.splice(index, 1);
                wellness.save();
                res.redirect("/wellness/nutritionaltrend"); // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            });
        }
    });
});
// delete social log
exports.router.delete("/wellness/socialtrend/:id", protectLogin, (req, res) => {
    social_wellness_1.SocialWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error);
        }
        else {
            total_wellness_1.TotalWellness.findOne({ username: req.session.user.username }, (error, wellness) => {
                let index = wellness.socialWellness.indexOf(req.params.id);
                wellness.socialWellness.splice(index, 1);
                wellness.save();
                res.redirect("/wellness/socialtrend"); // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            });
        }
    });
});
//# sourceMappingURL=wellness.js.map