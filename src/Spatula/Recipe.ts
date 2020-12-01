import {Duration, Image} from "./DataTypes"
import {Ingredient} from "./Ingredient"

/**
 * Defines an object that has been extracted from a Schema.org Recipe type schema object
 * `ingredientList` will hold the first-order parse of the listed recipe ingredients as
 * unreconciled `Ingredient` objects.
 *
 * | property | type | description
 * | -------- | ---- | -----------
 * | name | string | name of the recipe
 * | url | string | original page URL
 * | author | string | who wrote this
 * | datePublished | Date | date published
 * | dateModified | Date | date last updated
 * | publisher Info | Object | name: string, logo: Image
 * | image | Image | Title image of the recipe
 * | description | string | describes the dish
 * | keyords | string[] | may be useful in searches
 * | cuisine | string | name of the type of cuisine (e.g. Mediterranean)
 * | category | string | name of the food category (e.g. Vegetarian)
 * | numComments | number | how many comments can be found in the related comment section
 * | prepTime | Duration | how long it takes to prepare ingredients, and may include wait times
 * | cookTime | Duration | how long it takes to cook once prep
 * | totalTime | Duration | how long it takes to prepare and cook, including any wait times.
 * | servings | number | number of servings this recipe should make
 * | ingredientList | Ingredient[] | recipe ingredient lines parsed into our Ingredient objects
 * | instructions | string[] | series of steps required to prepare the dish.
 */
export class Recipe {
    public name:string;
    public url:string;
    public author:string;
    public datePublished: Date
    public dateModified: Date
    public publisherInfo: {
        name: string,
        logo: Image
    }
    public image:Image
    public description: string
    public keywords: string[]
    public cuisine: string
    public category:string
    // aggregateRating
    public numComments: number
    public prepTime:Duration
    public cookTime:Duration
    public totalTime:Duration
    public servings:number
    public ingredientList:Ingredient[]
    public instructions:string[]
}
