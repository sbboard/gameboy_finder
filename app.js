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

//calculate endDate
let endDate = "..2016-12-14T07:47:48Z"

ebay.getAccessToken()
    .then((data) => {
        ebay.searchItems({
            keyword: "gameboy color",
            categoryId: 139973,
            limit: 10,
            filter: `price:[..10],priceCurrency:USD,conditionIds:{7000},itemEndDate:[..${endDate}]` // new string based filter method. Format here: https://developer.ebay.com/api-docs/buy/static/ref-buy-browse-filters.html#conditionIds
        })
        .then((data) => {
            console.log(data);
        })
})
.catch((err) => {
    console.log(err)
})