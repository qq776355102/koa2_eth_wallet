var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var CryptoJS = require("crypto-js");
// 合约地址
var contractAddress = "0x6400B5522f8D448C0803e6245436DD1c81dF09ce";
var abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdrawEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
var fromAddress = "0x371Cb4E3bEaaD5799a3BAA50Bf193FFe0f142108";
var private_key = "503ac03536073fc78c4820daa2d1511c57f0a77fe1940a9d74ad658cb0eb8070";
var privKey = new Buffer.from(private_key, 'hex');
var gasLimit = 90000;
// 创建web3对象
var web3 = new Web3();
// 连接到主网
web3.setProvider(new Web3.providers.HttpProvider("https://mainnet.infura.io/v2/11d78a7c90094677b48c5200d7253459"));
var coinContract = web3.eth.contract(abi).at(contractAddress);
async function transfer(to, amount, c_nonce) {
    
        var gasPrice = 1.5 * web3.eth.gasPrice;

        //var count = web3.eth.getTransactionCount(fromAddress);
        var count = c_nonce;
        console.log('count=' + count);

        console.log('gasPrice=' + gasPrice.toString(10));

        // 查询余额
        var tokenBalance = coinContract.balanceOf(fromAddress);
        console.log('tokenBalance=' + tokenBalance.toString(10));
        // 转账
        var transactionData = coinContract.transfer.getData(to,
            Number(amount) * 100000000);
        var rawTransaction = {
            "from": fromAddress,
            "nonce": web3.toHex(count),
            "gasPrice": web3.toHex(gasPrice),
            "gasLimit": web3.toHex(gasLimit),
            "to": contractAddress,
            "value": "0x0",
            "data": transactionData,
        };
        // 读取私钥，这里不包含‘0x’两个字符
        var tx = new Tx(rawTransaction);
        // 用私钥签名交易信息
        tx.sign(privKey);
        var serializedTx = tx.serialize();
        // 发送交易
        var rawTransaction_hex = '0x' + serializedTx.toString('hex');


        var tx_hash = await  web3.eth.sendRawTransaction(rawTransaction_hex);
        console.log(tx_hash);
}

module.exports = transfer;