
const Log = require('../logger').logger
import * as unirest from 'unirest';

const apiKey = "fnQOIA7WeQfAOAlaicJSphkepiCUJBHZt4OoDaRX"
const urlRoot = "https://api.nal.usda.gov/fdc/v1"
const food = "/food/"
const foodSearch = "/foods/search"
// https://api.nal.usda.gov/fdc/v1/food/168833?api_key=DEMO_KEY

/**
 * Lookup data on a food item by its fdcID
 * @param fdcId Food Data Central Identifier obtained previously
 * @return {Promise<any>} USDA Food Data Central data response (see usda food central site for more info)
 */
export function lookupFood(fdcId:string):Promise<any> {

    return new Promise(resolve => {
        unirest
            .get(urlRoot + food + fdcId)
            .headers({
                "content-type": "application/json",
            })
            .query({
                api_key: apiKey,
                dataType: ["Foundation"]
            })
            .type('json')
            .then(result => {
                resolve(result.body)
            })
    })
}

/**
 * Find data on a food items that match the given name/description string
 * @param {string} name Ingredient name
 * @return {Promise<any>} USDA Food Data Central data response (see usda food central site for more info)
 */
export function findFoodByName(name:string) {

    return new Promise(resolve => {
        unirest
            .get(urlRoot + foodSearch)
            .headers({
                "content-type": "application/json",
            })
            .query ({
                query: name,
                api_key: apiKey
                })
            .type('json')
            .then(result => {
                resolve(result.body)
            })
    })

}