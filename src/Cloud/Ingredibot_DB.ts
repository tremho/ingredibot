import {Ingredient} from "../Spatula/Ingredient";

const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({profile: 'wagtales'})
const S3 = new AWS.S3({apiVersion: '2006-03-01'})
const Log = require('../logger').logger;

import * as promiseLoop from "../promiseLoop"

import {Perishability, findStorageTimes} from "./Perishability";

import * as USDA from "./USDA";
import * as Zestful from "./Zestful"
import {Density, UnitType, NameMapUnit} from 'unit-measure'

const indexKey = "index"
const fdcBucket = "ingredibot-by-fdc-id" // except for 'index', all keys are fdcId identifiers per USDA

const minUpdateInterval = 300000 // 5 minutes
let lastUpdate = Date.now()

let cachedIndex:IndexEntry[] = []
let indexMap;

/**
 * entry structure of the DB index
 *
 * @file: `Incredibot_DB.ts`
 *
 * | property | type | default | description |
 * | -------  | ---- | ------- | ----------- |
 * | name | string | '' | name of the ingredient
 * | mstsEntered | number | 0 | Javascript timestamp (ms) of when this db entry was created
 * | timesReferenced | number | 0 | number of times this index item was accessed since first entry
 * | fdcId  | string | '' | the food data central code for this food item
 */
export class IndexEntry {
    public name: string = '' // name or abbreviation.  Note we may have more than one key that maps to the same fdcId
    public mstsEntered: number = 0 // ms
    public timesReferenced: number = 0 // to be updated with each reference
    public fdcId: string = '' // the fdcId used as a key in the bucket
}

/**
 * Recipe info as stared in the database

 * @file: `Incredibot_DB.ts`
 *
 * | property | type | default | description |
 * | -------  | ---- | ------- | ----------- |
 * | name | string | '' | name of the ingredient
 * | qty | number | 0 | quantity in the given unit of measure
 * | unit | string | '' | unit of measure the quqntity represents
 * | prep  | string | '' | string describing preparation or other modifiers
 * | fdcId  | string | '' | the food data central code for this food item
 * | density | number | 0 | Density ratio of this item (water === 1.0)
 * | perish | Perishability | -- | Perishability data for this ingredient
 */
export class DB_Info {
    public name: string = ''
    public qty: number = 0
    public unit: string = ''
    public prep: string = ''
    public fdcId: string = ''
    public density: number = 0
    public perish: Perishability
    // todo: Nutrition
}

/**
 * Load a DB record by fdcId
 *
 * @param {string} fdcId
 * @return {Promise<DBInfo>} Promise resolves with DB_Info data or null.
 */
function loadData(fdcId:string) {
    return new Promise(resolve => {
        if (!fdcId) return resolve(null) // no data; fast reject.
        S3.getObject({Bucket: fdcBucket, Key: fdcId}).promise().then(data => {
            const str = data.Body.toString()
            let fdcData
            try {
                fdcData = JSON.parse(str)
            } catch(e) {
                Log.info('Failed to parse loaded data by fdcid', e)
                resolve(null)
            }
            // Log.info('User Object get for ' + accessToken, data)
            // Log.info('loaded user '+ fdcId)
            resolve(fdcData)
        }).catch(e => {
            Log.exception('Failed to load data by fdcid', e)
            resolve(null)
        })
    })
}


/**
 * Saves the DB_Info data in the bucket under its fdcId
 *
 * @param data
 */
function saveData(data:DB_Info) {
    let str;
    try {
        str = JSON.stringify(data)
    } catch (e) {
        return Promise.resolve()
    }
    try {
    if(!data.fdcId) {
        console.error('missing fdcId -- can\'t save data\n'+JSON.stringify(data, null,2))
        return Promise.resolve()
    }
    indexMap.set(data.name, data)
    Log.debug(`data saved: ${data.name} (${data.fdcId})`)
    return S3.putObject({Bucket: fdcBucket, Key: data.fdcId, Body: str}).promise()
        .catch(e => {
            Log.exception('Failed to save data', e)
            return Promise.resolve()
        })
    } catch(e) {
        Log.exception('Failed to save data', e)
        return Promise.resolve()
    }

}

/**
 * Load the DB index
 *
 * @return {Promise<IndexEntry[]>} Promise resolves with an array of IndexEntry items or null
 */
export function loadIndex() {
    return new Promise(resolve => {
        if(cachedIndex.length) return resolve(cachedIndex)
        S3.getObject({Bucket: fdcBucket, Key: indexKey}).promise().then(data => {
            const str = data.Body.toString()
            let index
            try {
                index = JSON.parse(str)
            } catch(e) {
                Log.info('Failed to parse loaded index data', e)
                resolve(null)
            }
            // Log.info('User Object get for ' + accessToken, data)
            // Log.info('loaded index')
            cachedIndex = index
            resolve(index)
        }).catch(e => {
            if(e.code === 'NoSuchKey') {
                return resolve(cachedIndex)
            }

            Log.exception('Failed to load index', e)
            resolve(null)
        })
    })
}

/**
 * Persist the index to storage.
 * will write to the cloud if we are beyond our minimum update interval
 * Should be called on any index update
 * Should be called with force=true at app close
 * @param force
 * @return {Promise} should not proceed until promise resolves.
 */
function updateIndex(force?:boolean):Promise<void> {
    cachedIndex = Array.from(indexMap.values())
    let since = Date.now() - lastUpdate;
    let doUpdate = (force || since > minUpdateInterval)
    return new Promise(resolve => {
        if(doUpdate) {
            let str;
            try {
                str = JSON.stringify(cachedIndex)
            } catch(e) {
                str = "[]"
            }
            try {
                lastUpdate = Date.now()
                S3.putObject({Bucket: fdcBucket, Key: indexKey, Body: str}).promise().then(() => {
                    return resolve()
                }).catch(e => {
                    Log.exception('Failed to save index', e)
                    return resolve()
                })
            } catch(e) {
                Log.exception('Failed to save index', e)
                return resolve()
            }
        } else {
            return resolve()
        }

    })
}

/**
 * Turns the cachedIndex array into map
 */
function makeIndexMap() {
    indexMap = new Map<string, IndexEntry>()
    cachedIndex.forEach(entry => {
      indexMap.set(entry.name, entry)
    })
}

/**
 * Call at start to establish index
 */
export function setup():Promise<void> {
    return loadIndex().then(() => {
        return makeIndexMap()
    })
}

/**
 * Get an ingredient from our index, if it's there
 * @param {string} type  Name of the ingredient
 * @return {DB_Info | undefined}  the record we have in stare for this ingredient
 */
export function getIngredient(type:string):DB_Info|undefined {
    return indexMap.get(type)
}

/**
 * Perform final persistance before leaving app.
 */
export function shutdown():Promise<void> {
    return updateIndex(true)
}

export function reconcileIngredient(ingredient:Ingredient):Promise<DB_Info> {
    let out = getIngredient(ingredient.name)
    if (out) return Promise.resolve(out) // return from our DB

    // New ingredient -- make entry
    return reconcileNewIngredient(ingredient).then(dbInfo => {
        // add to DB
        saveData(dbInfo)
        return updateIndex().then(() => {
            return dbInfo
        })
    })
}
//-----------
/**
 * Turn Ingredient into a reconciled DB_Info ingredient object
 * @param ingredient
 */
export function reconcileNewIngredient(ingredient:Ingredient):Promise<DB_Info> {
    const out = new DB_Info()
    out.name = ingredient.name
    out.unit = ingredient.quantity.getValueUnit()
    out.qty = ingredient.quantity.getValue()

    // out.prep = ingredient.unitModifier
    // if (ingredient.ingredientType.prep) {
    //     if (out.prep) out.prep += ', '
    //     else out.prep = ''
    //     out.prep += ingredient.ingredientType.prep
    // }
    return Zestful.parseLines([ingredient.text]).then(infoList => {
        let list: DB_Info[] = (infoList as DB_Info[])
        let dbInfo = list[0]
        out.fdcId = dbInfo.fdcId
        let p = out.fdcId ? Promise.resolve() : USDA.findFoodByName(ingredient.name)
        return p.then(resp => {
            if(resp) {
                let foodList = resp && (resp as any).foods
                let i = -1
                let food
                while (!out.fdcId && (food = foodList[++i])) {
                    let names = food.description.split(',')
                    for (let j = 0; j < names.length; j++) {
                        let name = names[j]
                        if (name.trim().toLowerCase() === ingredient.name.toLowerCase()) {
                            out.fdcId = food.fdcId
                            break;
                        }
                    }
                }
            }
            if(!out.fdcId) return out;
            return USDA.lookupFood(out.fdcId).then(resp => {
                const foodPortions = resp && (resp as any).foodPortions || []
                const densities: number[] = []
                foodPortions.forEach(fp => {
                    let unit = fp.measureUnit.name || fp.measureUnit.abbreviation
                    if (!unit || unit === 'undetermined') {
                        unit = NameMapUnit.resolveSynonym(fp.modifier)
                        if (!unit) {
                            let res =fp.modifier.match(/\w+[ ,\.;!\/\(]/)
                            unit = (res && res[0]) || '' // matched word
                            unit = unit.substring(0, unit.length - 1) // trim last character
                        }
                    }
                    if (unit === 'oz') unit = 'fl.oz'

                    try {
                        let ut = NameMapUnit.resolveSynonym(unit)
                        if (ut) {
                            let qty = fp.amount || 1
                            let grams = fp.gramWeight

                            let density = new Density(UnitType.Gram, ut, grams, qty)
                            densities.push(density.getValueAs(UnitType.Gram, UnitType.Milliliter))
                        }
                    } catch (e) {
                        Log.error('can\'t compute density ' + e.message)
                    }
                })
                let total = 0;
                let mean = 0;
                if (!densities.length) {
                    mean = 1.0 // assume water or equivalent
                } else {
                    densities.forEach(d => {
                        total += d;
                    })
                    mean = total / densities.length
                }
                out.density = mean
                return out;
            })
        })
    })
}

/**
 * Output contents of index for debugging purposes
 */
export function dumpIndex() {
    try {
        let isDone = false
        let entries = indexMap.entries()
        while(!isDone) {
            let {value, done} = entries.next()
            isDone = done
            let [name, dbInfo] = value;
            Log.debug(`${name} = ${JSON.stringify(dbInfo)}`)
        }
    } catch(e) {

    }
}

function appendPerishabilityData(dbInfo:DB_Info):Promise<DB_Info> {
    // Log.debug('Pretend to add perishability to '+dbInfo.name)
    dbInfo.perish = findStorageTimes(dbInfo.name)


    return Promise.resolve(dbInfo)
}

function appendNutritionData(dbInfo:DB_Info):Promise<DB_Info> {
    // Log.debug('Pretend to add nutrition to '+dbInfo.fdcId)
    return Promise.resolve(dbInfo)
}

export function updater() {
    let entryArray = Array.from(indexMap.entries())
    return promiseLoop.execute(entryArray, (arg) => {
        let [name, dbInfo] = arg;
        return appendPerishabilityData(dbInfo).then(dbInfo => {
            return appendNutritionData(dbInfo).then(dbInfo => {
                outputIngredient(dbInfo)
                return dbInfo
            })
        })
    })
}

function outputIngredient(d:DB_Info) {
    Log.debug(`${d.name} ${d.fdcId} ${d.density}, ${showPerish(d.perish)}`)
}
function showPerish(perish) {
    let out = ''
    if(perish.pantry) {
        let d = perish.pantry.as(UnitType.Day)
        out += `${d} days`
    }
    if(perish.refrigerated) {
        let d = perish.refrigerated.as(UnitType.Day)
        out += `, ${d} days refrigerated`
    }
    return out
}
