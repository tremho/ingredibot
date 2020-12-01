
### TODO tracking
(as of 11/22)

 11/21
 - See if we can skip past Zestful at this point.

 - OkAY! keep Z around for parser comparisons later
 - √ refactor current flow into a more structured set of operations and remove deadheads
 - ◊ make sure we're not double hitting the DB. Use cache if there, save only new items
 - √ print out the parse evolution for better evaluation
 - next generation of work will be on parse improvement

11/22

###### look at reconciliation improvements
- What's the significance of all caps items?
- What categorizations are there / do we want?
- can we rig a scoring system to choose instaed of just picking first one?
- See if there is an API filter for the search that can help

###### Revisit density calculation
- water should come out as 1.0

###### Conclusions and redesign notions

- I am unable to match to the basic types (water, sugar, chicken) 
using the Food Data Central API.  I'm not sure how Zestful is doing it,
except that they may have hand curated their picks.

- I have been reluctant to use Zestful, but they have extraordinarily
liberal terms of use: no restrictions on data retention or on commercial
use.. practically an MIT or WTF license.

So --

- From the first-pass parse in `scrape`
- pass it through Zestful and take their parse and fdcid
- look up the fdc detail and process as we do
- Store this. That seems to be okay per Zestful.
- Be sure to credit Zestful in our docs and statements. ("Powered by")

Okay --

- the modifiers from FDC and their mapping to units is questionable
I'm using the first word, but these may be ingredient specific (e.g. breast)
and there's no weight/volume relationship for a unit anyway.
I'm getting 0.58 density on a cup of diced chicken, but the web 
says chicken should be 1.59 but 0.59 elsewhere, so maybe it's right.

- test with roast beef. see what we get.
- Take out the call to findFood and go straight to Zestful. 
- Handle case of no fdcId from Zestful.
 - Maybe in this case we could use usda, but how to pick?

 ######  11/23
 Okay -- looking decent at this point, so for the sake of argument,
 let's say the basic process is working as intended.
 ###### What's Next?
 Well, the point of this particular project is to accept
 a stream of many recipe urls and use the ingredients found there
 to build our own ingredient DB.
 Then we can use this DB in our own product work.
 ###### So for the immediate goals
 - √ verify our test urls have properly populated our DB
 - √ make sure we are picking from there first before calling 
 on the 3rd party APIs.
 - √ (mostly) things still look correct, right?
 
 ----
 - ◊ 'packet ranch seasoning' is a problem (no fdcId)
 - √ why is packet not moved to modifier instead of name? 
    - it wasn't in the MatchableUnits table.
 - ◊◊ can we find 'ranch seasoning?'
    - no. Zestful can't.  Direct lookup fdcid: 1081877
    
    = create a form input utility to add data directly like this
 
 -----
 - √ dump the index so we can see 'names' as entered.
 
 -----
 - Review the issues.  We have crash on save of something:
 'string.split' is not a function?
 
 - create an updater function that enumerates the db and
 calls a function that will add new info
    - Perishability
    - Nutrition 
 
 ---------
 
 Perishability support is weak at best.
 Haven't done nutrition yet. No immediate need until app calls for it.
 We can improve these things with updater.
 
 -------------
 
 Question of the day as we head into December and on into 2021:
 - Should I switch my attention to ThunderBolt UI?
 - Or should I spend time now gathering recipe feeds sources? (RapidAPI has several available)
 
 
 ---------
 
 - Add a few more test URLs
 - devise a strategy for recipe scooping
 
 - Then "load `er up"
 
 
 ---------
  
  - Check for direct access to the APIs we are using and get off RapidAPI
  
 
  - Zippering, and request sizes
  
    - We will want to determine a time range, and thus so many days.
    - what season is it? How many days left in season?
    - (or if < 15 days in current season, what's the next season and how long)?
    - look for this many recipes, divide by number of feeds, and add
    a margin amount.
  
 
  - Main courses only.
    - later we can include sides and desserts
    -   [opt] sides if recommended
    -   [opt] desserts once a week only (Saturday, or ??)
  - Direct feeds from recipe sites (allrecipes, etc)
  
 `
 
 
 
