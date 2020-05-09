// import ethers.js
const ethers = require('ethers');
// import web3
const web3 = require('web3');
// import axios
var axios = require('axios');
// import contant file
var constants = require('./constant');
//connect to provider i.e ganache
let provider = new ethers.providers.JsonRpcProvider();

// Load deployed contract
let contract = new ethers.Contract(constants.CONTRACT_ADDRESS, constants.abi, provider);

// function for Ether transfer.
exports.transfer = async ()=> {
    try {
        // get transaction nounce
        let txNonce = await provider.getTransactionCount(constants.PUBLIC_KEY,"pending");
        // Convert ether to wei
        let _amount = ethers.utils.parseEther("1.0");
        console.log(_amount);
        let ether = ethers.utils.formatEther(_amount);
        console.log(ether);
        let gasPrices = await provider.getGasPrice();
        
        let transaction = {
            to: "0x7C8B7004693506BEFF6E52DBaaaD196Dd5875536",
            nonce : txNonce, 
            gasPrice: gasPrices.medium * 1000000000,
            gasLimit: web3.utils.toHex(300000),
            value: _amount,
            chainId: 5777 //EIP 155 chainId - mainnet: 1, rinkeby: 4
        };

        // Send the transaction
        let signer = provider.getSigner();
        let result = await signer.sendTransaction(transaction);

        // The second parameter passed means number of confirmations to wait.
        // await provider.waitForTransaction(result.hash,2);

        return result.hash;

    } catch (error){
        console.log(error)
        return false;
    }
}

// function for token tranfer.
exports.transferToken = async (targetAddress,amount) => {
    
    try{
        // load AbI through interface. 
        let iface = new ethers.utils.Interface(constants.ABI);
        // get Current nonce.
        let txNonce = await provider.getTransactionCount(constants.PUBLIC_KEY,"pending");
        var numberOfDecimals = 18;
        var numberOfTokens = ethers.utils.parseUnits(amount,numberOfDecimals); // convert to 18 decimals

        let transaction = {
            to: constants.CONTRACT_ADDRESS,
            gasLimit: web3.utils.toHex(300000),
            gasPrice: gasPrices.medium * 1000000000,
            nonce : txNonce,
            value: 0,
            // pass the interface here in data field.
            data : iface.functions.transfer.encode([ targetAddress, numberOfTokens ]) ,
            chainId: 5777 //EIP 155 chainId - mainnet: 1, rinkeby: 4
        };

        // Send the transaction
        let result = await wallet.sendTransaction(transaction);

        // The second parameter passed means number of confirmations to wait.
        // await web3Provider.waitForTransaction(result.hash,2); 

        return result.hash;

    } catch (error){
        console.log(error)
        return false;
    }
}
// function for retrieving current Nonce.
exports.getNonceByEthAddress = async () => {
    try {
        let nonce = await wallet.getTransactionCount();
        return (nonce);
    } catch (error) {
        console.log(error);
        return false;
    }
}
// function to query amount of tokens an address currently owns.
exports.getTokenBalance = async (address) => {
    try{
        let balancePromise = await contract.balanceOf(address);
        return (balancePromise.toNumber()).toString();
    }catch (error) {
        console.log(error);
        return false;
    }
}
exports.getTotalSupply = async () => {
    try{
        let supplyPromise = await contract.totalSupply();
        return (supplyPromise.toNumber()).toString();
    }catch (error) {
        console.log(error);
        return false;
    }
}