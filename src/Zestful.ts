
const Log = require('./logger').logger
import * as unirest from 'unirest';

const rapidApiKey = "4eaa2d960fmsh2e4ad5ae1140471p18bf96jsn603eefb69d19"
const rapidApiHost = "zestful.p.rapidapi.com"
const urlRoot = "https://zestful.p.rapidapi.com"
const parseIngredients = '/parseIngredients'

export function readIngredientLine(lineText:string) {

    const ingredients = {
        ingredients:[
            lineText
        ]
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
                resolve(result.body)
            })
    })
}