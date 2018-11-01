const moment = require("moment")
const {request} = require("./request-promise")


// Get urnik HTML
const getNumbersHTML = async () => {

// Starting options
    var options = {
        url: 'https://urnik.ts.si//login.php',
        method: 'POST',
        form: {
            inputUsername: "drofenikm",
            inputPassword: "Fyhthk2eb1324!"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

//1st req
    try {
        var res  = await request(options);        
    } catch (error) {
        throw new Error(`Could not reach ${options.url}. ERROR: ${error}`)
    }


// Get cookies and fill them in options - self invoking function
    (function () {
        options.headers.cookie = ""
        var arr = res.caseless.dict["set-cookie"]
        for (i = 0; i < arr.length; i++) {
            options.headers.cookie += arr[i].split(" ")[0]+" "
        }
    })();

// Change URL and add form (date and group)

options.url = "https://urnik.ts.si/tel_st"

//2nd req
try {
    res = await request(options);      
} catch (error) {
    throw new Error(`Could not reach ${options.url}. ERROR: ${error}`)
}

// Return HTML
   return res.body
}

module.exports = {getNumbersHTML}