
const Log = require('./logger').logger
import * as unirest from 'unirest';

const apiKey = "fnQOIA7WeQfAOAlaicJSphkepiCUJBHZt4OoDaRX"
const urlRoot = "https://api.nal.usda.gov/fdc/v1"
const food = "/food/"
// https://api.nal.usda.gov/fdc/v1/food/168833?api_key=DEMO_KEY

export function lookupFood(fdcId:string) {

    return new Promise(resolve => {
        unirest
            .get(urlRoot + food + fdcId)
            .headers({
                "content-type": "application/json",
            })
            .query({api_key: apiKey})
            .type('json')
            .then(result => {
                resolve(result.body)
            })
    })
}