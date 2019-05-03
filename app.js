const Ebay = require('ebay-node-api')
const nodemailer = require("nodemailer")
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));
const admin = {
    interval: 60*60*1000,
    dayOf: 1
}

let ebay = new Ebay({
    clientID: config.client_id
});

let transporter = nodemailer.createTransport({
    name: 'gang-fight.com',
    host: 'localhost',
    port: 25,
    tls:{
        rejectUnauthorized: false
    }
});

setInterval(()=> {
    let theBoys = []
    let today = new Date()
    if(today.getHours() == 7){
        ebay.findItemsByKeywords("\"gameboy color\" \"for parts\"")
        .then((data) => {
            for(let i=0;i<data[0].searchResult[0].item.length;i++){
                let gameboy = data[0].searchResult[0].item[i]
                let price = parseFloat(gameboy.sellingStatus[0].convertedCurrentPrice[0].__value__)
                let shippingCost = parseFloat(gameboy.shippingInfo[0].shippingServiceCost[0].__value__)
                let endTime = gameboy.listingInfo[0].endTime[0]
                let diff =  Math.floor(( Date.parse(endTime) - Date.parse(today) ) / 86400000);
                if(gameboy.condition[0].conditionId[0] == 7000 && gameboy.primaryCategory[0].categoryId[0] == 139971 && (price + shippingCost <= 15) && diff <= admin.dayOf){
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
                let messageText = ""
                let messageHTML = ""
                for(let i=0;i<theBoys.length;i++){
                    messageText += `Hey dude! Here's some gameboys you might want to check out. ${theBoys[i].name} ($${theBoys[i].cost}): ${theBoys[i].link}`
                    messageHTML += `Hey dude! Here's some gameboys you might want to check out.<br><br><b>${theBoys[i].name} ($${theBoys[i].cost}):</b> <a href="${theBoys[i].link}">link</a><br>`
                }
                transporter.sendMail({
                    from: '"GameBoy Bot" <gameboy@gang-fight.com>', // sender address
                    to: "colin.buffum@gmail.com", // list of receivers
                    subject: "Some Good Gameboys Ending Today!", // Subject line
                    text: messageText, // plain text body
                    html: messageHTML // html body
              });
              console.log("email sent")
            }
            else{
                console.log("none")
            }
        })
    }
}, admin.interval);