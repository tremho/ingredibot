
/*
https://www.thespruceeats.com/the-shelf-life-of-pantry-foods-1389305
*/
const ingredientLife = [
    ['Baking powder',	'18 months'],
    ['Baking soda',	'2 years'],
    ['Chocolate, baking',	'6 to 12 months'],
    ['Chocolate chips, semi-sweet', '2 years'],
    ['Chocolate chips, milk chocolate', '16 months'],
    ['Cocoa', '1 year'],
    ['Cornmeal', '6 to 12 months'],
    ['Cornstarch', '18 months'],
    ['Cream of tartar', '2 to 3 years'],
    ['Flour, all-purpose', '6 to 8 months'],
    ['Flour, self-rising', '6 to 8 months'],
    ['Flour, wheat', '6 to 8 months'],
    ['Honey', 'Indefinitely'],
    ['Milk, evaporated', '1 year'],
    ['Milk, powdered', '1 year'],
    ['Milk, sweetened condensed', '1 year'],
    ['Molasses', '2 years'],
    ['Nuts, shelled', '4 months'],
    ['Nuts, unshelled', '6 months'],
    ['Oil, canola, unopened', '2 years'],
    ['Oil, canola, opened', '1 year'],
    ['Oil, olive', '6 months'],
    ['Oil, vegetable spray', '2 years'],
    ['Salt', 'Indefinitely'],
    ['Sugar, brown', 'Indefinitely'],
    ['Sugar, granulated', 'Indefinitely'],
    ['Sugar, powdered', 'Indefinitely'],
    ['Vanilla extract (imitation)', '3 years'],
    ['Vanilla extract (real)', 'Indefinitely'],
    ['Yeast', 'Follow expiration date on the package'],
//Herbs & Spices (dried and ground)'],
    ['Allspice', '2 to 3 years'],
    ['Basil', '1 to 3 years'],
    ['Bay leaves', '1 to 3 years'],
    ['Black pepper', '2 to 3 years'],
    ['Chili powder', '2 to 3 years'],
    ['Cinnamon sticks', '3 to 4 years'],
    ['Cinnamon, ground', '2 to 3 years'],
    ['Cloves, ground', '2 to 3 years'],
    ['Coriander seed', '3 to 4 years'],
    ['Coriander, ground', '2 to 3 years'],
    ['Cumin', '2 to 3 years'],
    ['Dill', '1 to 3 years'],
    ['Dry mustard', '2 to 3 years'],
    ['Garlic (minced), unopened', '2 years'],
    ['Garlic (whole)', '3 to 4 months'],
    ['Garlic powder', '2 to 3 years'],
    ['Ginger, ground', '2 to 3 years'],
    ['Marjoram', '1 to 3 years'],
    ['Nutmeg', '2 to 3 years'],
    ['Onion powder', '2 to 3 years'],
    ['Oregano', '1 to 3 years'],
    ['Parsley', '1 to 3 years'],
    ['Rosemary', '1 to 3 years'],
    ['Sage', '1 to 3 years'],
    ['Savory', '1 to 3 years'],
    ['Thyme', '1 to 3 years'],
// ['Dried Goods'],
    ['Beans, dried', '1 year'],
    ['Cereal, unopened', '6 to 12 months'],
    ['Cereal, opened', '2 to 3 months'],
    ['Dried fruit (raisins, apricots, etc.)', '6 to 12 months'],
    ['Jerky, commercial packaged', '12 months'],
    ['Jerky, homemade', '1 to 2 months'],
    ['Lentils', '1 year'],
    ['Oatmeal', '1 year'],
//Canned & Jarred Goods'],
    ['Applesauce', '12 to 18 months'],
    ['Beans, canned', '2 to 5 years'],
    ['Broth, beef', '2 to 5 years'],
    ['Broth, chicken', '2 to 5 years'],
    ['Broth, vegetable', '2 to 5 years'],
    ['Canned fruit', '12 to 18 months'],
    ['Canned meats (tuna, salmon, chicken, etc.)', '2 to 5 years'],
    ['Home-canned foods', '12 months'],
    ['Pumpkin puree', '12 to 18 months'],
    ['Soup (except tomato)', '2 to 5 years'],
    ['Soup, tomato', '12 to 18 months'],
    ['Tomato paste', '12 to 18 months'],
    ['Tomato sauce', '12 to 18 months'],
    ['Tomatoes, crushed', '12 to 18 months'],
    ['Tomatoes, stewed', '12 to 18 months'],
    ['Tomatoes, sun-dried (oil-packed)', '12 to 18 months'],
    ['Tomatoes, whole', '12 to 18 months'],
//Pasta & Grains'],
    ['Cookies, packaged', '2 months'],
    ['Crackers', '8 months'],
    ['Pasta', '2 years'],
    ['Popcorn', '2 years'],
    ['Pretzels/Chips', '2 months'],
    ['Rice, basmati', '2 years'],
    ['Rice, brown', '6 months'],
    ['Rice, jasmine', '2 years'],
    ['Rice, white', '2 years'],
    ['Rice, wild', '6 months'],
//Condiments'],
    ['Barbeque sauce', '1 year'],
    ['Hot sauce, unopened', '5 years'],
    ['Jam', '2 years'],
    ['Jelly', '2 years'],
    ['Ketchup', '1 year'],
    ['Maple syrup, artificial', '1 year'],
    ['Maple syrup, real, unopened', '1 year'],
    ['Mayonnaise, (from package date)', '3 to 4 months'],
    ['Mustard', '2 years'],
    ['Peanut butter, unopened', '6 to 9 months'],
    ['Peanut butter, opened', '3 months'],
    ['Pickles', '1 year'],
    ['Salad dressing', '12 to 18 months'],
    ['Salsa', '12 to 18 months'],
    ['Soy sauce', '3 years unopened'],
    ['Vinegar, apple cider	Best used in', '2 years'],
    ['Vinegar, balsamic	Best used in', '3 years'],
    ['Vinegar, malt	Best used in', '2 years'],
    ['Vinegar, red wine	Best used in', '2 years'],
    ['Vinegar, rice	Best used in', '2 years'],
    ['Vinegar, white	Indefinitely'],
    ['Vinegar, white wine	Best used in 2 years'],
    ['Worcestershire sauce	1 year'],
//Drinks'],
    ['Coffee, ground and vacuum-packed unopened', '1 year'],
    ['Coffee, ground and vacuum-packed opened', '1 to 2 weeks'],
    ['Coffee beans (roasted). Not vacuum-packed', '1 to 3 weeks'],
    ['Coffee, freshly ground', '1 to 2 weeks'],
    ['Coffee, instant unopened', '1 year'],
    ['Coffee, instant opened', '2 to 3 months'],
    ['Iced tea mix unopened', '3 years'],
    ['Iced tea mix opened', '6 to 12 months'],
    ['Juice boxes', '4 to 6 months'],
    ['Juice, bottled or canned', '12 months'],
    ['Soda, past expiration', '3 months'],
    ['Tea, in bags, unopened', '18 months'],
    ['Tea, in bags, opened', '1 year'],
    ['Tea, loose, unopened', '2 years'],
    ['Tea, loose, opened', '6 to 12 months'],
    ['Water, bottled', '1 to 2 years'],
]

/*
https://www.fsis.usda.gov/wps/portal/fsis/topics/food-safety-education/get-answers/food-safety-fact-sheets/safe-food-handling/refrigeration-and-food-safety/ct_index/!ut/p/a1/jZFRT8IwEMc_DY_d3RwS8G1ZYmDKkBCl7IWUreuabO3SVqd-est8EQNK76l3v3979z_IgUKu2JsUzEmtWHO855M9rnESzhJMV7PwHhfZy3r1kCQ43dx6YPcHkEVX6i-cGP_Tp1d8cGOWyVJA3jFXE6kqDVRwR5iyPTcWaKV1SSyruPsgFSscsTXnzheOOTJUa6bKRioB1PDKSMHN4JB_oyQ_5EALt5eq5O-whfy0NQx9LLJoM56nWYSr8W_gjHffwGVz_PSi0YdhUbtYHaKpH9N3yA03wavx6dq5zt6NcIR93wdCa9HwoNDtCM9Jam0d0FMSuvaZfj7Gc5RP7XZq4y8BE-W7/#13
Storage Times For Refrigerated Foods
*/
const refrigerationTimes = [
//Ground Meat, Ground Poultry, and Stew Meat
    ['Ground beef, turkey, veal, pork, lamb', '1-2 days'],
    ['Stew meat', '1-2 days'],
//Fresh Meat (Beef, Veal, Lamb, and Pork)
    ['Steaks, chops, roasts', '3-5 days'],
    ['Variety meats (Tongue, kidneys, liver, heart, chitterlings)', '1-2 days'],
//Fresh Poultry'],
    ['Chicken or turkey, whole', '1-2 days'],
    ['Chicken or turkey, parts', '1-2 days'],
    ['Giblets', '1-2 days'],
//Bacon and Sausage
    ['Bacon', '7 days'],
    ['Sausage, raw from meat or poultry', '1-2 days'],
    ['Smoked breakfast links, patties', '7 days'],
    ['Summer sausage labeled "Keep Refrigerated", unopened', '3 months'],
    ['Summer sausage labeled "Keep Refrigerated", opened', '3 weeks'],
    ['Hard sausage (such as Pepperoni, salami)', '2-3 weeks'],
//Ham, Corned Beef
    ['Ham, canned, labeled "Keep Refrigerated",unopened', '6-9 months'],
    ['Ham, canned, labeled "Keep Refrigerated",opened', '3-5 days'],
    ['Ham, fully cooked, whole', '7 days'],
    ['Ham, fully cooked, half', '3-5 days'],
    ['Ham, fully cooked, slices', '3-4 days'],
    ['Corned beef in pouch with pickling juices', '5-7 days'],
//Hot Dogs and Luncheon Meats'],
    ['Hot dogs, Unopened package', '2 weeks'],
    ['Hot dogs, Opened package', '1 week'],
    ['Luncheon meats, Unopened package', '2 weeks;'],
    ['Luncheon meats, Opened package', '3-5 days'],
//Deli and Vacuum-Packed Products'],
    ['Store-prepared (or homemade) egg, chicken, tuna, ham, and macaroni salads', '3-5 days'],
    ['Pre-stuffed pork, lamb chops, and chicken breasts', '1 day'],
    ['Store-cooked dinners and entrees', '3-4 days'],
    ['Commercial brand vacuum-packed dinners with/USDA seal, unopened', '2 weeks'],
// Cooked Meat, Poultry, and Fish Leftovers'],
    ['Pieces and cooked casseroles', '3-4 days'],
    ['Gravy and broth, patties, and nuggets', '3-4 days'],
    ['Soups and Stews', '3-4 days'],
// Fresh Fish and Shellfish'],
    ['Fresh Fish and Shellfish', '1-2 days'],
//Eggs
    ['Fresh, in shell', '3-5 weeks'],
    ['Raw yolks, whites', '2-4 days'],
    ['Hard-cooked', '1 week'],
    ['Liquid pasteurized eggs, egg substitutes	Unopened, 10 days'],
    ['Liquid pasteurized eggs, egg substitutes	Unopened, 10 days'],
    ['Cooked egg dishes', '3-4 days']
]

import {Time, UnitFactory} from 'unit-measure'
const Log = require('../logger').logger;

export class Perishability {
    public pantry: Time
    public refrigerated: Time
}

export function findStorageTimes(name) {
    let perish = new Perishability()
    name = name.toLowerCase()
    let hiscore = 1; // minimum score is 2
    let bestEntry;
    // Log.debug('looking for '+name)
    refrigerationTimes.forEach(entry => {
        let listing = entry[0].toLowerCase()
        // Log.debug('listing '+listing)
        let score = 0
        let found = listing.indexOf(name)
        if(found !== -1) {
            score++
        }
        let parts = name.split(/[ ]|[,]/)
        for(let i=0; i<parts.length; i++) {
            found = listing.indexOf(parts[i])
            if(found !== -1) {
                score++
            }
        }
        if(score > hiscore) {
            bestEntry = entry
            hiscore = score
        }
    })
    if(bestEntry) {
        perish.refrigerated = rangeParse(bestEntry[1])
    } else {
        // repeat for pantry items if we didn't find it in the refrigerator
        hiscore = 1;
        ingredientLife.forEach(entry => {
            let listing = entry[0].toLowerCase()
            // Log.debug('listing '+listing)
            let score = 0
            let found = listing.indexOf(name)
            if (found !== -1) {
                score++
            }
            let parts = name.split(/[ ]|[,]/)
            for (let i = 0; i < parts.length; i++) {
                found = listing.indexOf(parts[i])
                if (found !== -1) {
                    score++
                }
            }
            if (score > hiscore) {
                bestEntry = entry
                hiscore = score
            }
        })
        if (bestEntry) {
            perish.pantry = rangeParse(bestEntry[1])
        }
    }
    return perish
}
function rangeParse(range) {
    if(!range) range = ''
    let res = range.match(/[0-9]+[ to -]/)
    if (res) {
        let v1 = parseInt(res[0])
        let pi = range.indexOf(res[0])+res[0].length
        range = range.substring(pi)
        res = range.match(/[0-9]+[ ,]/)
        let v2 = v1
        if(res) {
            v2 = parseInt(res[0])
            let pi = range.indexOf(res[0])+res[0].length
            range = range.substring(pi)
        }
        let avg = v1+v2 / 2
        // Log.debug(`making time from range ${range}, ${avg}`)
        let ut = range.trim();
        if(ut === 'days') ut = 'day'
        if(ut === 'ays') ut = 'day'
        if(ut === 'months') ut = 'month'
        if(ut === 'weeks') ut = 'week'
        if(ut === 'years') ut = 'year'
        // Log.debug(`making time from range ${ut} ${avg}`)
        return new Time(avg, ut)
    }
}