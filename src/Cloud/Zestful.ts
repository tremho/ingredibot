
const Log = require('../logger').logger
import * as unirest from 'unirest';

const rapidApiKey = "4eaa2d960fmsh2e4ad5ae1140471p18bf96jsn603eefb69d19"
const rapidApiHost = "zestful.p.rapidapi.com"
const urlRoot = "https://zestful.p.rapidapi.com"
const parseIngredients = '/parseIngredients'

import {DB_Info} from "./Ingredibot_DB";

/**
 * Call upon the Zestful API to parse an recipe ingredient line.
 *
 * @param {string[]} ingredientLines Lines from the recipe to be parsed
 * @return {DB_Info[]} Array of corresponding parsed data
 */
export function parseLines(ingredientLines:string[]):Promise<DB_Info[]> {

    const ingredients = {
        ingredients: ingredientLines
    }

    return new Promise(resolve => {
        unirest
            .post(urlRoot + parseIngredients)
            .headers({
                "content-type": "application/json",
                "x-rapidapi-key": rapidApiKey,
                "x-rapidapi-host": rapidApiHost,
                "useQueryString": true
            })
            .type('json')
            .send(ingredients)
            .then(result => {
                let list = result.body
                list = (list && list.results) || []
                let out:DB_Info[] = []
                for(let i=0; i<list.length; i++) {
                    let parsed = list[i]
                    parsed = parsed && parsed.ingredientParsed
                    if(parsed) {
                        let composed = new DB_Info()
                        composed.name = parsed.product
                        composed.qty = parsed.quantity
                        composed.unit = parsed.unit
                        composed.prep = parsed.preparationNotes
                        composed.fdcId = parsed.usdaInfo && parsed.usdaInfo.fdcId
                        out.push(composed)
                    }
                }
                resolve(out)
            })
    })
}

