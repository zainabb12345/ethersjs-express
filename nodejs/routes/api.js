let express = require('express')
    router = express.Router(),
    require('ethers'),
    methods = require('../utils/functions');

router.get('/balanceOf/:address', async function (req, res) {
    let result = await methods.getTokenBalance(req.params.address);
    res.send(result.toString());
});

router.get('/totalSupply', async function (req, res) {
    // let result = await methods.getBalanceOf(req.params.address);
    let result = await methods.getTotalSupply();
    res.send(result.toString());
});

router.post('/transfer',async function (req, res) {
    // let _to = req.body.to;
    // let _amount = req.body.amount;
    let result = await methods.transfer();
    if (Number(result) != -1){
        res.send(result);
    } else{
        res.send('error');
    }
});

module.exports = router;
