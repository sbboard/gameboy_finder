const Ebay = require('ebay-node-api')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));

let ebay = new Ebay({
    clientID: config.client_id
});

setInterval(()=> {
    let theBoys = []
    let today = new Date()
    //if(today.getHours() == 7){
        ebay.findItemsByKeywords("\"gameboy color\" \"for parts\"")
        .then((data) => {
            for(let i=0;i<data[0].searchResult[0].item.length;i++){
                let gameboy = data[0].searchResult[0].item[i]
                let price = parseFloat(gameboy.sellingStatus[0].convertedCurrentPrice[0].__value__)
                let shippingCost = parseFloat(gameboy.shippingInfo[0].shippingServiceCost[0].__value__)
                let endTime = gameboy.listingInfo[0].endTime[0]
                let diff =  Math.floor(( Date.parse(endTime) - Date.parse(today) ) / 86400000);
                if(gameboy.condition[0].conditionId[0] == 7000 && gameboy.primaryCategory[0].categoryId[0] == 139971 && (price + shippingCost <= 15) && diff <= 1){
                    theBoys.push(
                        {
                            name: gameboy.title[0],
                            cost: price + shippingCost,
                            link:gameboy.viewItemURL[0],
                        })
                }
            }
        })
        .then(()=>{
            if(theBoys.length > 0){
                console.log("more")
            }
            else{
                console.log("none")
            }
        })
    //}
}, 
    5*1000
    //60*60*1000
);