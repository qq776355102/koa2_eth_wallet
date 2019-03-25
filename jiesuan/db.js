'use strict';
//创造transaction表的映射
const Sequelize = require('sequelize');
const definddb = require('../app_need/db');
var attr = {//填充额外属性
    name: Sequelize.STRING(20),
    address: Sequelize.STRING(45),
    amount: Sequelize.STRING(50),
    email: Sequelize.STRING(30)
}
var db_cvntx = definddb('zhiyuanzhes', attr);
module.exports = db_cvntx;