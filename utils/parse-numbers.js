const moment = require("moment")
var entities = require("entities");
const {myEE} = require("../events")
const fs = require("fs").promises

const cheerio = require("cheerio")
let $;

const {getNumbersHTML} = require("./get-numbers")

// Load HTML into Cheerio
let numbersFun = (localFile=false, data={}) => {
    return new Promise((resolve,reject) => {
        getNumbersHTML()
        .then(res => {

            // Tukaj se mora zapisat v bazo mimogrede.

            // Celoten html
            $ = cheerio.load(res);

            // Celotna tabela
            let temp = $("tbody > tr")

            if(temp.text() === "") {
                throw new Error("Could not parse any HTML, parsed an empty file.")
            }

            // Tabele
            var numbers = {}

            temp.each(function(i, elem) {
                let zacasno = $(this).children()

                $(zacasno).each(function(i, ele) {
                    let text = $(this).html()
                    if (isNaN(text)) {
                        text = entities.decodeHTML(text).replace(/<br>/g, " ").replace(/<b>.*<\/b>/g, "").split(" ").map((e) => e.toLowerCase())
                        numbers[text] = $(zacasno[i+1]).text()
                    }
                })
            });
            //myEE.emit("onNumbersLoad", numbers)
            fs.appendFile(process.env.PATHTOLOGS+"/parse-numbers-log.txt", `${moment().format("D.M - H:m:s")}: Parsing numbers successful\n`).catch(e => console.log(e))
            resolve(numbers)
        })
        .catch(e => {
            fs.appendFile(process.env.PATHTOLOGS+"/parse-numbers-log.txt", `${moment().format("D.M - H:m:s")}: ${e}\n`).catch(e => console.log(e))
            reject(e)
        })
    })   
}

module.exports = numbersFun