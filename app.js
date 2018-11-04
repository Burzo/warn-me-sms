require("./events.js")
require("./config/config.js")

const express = require("express")
const fs = require("fs").promises
var cron = require('node-cron');
const async2 = require("async")
const moment = require("moment")
const {sendSms} = require("mojtelekomsms")

const baza = require("./utils/parse-schedule.js")
const numbers = require("./utils/parse-numbers.js")
const {myEE} = require("./events")
const send = require("./src/send-sms.js")
const asyncForEach = require("./utils/helpers.js")
const sendToMore = require("./src/send-to-more.js")

const app = express()

// TEST IF LOADING
// myEE.on("onUrnikLoad", (res) =>  console.log())
// myEE.on("onNumbersLoad", (res) =>  console.log())

cron.schedule(" 0 5 * * * ", () => {
    sendToMore()
    },  {
        scheduled: true,
        timezone: "Europe/Ljubljana"
    }
)

// Update schedule and numbers every day in a file, at 0 minutes and 4 hours (04:00am)
cron.schedule("0 4 * * *", async () => {
    let num = await numbers()
    let baz = await baza()

    fs.writeFile(__dirname+"/data/baza.json", JSON.stringify(baz)).then(() => fs.appendFile(process.env.PATHTOLOGS+"/server-logs.txt", `${moment().format("D.M - H:m:s")}: Wrote to ${__dirname+"/data/baza.json"}\n`))
    fs.writeFile(__dirname+"/data/stevilke.json", JSON.stringify(num)).then(() => fs.appendFile(process.env.PATHTOLOGS+"/server-logs.txt", `${moment().format("D.M - H:m:s")}: Wrote to ${__dirname+"/data/stevilke.json"}\n`))
},  {
    scheduled: true,
    timezone: "Europe/Ljubljana"
})


app.listen(process.env.PORT, ()=> {
    fs.appendFile(process.env.PATHTOLOGS+"/server-logs.txt", `${moment().format("D.M - H:m:s")}: LISTENING ON PORT ${process.env.PORT}\n`)
    console.log(`${moment().format("D.M - H:m:s")}: LISTENING ON PORT ${process.env.PORT}`)
})