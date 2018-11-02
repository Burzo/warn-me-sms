const moment = require("moment")
var entities = require("entities");
const {myEE} = require("../events")
const fs = require("fs").promises

const cheerio = require("cheerio")
let $;

const {getUrnikHTML} = require("./get-urnik")

// Load HTML into Cheerio
let bazaFun = (localFile=false, data={}) => {
    return new Promise((resolve,reject) => {
        getUrnikHTML()
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
            var vsi = [] // Vsi userji
            var final = [] // Vsi userji + ure
            let skupno = {} // Vsi userji + ure v Objectu

            // Števci
            var daysCounter = 0 // Šteje do kolikor je dni v mesecu, da se ne prezapolni tabela.

            temp.each(function(i, elem) {
                let zacasno = $(this).children()
                daysCounter = 0
                $(zacasno).each(function(i, ele) {
                    let text = $(this).text()
                    let html = $(this).html()
                    let manyDays = moment().daysInMonth()
                    let tempo = [];
                    
                    // Tukaj je logika trimanja ipd. HTMLja
                    if (0 < i && i !== 2 && text !== "") {
                        if (daysCounter <= manyDays) {
                            if (i !== 1) {
                                var replacedText = html.match(/[0-9]*/g)
                                replacedText.forEach(element => {
                                    if (element !== "") {
                                        tempo.push(element);
                                    }
                                });
                                final.push(tempo)
                            } else {
                                let oseba = entities.decodeHTML(html).replace(/<br>/g, " ").split(" ").map((e) => e.toLowerCase())
                                vsi.push(oseba)
                                final.push(oseba)
                            }  
                            daysCounter++                
                        } else {
                        }
                    }
                })
            });

            // Samo še enkrat uporabim isti counter.
            daysCounter = 0

            // Combine vsi and final into an object skupno (keys are surname+name)
            for (let i = 0; i < final.length; i++) {
                if (vsi[daysCounter] === final[i]) {
                    skupno[vsi[daysCounter]] = []
                    var trenutnaOseba = vsi[daysCounter]
                    daysCounter++;
                } else {
                    skupno[trenutnaOseba].push(final[i])
                }
            }
            //myEE.emit("onUrnikLoad", skupno)
            fs.appendFile(process.env.PATHTOLOGS+"/parse-schedule-logs.txt", `${moment().format("D.M - H:m:s")}: Parsing schedule successful\n`).catch(e => console.log(e))
            resolve(skupno)
        })
        .catch(e => {
            fs.appendFile(process.env.PATHTOLOGS+"/parse-schedule-logs.txt", `${moment().format("D.M - H:m:s")}: ${e}\n`).catch(e => console.log(e))
            reject(e)
        })
    })   
}

module.exports = bazaFun