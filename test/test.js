var CryptoJS = require("crypto-js");
const rq  = require('sync-request');

// 解密
// var bytes  = CryptoJS.AES.decrypt({"amount":"500","coinType":"CVNT","userId":"5164708","to":"0x8d345c08805c1e0d21f518bb301640e937b8c2c3","t":"1545359273"}.toString(), '3P4mrxQfmExfhxqjLnR2Ah4WES5EB1KBrN');
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
 
// console.log(decryptedData);

var a = rq('GET','https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=CVNT',{
    headers: {
        'X-CMC_PRO_API_KEY': '6de02d6c-e6fe-4dd5-9233-cb461c8325c1',
      },

});
console.log(JSON.parse(a.body).data.CVNT.quote.USD.price);
