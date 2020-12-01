const Tap = require('tap')

import {Ingredient} from "../src/Spatula/Ingredient"
import {UnitType} from 'unit-measure'
import {setup} from '../src/Cloud/Ingredibot_DB'

function precision(decimals, value) {
    let mx = Math.pow(10, decimals)
    let shift = value * mx
    return Math.floor(Math.round(shift))
}

function testQuantities() {

    Tap.test(t => {
        let ingredient = new Ingredient('14 tsp cayenne')
        t.equal(precision(0, ingredient.quantity.getValue()) ,14)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Teaspoon)
        t.equal(ingredient.name, 'cayenne')
        t.end()
    })
    Tap.test(t => {
        let ingredient = new Ingredient('1/4 tsp cayenne')
        t.equal(ingredient.quantity.getValue(), 0.25)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Teaspoon)
        t.equal(ingredient.name, 'cayenne')
        t.end()
    })
    Tap.test(t => {
        let ingredient = new Ingredient('1 1/4 tsp cayenne')
        t.equal(ingredient.quantity.getValue(), 1.25)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Teaspoon)
        t.equal(ingredient.name, 'cayenne')
        t.end()
    })
    Tap.test(t => {
        let ingredient = new Ingredient('3 (6 ounce) cans tomato paste')
        t.equal(ingredient.quantity.getValue(), 3)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Count)
        t.equal(ingredient.name, 'tomato paste')
        t.equal(ingredient.unitModifier, '(6 ounce) cans')
        t.end()
    })
    Tap.test(t => {
        let ingredient = new Ingredient ( "2 medium ripe red tomatoes, diced")
        t.equal(ingredient.quantity.getValue(), 2)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Count)
        t.equal(ingredient.unitModifier,'Medium')
        t.equal(ingredient.name, 'ripe red tomatoes')
        // t.equal(ingredient.ingredientType.prep, 'diced')
        t.end()
    })
}
function tomaytoTomahto() {
    Tap.test(t => {
        let ingredient = new Ingredient ( "2 ripe medium red tomatoes, diced")
        // t.ok(false, ''+ingredient.text)
        // t.ok(false, ''+ingredient.quantity.getValue())
        // t.ok(false, ''+ingredient.quantity.getValueUnit())
        // t.ok(false, ''+ingredient.unitModifier)
        // t.ok(false, ''+ingredient.ingredientType.name)
        // t.ok(false, ''+ingredient.ingredientType.prep)
        t.equal(ingredient.quantity.getValue(), 2)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Count)
        t.equal(ingredient.unitModifier,'Medium')
        t.equal(ingredient.name, 'red tomatoes')
        // t.equal(ingredient.ingredientType.prep, 'ripe, diced')
        t.end()
    })
    Tap.test(t => {
        let ingredient = new Ingredient ( "2 diced medium red tomatoes")
        // t.ok(false, ''+ingredient.text)
        // t.ok(false, ''+ingredient.quantity.getValue())
        // t.ok(false, ''+ingredient.quantity.getValueUnit())
        // t.ok(false, ''+ingredient.unitModifier)
        // t.ok(false, ''+ingredient.ingredientType.name)
        // t.ok(false, ''+ingredient.ingredientType.prep)
        t.equal(ingredient.quantity.getValue(), 2)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Count)
        t.equal(ingredient.unitModifier,'Medium')
        t.equal(ingredient.name, 'red tomatoes')
        // t.equal(ingredient.ingredientType.prep, 'diced')
        t.end()
    })
}
function chicken() {
    Tap.test(t => {
        let ingredient = new Ingredient ( "2 lbs chicken thighs (boneless skinless, cubed - can use chicken breasts if preferred)")
        t.equal(ingredient.quantity.getValue(), 2)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Pound)
        t.equal(ingredient.unitModifier,'(boneless skinless, cubed - can use chicken breasts if preferred)')
        t.equal(ingredient.name, 'chicken thighs')

        t.end()
    })
}
function ranch() {
    Tap.test(t => {
        let ingredient = new Ingredient ( "1 packet ranch seasoning (dry mix in packet)")
        t.equal(ingredient.quantity.getValue(), 1)
        t.equal(ingredient.quantity.getValueUnit(), UnitType.Count)
        t.equal(ingredient.unitModifier,'(dry mix in packet) packet')
        t.equal(ingredient.name, 'ranch seasoning')

        t.end()
    })
}

setup().then(()=> {
    testQuantities()
    tomaytoTomahto()
    chicken()
    ranch()
})
