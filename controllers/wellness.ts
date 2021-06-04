// additional ideas
// change input from text to drop down on 
// responsiveness on phone
// busy home page, ore description needed
// alert if value outside of acceptable range entered in number
// fix time zone issue with graphs and tables

// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
import * as express from 'express' // JS: const router = express.Router()
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")
import * as methodOverride from 'method-override' // JS: const methodOverride = require('method-override')
import * as bcrypt from "bcrypt"

export const router = express.Router()

// type documentation for expess session https://github.com/DefinitelyTyped/DefinitelyTyped/blob/57e279fb29f06e2e6766118b585d0a3e940c45b3/types/express-session/index.d.ts#L203 used to declare additional properties that solved a type error when declaring req.session.user
declare module 'express-session' {
    interface SessionData { // 
        user: any; // mongoose has bad typescript support: https://thecodebarbarian.com/working-with-mongoose-in-typescript.html this solves the typescript error for req.session.user
    }
}

// ========== //
router.use(methodOverride('_method'))

// ===== VARIABLES ===== //
import {EmotionalWellness} from "../models/emotional-wellness"
import {NutritionalWellness} from "../models/nutritional-wellness"
import {PhysicalWellness} from "../models/physical-wellness"
import {SocialWellness} from "../models/social-wellness"
import {TotalWellness} from "../models/total-wellness"
import { resolveSoa } from 'dns'
import {Resource} from "../models/resources"

// ===== MIDDLEWARE ===== //
const protectLogin = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect("/login")
    }
}

// ===== ROUTES ===== // 
// login
router.get("/login", (req, res) => {
    res.render("login.ejs")
})

// login next
router.post("/login", (req, res) => {
    TotalWellness.find({username: req.body.username}, (error, user) => {
        if (error) {
            res.send(error)
        } else if (user.length === 0) { // want to check that find returns an array with a single element, not an empty array
            res.render("login-incorrect-username.ejs")
        } else  if (!bcrypt.compareSync(req.body.password, user[0].password)) { //find will always return an array so we want to find at [0] bc it is a singleton array
            res.render("login-incorrect-password.ejs")
        } else {
            req.session.user = user[0] // req.session.user attaches the variable user to the session information, express stores that for you
            res.redirect("/wellness")
        }
    })
})

// logout
// referenced https://www.codota.com/code/javascript/functions/express/Request/logout
router.post("/logout", protectLogin, (req, res) => {
    req.session.user = null
    console.log(req.session.user)
    res.redirect("/login")
})

// create account 
router.get("/createaccount", (req, res) => {
    res.render("create-account.ejs")
})

// create account post 
router.post("/createaccount", (req, res) => {
    TotalWellness.find({username: req.body.username}, (error, user) => {
        if (error) {
            res.send(error)
        } else if (user.length === 0) {
            const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync())
            req.body.password = password
            TotalWellness.create(req.body, (error, newUser) => {
                if (error) {
                    res.send(error)
                } else {
                    req.session.user = newUser // this assigns the "newUser" to a session
                    console.log(newUser)
                    res.redirect("/login")
                }
            })
        } else if (user) {
            res.render("create-account-username-exists.ejs")
        } 
    })
})

// home
router.get("/wellness", protectLogin, (req, res) => { // protectLogin is middleware writeen in server.ts and imported to this file to only allow next() if there is a user attached to the session
    TotalWellness.findOne({ username: req.session.user.username }, (error,wellnessData) => { // finds the TotalWellness document associated with the username
        if (error) {
            res.send(error)
        } else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            console.log(wellnessData)
            const emotionalLogObjects = wellnessData.emotionalWellness.map(log => { // creates an array of promises which in mongoose are ".exec()" functions
                return EmotionalWellness.findById(log).exec() // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            })
            const physicalLogObjects = wellnessData.physicalWellness.map(log => {
                return PhysicalWellness.findById(log).exec()
            })
            const nutritionalLogObjects = wellnessData.nutritionalWellness.map(log => {
                return NutritionalWellness.findById(log).exec()
            })
            const socialLogObjects = wellnessData.socialWellness.map(log => {
                return SocialWellness.findById(log).exec()
            })
            Promise.all(emotionalLogObjects).then((emotionalObjects) => { // promise.all() takes iterable promises as an input and resolves them as a single promise in the form of an array
                Promise.all(physicalLogObjects).then((physicalObjects) => {
                    Promise.all(nutritionalLogObjects).then((nutritionalObjects) => {
                        Promise.all(socialLogObjects).then((socialObjects) => {
                            // console.log(`physical data is: ${physicalObjects}. emotional data is: ${emotionalObjects}. nutritional data is: ${nutritionalObjects}. social data is: ${socialObjects} `)
                            res.render("home.ejs", {
                                physicalData: physicalObjects,
                                emotionalData: emotionalObjects,
                                nutritionalData: nutritionalObjects,
                                socialData: socialObjects,
                                username: req.session.user.username
                                // objects is the resolved promise as specified in the .then() parameter
                            })
                         })
                    })
                })
            })
        }
    })
})

// new emotional log
router.get("/wellness/newemotional", protectLogin, (req, res) => {
    TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error)
        } else {
            res.render("new-emotional-log.ejs", {
                wellness: wellness
            })
        }
    })
})

// create
router.post("/wellness/newemotional", protectLogin, (req, res) => {
    EmotionalWellness.create(req.body, (error, newLog) => { // creates new document with the structure of the EmotionalWellness schema
        if(error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, totalWellness) => { // finds the totalWellness document that matches the user 
                totalWellness.emotionalWellness.push(newLog) // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save() // saves the totalWellness document
                res.redirect("/wellness/emotionaltrend")
            })
        }        
    })
})

// new physical log
router.get("/wellness/newphysical", protectLogin, (req, res) => {
    TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error)
        } else {
            res.render("new-physical-log.ejs", {
                wellness: wellness
            })
        }
    })
})

// create
router.post("/wellness/newphysical", protectLogin, (req, res) => {
    PhysicalWellness.create(req.body, (error, newLog) => { // creates new document with the structure of the EmotionalWellness schema
        if(error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, totalWellness) => { // finds the totalWellness document that matches the user 
                totalWellness.physicalWellness.push(newLog) // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save() // saves the totalWellness document
                res.redirect("/wellness/physicaltrend")
            })
        }        
    })
})

// new nutritional log
router.get("/wellness/newnutritional", protectLogin, (req, res) => {
    TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error)
        } else {
            res.render("new-nutritional-log.ejs", {
                wellness: wellness
            })
        }
    })
})

// create
router.post("/wellness/newnutritional", protectLogin, (req, res) => {
    NutritionalWellness.create(req.body, (error, newLog) => { // creates new document with the structure of the EmotionalWellness schema
        if(error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, totalWellness) => { // finds the totalWellness document that matches the user 
                totalWellness.nutritionalWellness.push(newLog) // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save() // saves the totalWellness document
                console.log(totalWellness)
                res.redirect("/wellness/nutritionaltrend")
            })
        }        
    })
})


// new social log
router.get("/wellness/newsocial", protectLogin, (req, res) => {
    TotalWellness.find({}, (error, wellness) => {
        if (error) {
            res.send(error)
        } else {
            res.render("new-social-log.ejs", {
                wellness: wellness
            })
        }
    })
})

// create
router.post("/wellness/newsocial", protectLogin, (req, res) => {
    SocialWellness.create(req.body, (error, newLog) => { // creates new document with the structure of the EmotionalWellness schema
        if(error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, totalWellness) => { // finds the totalWellness document that matches the user 
                totalWellness.socialWellness.push(newLog) // accesses the emotional wellness key of the totalWellness and pushes the newLog (the req.body from the form)
                totalWellness.save() // saves the totalWellness document
                console.log(totalWellness)
                res.redirect("/wellness/socialtrend")
            })
        }        
    })
})

// view emotional log trend
router.get("/wellness/emotionaltrend", protectLogin, (req, res) => {
    TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => { // finds the TotalWellness document associated with the username
        if (error) {
            res.send(error)
        } else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.emotionalWellness.map(log => { // creates an array of promises which in mongoose are ".exec()" functions
                return EmotionalWellness.findById(log).exec() // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            })
            Promise.all(logObjects).then((objects) => { // promise.all() takes iterable promises as an input and resolves them as a single promise in the form of an array
                res.render("view-emotional-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                })
            })
        }
    })
})

// view physical log trend
router.get("/wellness/physicaltrend", protectLogin, (req, res) => {
    TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => { // finds the TotalWellness document associated with the username
        if (error) {
            res.send(error)
        } else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.physicalWellness.map(log => { // creates an array of promises which in mongoose are ".exec()" functions
                return PhysicalWellness.findById(log).exec() // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            })
            Promise.all(logObjects).then((objects) => { // promise.all() takes iterable promises as an input and resolves them as a single promise in the form of an array
                res.render("view-physical-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                })
            })
        }
    })
})

// view nutritional log trend
router.get("/wellness/nutritionaltrend", protectLogin, (req, res) => {
    TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => { // finds the TotalWellness document associated with the username
        if (error) {
            res.send(error)
        } else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.nutritionalWellness.map(log => { // creates an array of promises which in mongoose are ".exec()" functions
                return NutritionalWellness.findById(log).exec() // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            })
            Promise.all(logObjects).then((objects) => { // promise.all() takes iterable promises as an input and resolves them as a single promise in the form of an array
                res.render("view-nutritional-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                })
            })
        }
    })
})

// view social log trend
router.get("/wellness/socialtrend", protectLogin, (req, res) => {
    TotalWellness.findOne({ username: req.session.user.username }, (error, wellnessData) => { // finds the TotalWellness document associated with the username
        if (error) {
            res.send(error)
        } else { // have to create async db searches so that the page does not render until data has been filtered from mongoose
            const logObjects = wellnessData.socialWellness.map(log => { // creates an array of promises which in mongoose are ".exec()" functions
                return SocialWellness.findById(log).exec() // the promise queryies the EmotionalWellness documents, waits to find a matching one, and returns the object document with that ID
            })
            Promise.all(logObjects).then((objects) => { // promise.all() takes iterable promises as an input and resolves them as a single promise in the form of an array
                res.render("view-social-trend.ejs", {
                    wellnessData: objects // objects is the resolved promise as specified in the .then() parameter
                })
            })
        }
    })
})

// edit emotional wellness log
router.get("/wellness/emotionaltrend/:id/edit", protectLogin, (req, res) => {
    EmotionalWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.render("edit-emotional-log.ejs", {
                data: data
            })
        }
    })
})

// update
router.put("/wellness/emotionaltrend/:id", protectLogin, (req, res) => {
    EmotionalWellness.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, log) => {

        res.redirect("/wellness/emotionaltrend")
    })
})

// edit physical wellness log
router.get("/wellness/physicaltrend/:id/edit", protectLogin, (req, res) => {
    PhysicalWellness.findById(req.params.id, null, null, (error, data) => {
        
        if (error) {
            res.send(error)
        } else {
            console.log("DATA IS ", data)
            res.render("edit-physical-log.ejs", {
                data: data
            })
        }
    })
})

// update
router.put("/wellness/physicaltrend/:id", protectLogin, (req, res) => {
    PhysicalWellness.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, log) => {
        res.redirect("/wellness/physicaltrend")
    })
})

// edit nutritional wellness log
router.get("/wellness/nutritionaltrend/:id/edit", protectLogin, (req, res) => {
    NutritionalWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.render("edit-nutritional-log.ejs", {
                data: data
            })
        }
    })
})

// update
router.put("/wellness/nutritionaltrend/:id", protectLogin, (req, res) => {
    NutritionalWellness.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, log) => {
        res.redirect("/wellness/nutritionaltrend")
    })
})

// edit social wellness log
router.get("/wellness/socialtrend/:id/edit", protectLogin, (req, res) => {
    SocialWellness.findById(req.params.id, null, null, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.render("edit-social-log.ejs", {
                data: data
            })
        }
    })
})


// update
router.put("/wellness/socialtrend/:id", protectLogin, (req, res) => {
    SocialWellness.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, log) => {
        res.redirect("/wellness/socialtrend")
    })
})

// delete emotional log
router.delete("/wellness/emotionaltrend/:id", protectLogin, (req, res) => {
    EmotionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => { // adding null solved a type error produced by using the error parameter second when it wanted the option parameter second, consulted someone with experience
        if (error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, wellness) => { // must delete the log from both documents
                let index = wellness.emotionalWellness.indexOf(req.params.id)
                wellness.emotionalWellness.splice(index, 1)
                wellness.save()
                res.redirect("/wellness/emotionaltrend") // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            })
            
        }
    })
})

// delete physical log
router.delete("/wellness/physicaltrend/:id", protectLogin, (req, res) => {
    PhysicalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => { // adding null solved a type error produced by using the error parameter second when it wanted the option parameter second, consulted someone with experience
        if (error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, wellness) => { // must delete the log from both documents
                let index = wellness.physicalWellness.indexOf(req.params.id)
                wellness.physicalWellness.splice(index, 1)
                wellness.save()
                res.redirect("/wellness/physicaltrend") // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            })
            
        }
    })
})

// delete nutritional log
router.delete("/wellness/nutritionaltrend/:id", protectLogin, (req, res) => {
    NutritionalWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => { // adding null solved a type error produced by using the error parameter second when it wanted the option parameter second, consulted someone with experience
        if (error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, wellness) => { // must delete the log from both documents
                let index = wellness.nutritionalWellness.indexOf(req.params.id)
                wellness.nutritionalWellness.splice(index, 1)
                wellness.save()
                res.redirect("/wellness/nutritionaltrend") // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            })
            
        }
    })
})

// delete social log
router.delete("/wellness/socialtrend/:id", protectLogin, (req, res) => {
    SocialWellness.findByIdAndRemove(req.params.id, null, (error, deleteSuccess) => { // adding null solved a type error produced by using the error parameter second when it wanted the option parameter second, consulted someone with experience
        if (error) {
            res.send(error)
        } else {
            TotalWellness.findOne({username: req.session.user.username}, (error, wellness) => { // must delete the log from both documents
                let index = wellness.socialWellness.indexOf(req.params.id)
                wellness.socialWellness.splice(index, 1)
                wellness.save()
                res.redirect("/wellness/socialtrend") // this must go inside the curly braces otherwise it will try to redirect before deleting and produce an error
            })
            
        }
    })
})

// delete account route
router.delete("/deleteaccount", protectLogin, (req, res) => {
    TotalWellness.findByIdAndRemove(req.session.user._id, null, (error, deleteSuccess) => {
        if (error) {
            res.send(error)
        } else {
            res.redirect("/login")
        }
    })
})

// wellness resources section
//index
router.get("/resources", protectLogin, (req, res) => {
    Resource.find({}, (error, resource) => {
        if (error) {
            res.send(error)
        } else {
            res.render("wellness-resources-index.ejs", {
                resource: resource
            })
        }
    })
})
// new
router.get("/resource/new", protectLogin, (req, res) => {
    res.render("new-resource.ejs")
})
// create
router.post("/resource/new", protectLogin, (req, res) => {
    Resource.create(req.body, (error, resource) => {
        if (error) {
            res.send(error)
        } else {
            res.redirect("/resources")
        }
    })
})
// show
router.get("/resource/:id", protectLogin, (req, res) => {
    Resource.findById(req.params.id, (error, resource) => {
        if (error) {
            res.send(error)
        } else {
            res.render("show-resource.ejs", {
                resource: resource,
                id: resource.id
            })
        }
    })
})

// edit
router.get("/resource/:id/edit", protectLogin, (req, res) => {
    Resource.findById(req.params.id, null, null, (error, resource) => {
        if (error) {
            res.send(error)
        } else {
            res.render("edit-resource", {
                resource: resource
            })
        }
    })
})

// update
router.put("/resource/:id/edit", protectLogin, (req, res) => {
    Resource.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, video) => {
        if (error) {
            res.send(error)
        } else {
            res.redirect(`/resource/${req.params.id}`)
        }
    })
})

// delete 
router.delete("/resource/:id", protectLogin, (req, res) => {
    Resource.findByIdAndRemove(req.params.id, (error, deleted) => {
        if (error) {
            res.send(error)
        } else  {
            res.redirect("/resources")
        }
    })
})