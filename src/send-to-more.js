const async2 = require("async")
const send = require("./send-sms.js")
const fs = require("fs").promises

const sendToMore = async () => {
// čez tabelo in usem poslat
    try {
        let users = JSON.parse(await fs.readFile(__dirname+"/../data/users.json", {encoding:"UTF-8"})).users
        console.log(users)
        for (let user of users) {
            let i = await send(user)
            console.log(i,user)
        };
    } catch (e) {
        console.log(e)
        fs.appendFile(process.env.PATHTOLOGS+"/send-sms-logs.txt", `${moment().format("D.M - H:m:s")}: ${e}}. Preverite vpisne podatke.\n`)
    }
}

module.exports = sendToMore