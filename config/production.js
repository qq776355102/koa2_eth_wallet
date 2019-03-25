'use strict';
/**
 * 生产环境配置文件
 */
var config = {
    env: 'production', //环境名称
    port: 3000,         //服务端口号
    mysql_config: {
        //mysql数据库配置
        db_name: 'cvn_wallet',//数据库名称
        db_user: 'root',//数据库使用者名称
        db_password: '123456',//使用者密码
        db_host: 'localhost',//地址
        db_port: '3306',//端口号
        db_prefix: 'cvn_',//表前缀
        dialectOptions: {
            socketPath: '/tmp/mysql.sock' // 指定套接字文件路径
        }
    },

    //私钥
    private_key: "",

    //私钥对应的地址
    from_address: "",

    //cvn提现配置
    cvn_tixian: {
        //单次提现CVN上限,默认1万
        tixian_upper_limit: 10000,
        //提现频率,默认1天1次; count=0,禁止提现; count < 0,提现不受限制
        tixian_rate: {
            day: 1,
            count: 1
        },
        //开通提现时间戳,默认2019-01-01 00:00:00
        start_time: 1546272000000
    },
    //推送交易状态url
    push_txstate_url:''
};
module.exports = config;
