// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
// needed to include the "* as" because it was compiling eachdependency as "express_1.default" and giving a type error
import * as express from 'express' // JS: const router = express.Router()
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")
import * as methodOverride from 'method-override' // JS: const methodOverride = require('method-override')
import {router} from "./controllers/wellness" // JS: const router = express.Router(), router is in {} to specify which export it is accessing from the controller "wellness"
import * as session from "express-session"

// ====== CONFIGURATION ===== //
const app = express()
const port = process.env.PORT || 3000

// ========== //
app.use(methodOverride('_method'))

// ===== MIDDLEWARE ===== //
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(
    session({
        secret: process.env.SECRET, 
        resave: false,
        saveUninitialized: false,
    })
)

// ===== CONNECT TO MONGO/EXTERNAL MIDDLEWARE ===== //
const mongoURI = process.env.LOCAL ? 'mongodb://localhost:27017/basiccrud' : process.env.MONGODBNAME
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo')
})

// ===== VARIABLES ===== //
import {EmotionalWellness} from "./models/emotional-wellness"
import {NutritionalWellness} from "./models/nutritional-wellness"
import {PhysicalWellness} from "./models/physical-wellness"
import {SocialWellness} from "./models/social-wellness"
import {TotalWellness} from "./models/total-wellness"

app.use(router)

// ===== LISTENER ===== //
app.listen(port, () => {
    console.log("listening on port", port)
})
