const moment = require("moment")
var entities = require("entities");
const {myEE} = require("../events")

const cheerio = require("cheerio")
let $;

const {getNumbersHTML} = require("./get-numbers")

// Load HTML into Cheerio
let numbersFun = () => {
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
                        text = entities.decodeHTML(text).replace(/<br>/g, " ").split(" ").map((e) => e.toLowerCase())
                        numbers[text] = $(zacasno[i+1]).text()
                    }
                })
            });
            myEE.emit("onNumbersLoad", numbers)
            resolve(numbers)
        })
        .catch(e => reject(e))
    })   
}

module.exports = numbersFun