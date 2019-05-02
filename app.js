let eBay = require('ebay-node-api')
const path = require('path'),
    config = require(path.join(__dirname, 'config.js'));
 
let ebay = new eBay({
    clientID: config.client_id,
    clientSecret: config.client_secret,
    body: {
        grant_type: config.client_credentials
    }
});

function ebaySearch(endDate){
    ebay.getAccessToken()
        .then((data) => {
            ebay.searchItems({
                keyword: "gameboy color",
                categoryId: 139973,
                limit: 10,
                filter: `price:[..10],priceCurrency:USD,conditionIds:{7000},itemEndDate:[..${endDate}]` 
                //Format here: https://developer.ebay.com/api-docs/buy/static/ref-buy-browse-filters.html#conditionIds
            })
            .then((data) => {
                console.log(data);
            })
    })
    .catch((err) => {
        console.log(err)
    })
}

setTimeout(()=> {
    //get time
    //if time is 7AM
    //set endDate to today
    let searchResults = ebaySearch(endDate)
    if(searchResults.length > 0){
        //email myself search results
        console.log(searchResults)
    }
}, 60*60*1000);