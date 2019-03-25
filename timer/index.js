

const db_transaction = require('../model/db_model/cvntxs.js');
var tranfer = require('../web3/web3.js');


const serialFn = async () => { //串行执行
    var data = await db_transaction.findAll({ where: { 'txReceiptStatus': 5},limit:50});
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            await tranfer(data[i].to, data[i].amount, data[i].userId, data[i].coinType, data[i].logId);
        };
        setTimeout(() => {
            serialFn();
        }, 2000);
    } else {
        setTimeout(() => {
            serialFn();
        }, 2000);
    }
};
serialFn();
