# cvn


### 更改配置文件

 ./config/production.js
 
 ```
 1:端口配置
 2：mysql数据库
 3：钱包地址私钥
 4：体现配置
 
```

### 加载依赖

    npm install


### 启动

普通启动

    npm run start_sh 
或 pm2启动

    npm run pm2







### 建议

1：如果程序连接本机mysql,建议打开skip-networking;

同时更改./app_need/db.js 

在dialect: 'mysql',下面添加
    
```
    dialectOptions: {
        socketPath: '/tmp/mysql.sock'
    },
    
```
    
    
2：如果连接远端数据库,登录数据库执行以下命令：
    
    grant all privileges on test.* to 'root'@'ip' identified by '123456';
    flush privileges;

 ip：ip地址 

 test：数据库名
