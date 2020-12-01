
import * as unirest from "unirest"

import {Ingredient} from './Ingredient'
import {Recipe} from './Recipe'
import {Duration} from './DataTypes'



class ErrorBadSchema extends Error {
    constructor() {
        super();
        this.message = 'Schema not recognized'
    }
}


//=======================================
const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Referer': 'https://services.wanwandog.com'
}


/**
 * Read a web page that describes a recipe and that has a `schema.org` `Recipe` type schema within it.
 *
 * @param {string} url Address of the recipe web page
 * @return {string} html text of the page source
 */
function readRecipePage(url) {
    return new Promise(resolve => {
        unirest
            .get(url)
            .headers(requestHeaders)
            .then(result => {
                resolve(result.body)
            })
    })
}

/**
 * accepts page data ( as from `readRecipePage`) and extracts LD+JSON blocks
 * from it.  These may or may not be Recipe blocks, but will be LD+JSON segments.
 * @param {string} pageData
 * @return {string[]} Array of extracted block text
 *
 */
function findRecipeBlocks(pageData:string):string[] {
    const blocks:string[] = []
    let start = 0;
    let done = false
    const ldScriptStart = "<script type=\"application/ld+json\""
    while(!done) {
        let bs = pageData.indexOf(ldScriptStart, start)
        let ld;
        if(bs !== -1) {
            bs += ldScriptStart.length;
            let bse = pageData.indexOf('>', bs)
            if(bse == -1) bse = bs
            bse++
            let be = pageData.indexOf('</script>', bse)
            const lds = pageData.substring(bse, be)
            try {
                ld = JSON.parse(lds)
            } catch(e) {
                console.error('failed to parse ld block ', e)
            }
            start = be +1
            if(ld) {
                if(Array.isArray(ld)) {
                    ld.forEach(ldi => {
                        blocks.push(ldi)
                    })
                } else {
                    blocks.push(ld)
                }
            }
            done = (start >= pageData.length - ldScriptStart.length)
        } else {
            done = true;
        }
    }
    return blocks;
}

/**
 * Attempts to parse a LD+JSON block as a Recipe object.
 * Parsed Recipe will include Ingredient elements in `ingredientList` that has first-level (unreconciled)
 * parsing done to determine name and quqntity.
 * @param block
 */
function blockToRecipe(block) {
    const recipe = new Recipe()
    // verify the schema
    let schemaOK = block['@context'] === 'http://schema.org' || block['@context'] === 'http://schema.org/'
        || block['@context'] === 'https://schema.org' || block['@context'] === 'https://schema.org/'

    if(schemaOK) {
        schemaOK = block['@type'] === 'Recipe'
    }
    if(!schemaOK) {
        // might be in a graph array that describes the whole page
        const graphArray = block['@graph'] || []
        for( let i=0; i<graphArray.length; i++) {
            const tb = graphArray[i]
            if(tb['@type']==='Recipe') return blockToRecipe(tb)
        }

    }
    if(!schemaOK) {
        return new ErrorBadSchema()
    }
    recipe.name = block.name
    recipe.url = block.url
    recipe.author = block.author && block.author.name
    if(block.publisher) {
        recipe.publisherInfo = {
            name: block.publisher.name,
            logo: block.publisher.logo
        }
    }
    recipe.datePublished = new Date(block.datePublished)
    recipe.dateModified = block.dateModified
    recipe.cuisine = block.recipeCuisine
    recipe.category = block.recipeCategory
    recipe.keywords = block.keywords
    recipe.image = block.image
    recipe.description = block.description
    if(block.interactionStatistic) {
        if(block.interactionStatistic.interactionType === 'http://schema.org/Comment') {
            recipe.numComments = block.interactionStatistic.userInteractionCount
        }
    }
    recipe.prepTime = block.prepTime && new Duration(block.prepTime)
    recipe.cookTime = block.cookTime && new Duration(block.cookTime)
    recipe.totalTime = block.totalTime && new Duration(block.totalTime)
    recipe.servings = block.recipeYield
    const ingredients = block.recipeIngredient || []
    for (let i=0; i<ingredients.length; i++) {
        let ingText = ingredients[i]
        if(ingText) {
            if(i === 0) recipe.ingredientList = []
            recipe.ingredientList.push( new Ingredient(ingText) )
        }
    }
    const steps = block.recipeInstructions || []
    for(let i=0; i<steps.length; i++) {
        let step = steps[i]
        if(step) {
            if(i == 0) recipe.instructions = []
            recipe.instructions.push(step)
        }
    }
    // aggregateRating

    return recipe
}


/**
 * Extract the Recipe object(s) from a web page recipe article
 * @param url Url of the recipe browser page
 * @return {Promise<Recipe[]>} an array with the recipes found on this page (usually only one)
 */
export function scrape(url):Promise<Recipe[]> {
    let recipes:Recipe[] = []
    return readRecipePage(url).then((pageData:string) => {
        const blocks = findRecipeBlocks(pageData)
        for(let i=0; i< blocks.length; i++) {
            // console.log(blocks[i])
            let recipe = blockToRecipe(blocks[i])
            // console.log(JSON.stringify(recipe, null, 2))
            if(recipe instanceof Recipe) {
                recipes.push(recipe)
            }
        }
        return recipes
    })
}

