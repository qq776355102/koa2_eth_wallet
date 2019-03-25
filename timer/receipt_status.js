const db_transaction = require('../model/db_model/cvntxs.js');
const request = require('sync-request');
var CryptoJS = require("crypto-js");
var config = require('../app_need/config');
var Web3 = require('web3');

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("https://mainnet.infura.io/v2/11d78a7c90094677b48c5200d7253459"));

const serialFn = async () => {
    var data = await db_transaction.findAll({ where: { '$or': [{ 'txReceiptStatus': [6, 7] }, { '$and': [{ 'updatedAt': { $lt: (new Date().getTime() - 48 * 60 * 60 * 1000) } }, { 'txReceiptStatus': 4 }] }] }, limit: 10 });
    console.log(data.length);
    if (data.length > 0) {
        try {
            for (var i = 0; i < data.length; i++) {
                if (data[i].txReceiptStatus == 6) {
                    push_txstate(data[i].logId, 2);
                    await db_transaction.update({ 'txReceiptStatus': 2 }, { where: { 'logId': data[i].logId } });
                } else if (data[i].txReceiptStatus == 7 || data[i].txReceiptStatus == 4) {
                    if (data[i].txHash) {
                        var transaction_status = web3.eth.getTransactionReceipt(data[i].txHash);
                        if (transaction_status) {
                            if (transaction_status.status == "0x1") {
                                var times = web3.eth.getBlock(transaction_status.blockNumber).timestamp;
                                push_txstate(data[i].logId, 1, data[i].txHash, times);
                                await db_transaction.update({ 'txReceiptStatus': 1 }, { where: { 'logId': data[i].logId } });
                            } else if (transaction_status.status == "0x0") {
                                var times = web3.eth.getBlock(transaction_status.blockNumber).timestamp;
                                push_txstate(data[i].logId, 2);
                                await db_transaction.update({ 'txReceiptStatus': 2 }, { where: { 'logId': data[i].logId } });
                            }
                        } else {
                            push_txstate(data[i].logId, 2, data[i].txHash);
                            await db_transaction.update({ 'txReceiptStatus': 2 }, { where: { 'logId': data[i].logId } });
                        }
                    } else {
                        push_txstate(data[i].logId, 2);
                        await db_transaction.update({ 'txReceiptStatus': 2 }, { where: { 'logId': data[i].logId } });
                    }
                }
            }
        } catch (error) {
            console.log('receipt_status error' + JSON.stringify(error));
            setTimeout(() => {
                serialFn();
            }, 120000);
        };
        setTimeout(() => {
            serialFn();
        }, 120000);
    } else {
        setTimeout(() => {
            serialFn();
        }, 60000);
    }
};

function push_txstate(logId, receiptStatus, txHash, time) {
    try {
        var param = {
            cvn_log_id: logId,
            receiptStatus: receiptStatus,
            txHash: txHash || '',
            time: time || '',
            t: new Date().getTime() / 1000
        };
        var sign = CryptoJS.SHA1(JSON.stringify(param).concat('3A4mrxQfmoxfhxqjKnR2Ah4sES5EB1KtrM'));
        request('POST', config.push_txstate_url + '&sign=' + sign, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(param)
        });

    } catch (error) {
        console.log('push err' + JSON.stringify(error));
    }

}

serialFn();