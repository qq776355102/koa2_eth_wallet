const router = require('koa-router')();

var Web3 = require('web3');
var CryptoJS = require("crypto-js");





const db_transaction = require('../model/db_model/cvntxs.js');
var tranfer = require('../web3/web3.js');


const serialFn = async () => { //串行执行
    var data = await db_transaction.findAll({ where: { 'txReceiptStatus': 5 } });
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            await tranfer(data[i].to, data[i].amount, data[i].userId, data[i].coinType, data[i].logId);
        };

    } 

};





const AES_KEY = "666666777777444"; //16位
const AES_IV = "1234567890123456";  //16位
function aes_encrypt(plainText) {
    // var encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(AES_KEY), {iv:  CryptoJS.enc.Utf8.parse(AES_IV)});
    // return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

    return CryptoJS.SHA1("3A4mrxQfmoxfhxqjKnR2Ah4sES5EB1KtrM" + JSON.stringify({ "t": "1546065010", "to": "0x958c64579b9375e6b426d7dd7cbf59b4805d2993", "userId": "5164708", "amount": "10", "coinType": "CVNT", "cvn_log_id": "440" }));

    //  CryptoJS.HmacSHA256("","54321");
}


function aes_decrypt(ciphertext) {
    var decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(AES_KEY), { iv: CryptoJS.enc.Utf8.parse(AES_IV) });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// decrypt_data = aes_decrypt(encrypt_data);
// console.log(decrypt_data);

// var data = JSON.stringify({"t":"1545984993","to":"0x958c64579b9375e6b426d7dd7cbf59b4805d2993","userId":"5164708","amount":"1","coinType":"CVNT","cvn_log_id":"412"});
// console.log(aes_encrypt(data));
// 创建web3对象
var web3 = new Web3();



// 连接到主网
web3.setProvider(new Web3.providers.HttpProvider("https://mainnet.infura.io/v2/11d78a7c90094677b48c5200d7253459"));



router.get('/test', function (ctx, next) {
    serialFn();
    // var b = web3.eth.getBalance('0x6400b5522f8d448c0803e6245436dd1c81df09ce');
   // var a = web3.eth.getTransactionReceipt("0xcfe84cb320ce528780d496139717deca92b748aed1e28578b61bd468ff28165c");
    //var b = web3.eth.getTransactionReceipt("0x0ed9f4f76312a7141975d29f40e042fecc8a9bc7f380e3a45156ddca7590750b"); 0xe554f562e44dcae8a5c614f7db36f1c2067ce55bf8c0fa3b7e1837f88f647045
    //  var c = web3.eth.getTransaction('0xf3ac3a40fa66aaa3a16dbaca9254da7d71bd2869af709b8c0d69682cfe4c2a83');
    // var data = JSON.stringify({"t":"1545984993","to":"0x958c64579b9375e6b426d7dd7cbf59b4805d2993","userId":"5164708","amount":"1","coinType":"CVNT","cvn_log_id":"412"});
    // console.log(aes_encrypt(data));
 //   var c = web3.eth.getTransaction("0xcfe84cb320ce528780d496139717deca92b748aed1e28578b61bd468ff28165c");
    ctx.body = {
        //"b": "",
        'c': web3.eth.getTransactionReceipt("0x1e86e44d3ab5506defc9673b38c81c645efc095d26f38d3bcc30f702b89c9dad"),
        //'d': web3.eth.getTransaction("0x1e86e44d3ab5506defc9673b38c81c645efc095d26f38d3bcc30f702b89c9dad"),
       // 'e': web3.eth.blockNumber,
        //'p':web3.eth.gasPrice
    }


});








module.exports = router;
