import {Measure, UnitType, UnitFactory} from "unit-measure"
import matchableUnits from "./MatchableUnits";
import matchableQualifiers from "./MatchableQualifiers";

/**
 * Defines an ingredient as parsed from a recipe line
 *
 * | property | type | default | description
 * | -------- | ---- | ------- | -----------
 * | text | string | | The ingredient line submitted
 * | name | string | | name of the ingredient
 * | quqntity | Measure | | THe unit-measure parsed
 * | modifiers | string[] | [] | Array of extradted modifiers
 */
export class Ingredient {
    public text:string
    private parsePos: number
    public name:string
    public quantity: Measure = new Measure()
    public modifiers:string[] = []
    private preprep:string = ''

    public constructor(ingText:string) {
        this.parse(ingText)
    }

    /**
     * unitModifier represents the `modifiers` array as a space-delimited string
     * mostly for legacy reasons.
     */
    public get unitModifier():string {
        return this.modifiers.join(' ').trim()
    }
    // Parse an ingredient line
    parse(ingText:string= '') {
        this.text = ingText
        this.parsePos = 0

        this.parentheticalModifiers()
        let qty = this.valueParse()
        let qual = (this.qualifierParse() || '').trim()
        if(qual) this.modifiers.push(qual)
        let unit = this.unitParse() || UnitType.Count
        if(unit !== undefined) {
            this.quantity = UnitFactory.createUnitObject(unit, qty)
        }
        let {name, prep} = this.ingredientAndPrepParse() || {}
        this.name = name;
        // this.ingredientType.prep = prep;
    }
    // parse quqntity value
    private valueParse() {
        let text = this.text.substring(this.parsePos)
        text = vulgarFractionReplacer(text)
        let res = text.match(/[0-9]+[ \/]/g)
        if (res) {
            let stage = 0;
            let intval = 0, numval = 0, denval = 0;
            for (let i = 0; i < res.length; i++) {
                let pv = res[i].trim()
                if (pv.charAt(pv.length - 1) === '/') {
                    stage = 1;
                    pv = pv.substring(0, pv.length - 1)
                } else if (stage === 1) {
                    stage = 2
                } else stage = 0;

                if(stage === 0 && intval) break;

                let v = parseInt(pv)
                this.parsePos += pv.length;
                switch (stage) {
                    case 0:
                        intval = v;
                        this.parsePos++
                        break
                    case 1:
                        numval = v;
                        break;
                    case 2:
                        denval = v;
                        this.parsePos++
                        break;
                }
            }
            let f = (numval && denval) ? numval / denval : 0
            let value = intval + f;
            return value
        }
    }

    // Remove all parenthetical statements to the modifiers
    private parentheticalModifiers() {
        let text = this.text
        let opi = text.indexOf('(')
        if(opi !== -1) {
            let cpi = text.indexOf(')', opi)
            let pmod = text.substring(opi, cpi+1).trim()
            if(pmod) this.modifiers.push(pmod)
            this.text = text.substring(0, opi).trim() + ' '+text.substring(cpi+1).trim()
        }
    }

    // Parse unit quqlifiers (sizing)
    private qualifierParse() {
        let text = this.text.substring(this.parsePos).toLowerCase().trim()
        for(let i=0; i<matchableQualifiers.length; i++) {
            let [toMatch, qualType] = matchableQualifiers[i]
            let matchPt = text.indexOf(toMatch+' ')
            if( matchPt !== -1) {
                // found a matching qualifier, use text prior as part of prep
                this.preprep = text.substring(0,matchPt).trim()
                this.parsePos += matchPt + toMatch.length+1;
                return qualType
            }
        }
    }

    // Parse the unit of measure (one of the MatchableUnit values)
    private unitParse() {
        let text = this.text.substring(this.parsePos).toLowerCase().trim()
        text = ' '+text; // part of the word match insurance
        for(let pass =0; pass < 2; pass++) {
            if(pass) text = text.toLowerCase() // second oass is case-insensitive
            for (let i = 0; i < matchableUnits.length; i++) {
                let [toMatch, unitType] = matchableUnits[i]
                let matchPt
                if(pass) {
                    toMatch = toMatch.toLowerCase() // second pass is case-insensitive
                }
                matchPt = text.indexOf(' ' + toMatch + ' ') // make sure we're matching a 'word'

                if (matchPt !== -1) {
                    // found a matching unit string, use text prior as the unit modifier
                    if(matchPt) this.modifiers.push(text.substring(0, matchPt).trim())
                    if (unitType === UnitType.Count) {
                        this.modifiers.push(toMatch.trim())
                    }
                    this.parsePos += matchPt + toMatch.length + 1;
                    return unitType
                }
            }
        }
    }
    // Get the ingredient name and any prep modifiers
    private ingredientAndPrepParse() {
        // from here to comma or EOL
        let text = this.text.substring(this.parsePos)
        let ci = text.indexOf(',')
        if(ci === -1) ci = text.length;
        let name = text.substring(0,ci).trim()
        let prep = this.preprep
        let prep2 = text.substring(ci+1).trim()
        if(prep && prep2) prep += ', '
        prep += prep2
        prep = prep.trim()
        return {name, prep}
    }
}

/**
 * Used to replace unicode so-called 'vulgar fraction' characters into full numerical fraction notation
 * that is parseable above.
 * @param {string} text String that may contain fraction characters
 * @return {string} expanded version of the string with character replaced by notation.
 */
function vulgarFractionReplacer(text) {
    type Entry = [string, number, number] // unicode character, numerator, denominator
    const vftable = [
        ['\u00bc', 1, 4],
        ['\u00bd', 1, 2],
        ['\u00be', 3, 4],
        ['\u2150', 1, 7],
        ['\u2151', 1, 9],
        ['\u2152', 1, 10],
        ['\u2153', 1, 3],
        ['\u2154', 2, 3],
        ['\u2155', 1, 5],
        ['\u2156', 2, 5],
        ['\u2157', 3, 5],
        ['\u2158', 4, 5],
        ['\u2159', 1, 6],
        ['\u215A', 5, 6],
        ['\u215B', 1, 8],
        ['\u215C', 3, 8],
        ['\u215D', 5, 8],
        ['\u215E', 7, 8]
    ]
    vftable.forEach(entry => {
        let [sym, n, d] = entry
        while(text.indexOf(sym) !== -1) {
            let r = ' '+n +'/'+d+' '
            text = text.replace(sym, r)
        }
    })
    return text
}
