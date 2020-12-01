//https://rapidapi.com/spoonacular/api/recipe-food-nutrition/endpoints

const Log = require('../logger').logger

import * as unirest from 'unirest'
import {DB_Info} from "./Ingredibot_DB";

const urlRoot = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes"
const SEARCH = '/search/'
const RANDOM = '/random/'

const rapidAPIHeaders = {
    "x-rapidapi-key": "4eaa2d960fmsh2e4ad5ae1140471p18bf96jsn603eefb69d19",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "useQueryString": true
}

import {SearchOptions} from "./Searcher";
/**
 * Called if there is no searchline parameters
 */
function getRandomRecipes(numResults = 100) {
    const out:string[] = []
    return new Promise(resolve => {
        unirest
            .get(urlRoot + RANDOM)
            .headers(rapidAPIHeaders)
            .type('json')
            .query({
                number: '' + numResults
                // tags, limitLicense
            })
            .then(result => {
                const body = result.body
                if(body) {
                    const recipes = body.recipes || []
                    for(let i=0; i<recipes.length; i++) {
                        const srec = recipes[i]
                        out.push(srec.sourceUrl)
                    }
                }
                resolve(out)
            })
    })

}

/**
 * Called when searchLine parameters have been teased out of options
 * @param searchLine
 */
function findRecipes(searchLine:string, cuisine?:string, diet?:string,  pageOffset:number = 0, numResults:number = 100):Promise<string[]> {
    const out:string[] = []
    return new Promise(resolve => {
        unirest
            .get(urlRoot + SEARCH)
            .headers(rapidAPIHeaders)
            .type('json')
            .query({
                query: searchLine,
                number: '' + numResults,
                offset: '' + pageOffset,
                type: "main course",
                cuisine,
                diet
                // excludeIngredients/intolerances, instuctionsRequired, limitLicense
            })
            .then(result => {
                const body = result.body
                if(body) {
                    const recipes = body.recipes || []
                    for(let i=0; i<recipes.length; i++) {
                        const srec = recipes[i]
                        out.push(srec.sourceUrl)
                    }
                }
                resolve(out)
            })
    })
}

/**
 * Turn options into searchline and get results
 * @param options
 */
export function searchRecipes(options:SearchOptions = {}):Promise<string[]> {
    let out:string[] = []
    let searchLine = ''
    let cuisine, diet
    if(options.season) {
        searchLine = options.season
    }
    if(options.cuisine) {
        //  must be one of the allowed values
        const allowed = [
            'african', 'chinese', 'japanese', 'korean', 'vietnamese',
            'thai', 'indian', 'british', 'irish', 'french', 'italian',
            'mexican', 'spanish', 'middle eastern', 'jewish', 'american',
            'cajun', 'southern', 'greek', 'german', 'nordic',
            'eastern european', 'caribbean', 'latin american'
        ]
        if(allowed.indexOf(options.cuisine) !== -1) {
            cuisine = options.cuisine
        }
    }
    if(options.category) {
        // must be one of the allowed values
        const allowed = ['pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'vegetarian']
        if(allowed.indexOf(options.category) !== -1) {
            diet = options.category
        }
    }
    // options.keywords

    let p;
    if(searchLine) {
        p = findRecipes(searchLine, cuisine, diet)
    } else {
        p = getRandomRecipes()
    }
    return p

}