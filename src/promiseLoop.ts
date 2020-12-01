/**
 * @typedef ProcessFunction
 *
 * @param {any} arg The entry from the list that is to be processed
 * @param {number} index The index of the list this arg is from
 * @param {any} accumulator The previous value of the accumulated result.  The value at the end of the recursion will be the
 * returned result of the execution.
 * @return {any} The last value of the accumulator.
 *
 */

export type ProcessFunction = (arg:any, index:number, accumulator:any) => Promise<any>

/**
 * PromiseLoop worker function
 *  (think of as `Promise.each(...)`) but it's not the Bluebird version
 * @param {any[]} listToProcess
 * @param {ProcessFunction} functionToCall Must return a promise that will update the intermediate accumulator
 */
export function execute (listToProcess:any[], functionToCall:ProcessFunction):Promise<any> {

    let end = listToProcess.length;
    let result;
    const recurser = (i) => {
        if(i >= end) {
            return Promise.resolve(result)
        }
        let arg = listToProcess[i]
        return functionToCall(arg, i, result).then(newResult => {
            result = newResult
            return recurser(++i)
        })
    }
    return recurser(0)
}
