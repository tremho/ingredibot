const Tap = require('tap')

import {Ingredient} from "../src/Spatula/Ingredient"
import {UnitType} from 'unit-measure'

import * as Ingredibot from "../src/Cloud/Ingredibot_DB"

function precision(decimals, value) {
    let mx = Math.pow(10, decimals)
    let shift = value * mx
    return Math.floor(Math.round(shift))/mx
}

function reconcile() {
    Tap.test(t => {
        let ingredient = new Ingredient ( "1 cup water")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Cup)
        t.equal(ingredient.name, 'water')

        Ingredibot.reconcileIngredient(ingredient).then(dbObj => {
            t.equal(dbObj.name, ingredient.name)
            t.equal(precision(1, dbObj.density), 1.0)

            t.end()
        })
    })
    Tap.test(t => {
        let ingredient = new Ingredient ( "1 cup sugar")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Cup)
        t.equal(ingredient.name, 'sugar')

        Ingredibot.reconcileIngredient(ingredient).then(dbObj => {
            t.equal(dbObj.name, ingredient.name)
            t.equal(precision(2, dbObj.density), 0.84)  // aqua-calc says 0.81

            t.end()
        })
    })
    Tap.test(t => {
        let ingredient = new Ingredient ( "1 lb chicken")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Pound)
        t.equal(ingredient.name, 'chicken')

        Ingredibot.reconcileIngredient(ingredient).then(dbObj => {
            t.equal(dbObj.name, ingredient.name)
            t.equal(precision(2, dbObj.density), 0.58) // aqua-calc says 0.59

            t.end()
        })
    })

    Tap.test(t => {
        let ingredient = new Ingredient ( "1 lb roast beef")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Pound)
        t.equal(ingredient.name, 'roast beef')

        Ingredibot.reconcileIngredient(ingredient).then(dbObj => {
            t.equal(dbObj.name, ingredient.name)
            t.equal(precision(2, dbObj.density), 1.0) // obviously not right, but fdc foodportions is empty for this.

            t.end()
        })
    })

    Tap.test(t => {
        let ingredient = new Ingredient ( "1 lb ground beef")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Pound)
        t.equal(ingredient.name, 'ground beef')

        Ingredibot.reconcileIngredient(ingredient).then(dbObj => {
            t.equal(dbObj.name, ingredient.name)
            t.equal(precision(2, dbObj.density), 0.96)  // sounds right, not verified

            t.end()
        })
    })
}

Ingredibot.setup().then(() => {
    reconcile()
})
