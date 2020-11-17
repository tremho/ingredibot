const Log = require('./logger').logger

import * as Zestful from './Zestful'
import * as USDA from './USDA'
import {Density, UnitType, NameMapUnit} from 'unit-measure'

Log.info("Hello world.  This is ingredibot!")

/**
 * TODO Plan:
 * - accept an argument of an ingredient line.  (e.g. 2 ounces goat cheese, crumbled)
 * - start with *Zestful* API
 * Zestful (https://zestfuldata.com/docs/) parses and returns the fdcId for a food item ingredient, which I guess I could look up on the FDC site
 * - (spatula has a parser for this, but that's another story at this point. comparisons useful for testing.)
 * - send the ingredient line text to their parser
 * - From their response. all we care about is the fcdid (fda)
 * - but we'll use their parser to prove out our own, so grab the quantity and ingredient name and prep from here.
 *
 * - then call the fda database and get the portion amount info.
 * - the foodPortion info has what we want in terms of density information.
 * -------
 * So what we have here is a decent proof-of-concept.  Let's build on that
 *
 * TODO plan for our DB  / what's next
 * - set up the AWS bucket for this, including an index by name that maps to fdcId that is our AWS object key for the data record
 * - set up to receive a feed of recipe URLs
 * - use Spatula type methods to read the ingredient lists from each recipe
 * - from our parse, see if we have a record for the ingredient already, if so, update our reference count in the index
 *  - if not, add new entry to index, then:
 *  - process those ingredient lists with the process here
 *  - add the data to AWS bucket
 *  - repeat with a continual stream of new recipes until the 'new entries added' count falls below a low threshold.
 *  - we can then consider a first version of our DB complete.
 *
 * TODO plan for DB revisions.
 * - read the index, sort by priority of most references
 * - read the object data.  Use the category field, or maybe the name in some cases to map to perishability tables we've
 * imported from other sources.
 * - go back to the USDA for nutrition info and cobble together our own table
 * - update and version stamp the data and index
 */

function getIncomingIngredientLine() {
    const cmdargs = process.argv.splice(2)
    let asText = cmdargs.join(' ').trim()
    if(!asText) {
        asText = "1/2 cup brown sugar, packed"
    }
    Log.info('ingredient line is ' + asText)
    return asText;
}

const textToParse = getIncomingIngredientLine()

const composed = {
    name: '',
    qty: 0,
    unit: '',
    prep: '',
    fdcId: '',
    density: 0
}

// Now send this to Zestful for an identification
Zestful.readIngredientLine(textToParse).then(resp => {
    Log.debug('Zestful returns:\n'+JSON.stringify( resp, null, 2))

    // ok. what do we want from this?
    let parsed = (resp as any)
    parsed = parsed && parsed.results && parsed.results[0]
    parsed = parsed && parsed.ingredientParsed
    if(parsed) {
        composed.name = parsed.product
        composed.qty = parsed.quantity
        composed.unit = parsed.unit
        composed.prep = parsed.preparationNotes
        composed.fdcId = parsed.usdaInfo.fdcId
    }

    Log.debug('composed so far:\n'+ JSON.stringify( composed, null, 2)+'\n')

    // Now ask our friends at the usda for what they can tell us
    USDA.lookupFood(composed.fdcId).then(resp => {
        Log.debug('USDA FDC returns:\n'+JSON.stringify( resp, null, 2))

    // Find the foodPortions array of the FDA response and create an array of measurement samples so we can devise a mean density based on these.
    // We should also be able to tease out the form based upon the modifier of the portion entry.
    // For now, just grab the modifier and we’ll post process it with parsing after we’ve surveyed the field a bit

        const foodPortions = resp && (resp as any).foodPortions || []
        const densities:number[] = []
        foodPortions.forEach(fp => {
            let unit = fp.measureUnit.name || fp.measureUnit.abbreviation
            if(!unit || unit === 'undetermined') unit = fp.modifier

            unit = unit && unit.split(' ')[0]

            let ut = NameMapUnit.resolveSynonym(unit)

            let qty = fp.amount || 1
            let grams = fp.gramWeight

            let density = new Density(UnitType.Gram, ut, grams, qty)
            densities.push(density.getValueAs(UnitType.Gram, UnitType.Milliliter))
        })
        let total = 0;
        let mean = 0;
        densities.forEach(d => {
            total += d;
        })
        mean = total/densities.length

        composed.density = mean

        Log.debug('\n\nWhat we\'ve got composed:\n' + JSON.stringify( composed, null, 2)+'\n')


    })

})

