require("./../events.js")
require("./../config/config.js")

const {myEE} = require("./../events")
const fs = require("fs").promises
const {sendSms} = require("mojtelekomsms")
const moment = require("moment")

const baza = require("./../utils/parse-schedule.js")
const numbers = require("./../utils/parse-numbers.js")

// TEST IF LOADING
// myEE.on("onUrnikLoad", (res) =>  console.log())
// myEE.on("onNumbersLoad", (res) =>  console.log())

//----------------------------------------------------------------------------------------------------------------------------------
const send = async (user, obj={}) => {
    let numbersAll = await numbers()
    let bazaAll = await baza()

    let day = parseInt(moment().format("D"))-1 // -1 ker se pr 0 začne
    let shiftEnd = bazaAll[user][day][1] // 1 ker se takrt konča izmena

    if (!shiftEnd) {
        return `${user} danes ne dela.`
    }

    let shiftEndFullTime = (moment(`${shiftEnd}-0-0`, "H-m-s")).subtract(15, "minutes")
    let remainder = moment.utc(shiftEndFullTime.diff(moment())).format("H:m")

    remainder = (moment.duration(remainder).asHours()).toFixed(1)
    
    let text = `*DEF ${remainder}# Oddaj porocilo.`
    let log = `${moment().format("D.M - H:m:s")}: Sms z vsebino ${text} poslan ${user}. Predvidoma bi moral prispeti ob ${shiftEndFullTime.format("H:m")}h\n`

    sendSms(numbersAll[user], text, process.env.MTUSERNAME, process.env.MTPASSWORD, process.env.MTNUMBER).catch(e => fs.appendFile(process.env.PATHTOLOGS+"/send-sms-logs.txt", `${moment().format("D.M - H:m:s")}: ${e}}. Preverite vpisne podatke.\n`))

    fs.appendFile(process.env.PATHTOLOGS+"/send-sms-logs.txt", log).catch(e => console.log(e))
    return log
}


module.exports = send