const fs = require("fs")
const path = require("path")

try {
    var config = require("./config.json")   
} catch (e) {
    throw new Error("Missing config.json, can not login into Moj Telekom. File should be in the folder config.")
}

process.env.MTUSERNAME = config.MTUSERNAME
process.env.MTPASSWORD = config.MTPASSWORD
process.env.MTNUMBER = config.MTNUMBER
process.env.PORT = config.PORT

//Check if logs folder exists
if (!fs.existsSync(path.join(__dirname, "../logs"))) {
    fs.mkdirSync(path.join(__dirname, "../logs"))
}

process.env.PATHTOLOGS = path.join(__dirname, "../logs")