// Is used in get-urnik.ts

const requestOld = require("request")

var request = (options) => {
    return new Promise((resolve, reject) => {
        requestOld(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else if (response.statusCode !== 200 && response.statusCode !== 302) {
                reject(body.message)
            }
            else {
                resolve(response)
            }
        })
    })
}

module.exports = {request}