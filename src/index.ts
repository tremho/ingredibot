import {DB_Info} from "./Cloud/Ingredibot_DB";

const Log = require('./logger').logger

import * as Ingredibot from './Cloud/Ingredibot_DB'
import {Density, UnitType, NameMapUnit} from 'unit-measure'

import {scrape} from "./Spatula/Schema";
import {Recipe} from "./Spatula/Recipe"
import {Ingredient} from "./Spatula/Ingredient"

import * as Searcher from './Cloud/Searcher'

import * as promiseLoop from "./promiseLoop"

Log.info("Hello world.  This is ingredibot!")

/**
 * Conduct the process of importing ingredients into the DB from a recipe URL
 * @param {string} url Recipe page url
 * @return {Promise<any>>} Promise resolves when done
 */
function builder(url) {
    // `scrape` recipe from url
    return scrape(url).then(recipies => {
        return promiseLoop.execute(recipies, (arg, ordinal, result) => {
            const recipe = (arg as Recipe)
            const reconciled: DB_Info[] = []
            return promiseLoop.execute(recipe.ingredientList, (arg, ordinal, result) => {
                const ingredient = (arg as Ingredient)
                Log.debug(`Parsed ${ingredient.text} as ${ingredient.quantity.getValue()} ${ingredient.quantity.getValueUnit()} ${ingredient.name}, ${ingredient.unitModifier}` )

                return Ingredibot.reconcileIngredient(ingredient).then(dbInfo => {
                    reconciled.push(dbInfo)
                })
                return Promise.resolve()
            }).then(() => {
                for (let i = 0; i < reconciled.length; i++) {
                    const dbObj = reconciled[i]
                    Log.debug('reconciled: \n'+JSON.stringify(dbObj, null, 2))
                }
            })
        })
    })
}

/**
 * Used to help analyse our parsing versus that which was done by Zestful so that we can potentially improve
 * our effectiveness there.
 * @param ingr
 * @param zInfo
 */
function compareParsing(ingr:Ingredient, zInfo:DB_Info) {
    let text = ingr.text
    let problems:string[] = []

    if(ingr.name !== zInfo.name) {
        problems.push('Ingredient name ' +ingr.name + ' did not parse to Z\'s ' + zInfo.name)
    }
    if(ingr.quantity.getValue() !== zInfo.qty) {
        problems.push('Ingredient quantity ' + ingr.quantity.unitCount + ' did not parse to Z\'s ' + zInfo.qty)

    }
    let syn = NameMapUnit.resolveSynonym(zInfo.unit)
    if(ingr.quantity.getValueUnit() !== syn) {
        problems.push('Ingredient unit ' + ingr.quantity.getValueUnit() + ' did not parse to Z\'s ' + zInfo.unit +' ('+syn+')')
    }

    console.log(`line "${text}" parsed as "${ingr.quantity.getValue()}" "${ingr.unitModifier||''} ${ingr.quantity.getValueUnit()}" "${ingr.name}`)
}


//========== Run =====
const recipeUrls = [
    'https://www.allrecipes.com/recipe/269696/instant-pot-beef-stuffed-peppers/',
    'https://www.taste.com.au/recipes/one-pot-chicken-alfredo-tortellini-recipe/nmqhjztv?r=quickeasy/mfQ7EL9o',
    'https://temeculablogs.com/instant-pot-crack-chicken-casserole/'
]
Ingredibot.setup().then(() => {
    Searcher.searchRecipes()
    // Ingredibot.updater()
    // promiseLoop.execute(recipeUrls, (arg => {
    //     let url = (arg as string)
    //     return builder(url)
    // })).then(() => {
    //     Log.info('done')
    //     Ingredibot.dumpIndex()
    //     return Ingredibot.shutdown()
    // })
})

/*
TODO:
find urls with unrecognized schemas or other anomalies and report.


Here's one:

'https://www.taste.com.au/recipes/one-pot-chicken-alfredo-tortellini-recipe/nmqhjztv?r=quickeasy/mfQ7EL9o'
 */


