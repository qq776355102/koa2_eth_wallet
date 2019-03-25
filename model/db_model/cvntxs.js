'use strict';
//创造transaction表的映射
const Sequelize = require('sequelize');
const definddb = require('../../app_need/db');
var attr = {//填充额外属性
    txHash: Sequelize.STRING(200),
    amount: Sequelize.STRING(50),
    coinType: Sequelize.STRING(21),
    userId: Sequelize.BIGINT,
    to: Sequelize.STRING(60),
    from: Sequelize.STRING(60),
    gaslimit: Sequelize.STRING(50),
    gasUsed: Sequelize.STRING(50),
    gasPrice: Sequelize.STRING(20),
    time: Sequelize.STRING(20),
    value: Sequelize.STRING(20),
    nonce: Sequelize.INTEGER(20),
    txReceiptStatus: Sequelize.STRING(20),
    blockNumber: Sequelize.STRING(20),
    input: Sequelize.STRING(200),
    transactionIndex: Sequelize.INTEGER(11),
    v: Sequelize.STRING(10),
    contractAddress: Sequelize.STRING(55),
    message: Sequelize.STRING(100),
    logId:Sequelize.STRING(64)
}
var db_cvntx = definddb('transaction', attr);
module.exports = db_cvntx;