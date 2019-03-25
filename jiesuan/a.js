const transfer = require('./jiesuan.js');
const db = require('./db.js');



const serialFn = async () => {
    await db.findAll().then(function(data){
        data.forEach(function(item,index){
            //if(2<=item.id < 5){
                console.log(item.address);
                console.log(item.amount);
                transfer(item.address,item.amount,item.id+3);
                console.log("-------------------------");
          //  }
        console.log(item.id)
    })});
};
serialFn();
