try {
    var config = require("./config.json")   
} catch (error) {
    throw new Error("Missing config.json, can not login into Moj Telekom. File should be in the folder config.")
}

process.env.MTUSERNAME = config.MTUSERNAME
process.env.MTPASSWORD = config.MTPASSWORD
process.env.MTNUMBER = config.MTNUMBER
process.env.PORT = config.PORT
process.env.PATHTOLOGS = require("path").join(__dirname, "../logs")