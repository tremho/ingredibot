
/*
Rapid API possibilities:
WebKnox Recipe API - https://rapidapi.com/webknox/api/recipe
Recipe Puppy - https://rapidapi.com/brianiswu/api/recipe-puppy
Yummly - https://rapidapi.com/apidojo/api/yummly2
Tasty - https://rapidapi.com/apidojo/api/tasty
Recipe search and diet - https://rapidapi.com/edamam/api/recipe-search-and-diet
Rakuten - https://rapidapi.com/rakuten_webservice/api/rakuten-recipe
The Meal DB - https://rapidapi.com/thecocktaildb/api/themealdb
Worldwide recipes - https://rapidapi.com/ptwebsolution/api/worldwide-recipes
Campbells Kitchen - https://rapidapi.com/campbellkitchen/api/campbells-kitchen
Shobr - https://rapidapi.com/tk76/api/shobr-recipes
Food2Fork - https://rapidapi.com/community/api/food2fork

Helpers / Competitors:
MyCookbook.io  - https://rapidapi.com/mycookbook/api/mycookbook-io1
Recipes to Grocery Store - https://rapidapi.com/tk76/api/recipes-to-grocery-store
Big Oven - https://rapidapi.com/volodimir.kudriachenko/api/BigOven
Supper app - https://rapidapi.com/techtic.naitik/api/supper_app
Recipe Ingredients Tagger - https://rapidapi.com/rajeshmr/api/recipe-ingredients-tagger/details
Idilia Sense Analytics - https://rapidapi.com/idilia/api/idilia-sense-analytics
 */

const Log = require('../logger').logger

import * as Spoonacular from './Spoonacular'

export class SearchOptions {
    public season?: string; // winter, spring, summer or fall
    public cuisine?: string; // e.g. american, french, mediterranean, indian
    public category?: string; // e.g. vegetarian, keto, holiday
    public keywords?: string[];
}

export function searchRecipes(options:SearchOptions = {}):Promise<string[]> {
    const out:string[] = []
    const all:Promise<any>[] = []
    all.push(Spoonacular.searchRecipes(options))

   return Promise.all(all).then((a /*, b, c, d, e */) => {
        Log.debug(a)
        return out;
    })
}