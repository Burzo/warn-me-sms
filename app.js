const express = require("express")
const lodash = require("lodash")
const bodyParser = require("body-parser")
const sendSms = require("mojtelekomsms")
const htmlParser = require("node-html-parser")
const axios = require("axios")
const moment = require("moment")
const fs = require("fs")
var entities = require("entities");

const cheerio = require("cheerio")
let $;

const {getUrnikHTML} = require("./utils/get-urnik")

// Load HTML into Cheerio
getUrnikHTML()
.then(res => {

    // Tukaj se mora zapisat v bazo mimogrede.

    // Celoten html
    $ = cheerio.load(res);

    // Celotna tabela
    let temp = $("tbody > tr")

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
            //let finalTempo;
            let tempo = [];
            
    
            if (0 < i && i !== 2 && text !== "") {
                if (daysCounter <= manyDays) {
                    if (i !== 1) {
                        var replacedText = html.match(/[0-9]*/g)
                        replacedText.forEach(element => {
                            if (element !== "") {
                                tempo.push(element);
                            }
                        });
                        //finalTempo = tempo;
                        final.push(tempo)
                    } else {
                        let oseba = entities.decodeHTML(html).replace(/<br>/g, " ").split(" ").map((e) => e.toLowerCase())
                        vsi.push(oseba)
                        //finalTempo = oseba;
                        final.push(oseba)
                    }
                    //final.push(finalTempo)    
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
    return skupno
})
.then(res => console.log(res))
.catch(e => console.log(e))


// let manyDaysTwo = moment().daysInMonth()
// for (let i = 0; i < skupno["blažko,vugrin,črt"].length; i++) {
//     console.log(skupno["blažko,vugrin,črt"][i])
// }