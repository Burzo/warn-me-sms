require("./events.js")
require("./config/config.js")

const {myEE} = require("./events")
const express = require("express")
const {sendSms} = require("mojtelekomsms")
const moment = require("moment")

const baza = require("./utils/parse-schedule.js")
const numbers = require("./utils/parse-numbers.js")
const app = express()

// TEST IF LOADING
myEE.on("onUrnikLoad", (res) =>  console.log())
myEE.on("onNumbersLoad", (res) =>  console.log())








//app.listen(process.env.PORT, ()=> console.log(`LISTENING ON PORT ${process.env.PORT}`))