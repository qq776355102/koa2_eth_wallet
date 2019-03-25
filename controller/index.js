'use strict';


var request = require('sync-request');
var transfer = require('../web3/web3.js');
const db_transaction = require('../model/db_model/cvntxs.js');
var Web3 = require('web3');

var config = require('../app_need/config');
var CryptoJS = require("crypto-js");
//var queue = require('../queue/index.js');
var fromAddress = config.from_address;
var index = {};


//提现
index.insert = async function (ctx, next) {
    var sign = ctx.query.sign;
    let req_query = ctx.request.body;

    if (CryptoJS.SHA1(JSON.stringify(req_query).concat('3A4mrxQfmoxfhxqjKnR2Ah4sES5EB1KtrM')) != sign) {
        ctx.body = { 'status': 0, 'message': "签名出错" };
        return;
    };
    if (new Date().getTime() - req_query.t * 1000 >= 10 * 60 * 1000) {
        ctx.body = { 'status': 0, 'message': "签名过期" };
        return;
    };


    return new Promise(function (resolve, reject) {
        if (Number(req_query.amount) > config.cvn_tixian.tixian_upper_limit) {
            ctx.body = { 'status': 0, 'message': "体现超过上限值：" + config.cvn_tixian.tixian_upper_limit };
            resolve(next());
        } else {
            if (config.cvn_tixian.tixian_rate.count == 0) {
                ctx.body = { 'status': 0, 'message': "系统提现端口关闭,开放日期已通知时间为准" };
                resolve(next());
            }
            else if (config.cvn_tixian.tixian_rate.count < 0 && new Date().getTime() >= config.cvn_tixian.start_time) {
                db_transaction.findOne({
                    where: {
                        'logId': req_query.cvn_log_id
                    }
                }).then(function (oldData) {
                    if (oldData) {
                        ctx.body = { 'status': 1 };
                        resolve(next());
                    } else {
                        db_transaction.create({
                            'amount': req_query.amount,
                            'coinType': req_query.coinType,
                            'userId': req_query.userId,
                            'to': req_query.to,
                            'from': fromAddress,
                            'logId': req_query.cvn_log_id,
                            'txReceiptStatus': 5
                        }).then(function (data) {
                            ctx.body = { 'status': 1 };
                            resolve(next());
                        });
                    }
                });
            } else if (new Date().getTime() >= config.cvn_tixian.start_time) {
                db_transaction.findAll({
                    where: {
                        'userId': req_query.userId,
                        'createdAt': {
                            $lt: new Date().getTime(),
                            $gte: (new Date().getTime() - Number(config.cvn_tixian.tixian_rate.day * 24 * 60 * 60 * 1000))
                        }
                    }
                }).then(function (data) {
                    if (data.length <= 0) {
                        db_transaction.findOne({
                            where: {
                                'logId': req_query.cvn_log_id
                            }
                        }).then(function (oldData) {
                            if (oldData) {
                                ctx.body = { 'status': 1 };
                                resolve(next());
                            } else {
                                db_transaction.create({
                                    'amount': req_query.amount,
                                    'coinType': req_query.coinType,
                                    'userId': req_query.userId,
                                    'to': req_query.to,
                                    'from': fromAddress,
                                    'logId': req_query.cvn_log_id,
                                    'txReceiptStatus': 5
                                }).then(function (data) {
                                    ctx.body = { 'status': 1 };
                                    resolve(next());
                                });
                            }
                        });
                    } else {
                        if (data.length >= config.cvn_tixian.tixian_rate.count) {
                            ctx.body = { 'status': 0, 'message': "你已经超过" + config.cvn_tixian.tixian_rate.day + "天" + config.cvn_tixian.tixian_rate.count + "次的提现上限了" }
                            resolve(next());
                        } else {
                            var b = true;
                            for (var i = 0; i <= data.length; i++) {
                                if (req_query.cvn_log_id == data[i].logId) {
                                    b = false;
                                    ctx.body = { 'status': 1 };
                                    resolve(next());
                                    return;
                                };
                            };
                            if (b) {
                                db_transaction.findOne({
                                    where: {
                                        'logId': req_query.cvn_log_id
                                    }
                                }).then(function (oldData) {
                                    if (oldData) {
                                        ctx.body = { 'status': 1 };
                                        resolve(next());
                                    } else {
                                        db_transaction.create({
                                            'amount': req_query.amount,
                                            'coinType': req_query.coinType,
                                            'userId': req_query.userId,
                                            'to': req_query.to,
                                            'from': fromAddress,
                                            'logId': req_query.cvn_log_id,
                                            'txReceiptStatus': 5
                                        }).then(function (data) {
                                            ctx.body = {
                                                'status': 1
                                            };
                                            resolve(next());
                                        });
                                    }
                                });
                            };

                        }
                    }
                });
            } else {
                ctx.body = { 'status': 0, 'message': "提现将于" + getLocalTime(config.cvn_tixian.start_time) + "开通" }
                resolve(next());
            }
        }
    }).catch(function (err) {
        ctx.body = { 'status': 0, 'message': JSON.stringify(err) };
        return;
    });

}



//查询交易状态
index.getTransactionId = async function (ctx, next) {
    var logId = ctx.request.query.txid;
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider("https://mainnet.infura.io/v2/11d78a7c90094677b48c5200d7253459"));
    if (ctx.request.query.debug && ctx.request.query.debug == "1") {
        ctx.body = {
            receiptStatus: ctx.request.query.receiptStatus,
            status: 1
        };
        return;
    };
    return new Promise(function (resolve, reject) {
        db_transaction.findOne({
            where: {
                'logId': logId
            }
        }).then(function (data) {
            if (data == null) {
                ctx.body = {
                    receiptStatus: 3,
                    status: 1,
                    txhash: "",
                    time: ""
                };
                resolve(next());
                return;
            } else {
                if (data.txReceiptStatus == 3) {
                    ctx.body = {
                        receiptStatus: 3,
                        status: 1,
                        txhash: "",
                        time: ""
                    };
                    resolve(next());
                    return;
                } else if (data.txReceiptStatus == 2) {
                    ctx.body = {
                        receiptStatus: 2,
                        status: 1,
                        txhash: "",
                        time: ""
                    };
                    resolve(next());
                    return;

                } else if (data.txReceiptStatus == 4) {
                    return data;
                } else if (data.txReceiptStatus == 5) {
                    ctx.body = {
                        receiptStatus: 5,
                        status: 1,
                        txhash: "",
                        time: ""
                    };
                    resolve(next());
                    return;
                } else if (data.txReceiptStatus == 7) {
                    if (data.txHash) {
                        return data;
                    } else {
                        ctx.body = {
                            receiptStatus: 2,
                            status: 1,
                            txhash: "",
                            time: ""
                        };
                        resolve(next());
                        return;
                    }
                } else if (data.txReceiptStatus == 6) {
                    ctx.body = {
                        receiptStatus: 2,
                        status: 1,
                        txhash: "",
                        time: ""
                    };
                    resolve(next());
                    return;

                } else {
                    return data;
                }
            }
        }).then(function (txlog) {
            if (txlog) {
                var transaction_status = web3.eth.getTransactionReceipt(txlog.txHash);
                if (transaction_status) {
                    if (transaction_status.status == "0x1") {
                        var times = web3.eth.getBlock(transaction_status.blockNumber).timestamp;
                        if (web3.eth.blockNumber - transaction_status.blockNumber >= 6) {
                            ctx.body = {
                                txHash: txlog.txHash,
                                receiptStatus: parseInt(transaction_status.status, 16),
                                status: 1,
                                time: times
                            };
                            resolve(next());
                            return;
                        } else {
                            ctx.body = {
                                txHash: txlog.txHash,
                                receiptStatus: 4,
                                status: 1,
                                time: times
                            };
                            resolve(next());
                            return;
                        }
                    } else if (transaction_status.status == "0x0") {
                        ctx.body = {
                            txHash: txlog.txHash,
                            receiptStatus: 2,
                            status: 1,
                            time: ""
                        };
                        resolve(next());
                        return;
                    } else {
                        if ((new Date().getTime() - Number(txlog.updatedAt)) > 48 * 60 * 60 * 1000) {
                            ctx.body = {
                                receiptStatus: 2,
                                status: 1,
                                txHash: txlog.txHash,
                                time: ""
                            };
                            resolve(next());
                            return;
                        } else {
                            ctx.body = {
                                txHash: txlog.txHash,
                                receiptStatus: 4,
                                status: 1,
                                time: ""
                            };
                            resolve(next());
                            return;
                        }
                    }
                } else {
                    if ((new Date().getTime() - Number(txlog.updatedAt)) > 48 * 60 * 60 * 1000) {
                        ctx.body = {
                            receiptStatus: 2,
                            status: 1,
                            txHash: txlog.txHash,
                            time: ""
                        };
                        resolve(next());
                        return;
                    } else {
                        ctx.body = {
                            receiptStatus: 4,
                            status: 1,
                            txHash: txlog.txHash,
                            time: ""
                        };
                        resolve(next());
                        return;
                    };
                }
            } else {
                return;
            }
        }).catch(function (err) {
            ctx.body = {
                message: JSON.stringify(err),
                status: 0
            };
            resolve(next());
        });
    });
}



console.log();

//查询币价
index.getCvnPrice = async function (ctx, next) {

    try {
        var rs = request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=CVNT', {
            headers: {
                'X-CMC_PRO_API_KEY': '6de02d6c-e6fe-4dd5-9233-cb461c8325c1',
            },

        });
        var USD = JSON.parse(rs.body).data.CVNT.quote.USD;
        ctx.body = {
            status: 1,
            unit: "USDT",
            cvntPrice: USD.price,
            percent_change_1h: USD.percent_change_1h
        };
    } catch (error) {
        ctx.body = {
            status: 0,
            message: JSON.stringify(error)
        };
    }


}

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}

module.exports = index;


