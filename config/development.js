'use strict';
/**
 * 开发环境配置文件
 */
var config = {
    env: 'development', //环境名称
    port: 3001,         //服务端口号
    mysql_config: {
        //mysql数据库配置
        db_name: 'cvnt_zhiyuanzhe',//数据库名称
        db_user: 'root',//数据库使用者名称
        db_password: '123456',//使用者密码
        db_host: '127.0.0.1',//地址
        db_port: '3306',//端口号
        db_prefix: ''//表前缀
    },

    private_key: "",

    from_address: "",

    //cvn提现配置
    cvn_tixian: {
        //单次提现金额上限
        tixian_upper_limit: 100,
        //体现频率,默认1天1次; count=0,禁止体现; count < 0,提现不受限制
        tixian_rate: {
            day: 1,
            count: -1
        },
        //开通提现时间戳,默认2019-01-01 00:00:00
        start_time: 1546272
    },

    //推送交易状态url
    push_txstate_url: ''

};
module.exports = config;
