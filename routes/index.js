const router = require('koa-router')();
const index=require('../controller/index');

router.prefix('/api/cvn');


router.post('/tixian',index.insert);

// router.get('/get', function(ctx, next) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       ctx.body = {message: 'Hello'};         
//       resolve(next());
//     }, 1);
//   });
// }, function(ctx, next) {
//   return new Promise(function(resolve, reject) {
//     // setTimeout(function() {
//     //   ctx.body.message += ' World';
//     //   resolve(next());
//     // }, 1);
//     resolve(next());
//   }).then(data=>{
//     ctx.body.message += ' World';
//    // resolve(next());
//   });;
// }, function(ctx, next) {
//   ctx.body.message += '!';
// });



router.get('/getTransactionId', index.getTransactionId);

router.get('/cvnPrice',index.getCvnPrice);


module.exports = router;
